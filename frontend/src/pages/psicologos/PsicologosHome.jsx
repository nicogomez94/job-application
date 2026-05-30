import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import './PsicologosHome.css';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80';

const IMG_EMBARAZADAS = '/psico-embarazadas.jpeg';
const IMG_MOVILIDAD = '/psico-movilidad.jpeg';
const IMG_MADRES = '/psico-madres.jpeg';

const GENERAL_BENEFITS = [
  {
    title: 'Superás barreras geográficas y de movilidad',
    text: 'No importa si vivís en un pueblo pequeño, si no hay psicólogos cerca o si tenés dificultades para desplazarte. Solo necesitás internet.',
  },
  {
    title: 'Ahorrás tiempo y dinero en traslados',
    text: 'Nada de atascos, esperas en sala o gasto en combustible. Ese tiempo y dinero lo invertís en tu bienestar.',
  },
  {
    title: 'Te sentís más cómodo y con privacidad',
    text: 'Estar en tu propio espacio reduce la ansiedad y el temor a encontrarte con conocidos en una sala de espera. Para muchos, esto disminuye el estigma de pedir ayuda.',
  },
  {
    title: 'Horarios a tu medida',
    text: 'Podés agendar sesiones al mediodía, al anochecer o fines de semana, algo difícil en consultorios físicos con horario fijo.',
  },
  {
    title: 'Continuidad sin interrupciones',
    text: 'Si viajás por trabajo, te mudás o cambiás de ciudad, no perdés a tu terapeuta ni los avances. La terapia viaja con vos.',
  },
  {
    title: 'Misma efectividad para la mayoría de los problemas',
    text: 'Los estudios muestran que la terapia online es tan eficaz como la presencial para ansiedad, depresión leve-moderada, duelo, estrés laboral, fobias, problemas de pareja, etc.',
  },
  {
    title: 'Menor costo económico',
    text: 'Muchos psicólogos remotos tienen tarifas más bajas al no alquilar consultorio. Además, cero gastos de desplazamiento.',
  },
  {
    title: 'Opciones de comunicación variadas',
    text: 'No solo videollamada: hay chat, mensajes asíncronos, seguimiento por app, etc. Te adaptás a tu estilo.',
  },
  {
    title: 'Mayor adherencia al tratamiento',
    text: 'Al ser más cómodo, es menos probable que canceles sesiones por pereza, lluvia o tráfico. La constancia mejora los resultados.',
  },
];

const SPECIAL_GROUPS = [
  {
    title: 'Personas con poca movilidad',
    image: IMG_MOVILIDAD,
    items: [
      'Elimina barreras físicas: No necesitan desplazarse en transporte público o coche.',
      'Evita riesgos de caídas o accidentes en trayectos hacia el consultorio.',
      'Ahorro de energía física: la fatiga por salir de casa se reduce al mínimo.',
      'Mayor autonomía: pueden recibir atención sin depender de familiares.',
      'Continuidad ante problemas de salud crónicos o climatológicos.',
    ],
  },
  {
    title: 'Mujeres embarazadas',
    image: IMG_EMBARAZADAS,
    items: [
      'Evita esfuerzos y riesgos en desplazamientos, especialmente en embarazos de alto riesgo.',
      'Ideal para reposo parcial o total: permite mantener el apoyo psicológico sin violar indicaciones médicas.',
      'Preparación al parto y postparto desde la tranquilidad del hogar, incluso con la pareja de forma remota.',
    ],
  },
  {
    title: 'Madres con hijos muy pequeños',
    image: IMG_MADRES,
    items: [
      'Sin necesidad de conseguir ni pagar cuidador: la madre puede estar en casa mientras el niño duerme o juega cerca.',
      'Flexibilidad ante imprevistos: si el bebé llora o hay que atenderlo, se puede pausar brevemente la sesión.',
      'Ahorro de tiempo y estrés: no hay que preparar la mochila del niño, desplazarse ni mantenerlo tranquilo en sala de espera.',
    ],
  },
];

