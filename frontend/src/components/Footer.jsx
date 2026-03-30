import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { useI18n } from '../context/i18nStore';
import './Footer.css';

export default function Footer() {
  const { language, setLanguage, t } = useI18n();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-logo-section">
            <div className="footer-logo">
              <img src="/logo.png" alt="Professionals at Home" className="footer-logo-img" />
              <span className="footer-logo-text"></span>
            </div>
            <p className="footer-description">
              {t('Conectamos talento con oportunidades.')}
            </p>
          </div>

          <div className="footer-section">
            <h3>{t('Profesionales')}</h3>
            <ul className="footer-list">
              <li><Link to="/jobs">{t('Buscar Empleos')}</Link></li>
              <li><Link to="/register/user">{t('Crear Cuenta')}</Link></li>
              <li><Link to="/user/profile">{t('MI perfil de trabajo')}</Link></li>
              <li><Link to="/sugerencias">{t('Sugerencias para Profesionales y Empresas')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>{t('Empresas')}</h3>
            <ul className="footer-list">
              <li><Link to="/register/company">{t('Registrar Empresa')}</Link></li>
              <li><Link to="/planes-y-precios">{t('Planes y Precios')}</Link></li>
              <li><Link to="/company/jobs/create">{t('Publicar Ofertas Laborales')}</Link></li>
              <li><Link to="/quienes-somos">{t('Quiénes Somos')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>{t('Contacto')}</h3>
            <ul className="footer-list">
              <li>Email: contacto@jobplatform.com</li>
              <li>Tel: +54 11 1234-5678</li>
              <li className="footer-social">
                <a href="#"><Twitter className="footer-social-icon" /></a>
                <a href="#"><Linkedin className="footer-social-icon" /></a>
                <a href="#"><Github className="footer-social-icon" /></a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} JobPlatform. {t('Todos los derechos reservados.')}</p>
          <p className="footer-legal">
            <Link to="/terminos-y-condiciones">{t('Términos y Condiciones')}</Link>
          </p>
          <div className="footer-language-toggle" role="group" aria-label="Language selector">
            <button
              type="button"
              className={`footer-language-btn ${language === 'es' ? 'footer-language-btn-active' : ''}`}
              onClick={() => setLanguage('es')}
              aria-label="Español"
              title="Español"
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
