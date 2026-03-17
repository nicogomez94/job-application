import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { companyService, subscriptionService } from '../../services';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const formatDate = (date) =>
  new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));

const formatAmount = (amount, currency = 'ARS') =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(Number(amount || 0));

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
    setProcessingPlanId(plan.id);
    try {
      await subscriptionService.create({
        plan: plan.id,
        amount: String(plan.price),
        currency: plan.currency || 'ARS',
        paymentStatus: 'approved',
        paymentMethod: 'manual',
      });
      toast.success('Suscripción activada');
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo activar el plan');
    } finally {
      setProcessingPlanId(null);
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

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginBottom: '0.7rem' }}>Estado actual</h2>
        {status?.hasActiveSubscription ? (
          <>
            <p style={{ color: '#5e4d38' }}>
              Plan: <strong>{status.subscription?.plan}</strong>
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
        ) : (
          <p style={{ color: '#b91c1c' }}>No tenés suscripción activa.</p>
        )}
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginBottom: '0.8rem' }}>Planes disponibles</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
          {plans.map((plan) => (
            <div key={plan.id} style={{ border: '1px solid #e7dcc6', borderRadius: '0.7rem', padding: '1rem' }}>
              <h3 style={{ marginBottom: '0.4rem' }}>{plan.name}</h3>
              <p style={{ color: '#5e4d38', marginBottom: '0.4rem' }}>{formatAmount(plan.price, plan.currency)}</p>
              <p style={{ color: '#7e705c', fontSize: '0.9rem', marginBottom: '0.8rem' }}>{plan.duration}</p>
              <button className="btn btn-primary" onClick={() => handleActivatePlan(plan)} disabled={processingPlanId === plan.id}>
                {processingPlanId === plan.id ? 'Procesando...' : 'Activar plan'}
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
