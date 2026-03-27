import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const containsGratis = (text = '') => /gratis/i.test(String(text));

  useEffect(() => {
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
  }, [navigate]);

  const handleSelectPlan = async (plan) => {
    setActivating(plan.id);
    try {
      // ─── MERCADO PAGO INTEGRATION POINT ──────────────────────────────────
      // Cuando isFreeMode sea false, reemplazar el bloque de abajo por:
      //
      //   const { data } = await mercadoPagoService.createPreference({
      //     plan: plan.id,
      //     amount: plan.price,
      //     currency: plan.currency,
      //     backUrls: {
      //       success: `${window.location.origin}/company/dashboard`,
      //       failure: `${window.location.origin}/register/company/plan`,
      //     },
      //   });
      //   window.location.href = data.init_point; // Redirigir a Mercado Pago
      //   return;
      //
      // ─────────────────────────────────────────────────────────────────────

      await subscriptionService.create({
        plan: plan.id,
        amount: '0',
        currency: plan.currency || 'ARS',
        paymentStatus: 'free',
        paymentMethod: 'free',
      });

      toast.success(`¡Plan ${plan.name} activado exitosamente!`);
      navigate('/company/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo activar el plan');
    } finally {
      setActivating(null);
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
          {/* <p className="select-plan-subtitle">
            Seleccioná el plan que mejor se adapte a tu empresa. Por ahora, todos los planes son
            gratuitos y no requieren tarjeta de crédito.
          </p> */}
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
                  <p className="select-plan-subtitle-card">{meta.subtitle}</p>
                </div>

                <div className="select-plan-price-section">
                  <div className="select-plan-original-price">
                    Valor regular: ${plan.price?.toLocaleString('es-AR')} {plan.currency}/{plan.duration}
                  </div>
                  {plan.discount && !containsGratis(plan.discount) && (
                    <div className="select-plan-discount">{plan.discount}</div>
                  )}
                </div>

                <ul className="select-plan-features">
                  {plan.features?.filter((feature) => !containsGratis(feature)).map((feature, i) => (
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
                    <span className="select-plan-btn-loading">Activando...</span>
                  ) : (
                    'Seleccionar plan'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="select-plan-footer">
          <p>
            No se requiere tarjeta de crédito durante el período de lanzamiento. Podés cambiar de
            plan en cualquier momento desde tu panel de empresa.
          </p>
          <p className="select-plan-footer-mp">
            {/* Mercado Pago se integrará próximamente para gestionar los pagos */}
            Próximamente: pagos seguros con <strong>Mercado Pago</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
