import { Link } from 'react-router-dom';
import { useI18n } from '../context/i18nStore';
import './Footer.css';

const CONTACT_EMAIL = 'info@professionalsathome.com';
const CONTACT_EMAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`;

export default function Footer() {
  const { language, setLanguage, t } = useI18n();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-logo-section">
            <div className="footer-logo">
              <img src="/logo.png" alt="professionals at home" className="footer-logo-img" />
              <span className="footer-logo-text" />
            </div>
            <p className="footer-description">{t('Conectamos talento con oportunidades.')}</p>
            <p className="footer-suggestions-link-wrap">
              <Link to="/sugerencias" className="footer-suggestions-link">
                {t('Sugerencias para Profesionales y Empresas')}
              </Link>
            </p>
          </div>

          <div className="footer-section">
            <h3>{t('Profesionales')}</h3>
            <ul className="footer-list">
              <li><Link to="/jobs">{t('Buscar Empleos')}</Link></li>
              <li><Link to="/register/user">{t('Crear Cuenta')}</Link></li>
              <li><Link to="/user/profile">{t('MI perfil de trabajo')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>{t('Empresas')}</h3>
            <ul className="footer-list">
              <li><Link to="/register/company">{t('Registrar Empresa')}</Link></li>
              <li><Link to="/planes-y-precios">{t('Planes')}</Link></li>
              <li><Link to="/company/jobs/create">{t('Publicar Ofertas Laborales')}</Link></li>
              <li><Link to="/quienes-somos">{t('Qui\u00e9nes Somos')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>{t('Contacto')}</h3>
            <ul className="footer-list">
              <li className="footer-contact-email">
                <a href={CONTACT_EMAIL_URL} target="_blank" rel="noreferrer">{CONTACT_EMAIL}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} professionals at home. {t('Todos los derechos reservados.')}</p>
          <p className="footer-legal">
            <Link to="/terminos-y-condiciones">{t('T\u00e9rminos y Condiciones')}</Link>
            {' | '}
            <Link to="/politicas-y-privacidad">{t('Pol\u00edticas y Privacidad')}</Link>
          </p>
          <p className="footer-credit">
            {t('Hecho por')}{' '}
            <a
              className="footer-credit-link"
              href="https://zigodev.com.ar"
              target="_blank"
              rel="noreferrer"
            >
              zigodev
            </a>
          </p>
          <div className="footer-language-toggle" role="group" aria-label="Language selector">
            <button
              type="button"
              className={`footer-language-btn ${language === 'es' ? 'footer-language-btn-active' : ''}`}
              onClick={() => setLanguage('es')}
              aria-label="Espa\u00f1ol"
              title="Espa\u00f1ol"
            >
              <img src="/flags/es.svg" alt="" className="footer-language-flag" aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`footer-language-btn ${language === 'en' ? 'footer-language-btn-active' : ''}`}
              onClick={() => setLanguage('en')}
              aria-label="English"
              title="English"
            >
              <img src="/flags/us.svg" alt="" className="footer-language-flag" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
