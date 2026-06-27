import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Mail, RefreshCw, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { EMAIL_VALIDATION_MESSAGE, isValidEmail } from '../../utils/emailValidation';
import './VerifyEmail.css';

const ACCOUNT_TYPE_LABELS = {
  user: 'Profesional',
  company: 'Empresa',
  patient: 'Paciente',
  psychologist: 'Psicólogo',
};

const getContinuePath = (type, user) => {
  if (type === 'user') return '/user/dashboard';
  if (type === 'company') return '/company/dashboard';
  if (type === 'patient') return '/psicologos/buscar';
  if (type === 'psychologist') {
    if (user?.status === 'PENDING_DOCS') return '/register/psicologo/documentos';
    if (user?.status === 'PENDING' || user?.status === 'REJECTED') return '/register/psicologo/confirmacion';
    if (user?.status === 'APPROVED') return '/psicologo/plan';
    return '/psicologo/dashboard';
  }
  return '/login';
};

const getLoginPath = (type) => {
  if (type === 'psychologist') return '/psicologos/login';
  if (type === 'patient') return '/psicologos/login-paciente';
  return '/login';
};

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { user, userType, isAuthenticated, updateUser } = useAuthStore();
  const initialType = ACCOUNT_TYPE_LABELS[userType] ? userType : 'user';
  const [email, setEmail] = useState(user?.email || '');
  const [accountType, setAccountType] = useState(initialType);
  const [status, setStatus] = useState(token ? 'verifying' : 'waiting');
  const [message, setMessage] = useState(
    token ? 'Confirmando tu email...' : 'Te enviamos un enlace de confirmación por correo.',
  );
  const [resending, setResending] = useState(false);
  const [verifiedType, setVerifiedType] = useState(null);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (ACCOUNT_TYPE_LABELS[userType]) setAccountType(userType);
  }, [user?.email, userType]);

  useEffect(() => {
    if (!token) return;

    let active = true;
    authService.verifyEmail(token)
      .then((response) => {
        if (!active) return;
        const confirmedType = response.data?.type;
        setVerifiedType(confirmedType);
        setStatus('success');
        setMessage('Tu email fue confirmado correctamente. Ya podés continuar.');
        if (isAuthenticated && confirmedType === userType) {
          updateUser({ emailVerified: true, emailVerifiedAt: new Date().toISOString() });
        }
      })
      .catch((error) => {
        if (!active) return;
        setStatus('error');
        setMessage(error.response?.data?.error || 'El enlace es inválido o expiró.');
      });

    return () => { active = false; };
  }, [isAuthenticated, token, updateUser, userType]);

  const effectiveType = verifiedType || accountType || userType;
  const continuePath = useMemo(
    () => getContinuePath(effectiveType, user),
    [effectiveType, user],
  );

  const handleResend = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!isValidEmail(normalizedEmail)) {
      toast.error(EMAIL_VALIDATION_MESSAGE);
      return;
    }

    setResending(true);
    try {
      const response = await authService.resendEmailVerification({
        email: normalizedEmail,
        userType: accountType,
      });
      toast.success(response.data?.message || 'Si la cuenta existe, recibirás un nuevo enlace.');
      setStatus('waiting');
      setMessage('Revisá tu bandeja de entrada y también la carpeta de spam.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo reenviar el email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-email-page">
      <section className="verify-email-card" aria-live="polite">
        <div className={`verify-email-icon verify-email-icon-${status}`}>
          {status === 'success' ? <CheckCircle /> : status === 'error' ? <XCircle /> : <Mail />}
        </div>

        <p className="verify-email-eyebrow">Seguridad de la cuenta</p>
        <h1>{status === 'success' ? 'Email confirmado' : 'Confirmá tu email'}</h1>
        <p className="verify-email-message">{message}</p>

        {status === 'verifying' && <div className="verify-email-spinner" aria-label="Verificando" />}

        {status === 'success' ? (
          isAuthenticated && effectiveType === userType ? (
            <button className="btn btn-primary verify-email-primary" onClick={() => navigate(continuePath, { replace: true })}>
              Continuar
            </button>
          ) : (
            <Link className="btn btn-primary verify-email-primary" to={getLoginPath(effectiveType)}>
              Iniciar sesión
            </Link>
          )
        ) : status !== 'verifying' && (
          <form className="verify-email-form" onSubmit={handleResend}>
            <label htmlFor="verification-account-type">Tipo de cuenta</label>
            <select
              id="verification-account-type"
              className="input"
              value={accountType}
              onChange={(event) => setAccountType(event.target.value)}
              disabled={Boolean(userType && ACCOUNT_TYPE_LABELS[userType])}
            >
              {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <label htmlFor="verification-email">Email</label>
            <input
              id="verification-email"
              className="input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              readOnly={Boolean(user?.email)}
              placeholder="tu@email.com"
              required
            />

            <button className="btn btn-primary verify-email-primary" type="submit" disabled={resending}>
              <RefreshCw size={17} className={resending ? 'verify-email-spin' : ''} />
              {resending ? 'Enviando...' : 'Reenviar enlace'}
            </button>
          </form>
        )}

        <p className="verify-email-help">
          El enlace vence en 24 horas. Hasta confirmar el email, las funciones privadas permanecen bloqueadas.
        </p>
      </section>
    </div>
  );
}
