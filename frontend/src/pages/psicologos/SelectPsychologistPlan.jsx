import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Shield, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { psychologistService } from '../../services';
import '../auth/SelectPlan.css';

const PLAN_META = {
  MONTHLY: { highlight: false, icon: Clock, subtitle: 'Ideal para empezar' },
  QUARTERLY: { highlight: true, badge: 'Recomendado', icon: Star, subtitle: 'La mejor relación precio-valor' },
  ANNUAL: { highlight: false, icon: Shield, subtitle: 'Para mayor continuidad' },
};

export default function SelectPsychologistPlan() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const subscriptionRes = await psychologistService.getSubscription();
        if (subscriptionRes.data?.hasActiveSubscription) {
          navigate('/psicologo/dashboard', { replace: true });
          return;
        }
      } catch {
        // No active subscription; show plans.
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
  }, [navigate]);

  const handleSelectPlan = async (plan) => {
    setActivating(plan.id);
    try {
      await psychologistService.createSubscription({
        plan: plan.id,
        amount: '0',
        currency: plan.currency || 'USD',
        paymentStatus: 'free',
        paymentMethod: 'free',
      });
      toast.success(`¡Plan ${plan.name} activado! Tu perfil ya es visible para los pacientes.`);
      navigate('/psicologo/dashboard', { replace: true });
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
        <div className="select-plan-header">
          <h1 className="select-plan-title">Elegí tu plan de psicólogo</h1>
        </div>

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
                {meta.badge && <div className="select-plan-badge">{meta.badge}</div>}

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
                  {isActivating ? <span className="select-plan-btn-loading">Activando...</span> : 'Seleccionar plan'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="select-plan-footer">
          <p>
            No se requiere tarjeta de crédito durante el período de lanzamiento.
          </p>
          <p className="select-plan-footer-mp">
            Próximamente: pagos seguros con <strong>Mercado Pago</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
