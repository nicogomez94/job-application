import { Link } from 'react-router-dom';
import { Briefcase, Github, Twitter, Linkedin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-logo-section">
            <div className="footer-logo">
              <Briefcase className="footer-logo-icon" />
              <span className="footer-logo-text">JobPlatform</span>
            </div>
            <p className="footer-description">
              Conectamos talento con oportunidades. La plataforma líder en búsqueda de empleo.
            </p>
          </div>

          <div className="footer-section">
            <h3>Candidatos</h3>
            <ul className="footer-list">
              <li><Link to="/jobs">Buscar Empleos</Link></li>
              <li><Link to="/register/user">Crear Cuenta</Link></li>
              <li><Link to="/user/profile">Mi Perfil</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Empresas</h3>
            <ul className="footer-list">
              <li><Link to="/register/company">Registrar Empresa</Link></li>
              <li><Link to="/company/subscription">Planes y Precios</Link></li>
              <li><Link to="/company/jobs/create">Publicar Oferta</Link></li>
              <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contacto</h3>
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
          <p>&copy; {new Date().getFullYear()} JobPlatform. Todos los derechos reservados.</p>
          <p className="footer-legal">
            <Link to="/terminos-y-condiciones">Términos y Condiciones</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
