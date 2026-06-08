import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, Lock, Brain } from 'lucide-react';
import { authService, psychologistAuthService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { getDebugLoginData, DEBUG_MODE } from '../../config/debug';
import PasswordInput from '../../components/PasswordInput';
import '../psicologos/Psicologos.css';
import './PsicoLogin.css';
import './Login.css';

export default function PsicoLogin() {
  const [loading, setLoading] = useState(false);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryStatus, setRecoveryStatus] = useState('idle');
  const [recoveryStatusMessage, setRecoveryStatusMessage] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
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

  const openRecoveryModal = () => {
    setRecoveryEmail(getValues('email') || '');
    setRecoveryStatus('idle');
    setRecoveryStatusMessage('');
    setIsRecoveryModalOpen(true);
  };

  const closeRecoveryModal = () => {
    if (recoveryLoading) return;
    setIsRecoveryModalOpen(false);
  };

  const submitRecovery = async (event) => {
    event.preventDefault();
    const trimmedEmail = recoveryEmail.trim();
    if (!trimmedEmail) {
      setRecoveryStatus('error');
      setRecoveryStatusMessage('Ingresá tu email.');
      return;
    }

    setRecoveryLoading(true);
    setRecoveryStatus('loading');
    setRecoveryStatusMessage('Enviando link de recuperación...');
    try {
      await authService.requestPasswordRecovery({ email: trimmedEmail, userType: 'psychologist' });
      setRecoveryStatus('success');
      setRecoveryStatusMessage('Si el email está registrado, recibirás un link para restablecer tu clave.');
    } catch {
      setRecoveryStatus('error');
      setRecoveryStatusMessage('No se pudo procesar la recuperación de clave.');
    } finally {
      setRecoveryLoading(false);
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
          <button type="button" className="login-forgot-password-btn" onClick={openRecoveryModal}>
            Recuperar clave
          </button>
        </div>

        <div className="psico-login-links">
          <span>¿No tenés cuenta?</span>
          <Link to="/register/psicologo">Registrarme como psicólogo</Link>
        </div>

        <div className="psico-login-divider" />

        <Link to="/psicologos/buscar" className="psico-login-back">
          ← Volver al listado de psicólogos
        </Link>

        {isRecoveryModalOpen && (
          <div className="login-recovery-backdrop" onClick={closeRecoveryModal} role="presentation">
            <div className="login-recovery-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="psychologist-recovery-title">
              <button type="button" className="login-recovery-close-btn" onClick={closeRecoveryModal} aria-label="Cerrar">
                &times;
              </button>
              <h3 id="psychologist-recovery-title" className="login-recovery-title">Recuperar clave</h3>
              <p className="login-recovery-description">Ingresá tu email y te enviaremos un link para restablecer tu clave.</p>
              <form className="login-recovery-form" onSubmit={submitRecovery}>
                <label className="login-label" htmlFor="psychologist-recovery-email">Email</label>
                <input
                  id="psychologist-recovery-email"
                  type="email"
                  value={recoveryEmail}
                  onChange={(event) => setRecoveryEmail(event.target.value)}
                  className="input"
                  placeholder="tu@email.com"
                  required
                  disabled={recoveryStatus === 'success'}
                />
                {recoveryStatus !== 'idle' && (
                  <p className={`login-recovery-status login-recovery-status-${recoveryStatus}`}>
                    {recoveryStatusMessage}
                  </p>
                )}
                {recoveryStatus !== 'success' && (
                  <button type="submit" disabled={recoveryLoading} className="btn btn-primary login-recovery-submit-btn">
                    {recoveryLoading ? 'Enviando...' : 'Enviar link de recuperación'}
                  </button>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
