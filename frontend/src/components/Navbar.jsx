import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { User, LogOut, Building2, ChevronDown, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '../context/i18nStore';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, userType, logout } = useAuthStore();
  const { t } = useI18n();
  const navigate = useNavigate();
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
            <Link to="/" className="navbar-logo" onClick={closeMenu}>
              <img src="/logo.png" alt="Professionals at Home" className="navbar-logo-img" />
              <span className="navbar-logo-text">Professionals at Home</span>
            </Link>
          </div>

          <button className="navbar-hamburger" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`navbar-links ${isMenuOpen ? 'navbar-links-open' : ''}`}>
            <form className="navbar-search" onSubmit={handleSearchSubmit}>
              <Search className="navbar-search-icon" size={16} />
              <input
                type="text"
                className="navbar-search-input"
                placeholder={t('Buscar empleo...')}
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
              <>
                <Link to="/register/user" className="btn btn-outline" onClick={closeMenu}>
                  {t('Registrarse')}
                </Link>
                <Link to="/login" className="btn btn-primary" onClick={closeMenu}>
                  {t('Ingresar')}
                </Link>
              </>
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
