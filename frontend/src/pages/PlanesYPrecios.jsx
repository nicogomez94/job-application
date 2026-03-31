import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, Shield, Zap } from 'lucide-react';
import { subscriptionService } from '../services';
import './PlanesYPrecios.css';

const FALLBACK_PLANS = [
  {
    id: 'MONTHLY',
    name: 'Plan 3 meses',
    subtitle: 'Ingreso inicial para nuevas empresas',
    price: 50,
    currency: 'USD',
    duration: '3 meses',
    features: [
      'Publicación y gestión de postulantes',
      'Ideal para validar el servicio',
      'Renovación paga al finalizar',
    ],
  },
  {
    id: 'QUARTERLY',
    name: 'Plan 7 meses',
    subtitle: 'Más tiempo para contratar sin interrupciones',
    price: 80,
    currency: 'USD',
    duration: '7 meses',
    highlight: true,
    badge: 'Recomendado',
    features: [
      'Mayor continuidad de publicaciones',
      'Mejor costo por mes',
      'Renovación paga al finalizar',
    ],
  },
  {
    id: 'ANNUAL',
    name: 'Plan 12 + 1',
    subtitle: 'Pagás 12 meses y usás 13 meses',
    price: 120,
    currency: 'USD',
    duration: '13 meses',
    features: [
      '1 mes adicional sin costo incluido',
      'Cobertura anual extendida',
      'Renovación paga al finalizar',
    ],
  },
];

const PLAN_META = {
  MONTHLY: { icon: Shield, subtitle: 'Ingreso inicial para nuevas empresas' },
  QUARTERLY: {
    icon: Star,
    subtitle: 'Más tiempo para contratar sin interrupciones',
    highlight: true,
    badge: 'Recomendado',
  },
  ANNUAL: { icon: Zap, subtitle: 'Pagás 12 meses y usás 13 meses' },
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
          <p>Elegí el plan que mejor se adapte al ritmo de contratación de tu empresa.</p>
        </header>

        <section className="pricing-conditions">
          <h2>Condiciones comerciales</h2>
          <p>Condiciones comerciales solo por tiempo limitado.</p>
          <ul>
            <li>Inscripción inicial: 2 meses gratis en tu primera vez en la plataforma.</li>
            <li>Periodo de renovación: todas las renovaciones son pagas en cualquiera de sus formas.</li>
            <li>Reconocimiento a la calidad: el empleador mejor calificado al finalizar su período pago recibe 2 meses sin costo.</li>
            <li>Programa de referidos: por cada nueva empresa que se inscriba con plan pago, obtenés 2 meses gratis.</li>
          </ul>
        </section>

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
                  <span> / {plan.duration || '3 meses'}</span>
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
