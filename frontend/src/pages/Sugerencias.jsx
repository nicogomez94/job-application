import './Sugerencias.css';
import { useI18n } from '../context/i18nStore';

const CONTENT = {
  es: {
    title: 'Sugerencias para los Empleadores y Profesionales',
    subtitle: 'ProfessionalsAtHome.com - Recomendaciones para una Colaboración Exitosa',
    intro1:
      'El propósito de este documento es exclusivamente orientativo. ProfessionalsAtHome.com es una plataforma de conexión que no participa, supervisa, ni tiene injerencia alguna en las negociaciones, acuerdos, contratos u obligaciones que pudieran surgir entre los usuarios (Profesionales, Empleadores o cualquier otro intermediario).',
    intro2:
      'Las presentes recomendaciones son sugerencias de buenas prácticas, elaboradas con la intención de fomentar un entorno de colaboración claro y respetuoso. Su adopción es completamente voluntaria y no sustituye el criterio ni la responsabilidad legal de cada parte involucrada.',
    section1Title: '1. Beneficios para Empleadores',
    section1Items: [
      {
        label: 'Inscripción Inicial:',
        text: 'Dos (2) meses gratis en su primera inscripción en la plataforma.',
      },
      {
        label: 'Reconocimiento a la Calidad:',
        text: 'El empleador con la mejor calificación otorgada por los profesionales, al finalizar su período de inscripción paga, será beneficiado con 6 meses adicionales sin costo.',
      },
      {
        label: 'Programa de Referidos:',
        text: 'Por cada empresa que anexe a la plataforma y que concrete una inscripción paga, el empleador referente obtendrá 2 meses gratis.',
      },
    ],
    section2Title: '2. Acuerdos Comerciales y de Pago',
    section2Items: [
      {
        label: 'Autonomía de las Partes:',
        text: 'Los montos, formas de pago, facturación y cualquier otro término comercial serán acordados única y exclusivamente entre las partes interesadas.',
      },
      {
        label: 'Exención de Responsabilidad:',
        text: 'La plataforma ProfessionalsAtHome.com no asume responsabilidad alguna sobre el cumplimiento, interpretación o posibles conflictos derivados de dichos acuerdos.',
      },
    ],
    section3Title: '3. Sugerencias para la Fase Inicial del Proyecto',
    section3Intro: 'Para establecer una base sólida desde el principio, se sugiere el siguiente flujo de trabajo:',
    section3Items: [
      {
        label: 'Propuesta y Alcance:',
        text: 'El empleador presentará la propuesta de trabajo al profesional para su evaluación y la elaboración de un presupuesto, en caso de no estar predefinido.',
      },
      {
        label: 'Análisis Preliminar:',
        text: 'El profesional podrá elaborar un resumen ejecutivo o una propuesta de implementación. La naturaleza (gratuita o paga) y la profundidad de este análisis inicial deberán ser acordadas previamente entre ambas partes.',
      },
      {
        label: 'Decisión de Continuidad:',
        text: 'Si el proyecto no continúa, la colaboración finalizará sin más costes ni obligaciones que los acordados explícitamente para la fase de análisis. Si se decide avanzar, se definirán conjuntamente la estrategia, el presupuesto definitivo y el cronograma de pagos.',
      },
    ],
    section4Title: '4. Gestión de Acuerdos y Entrega Final',
    section4Intro: 'La transparencia y la comunicación son clave para el éxito de cualquier proyecto. Se recomienda:',
    section4Items: [
      {
        label: 'Documentación de Acuerdos:',
        text: 'Se aconseja conservar un registro de todos los acuerdos y conversaciones relevantes. La comunicación a través de la mensajería de la plataforma o aplicaciones como WhatsApp puede servir como respaldo de la voluntad de las partes en caso de discrepancia.',
      },
      {
        label: 'Validación Previa a la Entrega:',
        text: 'Antes de realizar la entrega final del trabajo, el profesional debe verificar que todas las indicaciones, modificaciones y sugerencias del empleador hayan sido incorporadas y cuenten con su aprobación explícita.',
      },
      {
        label: 'Acta de Conformidad (Recomendado):',
        text: 'Se sugiere incluir una cláusula o "Acta de Conformidad" en el documento de entrega final, similar a la siguiente:',
      },
    ],
    section4NoteTitle: 'NOTA DE FINALIZACIÓN Y CONFORMIDAD:',
    section4Note:
      'La recepción de este trabajo por parte del empleador constituye la aceptación definitiva del proyecto. Queda entendido que todas las fases de revisión, modificación y corrección han concluido bajo la supervisión y aprobación del empleador. Por consiguiente, se da por finalizada la relación contractual respecto al objeto de este proyecto, eximiendo a ambas partes de responsabilidades ulteriores, con la única excepción del pago del saldo pendiente, si lo hubiera, según lo estipulado en el acuerdo inicial.',
    section5Title: '5. Sistema de Evaluación',
    section5Intro:
      'Al finalizar la interacción, ambas partes tienen la oportunidad de calificarse mutuamente mediante un sistema de estrellas. Este mecanismo es fundamental para:',
    section5Items: [
      {
        label: 'Fomentar la Confianza:',
        text: 'Ayuda a construir una comunidad sólida basada en la transparencia y el respeto mutuo.',
      },
      {
        label: 'Reconocer la Calidad:',
        text: 'Permite que los futuros usuarios conozcan la trayectoria y el desempeño de profesionales y empleadores dentro de la plataforma.',
      },
    ],
    section5Outro:
      'La participación en el sistema de evaluación es una valiosa contribución a la salud y el prestigio de la comunidad ProfessionalsAtHome.com',
    closing:
      'Esperamos que estas sugerencias sean de utilidad para construir relaciones profesionales fructíferas y transparentes.',
  },
  en: {
    title: 'Suggestions for Employers and Professionals',
    subtitle: 'ProfessionalsAtHome.com - Recommendations for Successful Collaboration',
    intro1:
      'The purpose of this document is solely for guidance. ProfessionalsAtHome.com is a connecting platform that does not participate in, supervise, or intervene in negotiations, agreements, contracts, or obligations that may arise between users (Professionals, Employers, or any other intermediary).',
    intro2:
      'These recommendations are best-practice suggestions, prepared to promote a clear and respectful collaboration environment. Their adoption is entirely voluntary and does not replace the judgment or legal responsibility of each party involved.',
    section1Title: '1. Benefits for Employers',
    section1Items: [
      {
        label: 'Initial Registration:',
        text: 'Two (2) free months on your first registration on the platform.',
      },
      {
        label: 'Quality Recognition:',
        text: 'The employer with the best rating given by professionals, at the end of their paid registration period, will receive 6 additional months at no cost.',
      },
      {
        label: 'Referral Program:',
        text: 'For each company that joins the platform and completes a paid registration, the referring employer will receive 2 free months.',
      },
    ],
    section2Title: '2. Commercial and Payment Agreements',
    section2Items: [
      {
        label: 'Party Autonomy:',
        text: 'Amounts, payment methods, invoicing, and any other commercial terms shall be agreed solely and exclusively between the interested parties.',
      },
      {
        label: 'Liability Disclaimer:',
        text: 'The ProfessionalsAtHome.com platform assumes no responsibility for compliance, interpretation, or potential conflicts arising from such agreements.',
      },
    ],
    section3Title: '3. Suggestions for the Initial Project Phase',
    section3Intro: 'To establish a solid foundation from the beginning, the following workflow is suggested:',
    section3Items: [
      {
        label: 'Proposal and Scope:',
        text: 'The employer will present the work proposal to the professional for evaluation and budget preparation, if not predefined.',
      },
      {
        label: 'Preliminary Analysis:',
        text: 'The professional may prepare an executive summary or implementation proposal. The nature (free or paid) and depth of this initial analysis must be agreed in advance by both parties.',
      },
      {
        label: 'Continuity Decision:',
        text: 'If the project does not continue, collaboration will end with no further costs or obligations beyond those explicitly agreed for the analysis phase. If both parties decide to proceed, strategy, final budget, and payment timeline will be jointly defined.',
      },
    ],
    section4Title: '4. Agreement Management and Final Delivery',
    section4Intro: 'Transparency and communication are key to the success of any project. It is recommended to:',
    section4Items: [
      {
        label: 'Agreement Documentation:',
        text: 'It is recommended to keep a record of all relevant agreements and conversations. Communication through the platform messaging system or apps such as WhatsApp may support the parties intentions in case of disagreement.',
      },
      {
        label: 'Pre-Delivery Validation:',
        text: "Before final delivery, the professional should verify that all employer instructions, modifications, and suggestions have been incorporated and explicitly approved.",
      },
      {
        label: 'Acceptance Certificate (Recommended):',
        text: 'It is recommended to include a clause or "Acceptance Certificate" in the final delivery document, similar to the following:',
      },
    ],
    section4NoteTitle: 'COMPLETION AND ACCEPTANCE NOTE:',
    section4Note:
      'Receipt of this work by the employer constitutes final acceptance of the project. It is understood that all review, modification, and correction phases have been completed under the employer supervision and approval. Therefore, the contractual relationship regarding this project is considered concluded, releasing both parties from further responsibilities, with the sole exception of payment of any outstanding balance, as established in the initial agreement.',
    section5Title: '5. Evaluation System',
    section5Intro:
      'At the end of the interaction, both parties can rate each other through a star system. This mechanism is essential to:',
    section5Items: [
      {
        label: 'Build Trust:',
        text: 'It helps build a strong community based on transparency and mutual respect.',
      },
      {
        label: 'Recognize Quality:',
        text: 'It allows future users to understand the track record and performance of professionals and employers within the platform.',
      },
    ],
    section5Outro:
      'Participating in the rating system is a valuable contribution to the health and prestige of the ProfessionalsAtHome.com community.',
    closing:
      'We hope these suggestions are helpful in building fruitful and transparent professional relationships.',
  },
};

