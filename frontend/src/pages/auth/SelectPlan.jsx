import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Star, Shield, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { subscriptionService } from '../../services';
import './SelectPlan.css';

const PLAN_META = {
  MONTHLY: {
    highlight: false,
    icon: Clock,
    subtitle: 'Ideal para empezar',
  },
  QUARTERLY: {
    highlight: true,
    badge: 'Recomendado',
    icon: Star,
    subtitle: 'La mejor relación precio-valor',
    freeSubtitle: 'Más tiempo para contratar sin interrupciones',
  },
  ANNUAL: {
    highlight: false,
    icon: Shield,
    subtitle: 'Para empresas en crecimiento',
  },
};

export default function SelectPlan() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkoutStatus = searchParams.get('checkout');
  const isFreeMode = plans.length > 0 && plans.every((plan) => plan.isFreeMode);

  const formatBilling = (billing) => {
    if (!billing?.amount) return 'Monto en ARS pendiente de configuración';
    const amount = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: billing.currency || 'ARS',
      maximumFractionDigits: 0,
    }).format(Number(billing.amount));
    return `${amount} cada ${billing.frequency} meses`;
  };

  useEffect(() => {
    if (checkoutStatus === 'pending') {
      toast.success('Pago iniciado. Tu plan se activará cuando Mercado Pago confirme la suscripción.');
    }

    const init = async () => {
      try {
        // Si ya tiene suscripción activa, ir directo al dashboard
        await subscriptionService.getActive();
        navigate('/company/dashboard', { replace: true });
        return;
      } catch {
        // Sin suscripción activa → mostrar planes (flujo normal)
      }

      try {
        const res = await subscriptionService.getPlans();
        setPlans(res.data?.plans || []);
      } catch {
        toast.error('No se pudieron cargar los planes');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate, checkoutStatus]);

  const handleSelectPlan = async (plan) => {
    if (plan.isFreeMode) {
      setActivating(plan.id);
      try {
        await subscriptionService.create({ plan: plan.id });
        toast.success(`¡Plan ${plan.name} activado exitosamente!`);
        navigate('/company/dashboard', { replace: true });
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudo activar el plan');
      } finally {
        setActivating(null);
      }
      return;
    }

    if (!plan.billing?.configured) {
      toast.error('Este plan todavía no tiene monto ARS configurado para Mercado Pago.');
      return;
    }

    setActivating(plan.id);
    try {
      const { data } = await subscriptionService.createCheckout({ plan: plan.id });
      const checkoutUrl = data?.checkoutUrl || data?.init_point;
      if (!checkoutUrl) {
        throw new Error('Mercado Pago no devolvió URL de checkout');
      }
      window.location.assign(checkoutUrl);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'No se pudo iniciar el pago');
      setActivating(null);
      return;
    } finally {
      if (!document.hidden) setActivating(null);
    }
  };

  if (loading) {
    return (
      <div className="select-plan-loading">
        <div className="select-plan-spinner" />
        <p>Cargando planes...</p>
      </div>
    );
  }

  return (
    <div className="select-plan-page">
      <div className="select-plan-container">
        {/* Header */}
        <div className="select-plan-header">
          <h1 className="select-plan-title">Seleccione el plan que mejor se adapte a su empresa</h1>
          {isFreeMode && (
            <p className="select-plan-subtitle">
              Por ahora, todos los planes son gratuitos y no requieren tarjeta.
            </p>
          )}
        </div>

        {/* Plan cards */}
        <div className="select-plan-grid">
          {plans.map((plan) => {
            const meta = PLAN_META[plan.id] || {};
            const Icon = meta.icon || Clock;
            const isActivating = activating === plan.id;

            return (
              <div
                key={plan.id}
                className={`select-plan-card ${meta.highlight ? 'select-plan-card--highlight' : ''}`}
              >
                {meta.badge && (
                  <div className="select-plan-badge">{meta.badge}</div>
                )}

                <div className="select-plan-card-header">
                  <div className={`select-plan-icon-wrap ${meta.highlight ? 'select-plan-icon-wrap--highlight' : ''}`}>
                    <Icon size={24} />
                  </div>
                  <h2 className="select-plan-name">{plan.name}</h2>
                  <p className="select-plan-subtitle-card">
                    {plan.isFreeMode ? (meta.freeSubtitle || meta.subtitle) : meta.subtitle}
                  </p>
                </div>

                <div className="select-plan-price-section">
                  {plan.isFreeMode ? (
                    <div className="select-plan-free-label">Gratis</div>
                  ) : (
                    <>
                      <div className="select-plan-original-price">
                        Valor de referencia: ${plan.price?.toLocaleString('es-AR')} {plan.currency}/{plan.duration}
                      </div>
                      <div className="select-plan-billing-price">
                        Mercado Pago: {formatBilling(plan.billing)}
                      </div>
                    </>
                  )}
                  {plan.discount && (
                    <div className="select-plan-discount">{plan.discount}</div>
                  )}
                </div>

                <ul className="select-plan-features">
                  {plan.features?.map((feature, i) => (
                    <li key={i} className="select-plan-feature">
                      <Check size={16} className="select-plan-check" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`select-plan-btn ${meta.highlight ? 'select-plan-btn--highlight' : ''}`}
                  onClick={() => handleSelectPlan(plan)}
                  disabled={activating !== null}
                >
                  {isActivating ? (
                    <span className="select-plan-btn-loading">
                      {plan.isFreeMode ? 'Activando...' : 'Redirigiendo...'}
                    </span>
                  ) : (
                    plan.isFreeMode ? 'Seleccionar plan' : 'Pagar con Mercado Pago'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="select-plan-footer">
          {isFreeMode ? (
            <p>La activación es inmediata y no requiere ningún medio de pago.</p>
          ) : (
            <>
              <p>El plan se activa automáticamente cuando Mercado Pago confirma la suscripción.</p>
              <p className="select-plan-footer-mp">
                Pagos seguros y recurrentes con <strong>Mercado Pago</strong>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
