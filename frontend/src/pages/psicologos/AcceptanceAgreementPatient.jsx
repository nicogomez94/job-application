import { useI18n } from '../../context/i18nStore';
import '../../pages/TermsAndConditions.css';

export default function AcceptanceAgreementPatient() {
  const { language } = useI18n();
  const isEn = language === 'en';

  return (
    <div className="terms-page">
      <section className="terms-hero">
        <div className="terms-container">
          <h1>{isEn ? 'User / Patient Acceptance Agreement' : 'Acuerdo de Aceptación del Usuario / Paciente'}</h1>
          <p className="terms-subtitle">professionalsathome.com</p>
          <p className="terms-updated">{isEn ? 'Last updated: June 2026' : 'Última actualización: Junio 2026'}</p>
        </div>
      </section>

      <section className="terms-content">
        <div className="terms-container terms-card">
          <div className="terms-section">
            <p>
              {isEn
                ? 'By registering, accessing, or using the platform www.professionalsathome.com (the "Platform"), I declare that I have read, understood, and fully accepted the Terms and Conditions, the Privacy Policy, and the provisions contained in this Agreement.'
                : 'Al registrarme, acceder o utilizar la plataforma www.professionalsathome.com (en adelante, la "Plataforma"), declaro que he leído, comprendido y aceptado íntegramente los Términos y Condiciones, la Política de Privacidad y las disposiciones contenidas en el presente Acuerdo.'}
            </p>
            <p className="terms-highlight">
              {isEn
                ? 'This Agreement is intended only for patients and users who contact independent mental health professionals through the Platform.'
                : 'El presente Acuerdo está destinado únicamente a pacientes y usuarios que contactan profesionales independientes de la salud mental a través de la Plataforma.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '1. Nature of the Platform' : '1. Naturaleza de la Plataforma'}</h2>
            <p>
              {isEn
                ? 'The Platform is a digital service designed to facilitate contact between users/patients and independent mental health professionals.'
                : 'La Plataforma es un servicio digital destinado a facilitar el contacto entre usuarios/pacientes y profesionales independientes de la salud mental.'}
            </p>
            <p>
              {isEn
                ? 'The Platform does not provide psychology, psychotherapy, psychiatry, clinical counseling, or any type of healthcare service.'
                : 'La Plataforma no presta servicios de psicología, psicoterapia, psiquiatría, asesoramiento clínico ni atención sanitaria de ningún tipo.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '2. Independence of Professionals' : '2. Independencia de los Profesionales'}</h2>
            <p>
              {isEn
                ? 'The psychologists and other professionals listed on the Platform act independently and under their own professional responsibility.'
                : 'Los psicólogos y demás profesionales publicados en la Plataforma actúan de forma independiente y bajo su exclusiva responsabilidad profesional.'}
            </p>
            <p>
              {isEn
                ? 'The Platform is not an employer, partner, representative, supervisor, or liable party for the services provided by professionals.'
                : 'La Plataforma no es empleadora, socia, representante, supervisora ni responsable de los servicios prestados por los profesionales.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '3. Professional-User Relationship' : '3. Relación Profesional-Usuario'}</h2>
            <p>
              {isEn
                ? 'Any therapeutic, professional, contractual, or assistance relationship that may arise between a user and a professional will be established exclusively between those parties.'
                : 'Toda relación terapéutica, profesional, contractual o asistencial que pueda surgir entre un usuario y un profesional será establecida exclusivamente entre dichas partes.'}
            </p>
            <p>{isEn ? 'The Platform does not participate in:' : 'La Plataforma no participa en:'}</p>
            <ul className="terms-list">
              <li>{isEn ? 'Diagnoses.' : 'Diagnósticos.'}</li>
              <li>{isEn ? 'Treatments.' : 'Tratamientos.'}</li>
              <li>{isEn ? 'Clinical evaluations.' : 'Evaluaciones clínicas.'}</li>
              <li>{isEn ? 'Therapy sessions.' : 'Sesiones terapéuticas.'}</li>
              <li>{isEn ? 'Exchange of clinical documentation.' : 'Intercambio de documentación clínica.'}</li>
              <li>{isEn ? 'Payments or charges made outside the services expressly offered by the Platform.' : 'Pagos o cobros realizados fuera de los servicios expresamente ofrecidos por la Plataforma.'}</li>
              <li>{isEn ? 'Payments between patients and psychologists.' : 'Pagos entre pacientes y psicólogos.'}</li>
              <li>{isEn ? 'Professional agreements entered into by the parties.' : 'Acuerdos profesionales celebrados entre las partes.'}</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '4. Verification of Credentials' : '4. Verificación de Credenciales'}</h2>
            <p>
              {isEn
                ? 'The Platform may perform reasonable checks of identity, professional registration, licenses, or documentation provided by professionals.'
                : 'La Plataforma podrá realizar verificaciones razonables de identidad, matrícula profesional, licencias o documentación aportada por los profesionales.'}
            </p>
            <p>
              {isEn
                ? 'However, the user acknowledges that the Platform cannot guarantee, in an absolute manner, the validity, vigency, or legal status of such credentials in every jurisdiction.'
                : 'Sin embargo, el usuario reconoce que la Plataforma no puede garantizar de manera absoluta la vigencia, validez o situación legal de dichas credenciales en todas las jurisdicciones.'}
            </p>
            <p>
              {isEn
                ? 'The user has the right, as well as the responsibility, to carry out any additional verification they consider necessary before hiring or starting therapy with a professional.'
                : 'El usuario tiene el derecho como así la responsabilidad de realizar cualquier verificación adicional que considere necesaria antes de contratar o iniciar un proceso terapéutico con un profesional.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '5. Information Published by Professionals' : '5. Información Publicada por los Profesionales'}</h2>
            <p>
              {isEn
                ? 'The information contained in professional profiles is provided directly by each professional.'
                : 'La información contenida en los perfiles profesionales es proporcionada directamente por cada profesional.'}
            </p>
            <p>
              {isEn
                ? 'The Platform does not guarantee the accuracy, timeliness, completeness, or suitability of that information.'
                : 'La Plataforma no garantiza la exactitud, actualidad, integridad o adecuación de dicha información.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '6. Emergency Situations' : '6. Situaciones de Emergencia'}</h2>
            <p>
              {isEn
                ? 'The Platform is not an emergency service.'
                : 'La Plataforma no constituye un servicio de emergencia.'}
            </p>
            <p>{isEn ? 'In cases of:' : 'En caso de:'}</p>
            <ul className="terms-list">
              <li>{isEn ? 'Risk of suicide.' : 'Riesgo de suicidio.'}</li>
              <li>{isEn ? 'Risk of self-harm.' : 'Riesgo de autolesión.'}</li>
              <li>{isEn ? 'Severe psychological crisis.' : 'Crisis psicológica grave.'}</li>
              <li>{isEn ? 'Risk to third parties.' : 'Riesgo para terceros.'}</li>
              <li>{isEn ? 'Medical or psychiatric emergencies.' : 'Emergencias médicas o psiquiátricas.'}</li>
            </ul>
            <p>
              {isEn
                ? 'The user must immediately contact emergency services, local authorities, or specialized care centers in their jurisdiction.'
                : 'El usuario deberá contactar inmediatamente con los servicios de emergencia, autoridades locales o centros de asistencia especializados de su jurisdicción.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '7. Limitation of Liability' : '7. Limitación de Responsabilidad'}</h2>
            <p>
              {isEn
                ? 'To the maximum extent permitted by applicable law, the Platform shall not be liable for:'
                : 'En la máxima medida permitida por la legislación aplicable, la Plataforma no será responsable por:'}
            </p>
            <ul className="terms-list">
              <li>{isEn ? 'Acts or omissions of professionals.' : 'Actos u omisiones de los profesionales.'}</li>
              <li>{isEn ? 'Therapeutic outcomes.' : 'Resultados terapéuticos.'}</li>
              <li>{isEn ? 'Diagnoses made by professionals.' : 'Diagnósticos realizados por profesionales.'}</li>
              <li>{isEn ? 'Clinical decisions.' : 'Decisiones clínicas.'}</li>
              <li>{isEn ? 'Direct or indirect damages arising from the relationship between user and professional.' : 'Daños directos o indirectos derivados de la relación entre usuario y profesional.'}</li>
              <li>{isEn ? 'Temporary service interruptions.' : 'Interrupciones temporales del servicio.'}</li>
              <li>{isEn ? 'Technical or technological errors.' : 'Errores técnicos o tecnológicos.'}</li>
              <li>{isEn ? 'Information provided by third parties.' : 'Información proporcionada por terceros.'}</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '8. Data Protection' : '8. Protección de Datos'}</h2>
            <p>
              {isEn
                ? 'The user agrees that their personal data will be processed in accordance with the Platform’s current Privacy Policy.'
                : 'El usuario acepta que sus datos personales serán tratados de acuerdo con la Política de Privacidad vigente de la Plataforma.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '9. User Conduct' : '9. Conducta del Usuario'}</h2>
            <p>{isEn ? 'The user agrees to:' : 'El usuario se compromete a:'}</p>
            <ul className="terms-list">
              <li>{isEn ? 'Provide truthful information.' : 'Proporcionar información veraz.'}</li>
              <li>{isEn ? 'Use the Platform lawfully.' : 'Utilizar la Plataforma de manera lícita.'}</li>
              <li>{isEn ? 'Not engage in fraudulent activities.' : 'No realizar actividades fraudulentas.'}</li>
              <li>{isEn ? 'Not harass, threaten, or harm other users or professionals.' : 'No acosar, amenazar o perjudicar a otros usuarios o profesionales.'}</li>
              <li>{isEn ? 'Respect the applicable laws of their jurisdiction.' : 'Respetar las leyes aplicables de su jurisdicción.'}</li>
              <li>{isEn ? 'Not make racist comments toward any member of the Platform, patients, professionals, or others.' : 'No tener o hacer comentarios racistas a ningún miembro de la plataforma, paciente, profesional, etc.'}</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '10. Electronic Acceptance' : '10. Aceptación Electrónica'}</h2>
            <p className="terms-signature">
              {isEn
                ? 'The user acknowledges that electronic acceptance through a checkbox, acceptance button, or any other digital mechanism enabled by the Platform shall have the same legal validity as a handwritten signature, to the extent permitted by applicable law.'
                : 'El usuario reconoce que la aceptación electrónica mediante la selección de una casilla de verificación ("checkbox"), botón de aceptación o cualquier otro mecanismo digital habilitado por la Plataforma tendrá la misma validez legal que una firma manuscrita, en la medida permitida por la legislación aplicable.'}
            </p>
          </div>

          <div className="terms-section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <h2>{isEn ? 'Consent' : 'Consentimiento'}</h2>
            <ul className="terms-list">
              <li>{isEn ? 'I declare that I have read and understood this Acceptance Agreement.' : 'Declaro que he leído y comprendido este Acuerdo de Aceptación.'}</li>
              <li>{isEn ? 'I declare that I have read and accepted the Terms and Conditions of the Platform.' : 'Declaro que he leído y aceptado los Términos y Condiciones de la Plataforma.'}</li>
              <li>{isEn ? 'I declare that I have read and accepted the Privacy Policy of the Platform.' : 'Declaro que he leído y aceptado la Política de Privacidad de la Plataforma.'}</li>
              <li>{isEn ? 'I understand that the Platform only facilitates contact between users and independent professionals.' : 'Comprendo que la Plataforma únicamente facilita el contacto entre usuarios y profesionales independientes.'}</li>
              <li>{isEn ? 'I understand that the Platform does not provide psychological services and is not responsible for services provided by registered professionals.' : 'Comprendo que la Plataforma no presta servicios psicológicos ni es responsable de los servicios brindados por los profesionales registrados.'}</li>
              <li>{isEn ? 'I understand that it is the patient’s responsibility to request a detailed treatment plan from the psychologist.' : 'Es responsabilidad del paciente exigir al psicólogo un esquema detallado del tratamiento sugerido y adoptado por este último.'}</li>
            </ul>
            <p>
              {isEn
                ? 'Important note: The user is responsible for verifying that the professional is authorized to practice in their country or jurisdiction before starting any service.'
                : 'Nota importante: El usuario es responsable de verificar que el profesional esté autorizado para ejercer en su país o jurisdicción antes de iniciar cualquier servicio.'}
            </p>
            <p>
              {isEn ? 'END.' : 'FIN.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
