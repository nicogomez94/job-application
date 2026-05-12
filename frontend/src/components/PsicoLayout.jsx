import { useLayoutEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { LogOut, LayoutDashboard, User } from 'lucide-react';
import { scrollToTopInstant } from '../utils/scrollToTop';
import './PsicoLayout.css';

export default function PsicoLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userType, user, logout } = useAuthStore();
  const isPsychologist = isAuthenticated && userType === 'psychologist';

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
            <Link
              to="/psicologos"
              className={`psico-layout-nav-link ${location.pathname === '/psicologos' ? 'active' : ''}`}
            >
              Buscar psicólogo
            </Link>

            {!isPsychologist ? (
              <>
                <Link
                  to="/register/psicologo"
                  className="psico-layout-nav-link"
                >
                  Registrarme
                </Link>
                <Link
                  to="/psicologos/login"
                  className="psico-layout-nav-btn"
                >
                  Ingresar
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/psicologo/dashboard"
                  className="psico-layout-nav-link"
                >
                  <LayoutDashboard size={15} />
                  {displayName || 'Mi panel'}
                </Link>
                <button
                  type="button"
                  className="psico-layout-nav-logout"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  Salir
                </button>
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
          <Link to="/" className="psico-layout-footer-back">
            ← Volver al sitio principal
          </Link>
          <span className="psico-layout-footer-legal">
            Las consultas son pactadas directamente entre el paciente y el profesional.
            La plataforma no interviene ni garantiza los servicios.
          </span>
        </div>
      </footer>
    </div>
  );
}
