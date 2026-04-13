import { useI18n } from '../context/i18nStore';
import './TermsAndConditions.css';

export default function PrivacyPolicy() {
  const { language } = useI18n();
  const isEn = language === 'en';

  return (
    <div className="terms-page">
      <section className="terms-hero">
        <div className="terms-container">
          <h1>{isEn ? 'Privacy Policy' : 'Políticas y Privacidad'}</h1>
          <p className="terms-subtitle">
            {isEn
              ? 'Professionals At Home - Effective globally'
              : 'Professionals At Home - Vigente a nivel global'}
          </p>
          <p className="terms-updated">
            {isEn ? 'Last updated: April 2026' : 'Última actualización: Abril 2026'}
          </p>
        </div>
      </section>

      <section className="terms-content">
        <div className="terms-container terms-card">
          <div className="terms-section">
            <h2>{isEn ? '1. Scope' : '1. Alcance de esta política'}</h2>
            <p>
              {isEn
                ? 'This Privacy Policy explains how Professionals At Home collects, uses, stores, and protects personal data of professionals, employers, and visitors.'
                : 'Esta Política de Privacidad describe cómo Professionals At Home recopila, usa, almacena y protege los datos personales de profesionales, empleadores y visitantes.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '2. Information We Collect' : '2. Información que recopilamos'}</h2>
            <ul className="terms-bullet-list">
              <li>
                {isEn
                  ? 'Identification data: first name, last name, email, phone, and profile data.'
                  : 'Datos de identificación: nombre, apellido, email, teléfono y datos de perfil.'}
              </li>
              <li>
                {isEn
                  ? 'Account data: login credentials and platform preferences.'
                  : 'Datos de cuenta: credenciales de acceso y preferencias de uso de la plataforma.'}
              </li>
              <li>
                {isEn
                  ? 'Professional or business data: CV, experience details, documents, and logo.'
                  : 'Datos profesionales o empresariales: CV, descripción de experiencia, documentos y logo.'}
              </li>
              <li>
                {isEn
                  ? 'Technical data: IP address, browser type, device, and activity logs.'
                  : 'Datos técnicos: dirección IP, tipo de navegador, dispositivo y registros de actividad.'}
              </li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '3. Processing Purposes' : '3. Finalidades del tratamiento'}</h2>
            <ul className="terms-bullet-list">
              <li>{isEn ? 'Create and manage user/company accounts.' : 'Crear y administrar cuentas de usuarios y empresas.'}</li>
              <li>{isEn ? 'Enable matching between professionals and employers.' : 'Facilitar la conexión entre profesionales y empleadores.'}</li>
              <li>{isEn ? 'Support applications, postings, search, and communication.' : 'Permitir postulaciones, publicaciones, búsquedas y comunicación.'}</li>
              <li>{isEn ? 'Prevent fraud and comply with legal obligations.' : 'Prevenir fraude y cumplir obligaciones legales aplicables.'}</li>
              <li>{isEn ? 'Improve platform security and service quality.' : 'Mejorar la seguridad y la experiencia general del servicio.'}</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '4. Legal Basis and Consent' : '4. Base legal y consentimiento'}</h2>
            <p>
              {isEn
                ? 'Processing is based on user consent, execution of requested services, and compliance with applicable legal obligations.'
                : 'El tratamiento se basa en el consentimiento del usuario, la ejecución de los servicios solicitados y el cumplimiento de obligaciones legales aplicables.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '5. Data Sharing' : '5. Compartición de datos'}</h2>
            <p>
              {isEn
                ? 'We do not sell personal data. Data may only be shared with other users as part of platform functionality, with required service providers, or by legal request.'
                : 'La plataforma no vende datos personales. La información solo podrá compartirse con otros usuarios dentro de la plataforma, con proveedores necesarios o por requerimiento legal.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '6. Retention and Security' : '6. Conservación y seguridad'}</h2>
            <p>
              {isEn
                ? 'We retain data for as long as needed for stated purposes and legal obligations, applying reasonable technical and organizational safeguards.'
                : 'Conservamos los datos durante el tiempo necesario para las finalidades previstas y obligaciones legales, aplicando medidas técnicas y organizativas razonables.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '7. User Rights' : '7. Derechos del usuario'}</h2>
            <ul className="terms-bullet-list">
              <li>{isEn ? 'Access your personal data.' : 'Acceso a sus datos personales.'}</li>
              <li>{isEn ? 'Request correction of inaccurate data.' : 'Rectificación de datos inexactos o desactualizados.'}</li>
              <li>{isEn ? 'Request deletion where legally applicable.' : 'Eliminación de datos cuando legalmente proceda.'}</li>
              <li>{isEn ? 'Request limitation or objection to processing in certain cases.' : 'Limitación u oposición a ciertos tratamientos.'}</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '8. Cookies and Similar Technologies' : '8. Cookies y tecnologías similares'}</h2>
            <p>
              {isEn
                ? 'We may use cookies and similar technologies for authentication, usage analytics, and service improvement. Users can manage these settings in their browser.'
                : 'Podemos utilizar cookies y herramientas equivalentes para autenticación, análisis de uso y mejora del servicio. El usuario puede gestionar estas preferencias desde su navegador.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '9. Policy Updates' : '9. Cambios en esta política'}</h2>
            <p>
              {isEn
                ? 'This policy may be updated periodically. Material changes will be published in this section with the corresponding effective date.'
                : 'Esta política puede actualizarse periódicamente. Cuando haya cambios relevantes, se publicará la versión actualizada en esta sección con su fecha de vigencia.'}
            </p>
          </div>

          <div className="terms-section">
            <h2>{isEn ? '10. Contact' : '10. Contacto'}</h2>
            <p>
              {isEn
                ? 'For privacy questions or to exercise your rights, contact us through the official channels listed on the Platform.'
                : 'Para consultas sobre privacidad o ejercicio de derechos, puede contactarse a través de los medios oficiales informados dentro de la plataforma.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
