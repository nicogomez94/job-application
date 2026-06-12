import { useI18n } from '../../context/i18nStore';
import '../../pages/TermsAndConditions.css';

export default function AcceptanceAgreementPsychologist() {
  const { language } = useI18n();
  const isEn = language === 'en';

  return (
    <div className="terms-page">
      <section className="terms-hero">
        <div className="terms-container">
          <h1>{isEn ? 'Psychologist Professional Acceptance Agreement' : 'Acuerdo de Aceptación del Profesional Psicólogo'}</h1>
          <p className="terms-subtitle">professionalsathome.com</p>
          <p className="terms-updated">{isEn ? 'Last updated: June 2026' : 'Última actualización: Junio 2026'}</p>
        </div>
      </section>

      <section className="terms-content">
        <div className="terms-container terms-card">
          <div className="terms-section">
            <p>
              {isEn
                ? 'By registering, creating a professional profile, or using www.professionalsathome.com (the "Platform"), I declare, warrant, and expressly accept the provisions of this Agreement, together with the Terms and Conditions and the Privacy Policy.'
                : 'Al registrarme, crear un perfil profesional o utilizar los servicios de www.professionalsathome.com (en adelante, la "Plataforma"), declaro, garantizo y acepto expresamente lo siguiente:'}
            </p>
            <p className="terms-highlight">
              {isEn
                ? 'This Agreement applies only to psychologists and mental health professionals who offer their services through the Platform.'
                : 'El presente Acuerdo aplica únicamente a psicólogos y profesionales de la salud mental que ofrecen sus servicios a través de la Plataforma.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '1. Professional Information' : '1. Información Profesional'}</h2>
            <p>
              {isEn
                ? 'I declare that all information provided during registration, including name, education, degrees, licenses, registrations, certifications, specialties, experience, contact details, and any other information published on my profile, is true, accurate, current, and verifiable.'
                : 'Declaro que toda la información proporcionada durante mi registro, incluyendo nombre, formación académica, títulos, licencias, matrículas, certificaciones, especialidades, experiencia profesional, datos de contacto y cualquier otra información publicada en mi perfil, es verdadera, exacta, actualizada y verificable.'}
            </p>
            <p>
              {isEn
                ? 'I commit to keeping this information permanently updated.'
                : 'Me comprometo a mantener dicha información permanentemente actualizada.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '2. Professional Licensing' : '2. Habilitación Profesional'}</h2>
            <p>
              {isEn
                ? 'I declare that I hold all licenses, registrations, certifications, and authorizations legally required to practice psychology in the jurisdictions where I offer my services.'
                : 'Declaro que poseo todas las licencias, matrículas, registros, certificaciones y autorizaciones legalmente exigidas para ejercer la psicología en las jurisdicciones donde ofrezco mis servicios.'}
            </p>
            <p>
              {isEn
                ? 'I also guarantee that my professional activity complies with the laws, regulations, ethical codes, and professional standards applicable in my country, state, province, or region.'
                : 'Asimismo, garantizo que el ejercicio de mi actividad profesional cumple con las leyes, reglamentos, códigos éticos y normas profesionales aplicables en mi país, estado, provincia o región.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '3. Independent Professional Responsibility' : '3. Responsabilidad Profesional Independiente'}</h2>
            <p>
              {isEn
                ? 'I acknowledge that I act as an independent professional and that the Platform only provides a digital space for publishing professional profiles and connecting professionals with users.'
                : 'Reconozco que actúo como profesional independiente y que la Plataforma únicamente proporciona un espacio digital para la publicación de perfiles profesionales y el contacto entre profesionales y usuarios.'}
            </p>
            <ul className="terms-list">
              <li>{isEn ? 'Does not provide psychology, psychotherapy, mental health, or healthcare services.' : 'No presta servicios de psicología, psicoterapia, salud mental o atención sanitaria.'}</li>
              <li>{isEn ? 'Does not participate in the therapeutic relationship between professional and patient.' : 'No participa en la relación terapéutica entre profesional y paciente.'}</li>
              <li>{isEn ? 'Does not supervise, control, or evaluate sessions performed.' : 'No supervisa, controla ni evalúa las sesiones realizadas.'}</li>
              <li>{isEn ? 'Does not intervene in professional agreements between patients and professionals.' : 'No interviene en acuerdos profesionales celebrados entre pacientes y profesionales.'}</li>
              <li>{isEn ? 'Does not intervene in payments, charges, fees, refunds, or transactions of any kind between patients and professionals.' : 'No interviene en pagos, cobros, honorarios, reembolsos o transacciones de ningún tipo entre pacientes y profesionales.'}</li>
              <li>{isEn ? 'Does not guarantee patient acquisition.' : 'No garantiza la obtención de pacientes.'}</li>
              <li>{isEn ? 'Does not guarantee clinical, therapeutic, or professional outcomes.' : 'No garantiza resultados clínicos, terapéuticos ni profesionales.'}</li>
              <li>{isEn ? 'Does not act as employer, representative, partner, or agent of the professional.' : 'No actúa como empleador, representante, socio o agente del profesional.'}</li>
            </ul>
            <p>
              {isEn
                ? 'I assume full responsibility for all services I provide through contacts obtained via the Platform.'
                : 'Asumo plena responsabilidad por todos los servicios que brinde a través de los contactos obtenidos mediante la Plataforma.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '4. Relationship with Patients' : '4. Relación con los Pacientes'}</h2>
            <p>
              {isEn
                ? 'I accept that any professional relationship established with patients or users will be direct and independent between the parties.'
                : 'Acepto que toda relación profesional establecida con pacientes o usuarios será directa e independiente entre las partes.'}
            </p>
            <p>{isEn ? 'I will be exclusively responsible for:' : 'Seré exclusivamente responsable de:'}</p>
            <ul className="terms-list">
              <li>{isEn ? 'Initial clinical evaluation.' : 'La evaluación clínica inicial.'}</li>
              <li>{isEn ? 'Determining the suitability of care.' : 'La determinación de la idoneidad de la atención.'}</li>
              <li>{isEn ? 'Obtaining informed consent.' : 'La obtención del consentimiento informado.'}</li>
              <li>{isEn ? 'Managing and retaining clinical records when applicable.' : 'La gestión y conservación de historias clínicas cuando corresponda.'}</li>
              <li>{isEn ? 'Confidentiality of received information.' : 'La confidencialidad de la información recibida.'}</li>
              <li>{isEn ? 'Compliance with applicable ethical and professional standards.' : 'El cumplimiento de los estándares éticos y profesionales aplicables.'}</li>
              <li>{isEn ? 'Clinical emergency management in accordance with local regulations.' : 'La gestión de emergencias clínicas de acuerdo con la normativa local.'}</li>
              <li>{isEn ? 'Compliance with telepsychology or remote care rules where applicable.' : 'El cumplimiento de las regulaciones sobre tele psicología o atención a distancia cuando sean aplicables.'}</li>
              <li>{isEn ? 'Respectful and non-discriminatory treatment of patients, users, colleagues, and others.' : 'Mantener un trato respetuoso y libre de discriminación hacia pacientes, usuarios, colegas y demás participantes de la Plataforma.'}</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '5. International Services and Telepsychology' : '5. Servicios Internacionales y Telepsicología'}</h2>
            <p>
              {isEn
                ? 'I acknowledge that users may be located in different countries or jurisdictions.'
                : 'Reconozco que los usuarios pueden encontrarse en distintos países o jurisdicciones.'}
            </p>
            <p>
              {isEn
                ? 'Before providing services to a patient, I will verify that my professional authorization allows me to legally treat people located in the jurisdiction provided by the user/patient.'
                : 'Antes de prestar servicios a un paciente, verificaré que mi habilitación profesional me permite atender legalmente a personas ubicadas en la jurisdicción brindada por el usuario y/o paciente.'}
            </p>
            <p>
              {isEn
                ? 'The Platform does not verify or guarantee the legality of cross-border psychological services, and this responsibility is exclusively mine as the professional.'
                : 'La Plataforma no verifica ni garantiza la legalidad de la prestación transfronteriza de servicios psicológicos, siendo esta responsabilidad exclusiva del profesional.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '6. Confidentiality and Data Protection' : '6. Confidencialidad y Protección de Datos'}</h2>
            <p>
              {isEn
                ? 'I commit to protecting the privacy and confidentiality of patients in accordance with applicable data protection laws and professional secrecy obligations.'
                : 'Me comprometo a proteger la privacidad y confidencialidad de los pacientes de conformidad con las leyes y regulaciones aplicables en materia de protección de datos y secreto profesional.'}
            </p>
            <p>
              {isEn
                ? 'I agree to use information obtained through the Platform only for legitimate professional purposes related to psychological care.'
                : 'Acepto utilizar la información obtenida a través de la Plataforma únicamente para fines profesionales legítimos relacionados con la atención psicológica.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '7. Public Profile Information' : '7. Información Pública del Perfil'}</h2>
            <p>
              {isEn
                ? 'I authorize the Platform to publish the professional information I have voluntarily added to my profile, including name, photo, specialties, academic background, languages, jurisdiction, care modality, authorized contact information, fees if I choose to publish them, and any other information I decide to make public.'
                : 'Autorizo a la Plataforma a publicar la información profesional que haya incorporado voluntariamente en mi perfil, incluyendo nombre profesional, fotografía profesional, especialidades, formación académica, idiomas, país o jurisdicción de ejercicio, modalidad de atención, datos de contacto autorizados, honorarios si decido publicarlos y cualquier otra información que decida hacer pública.'}
            </p>
            <p>
              {isEn
                ? 'I declare that I hold the necessary rights to publish all content included in my profile.'
                : 'Declaro que poseo los derechos necesarios para publicar todo el contenido incorporado en mi perfil.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '8. Verification Documentation' : '8. Documentación de Validación'}</h2>
            <p>
              {isEn
                ? 'I accept that the Platform may request documentation to verify my identity and professional status, including degrees, registrations, licenses, professional certificates, or equivalent documents.'
                : 'Acepto que la Plataforma podrá solicitar documentación destinada a verificar mi identidad y condición profesional, incluyendo títulos, matrículas, licencias, certificados profesionales o documentos equivalentes.'}
            </p>
            <p>
              {isEn
                ? 'The Platform may request additional documentation at any time to maintain the validity of my professional profile.'
                : 'La Plataforma podrá solicitar documentación adicional en cualquier momento para mantener la validez de mi perfil profesional.'}
            </p>
            <p>
              {isEn
                ? 'I also accept that patients may request reasonable information to verify my professional authorization under applicable law.'
                : 'Asimismo, acepto que los pacientes podrán solicitar información razonable destinada a verificar mi habilitación profesional conforme a la legislación aplicable.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '9. Professional Conduct' : '9. Conducta Profesional'}</h2>
            <p>
              {isEn
                ? 'I agree to use the Platform ethically, professionally, respectfully, and without discrimination.'
                : 'Me comprometo a utilizar la Plataforma de manera ética, profesional, respetuosa y anti discriminatoria.'}
            </p>
            <ul className="terms-list">
              <li>{isEn ? 'False or misleading.' : 'Falso o engañoso.'}</li>
              <li>{isEn ? 'Defamatory or offensive.' : 'Difamatorio u ofensivo.'}</li>
              <li>{isEn ? 'Discriminatory.' : 'Discriminatorio.'}</li>
              <li>{isEn ? 'Fraudulent.' : 'Fraudulento.'}</li>
              <li>{isEn ? 'Contrary to current law.' : 'Contrario a la legislación vigente.'}</li>
              <li>{isEn ? 'That violates third-party rights.' : 'Que vulnere derechos de terceros.'}</li>
              <li>{isEn ? 'That harms the reputation or proper functioning of the Platform.' : 'Que perjudique la reputación o el correcto funcionamiento de la Plataforma.'}</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '10. Indemnity' : '10. Indemnidad'}</h2>
            <p>
              {isEn
                ? 'I agree to hold harmless the Platform, its owners, administrators, employees, and collaborators from any claim, action, damage, loss, cost, or expense arising from the services I provide, my failure to comply with legal or ethical obligations, false information, lack of authorization, or any conflict between patients and professionals.'
                : 'Acepto mantener indemne a la Plataforma, sus propietarios, administradores, empleados y colaboradores frente a cualquier reclamo, acción, daño, pérdida, costo o gasto derivado de los servicios profesionales que preste, el incumplimiento de mis obligaciones legales o éticas, la falsedad de la información proporcionada, la falta de habilitación profesional o cualquier conflicto surgido entre pacientes y profesionales.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '11. Limitation of Platform Liability' : '11. Limitación de Responsabilidad de la Plataforma'}</h2>
            <p>
              {isEn
                ? 'I accept that the Platform shall not be liable for services rendered by psychologists, diagnoses, evaluations or treatments performed, therapeutic results, conflicts between patients and professionals, contractual breaches between the parties, or direct or indirect damages arising from the professional relationship.'
                : 'Acepto que la Plataforma no será responsable por los servicios profesionales prestados por los psicólogos, diagnósticos, evaluaciones o tratamientos realizados, resultados terapéuticos obtenidos o no obtenidos, conflictos entre pacientes y profesionales, incumplimientos contractuales entre las partes, o daños directos o indirectos derivados de la relación profesional establecida entre pacientes y psicólogos.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '12. Account Suspension or Cancellation' : '12. Suspensión o Cancelación de la Cuenta'}</h2>
            <p>
              {isEn
                ? 'The Platform may suspend, restrict, or permanently cancel my account if I provide false or incomplete information, breach this Agreement, present irregular credentials, receive founded complaints about incompatible professional conduct, or act in a way that affects the security, reputation, or operation of the Platform.'
                : 'La Plataforma podrá suspender, restringir o cancelar mi cuenta, temporal o permanentemente, si proporciono información falsa o incompleta, incumplo este acuerdo, se detectan irregularidades en mis credenciales, existen denuncias fundadas sobre conductas incompatibles con el ejercicio profesional o mi conducta afecta la seguridad, reputación o funcionamiento de la Plataforma.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '13. Electronic Acceptance' : '13. Aceptación Electrónica'}</h2>
            <p className="terms-signature">
              {isEn
                ? 'The professional acknowledges that electronic acceptance through an "accept" option, checkbox, acceptance button, or any other digital mechanism enabled by the Platform shall have the same legal validity as a handwritten signature, to the extent permitted by applicable law.'
                : 'El profesional reconoce que la aceptación electrónica mediante la selección de (acepto) o una casilla de verificación ("checkbox"), botón de aceptación o cualquier otro mecanismo digital habilitado por la Plataforma tendrá la misma validez legal que una firma manuscrita, en la medida permitida por la legislación aplicable.'}
            </p>
          </div>

          <div className="terms-section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <h2>{isEn ? '14. Acceptance' : '14. Aceptación'}</h2>
            <p>
              {isEn
                ? 'I declare that I have read, understood, and fully accepted this Psychologist Professional Acceptance Agreement.'
                : 'Declaro haber leído, comprendido y aceptado íntegramente el presente Acuerdo de Aceptación del Profesional Psicólogo.'}
            </p>
            <p>
              {isEn
                ? 'Important note: The professional and/or psychologist is responsible for verifying whether they can legally treat patients located in other countries.'
                : 'Nota importante: El Profesional y/o psicólogo es responsable de verificar si puede atender legalmente a pacientes ubicados en otros países.'}
            </p>
            <p>{isEn ? 'END.' : 'FIN.'}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
