import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Star, Shield, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { psychologistService } from '../../services';
import '../auth/SelectPlan.css';

const PLAN_META = {
  MONTHLY: { highlight: false, icon: Clock, subtitle: 'Ideal para empezar' },
  QUARTERLY: {
    highlight: true,
    badge: 'Recomendado',
    icon: Star,
    subtitle: 'La mejor relación precio-valor',
    freeSubtitle: 'Más tiempo para recibir consultas',
  },
  ANNUAL: { highlight: false, icon: Shield, subtitle: 'Para mayor continuidad' },
};

const PLAN_LEVELS = {
  MONTHLY: 1,
  QUARTERLY: 2,
  ANNUAL: 3,
};

export default function SelectPsychologistPlan() {
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [pendingSubscription, setPendingSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkoutStatus = searchParams.get('checkout');
  const isFreeMode = plans.length > 0 && plans.every((plan) => plan.isFreeMode);

  const formatBilling = (plan) => {
    if (!plan.billing?.amount) return 'Monto en ARS pendiente de configuración';
    const amount = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: plan.billing.currency || 'ARS',
      maximumFractionDigits: 0,
    }).format(Number(plan.billing.amount));
    return `Valor de la inscripción por ${plan.duration}: ${amount}`;
  };

  useEffect(() => {
    if (checkoutStatus === 'pending') {
      toast.success('Pago iniciado. Tu perfil se activará cuando Mercado Pago confirme la suscripción.');
    }

    const init = async () => {
      try {
        const subscriptionRes = await psychologistService.getSubscription();
        if (subscriptionRes.data?.hasActiveSubscription) {
          setCurrentSubscription(subscriptionRes.data.subscription);
        } else if (subscriptionRes.data?.hasPendingSubscription) {
          setPendingSubscription(subscriptionRes.data.pendingSubscription);
        }
      } catch {
        // No active subscription; show plans anyway.
      }

      try {
        const res = await psychologistService.getPlans();
        setPlans(res.data?.plans || []);
      } catch {
        toast.error('No se pudieron cargar los planes');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [checkoutStatus]);

  const handleSelectPlan = async (plan) => {
    if (plan.isFreeMode) {
      setActivating(plan.id);
      try {
        await psychologistService.createSubscription({ plan: plan.id });
        toast.success(`¡Plan ${plan.name} activado! Tu perfil ya es visible para los pacientes.`);
        navigate('/psicologo/dashboard', { replace: true });
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
      const { data } = await psychologistService.createSubscriptionCheckout({ plan: plan.id });
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

  const getButtonLabel = ({ plan, isActivating, isCurrentPlan, isPendingPlan, isLowerOrSamePlan }) => {
    if (isActivating) {
      return <span className="select-plan-btn-loading">{plan.isFreeMode ? 'Activando...' : 'Redirigiendo...'}</span>;
    }
    if (isCurrentPlan) return 'Plan actual';
    if (!plan.isFreeMode && (isPendingPlan || pendingSubscription)) return 'Pago pendiente';
    if (isLowerOrSamePlan) return 'Solo plan superior';
    return plan.isFreeMode ? 'Seleccionar plan' : 'Pagar con Mercado Pago';
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
        <div className="select-plan-header">
          <p className="select-plan-launch-label">Planes Lanzamiento</p>
          <h1 className="select-plan-title">Elegí tu plan de negocio</h1>
          <ul className="select-plan-intro-list">
            <li>El monto de suscripción es el único pago requerido.</li>
            <li>Sin comisión de ningún tipo.</li>
            <li>Sin límite de consultas.</li>
          </ul>
          {isFreeMode && (
            <p className="select-plan-subtitle">
              Planes 2 y 3 bonificados
            </p>
          )}
        </div>

        <div className="select-plan-grid">
          {plans.map((plan) => {
            const meta = PLAN_META[plan.id] || {};
            const Icon = meta.icon || Clock;
            const isActivating = activating === plan.id;
            const isCurrentPlan = currentSubscription?.plan === plan.id;
            const isPendingPlan = pendingSubscription?.plan === plan.id;
            const isLowerOrSamePlan = currentSubscription
              && PLAN_LEVELS[plan.id] <= PLAN_LEVELS[currentSubscription.plan];
            const disabled = activating !== null
              || Boolean(isLowerOrSamePlan)
              || (!plan.isFreeMode && Boolean(pendingSubscription));

            return (
              <div
                key={plan.id}
                className={`select-plan-card ${meta.highlight ? 'select-plan-card--highlight' : ''} ${isCurrentPlan ? 'select-plan-card--current' : ''}`}
              >
                {meta.badge && <div className="select-plan-badge">{meta.badge}</div>}
                {isCurrentPlan && <div className="select-plan-current-badge">Plan actual</div>}

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
                    plan.id === 'MONTHLY' ? (
                      <div className="select-plan-free-block">
                        <div className="select-plan-free-label">Gratis</div>
                        <p className="select-plan-free-note">
                          Pasando los 3 meses, la plataforma le pedirá un plan de abono para continuar.
                        </p>
                      </div>
                    ) : null
                  ) : (
                    <>
                      <div className="select-plan-billing-price">
                        {formatBilling(plan)}
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
                  disabled={disabled}
                >
                  {getButtonLabel({
                    plan,
                    isActivating,
                    isCurrentPlan,
                    isPendingPlan,
                    isLowerOrSamePlan,
                  })}
                </button>
              </div>
            );
          })}
        </div>

        <div className="select-plan-footer">
          {isFreeMode ? (
            <p>La activación es inmediata y no requiere ningún medio de pago.</p>
          ) : (
            <>
              <p>El perfil se activa automáticamente cuando Mercado Pago confirma la suscripción.</p>
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
