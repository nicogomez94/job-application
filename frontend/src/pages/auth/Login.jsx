import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authService, subscriptionService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { DEBUG_MODE, getDebugLoginData } from '../../config/debug';
import { API_BASE_URL } from '../../services/apiBaseUrl';
import { Briefcase, Mail, Lock } from 'lucide-react';
import './Login.css';

const USER_TYPE_LABELS = {
  user: 'Profesional',
  company: 'Empresa',
  admin: 'Admin',
};

export default function Login({
  allowedUserTypes = ['user', 'company', 'admin'],
  defaultUserType = 'user',
  hideUserTypeSelector = false,
}) {
  const initialType =
    allowedUserTypes.includes(defaultUserType) ? defaultUserType : allowedUserTypes[0] || 'user';
  const [userType, setUserType] = useState(initialType);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: DEBUG_MODE ? getDebugLoginData(initialType) : { email: '', password: '' },
  });
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const apiBaseURL = API_BASE_URL;

  useEffect(() => {
    if (!allowedUserTypes.includes(userType)) {
      setUserType(initialType);
    }
  }, [allowedUserTypes, initialType, userType]);

  useEffect(() => {
    if (!DEBUG_MODE) return;
    reset(getDebugLoginData(userType));
  }, [userType, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let response;
      
      if (userType === 'user') {
        response = await authService.loginUser(data);
      } else if (userType === 'company') {
        response = await authService.loginCompany(data);
      } else {
        response = await authService.loginAdmin(data);
      }

      const { user, company, admin, token } = response.data;
      const userData = user || company || admin;
      
      setAuth(userData, userType, token);
      toast.success('¡Bienvenido!');

      if (userType === 'user') {
        navigate('/user/dashboard');
      } else if (userType === 'company') {
        // Si la empresa no tiene suscripción activa, redirigir a selección de plan
        try {
          await subscriptionService.getActive();
          navigate('/company/dashboard');
        } catch (err) {
          if (err.response?.status === 404) {
            navigate('/register/company/plan');
          } else {
            navigate('/company/dashboard');
          }
        }
      } else {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <Briefcase className="login-logo" />
          <h2 className="login-title">Iniciar Sesión</h2>
          <p className="login-subtitle">
            Accede a tu cuenta de JobPlatform
          </p>
        </div>

        <div className="card login-card">
          {!hideUserTypeSelector && (
            <div className="login-user-type-selector">
              {allowedUserTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setUserType(type)}
                  className={`login-user-type-btn ${
                    userType === type
                      ? 'login-user-type-btn-active'
                      : 'login-user-type-btn-inactive'
                  }`}
                >
                  {USER_TYPE_LABELS[type] || type}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="login-form-group">
              <label className="login-label" htmlFor="login-email">Email</label>
              <div className="login-input-wrapper">
                <Mail className="login-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  {...register('email', {
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido',
                    },
                  })}
                  className="input login-input-with-icon"
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && (
                <p className="login-error">{errors.email.message}</p>
              )}
            </div>

            <div className="login-form-group">
              <label className="login-label" htmlFor="login-password">Contraseña</label>
              <div className="login-input-wrapper">
                <Lock className="login-input-icon" />
                <input
                  id="login-password"
                  type="password"
                  {...register('password', {
                    required: 'La contraseña es requerida',
                  })}
                  className="input login-input-with-icon"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="login-error">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary login-submit-btn"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {userType !== 'admin' && (
            <>
              <div className="login-divider">
                <div className="login-divider-line">
                  <div className="login-divider-line-inner" />
                </div>
                <div className="login-divider-text-wrapper">
                  <span className="login-divider-text">O continúa con</span>
                </div>
              </div>

              <div className="login-google-btn-wrapper">
                <button
                  type="button"
                  className="btn btn-outline login-google-btn"
                  onClick={() => {
                    window.location.href = `${apiBaseURL}/auth/${userType}/google`;
                  }}
                >
                  <svg className="login-google-icon" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continuar con Google
                </button>
              </div>
            </>
          )}
        </div>

        {userType !== 'admin' && (
          <div className="login-register-link-wrapper">
            <p className="login-register-text">
              ¿No tienes cuenta?{' '}
              <Link
                to={userType === 'user' ? '/register/user' : '/register/company'}
                className="login-register-link"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
