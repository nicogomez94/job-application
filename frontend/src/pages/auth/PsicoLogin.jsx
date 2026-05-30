import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, Lock, Brain } from 'lucide-react';
import { psychologistAuthService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { getDebugLoginData, DEBUG_MODE } from '../../config/debug';
import PasswordInput from '../../components/PasswordInput';
import '../psicologos/Psicologos.css';
import './PsicoLogin.css';

export default function PsicoLogin() {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: DEBUG_MODE ? getDebugLoginData('psychologist') : { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await psychologistAuthService.login(data);
      const { psychologist, token } = response.data;
      setAuth(psychologist, 'psychologist', token);
      toast.success('¡Bienvenido!');

      const status = psychologist?.status;
      if (status === 'PENDING_DOCS') {
        navigate('/register/psicologo/documentos');
      } else if (status === 'PENDING' || status === 'REJECTED') {
        navigate('/register/psicologo/confirmacion');
      } else if (status === 'APPROVED') {
        navigate('/psicologo/plan');
      } else {
        navigate('/psicologo/dashboard');
      }
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
        <h1>Ingresar como psicólogo</h1>
        <p className="psico-login-subtitle">
          Accedé a tu panel profesional
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
          <Link to="/register/psicologo">Registrarme como psicólogo</Link>
        </div>

        <div className="psico-login-divider" />

        <Link to="/psicologos/buscar" className="psico-login-back">
          ← Volver al listado de psicólogos
        </Link>
      </div>
    </div>
  );
}
