import { useI18n } from '../../context/i18nStore';
import '../../pages/TermsAndConditions.css';

export default function PsicoPrivacidad() {
  const { language } = useI18n();
  const isEn = language === 'en';

  return (
    <div className="terms-page">
      <section className="terms-hero">
        <div className="terms-container">
          <h1>{isEn ? 'Privacy Policy' : 'Política de Privacidad'}</h1>
          <p className="terms-subtitle">professionalsathome.com</p>
          <p className="terms-updated">{isEn ? 'Last updated: May 2026' : 'Última actualización: Mayo 2026'}</p>
        </div>
      </section>

      <section className="terms-content">
        <div className="terms-container terms-card">

          {/* INTRO */}
          <div className="terms-section">
            <p>{isEn ? 'This Privacy Policy describes how the Platform collects, uses, stores, shares, and protects the personal data of users, patients, visitors, and registered professionals who use the website and its services. By accessing or using the Platform, you acknowledge that you have read and understood this Privacy Policy and agree to the processing of your personal data in accordance with the applicable data protection laws of your jurisdiction. If you do not agree with this Privacy Policy, you must refrain from using the Platform.' : 'La presente Política de Privacidad describe cómo la Plataforma recopila, utiliza, almacena, comparte y protege los datos personales de usuarios, pacientes, visitantes y profesionales registrados que utilizan el sitio web y sus servicios. Al acceder o utilizar la Plataforma, usted reconoce haber leído y comprendido esta Política de Privacidad y acepta el tratamiento de sus datos personales conforme a las leyes aplicables de protección de datos de su jurisdicción. Si no está de acuerdo con esta Política de Privacidad, deberá abstenerse de utilizar la Plataforma.'}</p>
          </div>

          {/* 1 */}
          <div className="terms-section">
            <h2>{isEn ? '1. Nature of the Platform' : '1. Naturaleza de la Plataforma'}</h2>
            <p>{isEn ? 'The Platform is a digital intermediary and professional directory service that allows psychologists and mental health professionals to create public profiles and promote their services, and registered users or patients to view those profiles and directly contact professionals. The Platform does not provide medical, psychological, or healthcare services. The therapeutic, professional, or clinical relationship is established exclusively between the user and the independent professional without exception.' : 'La Plataforma es un servicio digital de intermediación y directorio profesional que permite a psicólogos y profesionales de la salud mental crear perfiles públicos y promocionar sus servicios, y a usuarios o pacientes visualizar esos perfiles y contactar directamente a los profesionales. La Plataforma no presta servicios médicos, psicológicos ni sanitarios. La relación terapéutica, profesional o clínica se establece exclusivamente entre el usuario y el profesional independiente sin excepción.'}</p>
          </div>

          {/* 2 */}
          <div className="terms-section">
            <h2>{isEn ? '2. Personal Data We May Collect' : '2. Datos Personales que Podemos Recopilar'}</h2>

            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', marginTop: '1rem' }}>
              {isEn ? '2.1 Data Provided by Users / Patients' : '2.1 Datos proporcionados por usuarios / pacientes'}
            </h3>
            <ul className="terms-list">
              <li>{isEn ? 'Full name' : 'Nombre y apellido'}</li>
              <li>{isEn ? 'Email address' : 'Dirección de correo electrónico'}</li>
              <li>{isEn ? 'Phone number' : 'Número telefónico'}</li>
              <li>{isEn ? 'Country or city of residence' : 'País o ciudad de residencia'}</li>
              <li>{isEn ? 'Information voluntarily included in messages sent to professionals' : 'Información incluida voluntariamente en mensajes enviados a profesionales'}</li>
            </ul>

            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', marginTop: '1rem' }}>
              {isEn ? '2.2 Data Provided by Professionals' : '2.2 Datos proporcionados por profesionales'}
            </h3>
            <ul className="terms-list">
              <li>{isEn ? 'Full name' : 'Nombre completo'}</li>
              <li>{isEn ? 'Professional registration, license, or credentials' : 'Matrícula profesional, licencia o credenciales'}</li>
              <li>{isEn ? 'Specialties and professional experience' : 'Especialidades y experiencia profesional'}</li>
              <li>{isEn ? 'Professional contact information' : 'Información de contacto profesional'}</li>
              <li>{isEn ? 'Profile photograph' : 'Fotografía de perfil'}</li>
              <li>{isEn ? 'Description of services' : 'Descripción de servicios'}</li>
              <li>{isEn ? 'Academic or employment information' : 'Información académica o laboral'}</li>
              <li>{isEn ? 'Tax or commercial information when applicable' : 'Datos fiscales o comerciales si correspondiera'}</li>
            </ul>

            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', marginTop: '1rem' }}>
              {isEn ? '2.3 Automatically Collected Data' : '2.3 Datos recopilados automáticamente'}
            </h3>
            <ul className="terms-list">
              <li>{isEn ? 'IP address' : 'Dirección IP'}</li>
              <li>{isEn ? 'Browser and device type' : 'Tipo de navegador y dispositivo'}</li>
              <li>{isEn ? 'Operating system' : 'Sistema operativo'}</li>
              <li>{isEn ? 'Access dates and times' : 'Fechas y horarios de acceso'}</li>
              <li>{isEn ? 'Pages visited' : 'Páginas visitadas'}</li>
              <li>{isEn ? 'Cookies and similar technologies' : 'Cookies y tecnologías similares'}</li>
              <li>{isEn ? 'Analytical and statistical usage data' : 'Datos analíticos y estadísticos de uso'}</li>
            </ul>
          </div>

          {/* 3 */}
          <div className="terms-section">
            <h2>{isEn ? '3. Purpose of Data Processing' : '3. Finalidad del Tratamiento de los Datos'}</h2>
            <p>{isEn ? 'The Platform may use personal data to:' : 'La Plataforma podrá utilizar los datos personales para:'}</p>
            <ul className="terms-list">
              <li>{isEn ? 'Enable account registration and authentication.' : 'Permitir el registro y autenticación de cuentas.'}</li>
              <li>{isEn ? 'Facilitate contact between users and professionals.' : 'Facilitar el contacto entre usuarios y profesionales.'}</li>
              <li>{isEn ? 'Display professional profiles publicly within the Platform.' : 'Mostrar perfiles profesionales públicamente dentro de la Plataforma.'}</li>
              <li>{isEn ? 'Manage the technical operation of the website.' : 'Administrar el funcionamiento técnico del sitio web.'}</li>
              <li>{isEn ? 'Improve functionality, security, and user experience.' : 'Mejorar funcionalidades, seguridad y experiencia de usuario.'}</li>
              <li>{isEn ? 'Send administrative or technical communications.' : 'Enviar comunicaciones administrativas o técnicas.'}</li>
              <li>{isEn ? 'Detect fraudulent, abusive, or illegal activities.' : 'Detectar actividades fraudulentas, abusivas o ilegales.'}</li>
              <li>{isEn ? 'Comply with legal and regulatory obligations.' : 'Cumplir obligaciones legales y regulatorias.'}</li>
              <li>{isEn ? 'Generate internal statistics and usage metrics.' : 'Elaborar estadísticas internas y métricas de uso.'}</li>
            </ul>
          </div>

          {/* 4 */}
          <div className="terms-section">
            <h2>{isEn ? '4. Sensitive Information and Health Data' : '4. Información Sensible y Datos de Salud'}</h2>
            <p>{isEn ? 'The Platform recommends that users avoid sharing sensitive medical, clinical, or psychological information through public forms or unsecured channels. Messages sent directly to professionals are the sole responsibility of the user and the professional involved.' : 'La Plataforma recomienda a los usuarios evitar compartir información médica, clínica o psicológica sensible a través de formularios públicos o canales no seguros. Los mensajes enviados directamente a profesionales son responsabilidad exclusiva del usuario y del profesional involucrado.'}</p>
            <p>{isEn ? 'Unless expressly stated otherwise, the Platform does not manage medical records, provide diagnoses, participate in therapeutic treatments, act as a healthcare provider, or require sensitive medical information to create a basic account.' : 'Salvo indicación expresa, la Plataforma no administra historias clínicas, no realiza diagnósticos, no participa en tratamientos terapéuticos, no actúa como proveedor de servicios sanitarios, ni requiere información médica sensible para crear una cuenta básica.'}</p>
          </div>

          {/* 5 */}
          <div className="terms-section">
            <h2>{isEn ? '5. Legal Basis for Processing' : '5. Base Legal del Tratamiento'}</h2>
            <p>{isEn ? 'Depending on the applicable jurisdiction, the Platform may process personal data based on:' : 'Dependiendo de la jurisdicción aplicable, la Plataforma podrá tratar datos personales sobre la base de:'}</p>
            <ul className="terms-list">
              <li>{isEn ? 'User consent.' : 'Consentimiento del usuario.'}</li>
              <li>{isEn ? 'Performance of a contractual relationship.' : 'Ejecución de la relación contractual.'}</li>
              <li>{isEn ? 'Compliance with legal obligations.' : 'Cumplimiento de obligaciones legales.'}</li>
              <li>{isEn ? 'Legitimate interests related to the security, operation, and improvement of the Platform.' : 'Intereses legítimos relacionados con la seguridad, funcionamiento y mejora de la Plataforma.'}</li>
              <li>{isEn ? 'Protection against fraud, abuse, or misuse.' : 'Protección contra fraude, abuso o uso indebido.'}</li>
            </ul>
          </div>

          {/* 6 */}
          <div className="terms-section">
            <h2>{isEn ? '6. Data Sharing' : '6. Compartición de Datos'}</h2>
            <p>{isEn ? 'The Platform may share information only in the following cases:' : 'La Plataforma podrá compartir información únicamente en los siguientes casos:'}</p>
            <ul className="terms-list">
              <li>{isEn ? 'With technology providers necessary to operate the website.' : 'Con proveedores tecnológicos necesarios para operar el sitio web.'}</li>
              <li>{isEn ? 'With hosting, storage, security, or analytics service providers.' : 'Con servicios de hosting, almacenamiento, seguridad o análisis.'}</li>
              <li>{isEn ? 'When required by law, court order, or competent authority.' : 'Cuando sea requerido por ley, orden judicial o autoridad competente.'}</li>
              <li>{isEn ? 'To protect the rights, safety, or integrity of the Platform, users, or third parties.' : 'Para proteger derechos, seguridad o integridad de la Plataforma, usuarios o terceros.'}</li>
              <li>{isEn ? 'In corporate processes such as mergers, acquisitions, or business reorganizations.' : 'En procesos societarios como fusiones, adquisiciones o reorganizaciones empresariales.'}</li>
            </ul>
            <p className="terms-highlight">{isEn ? 'The Platform does not sell users\' personal data to third parties.' : 'La Plataforma no vende datos personales de usuarios a terceros.'}</p>
          </div>

          {/* 7 */}
          <div className="terms-section">
            <h2>{isEn ? '7. Public Professional Profiles' : '7. Perfiles Públicos de Profesionales'}</h2>
            <p>{isEn ? 'Registered professionals acknowledge and accept that certain profile information may be publicly visible within the Platform, including: professional name, photograph, specialties, professional description, languages, service modality, contact information voluntarily published, and experience and education. Each professional is responsible for the information they choose to publish. The Platform recommends not publishing unnecessary or sensitive personal data.' : 'Los profesionales registrados reconocen y aceptan que determinada información de sus perfiles podrá ser visible públicamente dentro de la Plataforma, incluyendo: nombre profesional, fotografía, especialidades, descripción profesional, idiomas, modalidad de atención, información de contacto publicada voluntariamente, y experiencia y formación. Cada profesional es responsable de la información que decide publicar. La Plataforma recomienda no publicar datos personales innecesarios o sensibles.'}</p>
          </div>

          {/* 8 */}
          <div className="terms-section">
            <h2>{isEn ? '8. Cookies and Similar Technologies' : '8. Cookies y Tecnologías Similares'}</h2>
            <p>{isEn ? 'The Platform may use cookies and similar technologies to maintain active sessions, remember preferences, analyze traffic and browsing behavior, improve functionality, and protect system security. Users may configure their browsers to reject certain cookies, although this may affect the functionality of the website.' : 'La Plataforma podrá utilizar cookies y tecnologías similares para mantener sesiones activas, recordar preferencias, analizar tráfico y comportamiento de navegación, mejorar funcionalidades y proteger la seguridad del sistema. El usuario podrá configurar su navegador para rechazar determinadas cookies, aunque ello podría afectar el funcionamiento del sitio web.'}</p>
          </div>

          {/* 9 */}
          <div className="terms-section">
            <h2>{isEn ? '9. Data Retention' : '9. Conservación de los Datos'}</h2>
            <p>{isEn ? 'Personal data will be retained only for as long as necessary to fulfill the purposes described herein, maintain the account active, comply with legal obligations, and enforce agreements and policies.' : 'Los datos personales serán conservados únicamente durante el tiempo necesario para cumplir las finalidades descritas, mantener la cuenta activa, cumplir obligaciones legales y hacer cumplir acuerdos y políticas.'}</p>
          </div>

          {/* 10 */}
          <div className="terms-section">
            <h2>{isEn ? '10. Information Security' : '10. Seguridad de la Información'}</h2>
            <p>{isEn ? 'The Platform implements reasonable technical, administrative, and organizational measures designed to protect personal data against unauthorized access, alteration, disclosure, loss, and misuse. However, no electronic transmission or storage system is completely secure, and the Platform cannot guarantee absolute security.' : 'La Plataforma implementa medidas técnicas, administrativas y organizativas razonables destinadas a proteger los datos personales contra acceso no autorizado, alteración, divulgación, pérdida y uso indebido. Sin embargo, ningún sistema de transmisión o almacenamiento electrónico es completamente seguro y la Plataforma no puede garantizar seguridad absoluta.'}</p>
          </div>

          {/* 11 */}
          <div className="terms-section">
            <h2>{isEn ? '11. User Rights' : '11. Derechos de los Usuarios'}</h2>
            <p>{isEn ? 'Depending on applicable legislation, users may have the right to:' : 'Dependiendo de la legislación aplicable, los usuarios podrán tener derecho a:'}</p>
            <ul className="terms-list">
              <li>{isEn ? 'Access their personal data.' : 'Acceder a sus datos personales.'}</li>
              <li>{isEn ? 'Correct inaccurate information.' : 'Rectificar información inexacta.'}</li>
              <li>{isEn ? 'Request deletion of data.' : 'Solicitar eliminación de datos.'}</li>
              <li>{isEn ? 'Object to processing.' : 'Oponerse al tratamiento.'}</li>
              <li>{isEn ? 'Withdraw consent.' : 'Retirar el consentimiento.'}</li>
              <li>{isEn ? 'Request data portability.' : 'Solicitar portabilidad de datos.'}</li>
              <li>{isEn ? 'File complaints with data protection authorities.' : 'Presentar reclamos ante autoridades de protección de datos.'}</li>
            </ul>
            <p>{isEn ? 'The Platform may require identity verification before processing requests.' : 'La Plataforma podría requerir verificación de identidad antes de procesar solicitudes.'}</p>
          </div>

          {/* 12 */}
          <div className="terms-section">
            <h2>{isEn ? '12. Minors' : '12. Menores de Edad'}</h2>
            <p>{isEn ? 'The Platform is not intended for minors unless permitted by applicable law and authorized where required. If the Platform becomes aware that it has collected personal data from minors in violation of applicable regulations, it may delete such information.' : 'La Plataforma no está destinada a menores de edad salvo autorización permitida por la legislación aplicable. Si la Plataforma detecta que ha recopilado datos personales de menores en violación de las normas aplicables, podrá eliminar dicha información.'}</p>
          </div>

          {/* 13 */}
          <div className="terms-section">
            <h2>{isEn ? '13. International Data Transfers' : '13. Transferencias Internacionales de Datos'}</h2>
            <p>{isEn ? 'Due to the international nature of the internet and the technological services used, data may be stored or processed in different countries. The Platform will seek to implement reasonable measures to protect personal data in accordance with applicable privacy and data protection laws.' : 'Debido al carácter internacional de internet y de los servicios tecnológicos utilizados, los datos podrán almacenarse o procesarse en distintos países. La Plataforma procurará implementar medidas razonables para proteger los datos personales conforme a las leyes aplicables de privacidad y protección de datos.'}</p>
          </div>

          {/* 14 */}
          <div className="terms-section">
            <h2>{isEn ? '14. Links to Third-Party Websites' : '14. Enlaces a Sitios de Terceros'}</h2>
            <p>{isEn ? 'The Platform may contain links to third-party websites or services. The Platform does not control and is not responsible for the privacy policies, content, or practices of third parties. Users are encouraged to review the applicable privacy policies before providing personal information.' : 'La Plataforma puede contener enlaces a sitios web o servicios de terceros. La Plataforma no controla ni es responsable por las políticas de privacidad, contenidos o prácticas de terceros. Se recomienda revisar las políticas de privacidad correspondientes antes de proporcionar información personal.'}</p>
          </div>

          {/* 15 */}
          <div className="terms-section">
            <h2>{isEn ? '15. Modifications to This Policy' : '15. Modificaciones de esta Política'}</h2>
            <p>{isEn ? 'The Platform may modify this Privacy Policy at any time. Updated versions shall become effective upon publication on the website. Continued use of the Platform after such modifications constitutes acceptance of the revised Policy.' : 'La Plataforma podrá modificar esta Política de Privacidad en cualquier momento. Las versiones actualizadas entrarán en vigor desde su publicación en el sitio web. El uso continuado de la Plataforma después de dichas modificaciones implica aceptación de la Política revisada.'}</p>
          </div>

          {/* 16 */}
          <div className="terms-section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <h2>{isEn ? '16. Governing Law' : '16. Ley Aplicable'}</h2>
            <p>{isEn ? 'Unless mandatory provisions of applicable data protection laws in the user\'s jurisdiction provide otherwise, this Privacy Policy shall be governed by the laws of the Republic of Argentina.' : 'Salvo disposición obligatoria en contrario conforme a la legislación de protección de datos aplicable en la jurisdicción del usuario, esta Política de Privacidad se regirá por las leyes de la República Argentina.'}</p>
          </div>

        </div>
      </section>
    </div>
  );
}
