import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { Briefcase, User, LogOut, Building2, LayoutDashboard, ChevronDown } from 'lucide-react';
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
              <span className="navbar-logo-text">JobBox</span>
            </Link>
          </div>

          <div className="navbar-links">
            <Link to="/" className="navbar-link">
              Home <ChevronDown size={16} />
            </Link>
            <Link to="/jobs" className="navbar-link">
              Find a Job <ChevronDown size={16} />
            </Link>
            <Link to="/companies" className="navbar-link">
              Recruiters <ChevronDown size={16} />
            </Link>
            <Link to="/candidates" className="navbar-link">
              Candidates <ChevronDown size={16} />
            </Link>
            <Link to="/blog" className="navbar-link">
              Blog <ChevronDown size={16} />
            </Link>
            <Link to="/pages" className="navbar-link">
              Pages <ChevronDown size={16} />
            </Link>

            {!isAuthenticated ? (
              <>
                <Link to="/register/user" className="btn btn-outline">
                  Register
                </Link>
                <Link to="/login" className="btn btn-primary">
                  Sign in
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
