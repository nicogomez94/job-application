import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, Shield, Zap } from 'lucide-react';
import { subscriptionService } from '../services';
import './PlanesYPrecios.css';

const FALLBACK_PLANS = [
  {
    id: 'MONTHLY',
    name: 'Mensual',
    subtitle: 'Ideal para empezar',
    price: 25000,
    currency: 'ARS',
    duration: 'mes',
    features: [
      'Hasta 3 publicaciones activas',
      'Gestión de postulantes',
      'Soporte por email',
    ],
  },
  {
    id: 'QUARTERLY',
    name: 'Trimestral',
    subtitle: 'La mejor relación precio-valor',
    price: 60000,
    currency: 'ARS',
    duration: 'trimestre',
    highlight: true,
    badge: 'Más elegido',
    features: [
      'Hasta 10 publicaciones activas',
      'Filtrado de candidatos',
      'Soporte prioritario',
    ],
  },
  {
    id: 'ANNUAL',
    name: 'Anual',
    subtitle: 'Para equipos con crecimiento sostenido',
    price: 210000,
    currency: 'ARS',
    duration: 'año',
    features: [
      'Publicaciones ilimitadas',
      'Acceso a métricas avanzadas',
      'Soporte dedicado',
    ],
  },
];

const PLAN_META = {
  MONTHLY: { icon: Shield, subtitle: 'Ideal para empezar' },
  QUARTERLY: {
    icon: Star,
    subtitle: 'La mejor relación precio-valor',
    highlight: true,
    badge: 'Más elegido',
  },
  ANNUAL: { icon: Zap, subtitle: 'Para equipos con crecimiento sostenido' },
};

const formatPrice = (price, currency = 'ARS') =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(price || 0));

export default function PlanesYPrecios() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const res = await subscriptionService.getPlans();
        const apiPlans = res.data?.plans || [];
        setPlans(apiPlans.length ? apiPlans : FALLBACK_PLANS);
      } catch {
        setPlans(FALLBACK_PLANS);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const normalizedPlans = useMemo(
    () =>
      plans.map((plan) => {
        const meta = PLAN_META[plan.id] || {};
        return {
          ...plan,
          icon: meta.icon || Shield,
          subtitle: meta.subtitle || plan.subtitle || 'Plan para empresas',
          highlight: Boolean(meta.highlight || plan.highlight),
          badge: meta.badge || plan.badge,
        };
      }),
    [plans]
  );

  return (
    <section className="pricing-page">
      <div className="pricing-container">
        <header className="pricing-header">
          <p className="pricing-eyebrow">Empresas</p>
          <h1>Planes y Precios</h1>
          <p>
            Elegí el plan que mejor se adapta al ritmo de contratación de tu empresa.
            Podés cambiarlo cuando quieras.
          </p>
        </header>

        <div className="pricing-grid">
          {(loading ? FALLBACK_PLANS : normalizedPlans).map((plan) => {
            const Icon = plan.icon || Shield;
            return (
              <article
                key={plan.id}
                className={`pricing-card ${plan.highlight ? 'pricing-card-highlight' : ''}`}
              >
                {plan.badge && <span className="pricing-badge">{plan.badge}</span>}
                <div className="pricing-icon">
                  <Icon size={22} />
                </div>
                <h2>{plan.name}</h2>
                <p className="pricing-subtitle">{plan.subtitle}</p>
                <p className="pricing-value">
                  {formatPrice(plan.price, plan.currency)}
                  <span> / {plan.duration || 'mes'}</span>
                </p>
                <ul className="pricing-features">
                  {(plan.features || []).map((feature) => (
                    <li key={feature}>
                      <Check size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register/company" className="pricing-cta">
                  Empezar ahora
                </Link>
              </article>
            );
          })}
        </div>

        <div className="pricing-bottom">
          <p>¿Ya tenés cuenta de empresa?</p>
          <Link to="/login">Iniciar sesión</Link>
        </div>
      </div>
    </section>
  );
}
