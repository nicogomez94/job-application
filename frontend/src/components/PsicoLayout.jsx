import { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { useI18n } from '../context/i18nStore';
import { LogOut, LayoutDashboard, ChevronDown, ClipboardList, Menu, X } from 'lucide-react';
import { scrollToTopInstant } from '../utils/scrollToTop';
import './PsicoLayout.css';

const CONTACT_EMAIL = 'info@professionalsathome.com';
const CONTACT_EMAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`;

export default function PsicoLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userType, user, logout } = useAuthStore();
  const { t, language, setLanguage } = useI18n();
  const isPsychologist = isAuthenticated && userType === 'psychologist';
  const isPatient = isAuthenticated && userType === 'patient';
  const isEn = language === 'en';

  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const loginRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (loginRef.current && !loginRef.current.contains(e.target)) {
        setLoginOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useLayoutEffect(() => {
    scrollToTopInstant();
    setLoginOpen(false);
    setMobileNavOpen(false);
  }, [location.pathname, location.search]);

  const accountRole = isPsychologist
    ? (isEn ? 'professional' : 'profesional')
    : isPatient
      ? (isEn ? 'user' : 'usuario')
      : (isEn ? 'account' : 'cuenta');

  const handleLogout = () => {
    const accountName = displayName || accountRole;
    const confirmMessage = isEn
      ? `Do you want to log out of ${accountName} (${accountRole})?`
      : `¿Quiere salir de ${accountName} (${accountRole})?`;
    if (!window.confirm(confirmMessage)) return;
    closeMobileNav();
    logout();
    navigate('/psicologos');
  };

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : null;

  return (
    <div className="psico-layout">
      <header className="psico-layout-header">
        <div className="psico-layout-header-inner">
          {/* Far left: back to main site */}
          <Link to="/" className="psico-layout-nav-link psico-layout-nav-link--back">
            {t('Sitio principal')}
          </Link>

          {/* Brand */}
          <Link to="/psicologos" className="psico-layout-brand">
            <span>
              <span className="psico-layout-brand-main">Psicólogos en Línea</span>
              <span className="psico-layout-brand-sub">professionals at home</span>
            </span>
          </Link>

          {/* Center: logged-in user name */}
          {(isPatient || isPsychologist) && displayName && (
            <div className="psico-layout-session-user">
              {displayName}
            </div>
          )}

          <button
            type="button"
            className="psico-layout-menu-toggle"
            onClick={() => setMobileNavOpen((open) => !open)}
            aria-label={mobileNavOpen ? t('Cerrar menú') : t('Abrir menú')}
            aria-expanded={mobileNavOpen}
            aria-controls="psico-layout-nav"
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav
            id="psico-layout-nav"
            className={`psico-layout-nav ${mobileNavOpen ? 'is-open' : ''}`}
          >
            <Link
              to="/"
              className="psico-layout-nav-link psico-layout-nav-link--mobile-back"
              onClick={closeMobileNav}
            >
              {t('Sitio principal')}
            </Link>

            {!isAuthenticated && (
              <Link
                to="/psicologos/registro-paciente"
                className={`psico-layout-nav-link ${location.pathname === '/psicologos/registro-paciente' ? 'active' : ''}`}
                onClick={closeMobileNav}
              >
                {t('Registro usuario')}
              </Link>
            )}

            {/* ── Authenticated as patient ── */}
            {isPatient && (
              <>
                <Link to="/psicologos/mi-cuenta" className="psico-layout-nav-link" onClick={closeMobileNav}>
                  <ClipboardList size={15} />
                  {t('Mis solicitudes')}
                </Link>
                <button type="button" className="psico-layout-nav-logout" onClick={handleLogout}>
                  <LogOut size={15} />
                  {t('Salir')}
                </button>
              </>
            )}

            {/* ── Authenticated as psychologist ── */}
            {isPsychologist && (
              <>
                <Link to="/psicologo/dashboard" className="psico-layout-nav-link" onClick={closeMobileNav}>
                  <LayoutDashboard size={15} />
                  {t('Mi panel')}
                </Link>
                <button type="button" className="psico-layout-nav-logout" onClick={handleLogout}>
                  <LogOut size={15} />
                  {t('Salir')}
                </button>
              </>
            )}

            {/* ── Not authenticated ── */}
            {!isPsychologist && !isPatient && (
              <>
                <Link to="/register/psicologo" className="psico-layout-nav-link" onClick={closeMobileNav}>
                  {t('Registro Psicólogos')}
                </Link>

                {/* Login dropdown */}
                <div className="psico-login-dropdown" ref={loginRef}>
                  <button
                    type="button"
                    className="psico-layout-nav-btn"
                    onClick={() => setLoginOpen((o) => !o)}
                    aria-haspopup="true"
                    aria-expanded={loginOpen}
                  >
                    {t('Ingresar')} <ChevronDown size={14} style={{ marginLeft: '0.15rem', transform: loginOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                  </button>
                  {loginOpen && (
                    <div className="psico-login-dropdown-menu" role="menu">
                      <Link
                        to="/psicologos/login-paciente"
                        className="psico-login-dropdown-item"
                        role="menuitem"
                        onClick={() => {
                          setLoginOpen(false);
                          closeMobileNav();
                        }}
                      >
                        <span className="psico-login-dropdown-label">{t('Soy paciente')}</span>
                        <span className="psico-login-dropdown-sub">{t('Busco un psicólogo')}</span>
                      </Link>
                      <div className="psico-login-dropdown-divider" />
                      <Link
                        to="/psicologos/login"
                        className="psico-login-dropdown-item"
                        role="menuitem"
                        onClick={() => {
                          setLoginOpen(false);
                          closeMobileNav();
                        }}
                      >
                        <span className="psico-login-dropdown-label">{t('Soy psicólogo')}</span>
                        <span className="psico-login-dropdown-sub">{t('Acceder a mi panel')}</span>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="navbar-language-toggle psico-layout-language-toggle" role="group" aria-label="Language selector">
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
          </nav>
        </div>
      </header>

      <main className="psico-layout-main">
        <Outlet />
      </main>

      <footer className="psico-layout-footer">
        <div className="psico-layout-footer-inner">
          <span>
            <strong>Psicólogos en Línea</strong> · professionals at home
          </span>
          <span className="psico-layout-footer-back-placeholder" />
          <span className="psico-layout-footer-legal">
            Las consultas son pactadas directamente entre el paciente y el profesional.
            La plataforma no interviene ni garantiza los servicios.{' '}
            <a href={CONTACT_EMAIL_URL} target="_blank" rel="noreferrer">{CONTACT_EMAIL}</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
