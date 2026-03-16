import './Sugerencias.css';

export default function Sugerencias() {
  return (
    <section className="tips-page">
      <div className="tips-doc-container">
        <header className="tips-doc-header">
          <h1>Sugerencias para los Empleadores y Profesionales</h1>
          <p className="tips-doc-subtitle">ProfessionalsAtHome.com - Recomendaciones para una Colaboración Exitosa</p>
        </header>

        <p className="tips-doc-intro">
          El propósito de este documento es exclusivamente orientativo. ProfessionalsAtHome.com es una plataforma de
          conexión que no participa, supervisa, ni tiene injerencia alguna en las negociaciones, acuerdos, contratos u
          obligaciones que pudieran surgir entre los usuarios (Profesionales, Empleadores o cualquier otro intermediario).
        </p>
        <p className="tips-doc-intro">
          Las presentes recomendaciones son sugerencias de buenas prácticas, elaboradas con la intención de fomentar un
          entorno de colaboración claro y respetuoso. Su adopción es completamente voluntaria y no sustituye el criterio
          ni la responsabilidad legal de cada parte involucrada.
        </p>

        <section className="tips-doc-section">
          <h2>1. Beneficios para Empleadores</h2>
          <ul className="tips-doc-list">
            <li>
              <strong>Inscripción Inicial:</strong> Dos (2) meses gratis en su primera inscripción en la plataforma.
            </li>
            <li>
              <strong>Reconocimiento a la Calidad:</strong> El empleador con la mejor calificación otorgada por los
              profesionales, al finalizar su período de inscripción paga, será beneficiado con 6 meses adicionales sin
              costo.
            </li>
            <li>
              <strong>Programa de Referidos:</strong> Por cada empresa que anexe a la plataforma y que concrete una
              inscripción paga, el empleador referente obtendrá 2 meses gratis.
            </li>
          </ul>
        </section>

        <section className="tips-doc-section">
          <h2>2. Acuerdos Comerciales y de Pago</h2>
          <ul className="tips-doc-list">
            <li>
              <strong>Autonomía de las Partes:</strong> Los montos, formas de pago, facturación y cualquier otro término
              comercial serán acordados única y exclusivamente entre las partes interesadas.
            </li>
            <li>
              <strong>Exención de Responsabilidad:</strong> La plataforma ProfessionalsAtHome.com no asume
              responsabilidad alguna sobre el cumplimiento, interpretación o posibles conflictos derivados de dichos
              acuerdos.
            </li>
          </ul>
        </section>

        <section className="tips-doc-section">
          <h2>3. Sugerencias para la Fase Inicial del Proyecto</h2>
          <p>Para establecer una base sólida desde el principio, se sugiere el siguiente flujo de trabajo:</p>
          <ol className="tips-doc-ordered-list">
            <li>
              <strong>Propuesta y Alcance:</strong> El empleador presentará la propuesta de trabajo al profesional para
              su evaluación y la elaboración de un presupuesto, en caso de no estar predefinido.
            </li>
            <li>
              <strong>Análisis Preliminar:</strong> El profesional podrá elaborar un resumen ejecutivo o una propuesta
              de implementación. La naturaleza (gratuita o paga) y la profundidad de este análisis inicial deberán ser
              acordadas previamente entre ambas partes.
            </li>
            <li>
              <strong>Decisión de Continuidad:</strong> Si el proyecto no continúa, la colaboración finalizará sin más
              costes ni obligaciones que los acordados explícitamente para la fase de análisis. Si se decide avanzar, se
              definirán conjuntamente la estrategia, el presupuesto definitivo y el cronograma de pagos.
            </li>
          </ol>
        </section>

        <section className="tips-doc-section">
          <h2>4. Gestión de Acuerdos y Entrega Final</h2>
          <p>
            La transparencia y la comunicación son clave para el éxito de cualquier proyecto. Se recomienda:
          </p>
          <ul className="tips-doc-list">
            <li>
              <strong>Documentación de Acuerdos:</strong> Se aconseja conservar un registro de todos los acuerdos y
              conversaciones relevantes. La comunicación a través de la mensajería de la plataforma o aplicaciones como
              WhatsApp puede servir como respaldo de la voluntad de las partes en caso de discrepancia.
            </li>
            <li>
              <strong>Validación Previa a la Entrega:</strong> Antes de realizar la entrega final del trabajo, el
              profesional debe verificar que todas las indicaciones, modificaciones y sugerencias del empleador hayan
              sido incorporadas y cuenten con su aprobación explícita.
            </li>
            <li>
              <strong>Acta de Conformidad (Recomendado):</strong> Se sugiere incluir una cláusula o "Acta de
              Conformidad" en el documento de entrega final, similar a la siguiente:
            </li>
          </ul>
          <div className="tips-doc-note">
            <p className="tips-doc-note-title">NOTA DE FINALIZACIÓN Y CONFORMIDAD:</p>
            <p>
              La recepción de este trabajo por parte del empleador constituye la aceptación definitiva del proyecto.
              Queda entendido que todas las fases de revisión, modificación y corrección han concluido bajo la
              supervisión y aprobación del empleador. Por consiguiente, se da por finalizada la relación contractual
              respecto al objeto de este proyecto, eximiendo a ambas partes de responsabilidades ulteriores, con la
              única excepción del pago del saldo pendiente, si lo hubiera, según lo estipulado en el acuerdo inicial.
            </p>
          </div>
        </section>

        <section className="tips-doc-section">
          <h2>5. Sistema de Evaluación</h2>
          <p>
            Al finalizar la interacción, ambas partes tienen la oportunidad de calificarse mutuamente mediante un
            sistema de estrellas. Este mecanismo es fundamental para:
          </p>
          <ul className="tips-doc-list">
            <li>
              <strong>Fomentar la Confianza:</strong> Ayuda a construir una comunidad sólida basada en la transparencia
              y el respeto mutuo.
            </li>
            <li>
              <strong>Reconocer la Calidad:</strong> Permite que los futuros usuarios conozcan la trayectoria y el
              desempeño de profesionales y empleadores dentro de la plataforma.
            </li>
          </ul>
          <p>
            La participación en el sistema de evaluación es una valiosa contribución a la salud y el prestigio de la
            comunidad ProfessionalsAtHome.com
          </p>
        </section>

        <p className="tips-doc-closing">
          Esperamos que estas sugerencias sean de utilidad para construir relaciones profesionales fructíferas y
          transparentes.
        </p>
      </div>
    </section>
  );
}
