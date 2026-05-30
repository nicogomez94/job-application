import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, Lock, Brain } from 'lucide-react';
import { patientAuthService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { getDebugLoginData, DEBUG_MODE } from '../../config/debug';
import PasswordInput from '../../components/PasswordInput';
import './Psicologos.css';
import '../auth/PsicoLogin.css';

export default function LoginPatient() {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: DEBUG_MODE ? getDebugLoginData('patient') : { email: '', password: '' },
  });

  // Redirect to the page the user was trying to access, or to the listing
  const from = location.state?.from || '/psicologos/buscar';

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await patientAuthService.login(data);
      const { patient, token } = res.data;
      setAuth(patient, 'patient', token);
      toast.success('¡Bienvenido/a!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="psico-login-page">
      <div className="psico-login-card">
        <div className="psico-login-icon">
          <Brain size={36} strokeWidth={1.5} />
        </div>
        <h1>Ingresar como paciente</h1>
        <p className="psico-login-subtitle">
          Accedé para contactar psicólogos en línea
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="psico-login-field">
            <label htmlFor="email">
              <Mail size={14} /> Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              {...register('email', {
                required: 'El email es obligatorio',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' },
              })}
            />
            {errors.email && <span className="psico-login-error">{errors.email.message}</span>}
          </div>

          <div className="psico-login-field">
            <label htmlFor="password">
              <Lock size={14} /> Contraseña
            </label>
            <PasswordInput
              id="password"
              placeholder="Tu contraseña"
              autoComplete="current-password"
              {...register('password', { required: 'La contraseña es obligatoria' })}
            />
            {errors.password && <span className="psico-login-error">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className="psico-btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="psico-login-links">
          <span>¿No tenés cuenta?</span>
          <Link to="/psicologos/registro-paciente">Registrarme</Link>
        </div>

        <div className="psico-login-divider" />

        <Link to="/psicologos/buscar" className="psico-login-back">
          ← Ver psicólogos sin iniciar sesión
        </Link>
      </div>
    </div>
  );
}
