import { useI18n } from '../context/i18nStore';
import './TermsAndConditions.css';

export default function TermsAndConditions() {
  const { language } = useI18n();
  const isEn = language === 'en';

  return (
    <div className="terms-page">
      <section className="terms-hero">
        <div className="terms-container">
          <h1>{isEn ? 'Terms and Conditions of Use' : 'Términos y Condiciones de Uso'}</h1>
          <p className="terms-subtitle">
            {isEn
              ? 'Professionals At Home - Effective globally'
              : 'Professionals At Home - Vigente a nivel global'}
          </p>
          <p className="terms-updated">
            {isEn ? 'Last updated: March 2026' : 'Última actualización: Marzo 2026'}
          </p>
        </div>
      </section>

      <section className="terms-content">
        <div className="terms-container terms-card">
          <div className="terms-section">
            <h2>{isEn ? '1. Acceptance of Terms' : '1. Aceptación de los Términos'}</h2>
            <p>
              {isEn
                ? 'By accessing, registering, or using professionalsathome.com (the "Platform"), whether as an independent professional ("Professional") or a contracting employer ("Employer"), you expressly and irrevocably acknowledge that you have read, understood, and accepted these Terms and Conditions.'
                : 'Al acceder, registrarse o utilizar el sitio web professionalsathome.com (la "Plataforma"), ya sea en calidad de profesional independiente ("Profesional") o empleador contratante ("Empleador"), usted manifiesta de manera expresa e irrevocable que ha leído, comprendido y aceptado estos Términos y Condiciones.'}
            </p>
            <p>
              {isEn
                ? 'If you do not agree with these terms in full, you must not use the Platform services.'
                : 'Si no está de acuerdo con la totalidad de estos términos, no podrá acceder ni utilizar los servicios ofrecidos por la Plataforma.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>
              {isEn
                ? '2. Nature of the Platform and Limitation of Liability'
                : '2. Naturaleza de la Plataforma y Limitación de Responsabilidad'}
            </h2>
            <p>
              {isEn
                ? 'Professionals At Home is a technology platform that only facilitates contact between Professionals and Employers.'
                : 'Professionals At Home es una plataforma tecnológica de intermediación que facilita el contacto entre Profesionales y Empleadores.'}
            </p>
            <p className="terms-highlight">
              {isEn
                ? 'THE PLATFORM IS NOT A PARTY TO ANY EMPLOYMENT RELATIONSHIP, SERVICE CONTRACT, OR COMMERCIAL AGREEMENT BETWEEN USERS.'
                : 'LA PLATAFORMA NO ES PARTE EN NINGUNA RELACIÓN LABORAL, CONTRATO DE PRESTACIÓN DE SERVICIOS O ACUERDO COMERCIAL ENTRE USUARIOS.'}
            </p>
            <ol className="terms-list">
              <li>
                <strong>{isEn ? 'No employment relationship:' : 'No existe relación laboral:'}</strong>{' '}
                {isEn
                  ? 'The Platform does not act as employer, agent, representative, or advisor of any user.'
                  : 'La Plataforma no actúa como empleador, agente, representante, gestor ni asesor de ninguno de los Usuarios.'}
              </li>
              <li>
                <strong>{isEn ? 'No control:' : 'No injerencia:'}</strong>{' '}
                {isEn
                  ? 'The Platform does not control and is not responsible for service quality, legality, suitability, solvency, or payment behavior of users.'
                  : 'La Plataforma no tiene control ni asume responsabilidad sobre la calidad, legalidad, idoneidad, solvencia o cumplimiento de pago de los usuarios.'}
              </li>
              <li>
                <strong>{isEn ? 'Full disclaimer:' : 'Exención total de responsabilidad:'}</strong>{' '}
                {isEn
                  ? 'professionalsathome.com and its team are released from disputes, damages, losses, or claims arising between users.'
                  : 'professionalsathome.com y su equipo quedan eximidos de disputas, daños, pérdidas o reclamos que pudieran surgir entre usuarios.'}
              </li>
            </ol>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '3. Code of Conduct' : '3. Código de Conducta'}</h2>
            <ul className="terms-bullet-list">
              <li>
                {isEn
                  ? 'Maintain professional, truthful, and respectful communication.'
                  : 'Mantener una comunicación profesional, ética, veraz y respetuosa.'}
              </li>
              <li>
                {isEn
                  ? 'Avoid discrimination, harassment, defamation, or abusive language.'
                  : 'Abstenerse de realizar actos de discriminación, acoso, difamación o lenguaje ofensivo.'}
              </li>
              <li>
                {isEn
                  ? 'Collaborate in good faith to resolve differences before escalating disputes.'
                  : 'Colaborar de buena fe para resolver diferencias antes de escalar conflictos.'}
              </li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '4. Accuracy of Information' : '4. Veracidad de la Información'}</h2>
            <p>
              {isEn
                ? 'Users are solely responsible for ensuring that profile data, credentials, documents, and references are authentic, accurate, and updated.'
                : 'El Usuario es responsable exclusivo de que los datos de perfil, credenciales, documentos y referencias sean auténticos, veraces y actualizados.'}
            </p>
            <p>
              {isEn
                ? 'Fraudulent or malicious information may result in immediate permanent account termination and loss of paid amounts without refund.'
                : 'La información fraudulenta o maliciosa podrá implicar la baja inmediata y definitiva de la cuenta y la pérdida de importes abonados sin derecho a reembolso.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>
              {isEn
                ? '5. Employer Breach (Non-payment)'
                : '5. Incumplimiento del Empleador (Falta de Pago)'}
            </h2>
            <p>
              {isEn
                ? 'If an Employer accepts delivered services and does not pay the agreed amount, the Platform may suspend or terminate the account.'
                : 'Si un Empleador acepta el servicio entregado y no realiza el pago acordado, la Plataforma podrá suspender o dar de baja su cuenta.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>
              {isEn
                ? '6. Professional Breach (Non-delivery)'
                : '6. Incumplimiento del Profesional (Falta de Entrega)'}
            </h2>
            <p>
              {isEn
                ? 'If a Professional receives payment and fails to deliver without valid justification, the Platform may terminate the account and cooperate with authorities if needed.'
                : 'Si un Profesional recibe pago y no cumple con la entrega sin justificación válida, la Plataforma podrá dar de baja la cuenta y colaborar con autoridades cuando corresponda.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '7. Disputes' : '7. Conflictos y Disputas'}</h2>
            <p>
              {isEn
                ? 'The Platform does not act as mediator, arbitrator, or judge in disputes between users.'
                : 'La Plataforma no actúa como mediador, árbitro ni juez en conflictos entre usuarios.'}
            </p>
            <p>
              {isEn
                ? 'The Platform may only provide records when required by a valid court order from competent authority.'
                : 'La Plataforma solo podrá facilitar registros cuando exista una orden judicial válida de autoridad competente.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '8. Sanctions and Account Termination' : '8. Sanciones y Baja de la Plataforma'}</h2>
            <ul className="terms-bullet-list">
              <li>{isEn ? 'Temporary suspension of the account.' : 'Suspensión temporal de la cuenta.'}</li>
              <li>{isEn ? 'Permanent account termination.' : 'Baja definitiva de la cuenta.'}</li>
              <li>
                {isEn
                  ? 'No refund is granted for amounts paid, where applicable.'
                  : 'No habrá derecho a reembolso de montos abonados, cuando corresponda.'}
              </li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '9. Governing Law and Jurisdiction' : '9. Legislación Aplicable y Jurisdicción'}</h2>
            <p>
              {isEn
                ? 'These Terms are governed by the substantive laws of the Republic of Panama. Any dispute shall be submitted to the ordinary courts of Panama City, Republic of Panama.'
                : 'Estos Términos se rigen por las leyes sustantivas de la República de Panamá. Toda controversia se someterá a los tribunales ordinarios de la Ciudad de Panamá, República de Panamá.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '10. Contact' : '10. Contacto'}</h2>
            <p>
              {isEn
                ? 'For questions or notices regarding these terms, contact the general management of Professionals At Home through the official channels published on the Platform.'
                : 'Para consultas o notificaciones sobre estos términos, contacte a la Dirección General de Professionals At Home a través de los canales oficiales publicados en la Plataforma.'}
            </p>
            <p className="terms-signature">
              {isEn ? 'Sincerely,' : 'Atentamente,'}
              <br />
              <strong>{isEn ? 'General Management' : 'La Dirección General'}</strong>
              <br />
              <strong>Professionals At Home</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
