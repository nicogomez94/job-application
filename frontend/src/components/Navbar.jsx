import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { User, LogOut, Building2, ChevronDown, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '../context/i18nStore';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, userType, logout } = useAuthStore();
  const { t, language, setLanguage } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    closeMenu();
    if (!query) {
      navigate('/jobs');
      return;
    }
    navigate(`/jobs?search=${encodeURIComponent(query)}`);
  };

  const getDashboardLink = () => {
    switch (userType) {
      case 'user':
        return '/user/dashboard';
      case 'company':
        return '/company/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div>
            <Link to="/" className="navbar-logo notranslate" onClick={closeMenu} translate="no" lang="en">
              <img src="/logo.png" alt="PaH logo" className="navbar-logo-img" />
              <span className="navbar-logo-text notranslate" translate="no" lang="en">Professionals at Home</span>
            </Link>
          </div>

          <button className="navbar-hamburger" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`navbar-links ${isMenuOpen ? 'navbar-links-open' : ''}`}>
            <div className="navbar-language-toggle" role="group" aria-label="Language selector">
              <button
                type="button"
                className={`navbar-language-btn ${language === 'es' ? 'navbar-language-btn-active' : ''}`}
                onClick={() => setLanguage('es')}
                aria-label="Español"
                title="Español"
              >
                <img src="/flags/es.svg" alt="" className="navbar-language-flag" aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`navbar-language-btn ${language === 'en' ? 'navbar-language-btn-active' : ''}`}
                onClick={() => setLanguage('en')}
                aria-label="English"
                title="English"
              >
                <img src="/flags/us.svg" alt="" className="navbar-language-flag" aria-hidden="true" />
              </button>
            </div>

            <Link
              to="/"
              className={`navbar-link navbar-link-home ${location.pathname === '/' ? 'navbar-link-active' : ''}`}
              onClick={closeMenu}
            >
              Home
            </Link>

            <form className="navbar-search" onSubmit={handleSearchSubmit}>
              <Search className="navbar-search-icon" size={16} />
              <input
                type="text"
                className="navbar-search-input"
                placeholder={t('Buscar')}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </form>

            <Link to="/jobs" className="navbar-link" onClick={closeMenu}>
              {t('Ver Ofertas')} <ChevronDown size={16} />
            </Link>
            {/* <Link to="/companies" className="navbar-link" onClick={closeMenu}>
              Reclutadores <ChevronDown size={16} />
            </Link>
            <Link to="/candidates" className="navbar-link" onClick={closeMenu}>
              Candidatos <ChevronDown size={16} />
            </Link> */}
            {!isAuthenticated ? (
              <div className="navbar-mobile-actions">
                <Link to="/register/user" className="btn btn-outline" onClick={closeMenu}>
                  {t('Registrarse')}
                </Link>
                &nbsp;
                <Link to="/login" className="btn btn-primary" onClick={closeMenu}>
                  {t('Ingresar')}
                </Link>
              </div>
            ) : (
              <div className="navbar-user-section">
                <div className="navbar-user-info">
                  {userType === 'user' && <User className="navbar-user-icon" />}
                  {userType === 'company' && <Building2 className="navbar-user-icon" />}
                  <Link to={getDashboardLink()} className="navbar-user-name-link" onClick={closeMenu}>
                    {user?.firstName || user?.companyName || t('Usuario')}
                  </Link>
                </div>

                <button onClick={handleLogout} className="navbar-logout-btn">
                  <LogOut className="navbar-icon-small" />
                  <span>{t('Salir')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
