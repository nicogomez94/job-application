import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { CheckCircle, Clock, XCircle, MessageCircle, Mail, Trash2, Ban, Camera, Unlock, Edit3, Save, X, User, Users, Phone, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { psychologistRequestService, patientAuthService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { BACKEND_BASE_URL } from '../../services/apiBaseUrl';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import PasswordInput from '../../components/PasswordInput';
import { getPhoneValidationMessage, normalizePhoneNumber } from '../../utils/phoneNumber';
import './Psicologos.css';

const toAssetUrl = (p) => {
  if (!p) return null;
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return `${BACKEND_BASE_URL}${p}`;
};

const REJECTED_MESSAGE = 'Estimada/o. En estos momentos estamos con agenda completa. Será un gusto asistirle en un próximo contacto. Intente nuevamente después de 7 días.';
const TERMINATION_MESSAGE = 'El usuario ha decidido finalizar la terapia por razones personales';
const PROFESSIONAL_SUSPENDED_MESSAGE = 'El profesional suspende momentáneamente el servicio de consultas';
const PROFESSIONAL_PENDING_MESSAGE = 'El profesional está en espera de aprobación';

const mailtoHref = (email) => `mailto:${String(email || '').trim()}`;

const STATUS_CONFIG = {
  PENDING: { label: 'Pendiente de respuesta', icon: Clock, color: 'orange' },
  ACCEPTED: { label: 'Solicitud aceptada', icon: CheckCircle, color: 'green' },
  REJECTED: {
    label: REJECTED_MESSAGE,
    icon: XCircle,
    color: 'red',
    className: 'psico-status-unavailable',
  },
};

const getPatientFormDefaults = (patient) => ({
  firstName: patient?.firstName || '',
  lastName: patient?.lastName || '',
  gender: patient?.gender || '',
  phone: patient?.phone || '',
  email: patient?.email || '',
});

const passwordFormDefaults = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [blocking, setBlocking] = useState(null);
  const [endingTherapy, setEndingTherapy] = useState(null);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const photoInputRef = useRef(null);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: getPatientFormDefaults(user),
  });
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm({ defaultValues: passwordFormDefaults });

  const load = async () => {
    try {
      const res = await psychologistRequestService.getMyRequests();
      setRequests(res.data || []);
    } catch {
      toast.error('No se pudieron cargar tus solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    reset(getPatientFormDefaults(user));
  }, [reset, user]);

  const openProfileEditor = () => {
    reset(getPatientFormDefaults(user));
    setEditingProfile(true);
  };

  const closeProfileEditor = () => {
    reset(getPatientFormDefaults(user));
    setEditingProfile(false);
  };

  const closePasswordEditor = () => {
    resetPassword(passwordFormDefaults);
    setEditingPassword(false);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const res = await patientAuthService.uploadProfileImage(file);
      const nextImage = res.data?.profileImage || '';
      updateUser({ profileImage: nextImage });
      toast.success('Foto de perfil actualizada');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo subir la foto de perfil');
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleProfileSubmit = async (data) => {
    const confirmed = window.confirm(
      'Antes de guardar, verificá que los datos modificados sean correctos. ¿Querés actualizar tu perfil?'
    );
    if (!confirmed) return;

    setSavingProfile(true);
    try {
      const payload = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        gender: data.gender || null,
        phone: normalizePhoneNumber(data.phone) || null,
        email: data.email.trim(),
      };

      const res = await patientAuthService.updateProfile(payload);
      const updatedPatient = res.data?.patient || payload;
      updateUser(updatedPatient);
      reset(getPatientFormDefaults(updatedPatient));
      setEditingProfile(false);
      toast.success('Datos del perfil actualizados correctamente');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudieron actualizar tus datos');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (data) => {
    setSavingPassword(true);
    try {
      await patientAuthService.updateProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        phone: user.phone || null,
        email: user.email,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      resetPassword(passwordFormDefaults);
      setEditingPassword(false);
      toast.success('Contraseña actualizada correctamente');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo actualizar la contraseña');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('¿Cancelar esta solicitud?')) return;
    setCancelling(id);
    try {
      await psychologistRequestService.cancel(id);
      toast.success('Solicitud cancelada');
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al cancelar');
    } finally {
      setCancelling(null);
    }
  };

  const handleBlock = async (request) => {
    const p = request.psychologist;
    const psyName = p?.displayName || `${p?.firstName || ''} ${p?.lastName || ''}`.trim() || 'este psicólogo';
    if (!window.confirm(`¿Bloquear a ${psyName}? Ya no vas a poder ver sus datos de contacto.`)) return;
    setBlocking(request.id);
    try {
      const res = await psychologistRequestService.blockRelationship(request.id);
      const nextRequest = res.data?.request || {
        ...request,
        message: null,
        blockInfo: res.data?.blockInfo,
        psychologist: {
          id: p?.id,
          firstName: p?.firstName,
          lastName: p?.lastName,
          displayName: p?.displayName,
        },
      };
      setRequests((prev) => prev.map((r) => (r.id === request.id ? nextRequest : r)));
      toast.success('Usuario bloqueado');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al bloquear');
    } finally {
      setBlocking(null);
    }
  };

  const handleUnblock = async (request) => {
    const p = request.psychologist;
    const psyName = p?.displayName || `${p?.firstName || ''} ${p?.lastName || ''}`.trim() || 'este psicólogo';
    if (!window.confirm(`¿Desbloquear a ${psyName}?`)) return;
    setBlocking(request.id);
    try {
      const res = await psychologistRequestService.unblockRelationship(request.id);
      setRequests((prev) => prev.map((r) => (r.id === request.id ? res.data?.request || { ...r, blockInfo: null } : r)));
      toast.success('Usuario desbloqueado');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al desbloquear');
    } finally {
      setBlocking(null);
    }
  };

  const handleRequestTherapyEnd = async (request) => {
    const p = request.psychologist;
    const psyName = p?.displayName || `${p?.firstName || ''} ${p?.lastName || ''}`.trim() || 'este psicólogo';
    if (!window.confirm(`¿Enviar al profesional el pedido para finalizar la terapia con ${psyName}?`)) return;
    setEndingTherapy(request.id);
    try {
      const res = await psychologistRequestService.requestTermination(request.id);
      setRequests((prev) => prev.map((r) => (r.id === request.id ? res.data?.request || r : r)));
      toast.success('Pedido enviado al profesional');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al pedir la finalización');
    } finally {
      setEndingTherapy(null);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('¿Seguro que querés borrar tu perfil? Esta acción elimina la cuenta definitivamente.');
    if (!confirmed) return;

    setDeletingAccount(true);
    try {
      await patientAuthService.deleteAccount();
      logout();
      toast.success('Perfil borrado');
      navigate('/psicologos');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo borrar el perfil');
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return <div className="psico-loading psico-page-loading">Cargando tus solicitudes...</div>;
  }

  const name = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
  const patientPhoto = user?.profileImage ? toAssetUrl(user.profileImage) : null;
  const patientInitials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="psico-dashboard-page">
      <div className="psico-dashboard-container">
        <div className="psico-dashboard-header">
          <div
            className="psico-dashboard-photo psico-photo-upload-wrapper"
            style={{ width: 64, height: 64, margin: '0 auto 0.5rem' }}
            onClick={() => !uploadingPhoto && photoInputRef.current?.click()}
            title="Cambiar foto de perfil"
          >
            {patientPhoto ? (
              <img src={patientPhoto} alt={name} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            ) : null}
            <div className="psico-card-initials" style={patientPhoto ? { display: 'none' } : {}}>{patientInitials || 'PA'}</div>
            <div className="psico-photo-upload-overlay">
              {uploadingPhoto ? <span className="psico-photo-uploading-dot" /> : <Camera size={14} />}
            </div>
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
          <h1>Mi cuenta</h1>
          {name && <p className="psico-login-subtitle">Hola, {name}</p>}
          <button
            type="button"
            className="psico-btn-secondary psico-edit-profile-btn"
            onClick={openProfileEditor}
          >
            <Edit3 size={16} /> Editar datos
          </button>
          <button
            type="button"
            className="psico-btn-secondary psico-edit-profile-btn"
            onClick={() => {
              resetPassword(passwordFormDefaults);
              setEditingPassword(true);
            }}
          >
            <Lock size={16} /> Cambiar contraseña
          </button>
        </div>

        {editingProfile && (
          <div className="psico-dashboard-card psico-patient-profile-editor">
            <div className="psico-dashboard-card-header">
              <h2>Editar datos</h2>
              <button
                type="button"
                className="psico-icon-btn"
                onClick={closeProfileEditor}
                title="Cerrar edición"
                aria-label="Cerrar edición"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleProfileSubmit)} noValidate autoComplete="off" className="psico-patient-edit-form">
              <div className="psico-form-grid">
                <div className="psico-login-field">
                  <label htmlFor="patient-edit-firstName">
                    <User size={14} /> Nombre
                  </label>
                  <input
                    id="patient-edit-firstName"
                    type="text"
                    autoComplete="given-name"
                    {...register('firstName', { required: 'El nombre es obligatorio' })}
                  />
                  {errors.firstName && <span className="psico-login-error">{errors.firstName.message}</span>}
                </div>

                <div className="psico-login-field">
                  <label htmlFor="patient-edit-lastName">
                    <User size={14} /> Apellido
                  </label>
                  <input
                    id="patient-edit-lastName"
                    type="text"
                    autoComplete="family-name"
                    {...register('lastName', { required: 'El apellido es obligatorio' })}
                  />
                  {errors.lastName && <span className="psico-login-error">{errors.lastName.message}</span>}
                </div>

                <div className="psico-login-field">
                  <label htmlFor="patient-edit-gender">
                    <Users size={14} /> Género
                  </label>
                  <select
                    id="patient-edit-gender"
                    className="psico-form-select"
                    {...register('gender', { required: 'El género es obligatorio' })}
                  >
                    <option value="">Seleccioná una opción</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {errors.gender && <span className="psico-login-error">{errors.gender.message}</span>}
                </div>

                <div className="psico-login-field">
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      validate: (value) => getPhoneValidationMessage(value) || true,
                    }}
                    render={({ field }) => (
                      <PhoneNumberInput
                        id="patient-edit-phone"
                        label={<><Phone size={14} /> WhatsApp</>}
                        value={field.value || ''}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.phone?.message}
                      />
                    )}
                  />
                </div>

                <div className="psico-login-field psico-form-grid-full">
                  <label htmlFor="patient-edit-email">
                    <Mail size={14} /> Email
                  </label>
                  <input
                    id="patient-edit-email"
                    type="email"
                    autoComplete="email"
                    {...register('email', {
                      required: 'El email es obligatorio',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' },
                    })}
                  />
                  {errors.email && <span className="psico-login-error">{errors.email.message}</span>}
                </div>

              </div>

              <div className="psico-form-actions">
                <button
                  type="button"
                  className="psico-btn-secondary"
                  onClick={closeProfileEditor}
                  disabled={savingProfile}
                >
                  <X size={16} /> Cancelar
                </button>
                <button
                  type="submit"
                  className="psico-btn-primary"
                  disabled={savingProfile}
                >
                  <Save size={16} /> {savingProfile ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        )}

        {editingPassword && (
          <div className="psico-dashboard-card psico-patient-profile-editor">
            <div className="psico-dashboard-card-header">
              <div>
                <h2>Cambiar contraseña</h2>
                <p className="psico-secondary-text">Este paso está separado de la edición de datos para evitar avisos innecesarios del navegador.</p>
              </div>
              <button type="button" className="psico-icon-btn" onClick={closePasswordEditor} title="Cerrar" aria-label="Cerrar cambio de contraseña">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit(handlePasswordChange)} className="psico-patient-edit-form">
              <div className="psico-form-grid">
                <div className="psico-login-field">
                  <label htmlFor="patient-password-current"><Lock size={14} /> Contraseña actual</label>
                  <PasswordInput
                    id="patient-password-current"
                    autoComplete="current-password"
                    {...registerPassword('currentPassword', { required: 'Ingresá tu contraseña actual' })}
                  />
                  {passwordErrors.currentPassword && <span className="psico-login-error">{passwordErrors.currentPassword.message}</span>}
                </div>
                <div className="psico-login-field">
                  <label htmlFor="patient-password-new"><Lock size={14} /> Nueva contraseña</label>
                  <PasswordInput
                    id="patient-password-new"
                    autoComplete="new-password"
                    {...registerPassword('newPassword', {
                      required: 'Ingresá una nueva contraseña',
                      minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                    })}
                  />
                  {passwordErrors.newPassword && <span className="psico-login-error">{passwordErrors.newPassword.message}</span>}
                </div>
                <div className="psico-login-field psico-form-grid-full">
                  <label htmlFor="patient-password-confirm"><Lock size={14} /> Confirmar nueva contraseña</label>
                  <PasswordInput
                    id="patient-password-confirm"
                    autoComplete="new-password"
                    {...registerPassword('confirmPassword', {
                      required: 'Repetí la nueva contraseña',
                      validate: (value) => value === watchPassword('newPassword') || 'Las contraseñas no coinciden',
                    })}
                  />
                  {passwordErrors.confirmPassword && <span className="psico-login-error">{passwordErrors.confirmPassword.message}</span>}
                </div>
              </div>
              <div className="psico-form-actions">
                <button type="button" className="psico-btn-secondary" onClick={closePasswordEditor} disabled={savingPassword}><X size={16} /> Cancelar</button>
                <button type="submit" className="psico-btn-primary" disabled={savingPassword}><Save size={16} /> {savingPassword ? 'Guardando...' : 'Guardar contraseña'}</button>
              </div>
            </form>
          </div>
        )}

        <div className="psico-dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="psico-dashboard-card">
            <div className="psico-dashboard-card-header">
              <h2>Mis solicitudes a psicólogos</h2>
              <Link to="/psicologos/buscar" className="psico-btn-primary psico-btn-sm">
                Buscar psicólogo
              </Link>
            </div>

            {requests.length === 0 ? (
              <div className="psico-dashboard-sub-empty">
                <p>Todavía no enviaste ninguna solicitud.</p>
                <Link to="/psicologos/buscar" className="psico-btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                  Ver psicólogos disponibles
                </Link>
              </div>
            ) : (
              <ul className="patient-requests-list">
                {requests.map((req) => {
                  const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = cfg.icon;
                  const p = req.psychologist;
                  const psyName = p?.displayName || `${p?.firstName || ''} ${p?.lastName || ''}`.trim();
                  const photo = p?.profileImage ? toAssetUrl(p.profileImage) : null;
                  const initials = `${p?.firstName?.[0] || ''}${p?.lastName?.[0] || ''}`.toUpperCase();
                  const blockInfo = req.blockInfo;
                  const professionalUnavailable = Boolean(req.professionalUnavailable || (p?.status && p.status !== 'ACTIVE'));
                  const hasTerminationRequest = Boolean(req.terminationRequestedAt && !req.terminationAcceptedAt);
                  const terminationAccepted = Boolean(req.terminationAcceptedAt);

                  return (
                    <li key={req.id} className={`patient-request-item ${blockInfo ? 'patient-request-item-blocked' : ''}`}>
                      <div className="patient-request-psy">
                        <div className="psico-card-photo psico-card-photo-sm">
                          {photo ? (
                            <img src={photo} alt={psyName} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                          ) : null}
                          <div className="psico-card-initials" style={photo ? { display: 'none' } : {}}>{initials}</div>
                        </div>
                        <div>
                          <strong>{psyName}</strong>
                          {p?.specialties?.length > 0 && (
                            <p className="psico-secondary-text">{p.specialties[0]}</p>
                          )}
                          {blockInfo ? (
                            <p className="psico-blocked-text">{blockInfo.message}</p>
                          ) : professionalUnavailable ? (
                            <p className="psico-unavailable-text">
                              {req.professionalUnavailableMessage || (p?.status === 'SUSPENDED' ? PROFESSIONAL_SUSPENDED_MESSAGE : PROFESSIONAL_PENDING_MESSAGE)}
                            </p>
                          ) : (
                            <Link to={`/psicologos/${p?.id}`} className="psico-link-subtle">
                              Ver perfil →
                            </Link>
                          )}
                          {hasTerminationRequest && (
                            <p className="psico-request-message psico-request-message--termination">
                              "{TERMINATION_MESSAGE}"
                            </p>
                          )}
                          {terminationAccepted && (
                            <p className="psico-secondary-text">El profesional aceptó la finalización de la terapia.</p>
                          )}
                        </div>
                      </div>

                      <div className="patient-request-status">
                        {!(req.status === 'REJECTED' && req.canReapply) && (
                          <span className={`psico-status-badge psico-status-${cfg.color} ${cfg.className || ''}`}>
                            <StatusIcon size={13} /> {cfg.label}
                          </span>
                        )}
                        {req.status === 'REJECTED' && req.canReapply && !blockInfo && (
                          <Link to={`/psicologos/${p?.id}`} className="psico-btn-primary psico-btn-sm">
                            Volver a solicitar
                          </Link>
                        )}
                        {blockInfo && (
                          <>
                            <span className="psico-status-badge psico-status-red">
                              <Ban size={13} /> Bloqueado
                            </span>
                            {blockInfo.blockedByMe && (
                              <button
                                className="psico-btn-unblock-sm"
                                onClick={() => handleUnblock(req)}
                                disabled={blocking === req.id}
                              >
                                <Unlock size={14} /> {blocking === req.id ? 'Desbloqueando...' : 'Desbloquear'}
                              </button>
                            )}
                          </>
                        )}
                        {professionalUnavailable && !blockInfo && (
                          <span className="psico-status-badge psico-status-orange">
                            <Clock size={13} /> No disponible
                          </span>
                        )}
                        <span className="psico-secondary-text psico-date-text">
                          {new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(req.createdAt))}
                        </span>
                      </div>

                      {req.status === 'ACCEPTED' && !blockInfo && !professionalUnavailable && (
                        <div className="patient-request-contact">
                          {p?.phone && (
                            <a
                              href={`https://wa.me/${p.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="psico-btn-whatsapp"
                            >
                              <MessageCircle size={14} /> WhatsApp
                            </a>
                          )}
                          {p?.contactEmail && (
                            <a href={mailtoHref(p.contactEmail)} className="psico-btn-email" target="_self">
                              <Mail size={14} /> {p.contactEmail}
                            </a>
                          )}
                        </div>
                      )}

                      {req.status === 'ACCEPTED' && !blockInfo && !professionalUnavailable && (
                        <button
                          className="psico-btn-danger-sm"
                          onClick={() => handleBlock(req)}
                          disabled={blocking === req.id}
                          title="Bloquear usuario"
                        >
                          <Ban size={14} />
                          {blocking === req.id ? 'Bloqueando...' : 'Bloquear'}
                        </button>
                      )}

                      {req.status === 'ACCEPTED' && !blockInfo && !professionalUnavailable && !terminationAccepted && (
                        <div className="psico-therapy-end">
                          <button
                            className="psico-btn-therapy-end"
                            onClick={() => handleRequestTherapyEnd(req)}
                            disabled={endingTherapy === req.id || hasTerminationRequest}
                          >
                            {hasTerminationRequest ? 'Finalización solicitada' : 'El usuario finaliza la terapia'}
                          </button>
                        </div>
                      )}

                      {req.status === 'PENDING' && !blockInfo && (
                        <button
                          className="psico-btn-danger-sm"
                          onClick={() => handleCancel(req.id)}
                          disabled={cancelling === req.id}
                          title="Cancelar solicitud"
                        >
                          <Trash2 size={14} />
                          {cancelling === req.id ? 'Cancelando...' : 'Cancelar'}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <button
          type="button"
          className="psico-delete-profile-btn"
          onClick={handleDeleteAccount}
          disabled={deletingAccount}
        >
          {deletingAccount ? 'Borrando perfil...' : 'Borrar perfil'}
        </button>
      </div>
    </div>
  );
}
