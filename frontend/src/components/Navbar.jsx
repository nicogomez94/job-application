import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { User, LogOut, Building2, ChevronDown, Menu, X, Search, PencilLine } from 'lucide-react';
import { useAuthStore } from '../context/authStore';
import { useI18n } from '../context/i18nStore';
import { BACKEND_BASE_URL } from '../services/apiBaseUrl';
import './Navbar.css';

const toAssetUrl = (assetPath) => {
  if (!assetPath) return '';
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) return assetPath;

  const rawPath = String(assetPath).trim();
  const noApiPrefix = rawPath.replace(/^\/?api\//i, '/');
  const normalizedPath = noApiPrefix.startsWith('/') ? noApiPrefix : `/${noApiPrefix}`;

  return `${BACKEND_BASE_URL}${normalizedPath}`;
};

export default function Navbar() {
  const { isAuthenticated, user, userType, logout } = useAuthStore();
  const { t, language, setLanguage } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
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

  const getEditProfileLink = () => {
    switch (userType) {
      case 'user':
        return '/user/profile';
      case 'company':
        return '/company/profile';
      default:
        return getDashboardLink();
    }
  };

  const displayName = user?.firstName || user?.companyName || t('Usuario');
  const avatarUrl = toAssetUrl(user?.profileImage || user?.companyLogo || '');
  const avatarInitial = (displayName?.charAt(0) || 'U').toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!userMenuRef.current?.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

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
              <label
                htmlFor="navbar-search-input"
                style={{
                  position: 'absolute',
                  width: '1px',
                  height: '1px',
                  padding: 0,
                  margin: '-1px',
                  overflow: 'hidden',
                  clip: 'rect(0, 0, 0, 0)',
                  whiteSpace: 'nowrap',
                  border: 0,
                }}
              >
                Buscar
              </label>
              <Search className="navbar-search-icon" size={16} />
              <input
                id="navbar-search-input"
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
              <div className="navbar-user-section" ref={userMenuRef}>
                <button
                  type="button"
                  className="navbar-user-menu-trigger"
                  onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={isUserDropdownOpen}
                >
                  <span className="navbar-user-info">
                    {userType === 'company' ? <Building2 className="navbar-user-icon" /> : <User className="navbar-user-icon" />}
                    <span className="navbar-user-name-link">{displayName}</span>
                  </span>
                  <ChevronDown className={`navbar-user-menu-chevron ${isUserDropdownOpen ? 'is-open' : ''}`} size={16} />
                </button>

                <div className={`navbar-user-dropdown ${isUserDropdownOpen ? 'navbar-user-dropdown-open' : ''}`} role="menu">
                  <Link
                    to={getDashboardLink()}
                    className="navbar-user-dropdown-profile-link"
                    onClick={closeMenu}
                    role="menuitem"
                  >
                    <div className="navbar-user-avatar" aria-hidden="true">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={`Foto de perfil de ${displayName}`} className="navbar-user-avatar-img" />
                      ) : (
                        avatarInitial
                      )}
                    </div>
                    <div className="navbar-user-dropdown-name">{displayName}</div>
                  </Link>

                  <Link
                    to={getEditProfileLink()}
                    className="navbar-user-dropdown-action"
                    onClick={closeMenu}
                    role="menuitem"
                  >
                    <PencilLine className="navbar-icon-small" />
                    <span>{t('Editar perfil')}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="navbar-user-dropdown-action navbar-user-dropdown-action-logout"
                    role="menuitem"
                  >
                    <LogOut className="navbar-icon-small" />
                    <span>{t('Salir')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
