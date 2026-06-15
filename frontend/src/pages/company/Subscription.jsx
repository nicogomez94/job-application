import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { companyService, subscriptionService } from '../../services';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const formatDate = (date) =>
  new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));

const formatAmount = (amount, currency = 'ARS') =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(Number(amount || 0));
const formatBilling = (billing) => {
  if (!billing?.amount) return 'Monto ARS pendiente de configuración';
  return `${formatAmount(billing.amount, billing.currency || 'ARS')} cada ${billing.frequency} meses`;
};
const PLAN_LABELS = {
  TRIAL: 'Prueba 2 meses',
  MONTHLY: 'Plan 3 meses',
  QUARTERLY: 'Plan 7 meses',
  ANNUAL: 'Plan 12 + 1',
};

export default function CompanySubscription() {
  const [plans, setPlans] = useState([]);
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [plansResponse, statusResponse, historyResponse] = await Promise.all([
        subscriptionService.getPlans(),
        companyService.checkSubscription(),
        subscriptionService.getHistory(),
      ]);
      setPlans(plansResponse.data?.plans || []);
      setStatus(statusResponse.data || null);
      setHistory(historyResponse.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudieron cargar las suscripciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleActivatePlan = async (plan) => {
    if (!plan.billing?.configured) {
      toast.error('Este plan todavía no tiene monto ARS configurado para Mercado Pago.');
      return;
    }

    setProcessingPlanId(plan.id);
    try {
      const { data } = await subscriptionService.createCheckout({ plan: plan.id });
      const checkoutUrl = data?.checkoutUrl || data?.init_point;
      if (!checkoutUrl) {
        throw new Error('Mercado Pago no devolvió URL de checkout');
      }
      window.location.assign(checkoutUrl);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'No se pudo iniciar el pago');
      setProcessingPlanId(null);
      return;
    } finally {
      if (!document.hidden) setProcessingPlanId(null);
    }
  };

  const handleCancel = async () => {
    if (!status?.subscription?.id) return;
    const confirmed = window.confirm('¿Cancelar la suscripción activa?');
    if (!confirmed) return;

    setCancellingId(status.subscription.id);
    try {
      await subscriptionService.cancel(status.subscription.id);
      toast.success('Suscripción cancelada');
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo cancelar la suscripción');
    } finally {
      setCancellingId(null);
    }
  };

  const currentPlanLabel = PLAN_LABELS[status?.subscription?.plan] || status?.subscription?.plan || '-';
  const pendingSubscription = status?.pendingSubscription;

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
        <p>Cargando suscripciones...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
      <BackToDashboardButton to="/company/dashboard" />
      <h1 style={{ marginBottom: '1rem' }}>Suscripciones</h1>
      {pendingSubscription && (
        <div
          style={{
            marginBottom: '1rem',
            border: '2px solid #bfdbfe',
            background: '#eff6ff',
            borderRadius: '0.9rem',
            padding: '1rem 1.1rem',
          }}
        >
          <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#1e3a8a' }}>
            Pago pendiente de confirmación
          </p>
          <p style={{ margin: '0.45rem 0 0', color: '#1f3b67', lineHeight: 1.55 }}>
            Iniciaste el pago del <strong>{PLAN_LABELS[pendingSubscription.plan] || pendingSubscription.plan}</strong>.
            La suscripción se activará automáticamente cuando Mercado Pago confirme el cobro.
          </p>
        </div>
      )}

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginBottom: '0.7rem' }}>Estado actual</h2>
        {status?.hasActiveSubscription ? (
          <>
            <p style={{ color: '#5e4d38' }}>
              Plan: <strong>{currentPlanLabel}</strong>
            </p>
            <p style={{ color: '#5e4d38' }}>
              Vigencia: {formatDate(status.subscription?.startDate)} - {formatDate(status.subscription?.endDate)}
            </p>
            <p style={{ color: '#5e4d38', marginBottom: '0.8rem' }}>
              Monto: {formatAmount(status.subscription?.amount, status.subscription?.currency)}
            </p>
            <button className="btn" style={{ background: '#fee2e2', color: '#991b1b' }} onClick={handleCancel} disabled={cancellingId === status.subscription?.id}>
              {cancellingId === status.subscription?.id ? 'Cancelando...' : 'Cancelar suscripción'}
            </button>
          </>
        ) : pendingSubscription ? (
          <p style={{ color: '#1d4ed8' }}>Tenés una suscripción pendiente de confirmación.</p>
        ) : (
          <p style={{ color: '#b91c1c' }}>No tenés suscripción activa.</p>
        )}
      </div>

      <div className="card" id="planes-pago" style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginBottom: '0.8rem' }}>Planes disponibles</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
          {plans.map((plan) => (
            <div key={plan.id} style={{ border: '1px solid #e7dcc6', borderRadius: '0.7rem', padding: '1rem' }}>
              <h3 style={{ marginBottom: '0.4rem' }}>{plan.name}</h3>
              <p style={{ color: '#5e4d38', marginBottom: '0.4rem' }}>
                Referencia: {formatAmount(plan.price, plan.currency)} / {plan.duration}
              </p>
              <p style={{ color: '#7e705c', fontSize: '0.9rem', marginBottom: '0.8rem' }}>
                Mercado Pago: {formatBilling(plan.billing)}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => handleActivatePlan(plan)}
                disabled={processingPlanId === plan.id || Boolean(pendingSubscription)}
              >
                {processingPlanId === plan.id ? 'Redirigiendo...' : pendingSubscription ? 'Pago pendiente' : 'Pagar con Mercado Pago'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '0.8rem' }}>Historial</h2>
        {history.length === 0 ? (
          <p style={{ color: '#7e705c' }}>Sin historial de suscripciones.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.7rem' }}>
            {history.map((item) => (
              <div key={item.id} style={{ border: '1px solid #e7dcc6', borderRadius: '0.5rem', padding: '0.8rem' }}>
                <p style={{ color: '#2f2416' }}>
                  <strong>{item.plan}</strong> - {item.status}
                </p>
                <p style={{ color: '#6f604b', fontSize: '0.9rem' }}>
                  {formatDate(item.startDate)} a {formatDate(item.endDate)}
                </p>
                <p style={{ color: '#6f604b', fontSize: '0.9rem' }}>{formatAmount(item.amount, item.currency)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
