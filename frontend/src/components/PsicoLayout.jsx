import { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { LogOut, LayoutDashboard, ChevronDown, ClipboardList } from 'lucide-react';
import { scrollToTopInstant } from '../utils/scrollToTop';
import './PsicoLayout.css';

export default function PsicoLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userType, user, logout } = useAuthStore();
  const isPsychologist = isAuthenticated && userType === 'psychologist';
  const isPatient = isAuthenticated && userType === 'patient';

  const [loginOpen, setLoginOpen] = useState(false);
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
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    logout();
    navigate('/psicologos');
  };

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : null;

  return (
    <div className="psico-layout">
      <header className="psico-layout-header">
        <div className="psico-layout-header-inner">
          <Link to="/psicologos" className="psico-layout-brand">
            <span className="psico-layout-brand-icon">🧠</span>
            <span>
              <span className="psico-layout-brand-main">Psicólogos en Línea</span>
              <span className="psico-layout-brand-sub">professionals at home</span>
            </span>
          </Link>

          <nav className="psico-layout-nav">
            <Link to="/" className="psico-layout-nav-link psico-layout-nav-link--back">
              ← Sitio principal
            </Link>
            <Link
              to="/psicologos/registro-paciente"
              className={`psico-layout-nav-link ${location.pathname === '/psicologos/registro-paciente' ? 'active' : ''}`}
            >
              Registro usuario
            </Link>

            {/* ── Authenticated as patient ── */}
            {isPatient && (
              <>
                <Link to="/psicologos/mi-cuenta" className="psico-layout-nav-link">
                  <ClipboardList size={15} />
                  Mis solicitudes
                </Link>
                {displayName && (
                  <span className="psico-layout-nav-user">{displayName}</span>
                )}
                <button type="button" className="psico-layout-nav-logout" onClick={handleLogout}>
                  <LogOut size={15} />
                  Salir
                </button>
              </>
            )}

            {/* ── Authenticated as psychologist ── */}
            {isPsychologist && (
              <>
                <Link to="/psicologo/dashboard" className="psico-layout-nav-link">
                  <LayoutDashboard size={15} />
                  {displayName || 'Mi panel'}
                </Link>
                <button type="button" className="psico-layout-nav-logout" onClick={handleLogout}>
                  <LogOut size={15} />
                  Salir
                </button>
              </>
            )}

            {/* ── Not authenticated ── */}
            {!isPsychologist && !isPatient && (
              <>
                <Link to="/register/psicologo" className="psico-layout-nav-link">
                  Registro Psicólogos
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
                    Ingresar <ChevronDown size={14} style={{ marginLeft: '0.15rem', transform: loginOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                  </button>
                  {loginOpen && (
                    <div className="psico-login-dropdown-menu" role="menu">
                      <Link
                        to="/psicologos/login-paciente"
                        className="psico-login-dropdown-item"
                        role="menuitem"
                        onClick={() => setLoginOpen(false)}
                      >
                        <span className="psico-login-dropdown-label">Soy paciente</span>
                        <span className="psico-login-dropdown-sub">Busco un psicólogo</span>
                      </Link>
                      <div className="psico-login-dropdown-divider" />
                      <Link
                        to="/psicologos/login"
                        className="psico-login-dropdown-item"
                        role="menuitem"
                        onClick={() => setLoginOpen(false)}
                      >
                        <span className="psico-login-dropdown-label">Soy psicólogo</span>
                        <span className="psico-login-dropdown-sub">Acceder a mi panel</span>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
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
            La plataforma no interviene ni garantiza los servicios.
          </span>
        </div>
      </footer>
    </div>
  );
}
