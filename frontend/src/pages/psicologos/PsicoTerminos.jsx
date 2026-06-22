import { useI18n } from '../../context/i18nStore';
import '../../pages/TermsAndConditions.css';

export default function PsicoTerminos() {
  const { language } = useI18n();
  const isEn = language === 'en';

  return (
    <div className="terms-page">
      <section className="terms-hero">
        <div className="terms-container">
          <h1>{isEn ? 'Terms and Conditions' : 'Términos y Condiciones'}</h1>
          <p className="terms-subtitle">professionalsathome.com</p>
          <p className="terms-updated">{isEn ? 'Last updated: May 2026' : 'Última actualización: Mayo 2026'}</p>
        </div>
      </section>

      <section className="terms-content">
        <div className="terms-container terms-card">

          {/* INTRO */}
          <div className="terms-section">
            <p>
              {isEn
                ? 'Welcome to professionalsathome.com (hereinafter, the "Platform"). These Terms and Conditions govern access to and use of the Platform by users and visitors worldwide. By accessing or using the Platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions, as well as any applicable laws and regulations in your jurisdiction. If you do not agree with these Terms and Conditions, you must refrain from using the Platform.'
                : 'Bienvenido/a a professionalsathome.com (en adelante, la "Plataforma"). Estos Términos y Condiciones regulan el acceso y uso de la Plataforma por parte de usuarios y visitantes en todo el mundo. Al acceder o utilizar la Plataforma, usted reconoce que ha leído, comprendido y aceptado quedar sujeto a estos Términos y Condiciones, así como a las leyes y regulaciones aplicables en su jurisdicción. Si no está de acuerdo con estos Términos y Condiciones, deberá abstenerse de utilizar la Plataforma.'}
            </p>
          </div>

          {/* 1 */}
          <div className="terms-section">
            <h2>{isEn ? '1. Before Contacting a Professional' : '1. Antes de contactar a un profesional'}</h2>
            <p className="terms-highlight">
              {isEn
                ? 'You are about to contact an independent professional. The Platform does not participate in the therapeutic relationship or in agreements between the parties (payments, fees, etc.) or any other matter.'
                : 'Estás por contactar a un profesional independiente. La plataforma no participa en la relación terapéutica ni en los acuerdos entre las partes (cobros, pagos, etc.) ni ningún otro.'}
            </p>
            <p>
              {isEn
                ? 'The Platform allows users to connect with independent mental health professionals. Before initiating any contact, the user acknowledges and agrees that:'
                : 'La Plataforma permite a los usuarios conectarse con profesionales independientes de la salud mental. Antes de iniciar cualquier contacto, el usuario reconoce y acepta que:'}
            </p>
            <ul className="terms-list">
              <li>{isEn ? 'Each psychologist or mental health professional operates independently.' : 'Cada psicólogo o profesional de la salud mental actúa de manera independiente.'}</li>
              <li>{isEn ? 'The Platform is not a healthcare provider, clinic, or medical institution.' : 'La Plataforma no es un prestador de servicios de salud, clínica o institución médica.'}</li>
              <li>{isEn ? 'The Platform does not participate in the therapeutic relationship established between users and professionals.' : 'La Plataforma no participa en la relación terapéutica establecida entre los usuarios y los profesionales.'}</li>
              <li>{isEn ? 'Any agreement, communication, treatment, recommendation, or therapeutic process is exclusively between the user and the professional.' : 'Cualquier acuerdo, comunicación, tratamiento, recomendación o proceso terapéutico es exclusivamente entre el usuario y el profesional.'}</li>
            </ul>
            <p className="terms-highlight">
              {isEn
                ? 'Important notice: Remote care is not recommended for acute life-threatening crises or active psychosis requiring immediate physical restraint, which necessitate in-person emergency care. It is recommended to call the nearest organization specializing in these cases.'
                : 'Aviso importante: La atención remota no es recomendada para crisis aguda con riesgo de vida o psicosis activa que requiera contención física inmediata, las cuales necesitan atención presencial de emergencia. Se recomienda llamar a la entidad más cercana dedicada a estos casos.'}
            </p>
          </div>

          {/* 2 */}
          <div className="terms-section">
            <h2>{isEn ? '2. Nature of the Service' : '2. Naturaleza del Servicio'}</h2>
            <p>
              {isEn
                ? 'The Platform is a digital intermediary and directory service that enables users to view professional profiles and independently contact licensed psychologists or mental health professionals. The user expressly acknowledges that:'
                : 'La Plataforma es un servicio digital de intermediación y directorio que permite a los usuarios visualizar perfiles profesionales y contactar de manera independiente a psicólogos matriculados u otros profesionales de la salud mental. El usuario reconoce expresamente que:'}
            </p>
            <ul className="terms-list">
              <li>{isEn ? 'The Platform does not provide psychological, psychiatric, medical, or healthcare services.' : 'La Plataforma no presta servicios psicológicos, psiquiátricos, médicos ni de atención sanitaria.'}</li>
              <li>{isEn ? 'The Platform does not conduct therapy sessions or clinical evaluations.' : 'La Plataforma no realiza sesiones terapéuticas ni evaluaciones clínicas.'}</li>
              <li>{isEn ? 'The Platform does not supervise, direct, control, or monitor professional services.' : 'La Plataforma no supervisa, dirige, controla ni monitorea los servicios profesionales.'}</li>
              <li>{isEn ? 'The Platform does not guarantee the availability, suitability, legality, licensing status, or quality of any professional.' : 'La Plataforma no garantiza la disponibilidad, idoneidad, legalidad, estado de matrícula/licencia o calidad de ningún profesional.'}</li>
              <li>{isEn ? "The Platform does not process or manage healthcare records unless expressly stated otherwise." : 'La Plataforma no procesa ni administra historias clínicas o registros médicos, salvo que se indique expresamente lo contrario.'}</li>
            </ul>
            <p>{isEn ? "The Platform's role is strictly limited to providing technological infrastructure and informational access." : 'La función de la Plataforma se limita estrictamente a proporcionar infraestructura tecnológica y acceso informativo.'}</p>
          </div>

          {/* 3 */}
          <div className="terms-section">
            <h2>{isEn ? '3. Relationship with Professionals' : '3. Relación con los Profesionales'}</h2>
            <p>{isEn ? 'All professionals listed on the Platform act independently and are solely responsible for their services, conduct, advice, diagnoses, treatment plans, and compliance with applicable professional regulations. Accordingly:' : 'Todos los profesionales publicados en la Plataforma actúan de manera independiente y son los únicos responsables de sus servicios, conducta, consejos, diagnósticos, planes de tratamiento y cumplimiento de las regulaciones profesionales aplicables. En consecuencia:'}</p>
            <ul className="terms-list">
              <li>{isEn ? 'The Platform does not employ professionals unless explicitly indicated.' : 'La Plataforma no emplea a los profesionales, salvo indicación expresa en contrario.'}</li>
              <li>{isEn ? 'The Platform does not guarantee therapeutic outcomes or user satisfaction.' : 'La Plataforma no garantiza resultados terapéuticos ni satisfacción del usuario.'}</li>
              <li>{isEn ? 'Any professional relationship is established directly between the user and the professional.' : 'Toda relación profesional se establece directamente entre el usuario y el profesional.'}</li>
              <li>{isEn ? 'Users are responsible for verifying the credentials, licenses, and suitability of any professional they choose to contact.' : 'Los usuarios son responsables de verificar las credenciales, matrículas/licencias e idoneidad del profesional que decidan contactar.'}</li>
            </ul>
          </div>

          {/* 4 */}
          <div className="terms-section">
            <h2>{isEn ? '4. Payments' : '4. Pagos'}</h2>
            <p>{isEn ? 'Unless expressly stated otherwise on the Platform:' : 'Salvo que se indique expresamente lo contrario en la Plataforma:'}</p>
            <ul className="terms-list">
              <li>{isEn ? 'All fees, rates, and payment conditions are determined directly between the user and the professional.' : 'Todos los honorarios, tarifas y condiciones de pago son determinados directamente entre el usuario y el profesional.'}</li>
              <li>{isEn ? 'The Platform only accepts payment from psychologists who wish to publish their professional profile. It does not receive, hold, or administer payments of any other kind.' : 'La plataforma solo acepta el pago del psicólogo interesado en publicar su perfil profesional. No recibe, retiene ni administra otros pagos de ninguna índole.'}</li>
              <li>{isEn ? 'The Platform is not responsible for refunds, cancellations, billing disputes, or financial claims.' : 'La Plataforma no es responsable de reembolsos, cancelaciones, disputas de facturación o reclamos financieros.'}</li>
              <li>{isEn ? 'Any financial transaction occurs exclusively between the user and the professional.' : 'Toda transacción económica ocurre exclusivamente entre el usuario y el profesional.'}</li>
            </ul>
          </div>

          {/* 5 */}
          <div className="terms-section">
            <h2>{isEn ? '5. Liability Disclaimer' : '5. Responsabilidad'}</h2>
            <p>{isEn ? 'To the maximum extent permitted by applicable law, the Platform shall not be liable for:' : 'En la máxima medida permitida por la legislación aplicable, la Plataforma no será responsable por:'}</p>
            <ul className="terms-list">
              <li>{isEn ? 'Services rendered by professionals.' : 'Los servicios prestados por los profesionales.'}</li>
              <li>{isEn ? 'Clinical or therapeutic outcomes.' : 'Los resultados clínicos o terapéuticos.'}</li>
              <li>{isEn ? 'Statements, advice, diagnoses, or recommendations provided by professionals.' : 'Declaraciones, consejos, diagnósticos o recomendaciones brindados por los profesionales.'}</li>
              <li>{isEn ? 'Disputes between users and professionals.' : 'Disputas entre usuarios y profesionales.'}</li>
              <li>{isEn ? 'Missed appointments, interruptions, or professional unavailability.' : 'Turnos perdidos, interrupciones o falta de disponibilidad de profesionales.'}</li>
              <li>{isEn ? 'Any direct, indirect, incidental, consequential, special, or punitive damages arising from the use of the Platform or from interactions with professionals.' : 'Cualquier daño directo, indirecto, incidental, consecuente, especial o punitivo derivado del uso de la Plataforma o de las interacciones con profesionales.'}</li>
            </ul>
            <p>{isEn ? 'Users access and use the Platform at their own risk.' : 'Los usuarios acceden y utilizan la Plataforma bajo su propio riesgo.'}</p>
          </div>

          {/* 6 */}
          <div className="terms-section">
            <h2>{isEn ? '6. User Obligations' : '6. Obligaciones del Usuario'}</h2>
            <p>{isEn ? 'By using the Platform, the user agrees to:' : 'Al utilizar la Plataforma, el usuario acepta:'}</p>
            <ul className="terms-list">
              <li>{isEn ? 'Use the Platform lawfully and in good faith.' : 'Utilizar la Plataforma de manera lícita y de buena fe.'}</li>
              <li>{isEn ? 'Provide truthful and accurate information.' : 'Proporcionar información veraz y precisa.'}</li>
              <li>{isEn ? 'Refrain from impersonating another person or entity.' : 'Abstenerse de suplantar a otra persona o entidad.'}</li>
              <li>{isEn ? 'Avoid fraudulent, abusive, discriminatory, threatening, or unlawful conduct.' : 'Evitar conductas fraudulentas, abusivas, discriminatorias, amenazantes o ilegales.'}</li>
              <li>{isEn ? 'Respect the rights, privacy, and dignity of professionals and other users.' : 'Respetar los derechos, privacidad y dignidad de los profesionales y demás usuarios.'}</li>
              <li>{isEn ? 'Comply with all applicable local, national, and international laws.' : 'Cumplir con todas las leyes locales, nacionales e internacionales aplicables.'}</li>
            </ul>
          </div>

          {/* 7 */}
          <div className="terms-section">
            <h2>{isEn ? '7. Availability and Modifications' : '7. Disponibilidad y Modificaciones'}</h2>
            <p>{isEn ? 'The Platform reserves the right, at any time and without prior notice, to:' : 'La Plataforma se reserva el derecho, en cualquier momento y sin previo aviso, de:'}</p>
            <ul className="terms-list">
              <li>{isEn ? 'Modify or remove content.' : 'Modificar o eliminar contenido.'}</li>
              <li>{isEn ? 'Update functionalities or features.' : 'Actualizar funcionalidades o características.'}</li>
              <li>{isEn ? 'Restrict or discontinue access to certain services.' : 'Restringir o discontinuar el acceso a determinados servicios.'}</li>
              <li>{isEn ? 'Interrupt the operation of the Platform temporarily or permanently.' : 'Interrumpir temporal o permanentemente el funcionamiento de la Plataforma por razones de mantenimiento, seguridad o motivos técnicos.'}</li>
            </ul>
          </div>

          {/* 8 */}
          <div className="terms-section">
            <h2>{isEn ? '8. Privacy and Data Protection' : '8. Privacidad y Protección de Datos'}</h2>
            <p>{isEn ? 'The Platform may collect and process personal data in accordance with its Privacy Policy and applicable data protection laws, including international regulations where applicable. Users are responsible for reviewing the Privacy Policy before using the Platform.' : 'La Plataforma podrá recopilar y procesar datos personales de conformidad con su Política de Privacidad y las leyes aplicables de protección de datos, incluidas las regulaciones internacionales cuando corresponda. Los usuarios son responsables de revisar la Política de Privacidad antes de utilizar la Plataforma.'}</p>
          </div>

          {/* 9 */}
          <div className="terms-section">
            <h2>{isEn ? '9. International Use' : '9. Uso Internacional'}</h2>
            <p>{isEn ? 'The Platform may be accessed from different countries and jurisdictions. Users are solely responsible for ensuring that their use of the Platform complies with the laws and regulations applicable in their country or region. The Platform makes no representation that its services or content are appropriate or legally permitted in every jurisdiction.' : 'La Plataforma puede ser accedida desde diferentes países y jurisdicciones. Los usuarios son los únicos responsables de asegurar que el uso de la Plataforma cumpla con las leyes y regulaciones aplicables en su país o región. La Plataforma no garantiza que sus servicios o contenidos sean apropiados o legalmente permitidos en todas las jurisdicciones.'}</p>
          </div>

          {/* 10 */}
          <div className="terms-section">
            <h2>{isEn ? '10. Exclusion of Healthcare Relationship' : '10. Exclusión de Relación Sanitaria'}</h2>
            <p>{isEn ? 'The user expressly acknowledges and agrees that the Platform does not establish any healthcare, clinical, fiduciary, therapeutic, doctor-patient, psychologist-patient, or assistance relationship with the user. Any healthcare or therapeutic relationship arises exclusively between the user and the independent professional selected by the user.' : 'El usuario reconoce y acepta expresamente que la Plataforma no establece ninguna relación sanitaria, clínica, fiduciaria, terapéutica, médico-paciente, psicólogo-paciente o de asistencia con el usuario. Toda relación sanitaria o terapéutica surge exclusivamente entre el usuario y el profesional independiente seleccionado por el usuario.'}</p>
            <p>{isEn ? 'The user also has the right to request documentation from the professional to verify the information provided before beginning treatment, as required by applicable law.' : 'El usuario tiene el derecho de pedir la documentación necesaria al profesional para verificar la información suministrada antes de someterse al tratamiento, según la ley del país en cuestión.'}</p>
          </div>

          {/* 11 */}
          <div className="terms-section">
            <h2>{isEn ? '11. Emergency Situations' : '11. Situaciones de Emergencia'}</h2>
            <p>{isEn ? 'The Platform is not intended for emergency situations or crisis intervention. If the user is experiencing a medical or mental health emergency, including risk of self-harm or harm to others, the user should immediately contact local emergency services, crisis hotlines, or qualified emergency healthcare providers in their jurisdiction. The Platform does not provide emergency assistance or real-time crisis support.' : 'La Plataforma no está destinada a situaciones de emergencia ni a intervenciones en crisis. Si el usuario está atravesando una emergencia médica o de salud mental, incluyendo riesgo de autolesión o daño a terceros, deberá contactar inmediatamente a los servicios de emergencia locales, líneas de asistencia en crisis o proveedores de atención médica de emergencia calificados en su jurisdicción. La Plataforma no proporciona asistencia de emergencia ni soporte de crisis en tiempo real.'}</p>
          </div>

          {/* 12 */}
          <div className="terms-section">
            <h2>{isEn ? '12. Intellectual Property' : '12. Propiedad Intelectual'}</h2>
            <p>{isEn ? 'All content, trademarks, logos, software, design elements, and materials available on the Platform are the property of the Platform or its licensors and are protected by applicable intellectual property laws. Users may not reproduce, distribute, modify, or commercially exploit any content without prior written authorization.' : 'Todo el contenido, marcas, logotipos, software, elementos de diseño y materiales disponibles en la Plataforma son propiedad de la Plataforma o de sus licenciantes y se encuentran protegidos por las leyes aplicables de propiedad intelectual. Los usuarios no podrán reproducir, distribuir, modificar ni explotar comercialmente ningún contenido sin autorización previa y por escrito.'}</p>
          </div>

          {/* 13 */}
          <div className="terms-section">
            <h2>{isEn ? '13. Modifications to These Terms' : '13. Modificaciones de estos Términos'}</h2>
            <p>{isEn ? 'The Platform reserves the right to amend or update these Terms and Conditions at any time. Updated versions shall become effective upon publication on the Platform. Continued use of the Platform after modifications constitutes acceptance of the revised Terms and Conditions.' : 'La Plataforma se reserva el derecho de modificar o actualizar estos Términos y Condiciones en cualquier momento. Las versiones actualizadas entrarán en vigor desde su publicación en la Plataforma. El uso continuado de la Plataforma después de dichas modificaciones constituirá aceptación de los Términos y Condiciones revisados.'}</p>
          </div>

          {/* 14 */}
          <div className="terms-section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <h2>{isEn ? '14. Governing Law and Jurisdiction' : '14. Ley Aplicable y Jurisdicción'}</h2>
            <p>{isEn ? 'Unless otherwise required by mandatory consumer protection laws in the user\'s jurisdiction, these Terms and Conditions shall be governed by and construed in accordance with the laws of the Argentine Republic. Any dispute arising from or related to these Terms and Conditions shall be submitted to the competent courts of the City of Buenos Aires, Argentina, unless applicable law provides otherwise.' : 'Salvo que las normas imperativas de protección al consumidor aplicables en la jurisdicción del usuario dispongan lo contrario, estos Términos y Condiciones se regirán e interpretarán de conformidad con las leyes de la República Argentina. Toda controversia derivada de o relacionada con estos Términos y Condiciones será sometida a los tribunales competentes de la Ciudad de Buenos Aires, Argentina, salvo disposición legal en contrario.'}</p>
          </div>

        </div>
      </section>
    </div>
  );
}