const PLANS = [
  {
    id: 'MONTHLY',
    name: 'Plan 3 meses',
    subtitle: 'Ideal para empezar',
    price: 30,
    currency: 'USD',
    duration: '3 meses',
    features: [
      'Perfil visible para pacientes',
      'Ideal para validar el servicio',
      'Bonificado para psicólogos',
    ],
    highlight: false,
  },
  {
    id: 'QUARTERLY',
    name: 'Plan 7 meses',
    subtitle: 'La mejor relación precio-valor',
    price: 50,
    currency: 'USD',
    duration: '7 meses',
    features: [
      'Mayor continuidad de publicaciones',
      'Mejor costo por mes',
      'Bonificado para psicólogos',
    ],
    highlight: true,
    badge: 'Recomendado',
  },
  {
    id: 'ANNUAL',
    name: 'Plan 12 + 1',
    subtitle: 'Para mayor continuidad',
    price: 80,
    currency: 'USD',
    duration: '13 meses',
    features: [
      '1 mes adicional sin costo incluido',
      'Cobertura anual extendida',
      'Bonificado para psicólogos',
    ],
    highlight: false,
  },
];

export default function PsicologosHome() {
  const { isAuthenticated, userType } = useAuthStore();
  const isPatient = isAuthenticated && userType === 'patient';
  const isPsychologist = isAuthenticated && userType === 'psychologist';

  return (
    <div className="psico-home">
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section
        className="psico-home-hero"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      >
        <div className="psico-home-hero-overlay">
          <h1 className="psico-home-hero-title">Psicólogos en Línea</h1>
          <p className="psico-home-hero-sub">
            Professionals at Home · Terapia online, donde estés
          </p>
          <div className="psico-home-hero-disclaimer">
            <strong>Aviso:</strong> La atención remota no es recomendable para crisis aguda de psicosis, riesgo de la salud física del paciente, intento de atentar contra la vida propia o de otros, etc. En estos casos se recomienda llamar al número de emergencia más cercano para casos de esta índole.
          </div>
          <div className="psico-home-hero-ctas">
            <Link to="/psicologos/buscar" className="psico-home-hero-btn psico-home-hero-btn--outline">
              Buscar psicólogo
            </Link>
            {!isAuthenticated ? (
              <Link to="/psicologos/registro-paciente" className="psico-home-hero-btn psico-home-hero-btn--solid">
                Soy paciente →
              </Link>
            ) : isPatient ? (
              <Link to="/psicologos/mi-cuenta" className="psico-home-hero-btn psico-home-hero-btn--solid">
                Mis solicitudes →
              </Link>
            ) : isPsychologist ? (
              <Link to="/psicologo/dashboard" className="psico-home-hero-btn psico-home-hero-btn--solid">
                Mi panel →
              </Link>
            ) : null}
          </div>
          {!isAuthenticated && (
            <div className="psico-home-hero-psy-link">
              ¿Sos psicólogo?{' '}
              <Link to="/register/psicologo">Registrate aquí</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── BENEFICIOS HEADER ──────────────────────────────────── */}
      <div className="psico-home-benefits-header">
        <h2>Beneficios de la terapia en línea / remota</h2>
      </div>

      {/* ── TEXTO 1: beneficios generales ─────────────────────── */}
      <section className="psico-home-general">
        <div className="psico-home-general-inner">
          <h3 className="psico-home-general-title">
            ¿Por qué elegir la psicología remota?
          </h3>
          <p className="psico-home-general-intro">
            Optar por la psicología remota tiene sentido por varias razones prácticas,
            emocionales y económicas. Aquí los motivos clave:
          </p>
          <ul className="psico-home-general-list">
            {GENERAL_BENEFITS.map((b) => (
              <li key={b.title} className="psico-home-general-item">
                <span className="psico-home-general-check">✓</span>
                <div>
                  <strong>{b.title}:</strong> {b.text}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── TEXTO 2-3-4: grupos especiales ────────────────────── */}
      <section className="psico-home-groups">
        <div className="psico-home-groups-grid">
          {SPECIAL_GROUPS.map((group) => (
            <div key={group.title} className="psico-home-group-col">
              <div className="psico-home-group-card">
                <h3 className="psico-home-group-title">{group.title}</h3>
                <ul className="psico-home-group-list">
                  {group.items.map((item) => (
                    <li key={item}>
                      <span className="psico-home-group-check">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="psico-home-group-img-wrap">
                <img
                  src={group.image}
                  alt={group.title}
                  className="psico-home-group-img"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PLANES DE PAGO ────────────────────────────────────── */}
      <section className="psico-home-plans">
        <div className="psico-home-plans-inner">
          <h2 className="psico-home-plans-title">Planes para Psicólogos</h2>
          <p className="psico-home-plans-sub">
            Elegí el plan que mejor se adapte a tu práctica profesional. Hoy están gratis.
          </p>

          <div className="psico-home-plans-grid">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`psico-home-plan-card ${plan.highlight ? 'psico-home-plan-card--highlight' : ''}`}
              >
                {plan.badge && (
                  <span className="psico-home-plan-badge">{plan.badge}</span>
                )}
                <h3 className="psico-home-plan-name">{plan.name}</h3>
                <p className="psico-home-plan-subtitle">{plan.subtitle}</p>
                <div className="psico-home-plan-price">
                  <span className="psico-home-plan-free">Gratis</span>
                  <span className="psico-home-plan-regular">
                    USD {plan.price} / {plan.duration}
                  </span>
                </div>
                <ul className="psico-home-plan-features">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <span className="psico-home-plan-check">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {isPsychologist ? (
                  <Link
                    to="/psicologo/plan"
                    className={`psico-home-plan-btn ${plan.highlight ? 'psico-home-plan-btn--highlight' : ''}`}
                  >
                    Ver mi plan
                  </Link>
                ) : !isAuthenticated ? (
                  <Link
                    to="/register/psicologo"
                    className={`psico-home-plan-btn ${plan.highlight ? 'psico-home-plan-btn--highlight' : ''}`}
                  >
                    Comenzar
                  </Link>
                ) : null}
              </div>
            ))}
          </div>

          <p className="psico-home-plans-note">
            <strong>Promoción vigente:</strong> el precio regular figura como referencia, pero el acceso
            a los planes para psicólogos está bonificado.
          </p>
        </div>
      </section>

      {/* ── IMPORTANTE ────────────────────────────────────────── */}
      <section className="psico-home-important">
        <div className="psico-home-important-inner">
          <h4 className="psico-home-important-title">IMPORTANTE</h4>
          <p>
            Esta sección de Psicología es completamente independiente a la sección inicial de
            Professionals at Home, por lo tanto los registros, términos y condiciones, privacidad y
            otros también son diferentes a los anteriores, ya que legalmente presentan otras normativas
            para los psicólogos profesionales. Para que el interesado en el servicio —cliente o
            paciente— pueda hacer cumplir su derecho a la atención que demandan las leyes bajo este
            servicio de psicología a nivel Nacional e Internacional, el profesional debe estar de
            acuerdo con dichas pautas, términos y condiciones. Este ratificado debe tener su conformidad
            de que fue apropiadamente leído y aceptado por el profesional en cuestión, con pleno
            conocimiento de los mismos y bajo su propia decisión.
          </p>
          <div className="psico-home-important-links">
            <Link to="/psicologos/terminos-y-condiciones">Términos y condiciones</Link>
            <Link to="/psicologos/politicas-de-privacidad">Privacidad</Link>
            {/* <Link to="/psicologos/contacto">Contacto</Link> */}
            {/* <Link to="/psicologo/plan">Planes de Pago</Link> */}
          </div>
        </div>
      </section>
    </div>
  );
}
