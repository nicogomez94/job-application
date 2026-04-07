import './TermsAndConditions.css';

export default function PrivacyPolicy() {
  return (
    <div className="terms-page">
      <section className="terms-hero">
        <div className="terms-container">
          <h1>Políticas y Privacidad</h1>
          <p className="terms-subtitle">
            Professionals At Home &mdash; Vigente a nivel global
          </p>
          <p className="terms-updated">Última actualización: Abril 2026</p>
        </div>
      </section>

      <section className="terms-content">
        <div className="terms-container terms-card">
          <div className="terms-section">
            <h2>1. Alcance de esta política</h2>
            <p>
              Esta Política de Privacidad describe cómo <strong>Professionals At Home</strong> recopila,
              usa, almacena y protege los datos personales de profesionales, empleadores y visitantes
              de la plataforma.
            </p>
            <p>
              Al registrarse o utilizar el sitio, usted declara haber leído y aceptado estas condiciones
              de tratamiento de datos.
            </p>
          </div>

          <div className="terms-section">
            <h2>2. Información que recopilamos</h2>
            <ul className="terms-bullet-list">
              <li>Datos de identificación: nombre, apellido, email, teléfono y datos de perfil.</li>
              <li>Datos de cuenta: credenciales de acceso y preferencias de uso de la plataforma.</li>
              <li>Datos profesionales o empresariales: CV, descripción de experiencia, documentos y logo.</li>
              <li>Datos técnicos: dirección IP, tipo de navegador, dispositivo y registros de actividad.</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>3. Finalidades del tratamiento</h2>
            <p>Utilizamos los datos para:</p>
            <ul className="terms-bullet-list">
              <li>Crear y administrar cuentas de usuarios y empresas.</li>
              <li>Facilitar la conexión entre profesionales y empleadores.</li>
              <li>Permitir postulaciones, publicaciones, búsquedas y comunicación dentro de la plataforma.</li>
              <li>Prevenir fraude, abuso, uso indebido y cumplir obligaciones legales aplicables.</li>
              <li>Mejorar la seguridad, rendimiento y experiencia general del servicio.</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>4. Base legal y consentimiento</h2>
            <p>
              El tratamiento de datos se basa en el consentimiento otorgado por el usuario al registrarse,
              la ejecución de los servicios contratados y, cuando corresponda, el cumplimiento de obligaciones
              legales y regulatorias aplicables.
            </p>
          </div>

          <div className="terms-section">
            <h2>5. Compartición de datos</h2>
            <p>
              La plataforma no vende datos personales. La información podrá compartirse únicamente en los
              siguientes casos:
            </p>
            <ul className="terms-bullet-list">
              <li>Con otros usuarios, dentro de las funcionalidades propias de la plataforma.</li>
              <li>Con proveedores tecnológicos que prestan servicios necesarios para operar el sitio.</li>
              <li>Por requerimiento legal, judicial o de autoridad competente.</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>6. Conservación y seguridad</h2>
            <p>
              Conservamos los datos durante el tiempo necesario para cumplir las finalidades previstas en
              esta política y para responder a obligaciones legales. Aplicamos medidas técnicas y organizativas
              razonables para proteger la información frente a acceso no autorizado, alteración o pérdida.
            </p>
          </div>

          <div className="terms-section">
            <h2>7. Derechos del usuario</h2>
            <p>Usted podrá solicitar, según corresponda:</p>
            <ul className="terms-bullet-list">
              <li>Acceso a sus datos personales.</li>
              <li>Rectificación de datos inexactos o desactualizados.</li>
              <li>Eliminación de datos cuando legalmente proceda.</li>
              <li>Limitación u oposición a ciertos tratamientos.</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>8. Cookies y tecnologías similares</h2>
            <p>
              Podemos utilizar cookies y herramientas equivalentes para autenticación, análisis de uso y
              mejora del servicio. El usuario puede gestionar estas preferencias desde su navegador.
            </p>
          </div>

          <div className="terms-section">
            <h2>9. Cambios en esta política</h2>
            <p>
              Esta política puede actualizarse periódicamente. Cuando existan cambios relevantes, se publicará
              la versión actualizada en esta misma sección con su fecha de vigencia.
            </p>
          </div>

          <div className="terms-section">
            <h2>10. Contacto</h2>
            <p>
              Para consultas sobre privacidad o ejercicio de derechos, puede contactarse a través de los medios
              oficiales informados dentro de la plataforma.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