export default function Sugerencias() {
  const { language } = useI18n();
  const content = language === 'en' ? CONTENT.en : CONTENT.es;

  return (
    <section className="tips-page">
      <div className="tips-doc-container">
        <header className="tips-doc-header">
          <h1>{content.title}</h1>
          <p className="tips-doc-subtitle">{content.subtitle}</p>
        </header>

        <p className="tips-doc-intro">{content.intro1}</p>
        <p className="tips-doc-intro">{content.intro2}</p>

        <section className="tips-doc-section">
          <h2>{content.section1Title}</h2>
          <ul className="tips-doc-list">
            {content.section1Items.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong> {item.text}
              </li>
            ))}
          </ul>
        </section>

        <section className="tips-doc-section">
          <h2>{content.section2Title}</h2>
          <ul className="tips-doc-list">
            {content.section2Items.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong> {item.text}
              </li>
            ))}
          </ul>
        </section>

        <section className="tips-doc-section">
          <h2>{content.section3Title}</h2>
          <p>{content.section3Intro}</p>
          <ol className="tips-doc-ordered-list">
            {content.section3Items.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong> {item.text}
              </li>
            ))}
          </ol>
        </section>

        <section className="tips-doc-section">
          <h2>{content.section4Title}</h2>
          <p>{content.section4Intro}</p>
          <ul className="tips-doc-list">
            {content.section4Items.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong> {item.text}
              </li>
            ))}
          </ul>
          <div className="tips-doc-note">
            <p className="tips-doc-note-title">{content.section4NoteTitle}</p>
            <p>{content.section4Note}</p>
          </div>
        </section>

        <section className="tips-doc-section">
          <h2>{content.section5Title}</h2>
          <p>{content.section5Intro}</p>
          <ul className="tips-doc-list">
            {content.section5Items.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong> {item.text}
              </li>
            ))}
          </ul>
          <p>{content.section5Outro}</p>
        </section>

        <p className="tips-doc-closing">{content.closing}</p>
      </div>
    </section>
  );
}
