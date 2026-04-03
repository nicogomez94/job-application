import './QuienesSomos.css';

const aboutImageTop = '/675d0da6-25a1-489f-8b1a-a65243dc0322.jfif';
const aboutImageBottom = '/7cf502a2-e693-4721-9f3c-278d72577747.jfif';

export default function QuienesSomos() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-container">
          <h1>Quiénes Somos</h1>
          <p>Conectamos oportunidades con personas y empresas que quieren crecer.</p>
          <div className="about-image-grid">
            <div className="about-image-card about-image-card-large">
              <img src={aboutImageTop} alt="Equipo de trabajo" />
            </div>
            <div className="about-image-card">
              <img src={aboutImageBottom} alt="Encuentro profesional" />
            </div>
          </div>
        </div>
      </section>

      <section className="about-content">
        <div className="about-container about-card">
          <h2>Empresa</h2>
          <p>Las grandes empresas vienen en tamaño pequeño. Los grandes negocios también.</p>
          <p>
            Las empresas como habitualmente las conocemos tienden a ser grandes edificios con
            muchos empleados e infinidades de gastos, por lo que requieren de una gran inversión,
            solo para mantenerse, lo que implica un gran riesgo y esfuerzo día a día.
          </p>
          <p>
            Esta plataforma las invita a ver la otra cara de la moneda en un mundo cambiante,
            donde las distancias envueltas en cables de silicona son cada vez más cortas y
            veloces.
          </p>
          <p>
            Podríamos decir que por estas autopistas virtuales transitan miles de usuarios sin más
            gastos que unas monedas.
          </p>
          <p>
            Las invitamos a compartir una visión cada día más realista, segura y próspera.
          </p>

          <h2>Profesional</h2>
          <p>Lo más simple suele ser lo más beneficioso y productivo.</p>
          <p>El derecho a la libertad, poder de decisión y autovaloración. Lo demás es puro cuento.</p>

          <h2>Cómo trabajamos</h2>
          <p>Nosotros trabajamos pensando en el bienestar de quienes deseen ser diferentes.</p>
          <p>
            Esta plataforma tiene en cuenta al individuo como primera persona, su bienestar
            personal, familiar, grupal y laboral, es nuestra prioridad.
          </p>
          <p>
            En un mundo de cambios permanentes reducimos las distancias laborales beneficiando a
            quienes deseen participar de manera más activa y progresista, mirar lo nuevo sin
            perder la esencia de la responsabilidad y el trabajo, enfocado en el entorno del
            individuo.
          </p>
          <p>
            Las horas son preciosas para perderlas en rutas, medios de transporte y otros, en su
            lugar, la compartimos con nuestros seres queridos, eventos favoritos y muchos más.
          </p>
          <p>¡Por lo tanto, la propuesta está aquí!</p>
          <p>Profesional at Home les agradece su tiempo y esfuerzo de visitar este sitio web.</p>
          <p>Atte. La gerencia.</p>
        </div>
      </section>
    </div>
  );
}
