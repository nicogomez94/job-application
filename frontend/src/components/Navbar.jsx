import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { Briefcase, User, LogOut, Building2, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, userType, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
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
            <Link to="/" className="navbar-logo">
              <Briefcase className="navbar-logo-icon" />
              <span className="navbar-logo-text">JobPlatform</span>
            </Link>
          </div>

          <div className="navbar-links">
            <Link to="/jobs" className="navbar-link">
              Buscar Empleos
            </Link>

            {!isAuthenticated ? (
              <>
                <Link to="/login" className="navbar-link">
                  Iniciar Sesión
                </Link>
                <Link to="/register/user" className="btn btn-primary">
                  Registrarse
                </Link>
                <Link to="/register/company" className="btn btn-outline">
                  Publicar Empleo
                </Link>
              </>
            ) : (
              <div className="navbar-user-section">
                <Link to={getDashboardLink()} className="navbar-dashboard-link">
                  <LayoutDashboard className="navbar-icon-small" />
                  <span>Dashboard</span>
                </Link>

                <div className="navbar-user-info">
                  {userType === 'user' && <User className="navbar-user-icon" />}
                  {userType === 'company' && <Building2 className="navbar-user-icon" />}
                  <span className="navbar-user-name">
                    {user?.firstName || user?.companyName || 'Usuario'}
                  </span>
                </div>

                <button onClick={handleLogout} className="navbar-logout-btn">
                  <LogOut className="navbar-icon-small" />
                  <span>Salir</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
