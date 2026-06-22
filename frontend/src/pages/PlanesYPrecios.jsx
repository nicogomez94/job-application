import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, Shield, Zap } from 'lucide-react';
import { subscriptionService } from '../services';
import { useI18n } from '../context/i18nStore';
import './PlanesYPrecios.css';

const FALLBACK_PLANS = [
  {
    id: 'MONTHLY',
    name: 'Plan 3 meses',
    subtitle: 'Ingreso inicial para nuevas empresas',
    price: null,
    currency: null,
    duration: '3 meses',
    isFreeMode: true,
    features: [
      'Publicación y gestión de postulantes',
      'Ideal para validar el servicio',
      'Acceso completo durante el plan',
    ],
  },
  {
    id: 'QUARTERLY',
    name: 'Plan 7 meses',
    subtitle: 'Más tiempo para contratar sin interrupciones',
    price: null,
    currency: null,
    duration: '7 meses',
    isFreeMode: true,
    highlight: true,
    badge: 'Recomendado',
    features: [
      'Mayor continuidad de publicaciones',
      'Más tiempo para encontrar profesionales',
      'Acceso completo durante el plan',
    ],
  },
  {
    id: 'ANNUAL',
    name: 'Plan 12 + 1',
    subtitle: 'Pagás 12 meses y usás 13 meses',
    price: null,
    currency: null,
    duration: '13 meses',
    isFreeMode: true,
    features: [
      '1 mes adicional incluido',
      'Cobertura anual extendida',
      'Acceso completo durante el plan',
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

const FREE_PLAN_SUBTITLES = {
  MONTHLY: 'Ideal para empezar',
  QUARTERLY: 'Más tiempo para contratar sin interrupciones',
  ANNUAL: 'Mayor continuidad para tu empresa',
};

const PLAN_TEXT_TO_EN = {
  Empresas: 'Companies',
  'Planes y Precios': 'Plans and Pricing',
  Planes: 'Plans',
  Gratis: 'Free',
  'Todos los planes son gratuitos por el momento. Elegí el que mejor se adapte a tu empresa.':
    'All plans are currently free. Choose the one that best fits your company.',
  'Todos los planes están bonificados y no requieren tarjeta ni medio de pago.':
    'All plans are free and require no card or payment method.',
  'Elegí el plan que mejor se adapte al ritmo de contratación de tu empresa.':
    'Choose the plan that best fits your company hiring pace.',
  'Condiciones comerciales': 'Commercial terms',
  'Condiciones comerciales solo por tiempo limitado.':
    'Commercial terms for a limited time only.',
  'Inscripción inicial: elegí un plan para activar la cuenta de empresa.':
    'Initial registration: choose a plan to activate the company account.',
  'Periodo de renovación: todas las renovaciones son pagas en cualquiera de sus formas.':
    'Renewal period: all renewals are paid under any modality.',
  'Reconocimiento a la calidad: el empleador mejor calificado podrá acceder a beneficios comerciales al renovar.':
    'Quality recognition: the highest-rated employer may access commercial benefits when renewing.',
  'Programa de referidos: los beneficios por referidos se aplican sobre renovaciones o nuevos períodos pagos.':
    'Referral program: referral benefits apply to renewals or new paid periods.',
  'Plan 3 meses': '3-Month Plan',
  'Plan 7 meses': '7-Month Plan',
  'Plan 12 + 1': '12 + 1 Plan',
  'Ingreso inicial para nuevas empresas': 'Initial access for new companies',
  'Más tiempo para contratar sin interrupciones': 'More time to hire without interruptions',
  'Pagás 12 meses y usás 13 meses': 'Pay 12 months and use 13 months',
  Recomendado: 'Recommended',
  '3 meses': '3 months',
  '7 meses': '7 months',
  '13 meses': '13 months',
  'Publicación y gestión de postulantes': 'Posting and applicant management',
  'Acceso a gestión de postulantes': 'Access to applicant management',
  'Acceso a gestión de applicants': 'Access to applicant management',
  'Ideal para validar el servicio': 'Ideal for validating the service',
  'Renovación paga al finalizar': 'Paid renewal at the end',
  'Acceso completo durante el plan': 'Full access during the plan',
  'Más tiempo para encontrar profesionales': 'More time to find professionals',
  'Mayor continuidad para tu empresa': 'Greater continuity for your company',
  'Acceso gratuito durante 3 meses': 'Free access for 3 months',
  'Acceso gratuito durante 7 meses': 'Free access for 7 months',
  'Acceso gratuito durante 13 meses': 'Free access for 13 months',
  'No requiere tarjeta ni medio de pago': 'No card or payment method required',
  'Mayor continuidad de publicaciones': 'Greater posting continuity',
  'Mejor costo por mes': 'Better monthly cost',
  '1 mes adicional incluido': '1 additional month included',
  'Cobertura anual extendida': 'Extended yearly coverage',
  'Cobertura extendida para contrataciones': 'Extended hiring coverage',
  'Mayor continuidad anual': 'Greater annual continuity',
  'Empezar ahora': 'Start now',
  '¿Ya tenés cuenta de empresa?': 'Do you already have a company account?',
  'Iniciar sesión': 'Log in',
};

const PLAN_TEXT_TO_ES = Object.fromEntries(
  Object.entries(PLAN_TEXT_TO_EN).map(([es, en]) => [en, es]),
);

const normalizePlanText = (value, language, t) => {
  if (typeof value !== 'string') return value;
  const text = value.trim();
  if (!text) return value;

  if (language === 'en') {
    return PLAN_TEXT_TO_EN[text] || t(text);
  }

  return PLAN_TEXT_TO_ES[text] || text;
};

const formatPrice = (price, currency = 'ARS', language = 'es') =>
  new Intl.NumberFormat(language === 'en' ? 'en-US' : 'es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
    currencyDisplay: language === 'en' ? 'code' : 'symbol',
  }).format(Number(price || 0));

export default function PlanesYPrecios() {
  const { language, t } = useI18n();
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
          subtitle: plan.isFreeMode
            ? (FREE_PLAN_SUBTITLES[plan.id] || plan.subtitle || 'Plan para empresas')
            : (meta.subtitle || plan.subtitle || 'Plan para empresas'),
          highlight: Boolean(meta.highlight || plan.highlight),
          badge: meta.badge || plan.badge,
        };
      }),
    [plans]
  );
  const displayedPlans = loading ? FALLBACK_PLANS : normalizedPlans;
  const isFreeMode = displayedPlans.length > 0 && displayedPlans.every((plan) => plan.isFreeMode);

  return (
    <section className="pricing-page">
      <div className="pricing-container">
        <header className="pricing-header">
          <p className="pricing-eyebrow">{normalizePlanText('Empresas', language, t)}</p>
          <h1>{normalizePlanText(isFreeMode ? 'Planes' : 'Planes y Precios', language, t)}</h1>
          <p>
            {isFreeMode
              ? normalizePlanText('Todos los planes son gratuitos por el momento. Elegí el que mejor se adapte a tu empresa.', language, t)
              : null}
          </p>
        </header>

        <section className="pricing-conditions">
          <h2>{normalizePlanText('Condiciones comerciales', language, t)}</h2>
          {isFreeMode ? (
            <p>{normalizePlanText('Todos los planes están bonificados y no requieren tarjeta ni medio de pago.', language, t)}</p>
          ) : (
            <>
              <p>{normalizePlanText('Condiciones comerciales solo por tiempo limitado.', language, t)}</p>
              <ul>
                <li>{normalizePlanText('Inscripción inicial: elegí un plan para activar la cuenta de empresa.', language, t)}</li>
                <li>{normalizePlanText('Periodo de renovación: todas las renovaciones son pagas en cualquiera de sus formas.', language, t)}</li>
                <li>{normalizePlanText('Reconocimiento a la calidad: el empleador mejor calificado podrá acceder a beneficios comerciales al renovar.', language, t)}</li>
                <li>{normalizePlanText('Programa de referidos: los beneficios por referidos se aplican sobre renovaciones o nuevos períodos pagos.', language, t)}</li>
              </ul>
            </>
          )}
        </section>

        <div className="pricing-grid">
          {displayedPlans.map((plan) => {
            const Icon = plan.icon || Shield;
            return (
              <article
                key={plan.id}
                className={`pricing-card ${plan.highlight ? 'pricing-card-highlight' : ''}`}
              >
                {plan.badge && (
                  <span className="pricing-badge">{normalizePlanText(plan.badge, language, t)}</span>
                )}
                <div className="pricing-icon">
                  <Icon size={22} />
                </div>
                <h2>{normalizePlanText(plan.name, language, t)}</h2>
                <p className="pricing-subtitle">{normalizePlanText(plan.subtitle, language, t)}</p>
                <p className="pricing-limited-offer">
                  {normalizePlanText('Solo por tiempo limitado.', language, t)}
                </p>
                {plan.isFreeMode ? (
                  <p className={`pricing-value ${plan.id === 'MONTHLY' ? 'pricing-value-limited' : ''}`}>
                    {normalizePlanText(plan.id === 'MONTHLY' ? 'Gratis por tiempo limitado!' : 'Gratis', language, t)}
                  </p>
                ) : (
                  <p className="pricing-value">
                    {formatPrice(plan.price, plan.currency, language)}
                    <span> / {normalizePlanText(plan.duration || '3 meses', language, t)}</span>
                  </p>
                )}
                <ul className="pricing-features">
                  {(plan.features || []).map((feature) => (
                    <li key={feature}>
                      <Check size={16} />
                      {normalizePlanText(feature, language, t)}
                    </li>
                  ))}
                </ul>
                <Link to="/register/company" className="pricing-cta">
                  {normalizePlanText('Empezar ahora', language, t)}
                </Link>
              </article>
            );
          })}
        </div>

        <div className="pricing-bottom">
          <p>{normalizePlanText('¿Ya tenés cuenta de empresa?', language, t)}</p>
          <Link to="/login">{normalizePlanText('Iniciar sesión', language, t)}</Link>
        </div>
      </div>
    </section>
  );
}
