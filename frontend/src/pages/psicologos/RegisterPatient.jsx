import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Users, Phone } from 'lucide-react';
import { patientAuthService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import PasswordInput from '../../components/PasswordInput';
import './Psicologos.css';
import '../auth/PsicoLogin.css';

export default function RegisterPatient() {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {},
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await patientAuthService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        gender: data.gender,
        acceptTerms: data.acceptTerms,
        acceptPrivacy: data.acceptPrivacy,
        acceptAgreement: data.acceptAgreement,
      });
      const { patient, token } = res.data;
      setAuth(patient, 'patient', token);
      toast.success('¡Cuenta creada! Ya podés buscar un psicólogo.');
      navigate('/psicologos/buscar');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="psico-login-page">
      <div className="psico-login-card">
        <div className="psico-login-icon">
          <User size={36} strokeWidth={1.5} />
        </div>
        <h1>Crear cuenta de paciente</h1>
        <p className="psico-login-subtitle">
          Registrate para contactar psicólogos en línea
        </p>

        <div className="psico-patient-register-notice">
          <strong>Aviso importante:</strong>La consulta en línea no es recomenda para situaciones que requieran contención física inmediata. En ese caso se necesita atención presencial de emergencia. El costo de la o las sesiones será tratado directamente con el profesional de su elección. ¡SIN EXCEPCIÓN!
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="psico-login-field">
            <label htmlFor="firstName">
              <User size={14} /> Nombre
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="Tu nombre"
              autoComplete="given-name"
              {...register('firstName', { required: 'El nombre es obligatorio' })}
            />
            {errors.firstName && <span className="psico-login-error">{errors.firstName.message}</span>}
          </div>

          <div className="psico-login-field">
            <label htmlFor="lastName">
              <User size={14} /> Apellido
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Tu apellido"
              autoComplete="family-name"
              {...register('lastName', { required: 'El apellido es obligatorio' })}
            />
            {errors.lastName && <span className="psico-login-error">{errors.lastName.message}</span>}
          </div>

          <div className="psico-login-field">
            <label htmlFor="gender">
              <Users size={14} /> Género
            </label>
            <select
              id="gender"
              {...register('gender', { required: 'Seleccioná tu género' })}
              style={{ padding: '0.55rem 0.75rem', border: '1.5px solid #d4c9b5', borderRadius: '8px', fontSize: '0.95rem', background: '#fff', width: '100%' }}
            >
              <option value="">Seleccioná una opción</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Otro</option>
            </select>
            {errors.gender && <span className="psico-login-error">{errors.gender.message}</span>}
          </div>

          <div className="psico-login-field">
            <label htmlFor="phone">
              <Phone size={14} /> WhatsApp
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+54 9 ..."
              autoComplete="tel"
              {...register('phone')}
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              })}
            />
            {errors.password && <span className="psico-login-error">{errors.password.message}</span>}
          </div>

          <div className="psico-login-field">
            <label htmlFor="confirmPassword">
              <Lock size={14} /> Confirmar contraseña
            </label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Repetí tu contraseña"
              autoComplete="new-password"
              {...register('confirmPassword', {
                required: 'Confirmá tu contraseña',
                validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
              })}
            />
            {errors.confirmPassword && (
              <span className="psico-login-error">{errors.confirmPassword.message}</span>
            )}
          </div>

          <div className="psico-login-field psico-login-legal-field">
            <label className="psico-login-legal-check">
              <input
                type="checkbox"
                {...register('acceptTerms', { required: 'Debés aceptar los Términos y Condiciones' })}
              />
              <span>
                Acepto los{' '}
                <a href="/psicologos/terminos-y-condiciones" target="_blank" rel="noopener noreferrer">Términos y Condiciones</a>
              </span>
            </label>
            {errors.acceptTerms && <span className="psico-login-error">{errors.acceptTerms.message}</span>}
          </div>

          <div className="psico-login-field psico-login-legal-field">
            <label className="psico-login-legal-check">
              <input
                type="checkbox"
                {...register('acceptPrivacy', { required: 'Debés aceptar la Política de Privacidad' })}
              />
              <span>
                Acepto la{' '}
                <a href="/psicologos/politicas-de-privacidad" target="_blank" rel="noopener noreferrer">Política de Privacidad</a>
              </span>
            </label>
            {errors.acceptPrivacy && <span className="psico-login-error">{errors.acceptPrivacy.message}</span>}
          </div>

          <div className="psico-login-field psico-login-legal-field">
            <label className="psico-login-legal-check">
              <input
                type="checkbox"
                {...register('acceptAgreement', { required: 'Debés aceptar el Acuerdo de Aceptación del Usuario / Paciente' })}
              />
              <span>
                Acepto el{' '}
                <a href="/psicologos/acuerdo-aceptacion-paciente" target="_blank" rel="noopener noreferrer">
                  Acuerdo de Aceptación del Usuario / Paciente
                </a>
              </span>
            </label>
            {errors.acceptAgreement && <span className="psico-login-error">{errors.acceptAgreement.message}</span>}
          </div>

          <button
            type="submit"
            className="psico-btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="psico-login-links">
          <span>¿Ya tenés cuenta?</span>
          <Link to="/psicologos/login-paciente">Iniciar sesión</Link>
        </div>

        <div className="psico-login-divider" />

        <Link to="/psicologos/buscar" className="psico-login-back">
          ← Ver psicólogos sin registrarme
        </Link>
      </div>
    </div>
  );
}
