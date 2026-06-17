import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, FileText, CreditCard, CheckCircle, Clock, XCircle, Edit, Users, Check, X, Ban, Camera, Mail, MessageCircle, Unlock, Eye, PauseCircle, PlayCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { psychologistService } from '../../services';
import { BACKEND_BASE_URL } from '../../services/apiBaseUrl';
import { useAuthStore } from '../../context/authStore';
import './Psicologos.css';

const toAssetUrl = (p) => {
  if (!p) return null;
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return `${BACKEND_BASE_URL}${p}`;
};

const STATUS_LABELS = {
  PENDING_DOCS: { label: 'Pendiente de documentación', icon: FileText, color: 'orange' },
  PENDING: { label: 'En espera de aprobación', icon: Clock, color: 'orange' },
  APPROVED: { label: 'Aprobado - Elegí tu plan para activarte', icon: CheckCircle, color: 'blue' },
  REJECTED: { label: 'Estamos considerando su registro. Disculpe las molestias.', icon: XCircle, color: 'red' },
  ACTIVE: { label: 'Activo - Visible para pacientes', icon: CheckCircle, color: 'green' },
  SUSPENDED: { label: 'Consultas suspendidas momentáneamente', icon: PauseCircle, color: 'orange' },
};

const PLAN_LABELS = {
  MONTHLY: 'Plan 3 meses',
  QUARTERLY: 'Plan 7 meses',
  ANNUAL: 'Plan 12 + 1',
  TRIAL: 'Prueba 2 meses',
};

const TERMINATION_MESSAGE = 'El usuario ha decidido finalizar la terapia por razones personales';
const ACCEPT_CONTACT_NOTICE = 'Al aceptar esta consulta el paciente verá su WhatsApp e email de contacto';

const formatList = (items) => (Array.isArray(items) && items.length > 0 ? items.join(', ') : '-');

const getAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age -= 1;
  return age;
};

export default function PsychologistDashboard() {
  const { updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [pendingSubscription, setPendingSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [updatingRequest, setUpdatingRequest] = useState(null);
  const [blockingRequest, setBlockingRequest] = useState(null);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const [expandedPatientRequest, setExpandedPatientRequest] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, subRes] = await Promise.allSettled([
          psychologistService.getProfile(),
          psychologistService.getSubscription(),
        ]);

        if (profileRes.status === 'fulfilled') {
          setProfile(profileRes.value.data);
          updateUser(profileRes.value.data);
        }
        if (subRes.status === 'fulfilled') {
          setSubscription(subRes.value.data?.hasActiveSubscription ? subRes.value.data.subscription : null);
          setPendingSubscription(subRes.value.data?.hasPendingSubscription ? subRes.value.data.pendingSubscription : null);
        }
        if (profileRes.status === 'rejected') {
          toast.error('No se pudo cargar el perfil del psicólogo');
        }
      } catch {
        toast.error('No se pudo cargar el panel');
      } finally {
        setLoading(false);
      }
    };
    load();

    // Load incoming hiring requests
    const loadRequests = async () => {
      setRequestsLoading(true);
      try {
        const res = await psychologistService.getIncomingRequests();
        setIncomingRequests(res.data || []);
      } catch {
        // silently ignore
      } finally {
        setRequestsLoading(false);
      }
    };
    loadRequests();
  }, []);

  if (loading) {
    return <div className="psico-loading psico-page-loading">Cargando panel...</div>;
  }

  const p = profile;
  const name = `${p?.firstName || ''} ${p?.lastName || ''}`.trim();
  const visibleCountry = p?.country || (p?.registrationType === 'ARGENTINA' ? 'Argentina' : '');
  const visibleProvince = p?.practiceProvince || p?.licenseProvince || p?.region;
  const visibleTitle = p?.universityDegree || p?.degreeInstitution;
  const visibleAge = getAge(p?.dateOfBirth);
  const photo = toAssetUrl(p?.profileImage);
  const initials = `${p?.firstName?.[0] || ''}${p?.lastName?.[0] || ''}`.toUpperCase();
  const statusInfo = STATUS_LABELS[p?.status] || STATUS_LABELS.PENDING;
  const StatusIcon = statusInfo.icon;
  const isRejected = p?.status === 'REJECTED';
  const canViewPatientListing = p?.status === 'ACTIVE' && Boolean(subscription);
  const patientListingParams = new URLSearchParams();
  if (name) patientListingParams.set('search', name);
  if (p?.id) patientListingParams.set('highlight', p.id);
  const patientListingQuery = patientListingParams.toString();
  const patientListingUrl = patientListingQuery
    ? `/psicologos/buscar?${patientListingQuery}`
    : '/psicologos/buscar';

  const formatDate = (d) =>
    d ? new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(d)) : '-';

  const formatTime = (d) =>
    d
      ? new Intl.DateTimeFormat('es-AR', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).format(new Date(d))
      : '';

  const handlePatientListingClick = (event) => {
    if (canViewPatientListing) return;
    event.preventDefault();
    if (p?.status === 'SUSPENDED') {
      toast.error('Tu perfil está suspendido y no aparece en el listado.');
      return;
    }
    if (!subscription) {
      toast.error('Todavía no figurás en el listado porque no tenés una suscripción activa.');
      return;
    }
    toast.error('Todavía no figurás en el listado porque tu cuenta no está activa.');
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const res = await psychologistService.uploadProfileImage(file);
      const nextImage = res.data?.profileImage || '';
      setProfile((prev) => ({ ...prev, profileImage: nextImage }));
      updateUser({ profileImage: nextImage });
      toast.success('Foto de perfil actualizada');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo subir la foto de perfil');
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleRequestStatus = async (requestId, status) => {
    if (status === 'ACCEPTED' && !window.confirm(ACCEPT_CONTACT_NOTICE)) return;
    setUpdatingRequest(requestId);
    try {
      const res = await psychologistService.updateRequestStatus(requestId, status);
      setIncomingRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, ...res.data?.request, status } : r)),
      );
      toast.success(status === 'ACCEPTED' ? 'Solicitud aceptada. El paciente verá tus datos de contacto.' : 'Solicitud rechazada');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al actualizar la solicitud');
    } finally {
      setUpdatingRequest(null);
    }
  };

  const handleAvailabilityChange = async (isAvailable) => {
    const message = isAvailable
      ? '¿Reactivar el servicio de consultas y volver a aparecer en el listado de pacientes?'
      : '¿Suspender momentáneamente el servicio de consultas? Los pacientes verán que no estás disponible.';
    if (!window.confirm(message)) return;

    setUpdatingAvailability(true);
    try {
      const res = await psychologistService.updateAvailability(isAvailable);
      const updated = res.data?.psychologist;
      if (updated) {
        setProfile(updated);
        updateUser(updated);
      } else {
        setProfile((prev) => ({ ...prev, status: isAvailable ? 'ACTIVE' : 'SUSPENDED' }));
        updateUser({ status: isAvailable ? 'ACTIVE' : 'SUSPENDED' });
      }
      toast.success(isAvailable ? 'Servicio de consultas reactivado' : 'Servicio de consultas suspendido');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo actualizar la disponibilidad');
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.id) return;
    if (!window.confirm('¿Cancelar la suscripción activa? Tu perfil dejará de aparecer en el listado.')) return;

    setCancellingSubscription(true);
    try {
      await psychologistService.cancelSubscription(subscription.id);
      setSubscription(null);
      setProfile((prev) => ({ ...prev, status: 'APPROVED' }));
      updateUser({ status: 'APPROVED' });
      toast.success('Suscripción cancelada');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo cancelar la suscripción');
    } finally {
      setCancellingSubscription(false);
    }
  };

  const handleBlock = async (request) => {
    const patient = request.patient;
    const patientName = `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim() || 'este paciente';
    if (!window.confirm(`¿Bloquear a ${patientName}? Ya no vas a poder ver sus datos.`)) return;
    setBlockingRequest(request.id);
    try {
      const res = await psychologistService.blockRelationship(request.id);
      const nextRequest = res.data?.request || {
        ...request,
        message: null,
        blockInfo: res.data?.blockInfo,
        patient: {
          id: patient?.id,
          firstName: patient?.firstName,
          lastName: patient?.lastName,
        },
      };
      setIncomingRequests((prev) => prev.map((r) => (r.id === request.id ? nextRequest : r)));
      toast.success('Usuario bloqueado');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al bloquear');
    } finally {
      setBlockingRequest(null);
    }
  };

  const handleUnblock = async (request) => {
    const patient = request.patient;
    const patientName = `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim() || 'este paciente';
    if (!window.confirm(`¿Desbloquear a ${patientName}?`)) return;
    setBlockingRequest(request.id);
    try {
      const res = await psychologistService.unblockRelationship(request.id);
      setIncomingRequests((prev) => prev.map((r) => (r.id === request.id ? res.data?.request || { ...r, blockInfo: null } : r)));
      toast.success('Usuario desbloqueado');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al desbloquear');
    } finally {
      setBlockingRequest(null);
    }
  };

  const handleAcceptTermination = async (request) => {
    const patient = request.patient;
    const patientName = `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim() || 'este paciente';
    if (!window.confirm(`¿Aceptar la finalización de terapia solicitada por ${patientName}?`)) return;
    setUpdatingRequest(request.id);
    try {
      const res = await psychologistService.acceptTermination(request.id);
      setIncomingRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, ...res.data?.request } : r)));
      toast.success('Finalización de terapia aceptada');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al aceptar la finalización');
    } finally {
      setUpdatingRequest(null);
    }
  };

  const pendingRequests = incomingRequests.filter((r) => r.status === 'PENDING');
  const resolvedRequests = incomingRequests.filter((r) => r.status !== 'PENDING');

  return (
    <div className="psico-dashboard-page">
      <div className="psico-dashboard-container">
        <h1>Mi panel de psicólogo</h1>

        {isRejected ? (
          <div className="psico-rejection-thread">
            <div className="psico-rejection-bubble">
              <p className="psico-rejection-bubble-text">{statusInfo.label}</p>
              <div className="psico-rejection-bubble-meta">
                <span>{formatTime(p?.updatedAt) || ' '}</span>
              </div>
            </div>
            {p?.rejectionReason && (
              <p className="psico-rejection-reason">Motivo: {p.rejectionReason}</p>
            )}
          </div>
        ) : (
          <div className={`psico-status-banner psico-status-${statusInfo.color}`}>
            <StatusIcon size={20} />
            <span>{statusInfo.label}</span>
            {p?.status === 'APPROVED' && (
              <Link to="/psicologo/plan" className="psico-btn-primary psico-btn-sm">
                Elegir plan →
              </Link>
            )}
          </div>
        )}

        <div className="psico-dashboard-layout">
          {/* ── Perfil — fila completa ── */}
          <div className="psico-dashboard-card psico-dashboard-card--profile">
            <div className="psico-dashboard-card-header">
              <User size={18} />
              <h2>Mi perfil</h2>
              <Link to="/psicologo/perfil" className="psico-icon-btn" title="Editar perfil">
                <Edit size={16} />
              </Link>
            </div>
            <div className="psico-dashboard-profile">
              <div className="psico-dashboard-profile-left">
                <div className="psico-dashboard-photo psico-photo-upload-wrapper" onClick={() => !uploadingPhoto && photoInputRef.current?.click()} title="Cambiar foto de perfil">
                  {photo ? (
                    <img src={photo} alt={name} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                  ) : null}
                  <div className="psico-card-initials" style={photo ? { display: 'none' } : {}}>{initials}</div>
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
                <div className="psico-dashboard-profile-identity">
                  <h3>{name}</h3>
                  <p>{p?.email}</p>
                  {p?.specialties?.length > 0 && (
                    <div className="psico-tags psico-tags-sm">
                      {p.specialties.slice(0, 2).map((s) => (
                        <span key={s} className="psico-tag">{s}</span>
                      ))}
                      {p.specialties.length > 2 && <span className="psico-tag">+{p.specialties.length - 2}</span>}
                    </div>
                  )}
                </div>
                <p className="psico-independent-notice psico-independent-notice--sm">
                  <strong>El profesional actúa de manera independiente.<br />
                  La plataforma no interviene en sesiones, pagos ni resultados del servicio.</strong>
                </p>
              </div>
              <div className="psico-dashboard-profile-fields">
                <div className="psico-profile-visible-summary">
                  <p><strong>Matrícula:</strong> {p?.licenseNumber || '-'}</p>
                  <p><strong>País:</strong> {visibleCountry || '-'}</p>
                  <p><strong>Provincia/Región:</strong> {visibleProvince || '-'}</p>
                  <p><strong>Edad:</strong> {visibleAge ? `${visibleAge} años` : '-'}</p>
                  <p><strong>Género:</strong> {p?.gender || '-'}</p>
                  <p><strong>Idiomas:</strong> {formatList(p?.languages)}</p>
                  <p><strong>Experiencia:</strong> {p?.yearsExperience != null ? `${p.yearsExperience} ${p.yearsExperience === 1 ? 'año' : 'años'}` : '-'}</p>
                  <p><strong>Modalidad:</strong> {p?.remoteModality || '-'}</p>
                  <p><strong>Costo final por sesión:</strong> {p?.sessionCost || '-'}</p>
                  <p><strong>Tiempo de sesión / promoción:</strong> {p?.sessionDuration || '-'}</p>
                  <p><strong>Título profesional:</strong> {visibleTitle || '-'}</p>
                  <p><strong>Edad:</strong> {formatList(p?.ageRanges)}</p>
                  <p><strong>Especialidades:</strong> {formatList(p?.specialties)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Suscripción + Acciones rápidas — fila secundaria ── */}
          <div className="psico-dashboard-secondary-row">
            <div className="psico-dashboard-card">
              <div className="psico-dashboard-card-header">
                <CreditCard size={18} />
                <h2>Suscripción</h2>
              </div>
              {subscription ? (
                <div className="psico-dashboard-sub">
                  <p><strong>Plan:</strong> {PLAN_LABELS[subscription.plan] || subscription.plan}</p>
                  <p><strong>Estado:</strong> {subscription.status}</p>
                  <p><strong>Válido hasta:</strong> {formatDate(subscription.endDate)}</p>
                  <Link to="/psicologo/plan" className="psico-btn-primary psico-dashboard-sub-action">
                    Cambiar plan
                  </Link>
                  <button
                    type="button"
                    className="psico-btn-secondary psico-dashboard-sub-action"
                    onClick={handleCancelSubscription}
                    disabled={cancellingSubscription}
                  >
                    {cancellingSubscription ? 'Cancelando...' : 'Cancelar suscripción'}
                  </button>
                </div>
              ) : pendingSubscription ? (
                <div className="psico-dashboard-sub-empty">
                  <p><strong>Pago pendiente:</strong> {PLAN_LABELS[pendingSubscription.plan] || pendingSubscription.plan}</p>
                  <p>Tu perfil se activará cuando Mercado Pago confirme la suscripción.</p>
                </div>
              ) : (
                <div className="psico-dashboard-sub-empty">
                  <p>Sin suscripción activa.</p>
                  {p?.status === 'APPROVED' && (
                    <Link to="/psicologo/plan" className="psico-btn-primary">
                      Elegir plan
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="psico-dashboard-card">
              <div className="psico-dashboard-card-header">
                <h2>Acciones rápidas</h2>
              </div>
              <ul className="psico-quick-actions">
                <li><Link to="/psicologo/perfil">Editar perfil</Link></li>
                <li><Link to="/psicologo/documentos">Ver / subir documentos</Link></li>
                {p?.status === 'APPROVED' && !subscription && <li><Link to="/psicologo/plan">Elegir plan</Link></li>}
                {subscription && <li><Link to="/psicologo/plan">Cambiar plan</Link></li>}
                <li><Link to={patientListingUrl} onClick={handlePatientListingClick}>Ver cómo aparezco en el listado del paciente</Link></li>
                {p?.status === 'ACTIVE' && (
                  <li>
                    <button
                      type="button"
                      className="psico-link-button psico-suspend-service-button"
                      onClick={() => handleAvailabilityChange(false)}
                      disabled={updatingAvailability}
                    >
                      <PauseCircle size={14} /> {updatingAvailability ? 'Suspendiendo...' : 'Suspender Servicio'}
                    </button>
                  </li>
                )}
                {p?.status === 'SUSPENDED' && (
                  <li>
                    <button
                      type="button"
                      className="psico-link-button"
                      onClick={() => handleAvailabilityChange(true)}
                      disabled={updatingAvailability}
                    >
                      <PlayCircle size={14} /> {updatingAvailability ? 'Reactivando...' : 'Reactivar consultas'}
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Incoming Hiring Requests ── */}
        <div className="psico-dashboard-card psico-dashboard-requests-card">
          <div className="psico-dashboard-card-header">
            <Users size={18} />
            <h2>Historial de solicitudes de pacientes</h2>
            {pendingRequests.length > 0 && (
              <span className="psico-badge-count">{pendingRequests.length} pendiente{pendingRequests.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {requestsLoading ? (
            <p className="psico-secondary-text">Cargando solicitudes...</p>
          ) : incomingRequests.length === 0 ? (
            <p className="psico-secondary-text">Aún no recibiste solicitudes de consulta.</p>
          ) : (
            <>
              {pendingRequests.length > 0 && (
                <div className="psico-requests-group">
                  <h3 className="psico-requests-group-title">Pendientes</h3>
                  <ul className="patient-requests-list">
                    {pendingRequests.map((req) => {
                      const patient = req.patient;
                      const patientName = `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim();
                      const patientPhoto = patient?.profileImage ? toAssetUrl(patient.profileImage) : null;
                      const blockInfo = req.blockInfo;
                      const isPatientProfileOpen = expandedPatientRequest === req.id;
                      const patientWhatsappUrl = patient?.phone ? `https://wa.me/${patient.phone.replace(/\D/g, '')}` : null;
                      return (
                        <li key={req.id} className={`patient-request-item ${blockInfo ? 'patient-request-item-blocked' : ''}`}>
                          <div className="patient-request-psy">
                            <div className="psico-card-photo psico-card-photo-sm">
                              {patientPhoto ? (
                                <img src={patientPhoto} alt={patientName} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                              ) : null}
                              <div className="psico-card-initials" style={patientPhoto ? { display: 'none' } : {}}>
                                {`${patient?.firstName?.[0] || ''}${patient?.lastName?.[0] || ''}`.toUpperCase()}
                              </div>
                            </div>
                            <div>
                              <strong>{patientName}</strong>
                              {!blockInfo && <p className="psico-secondary-text">{patient?.email}</p>}
                              {req.message && (
                                <p className="psico-request-message">"{req.message}"</p>
                              )}
                              {blockInfo && (
                                <p className="psico-blocked-text">{blockInfo.message}</p>
                              )}
                              <span className="psico-secondary-text psico-date-text">
                                {formatDate(req.createdAt)}
                              </span>
                              {!blockInfo && (
                                <>
                                  <button
                                    type="button"
                                    className="psico-link-button psico-link-button-inline"
                                    onClick={() => setExpandedPatientRequest((current) => (current === req.id ? null : req.id))}
                                  >
                                    <Eye size={14} /> {isPatientProfileOpen ? 'Ocultar perfil del paciente' : 'Ver perfil del paciente'}
                                  </button>
                                  {isPatientProfileOpen && (
                                    <div className="psico-patient-profile-preview">
                                      <p>
                                        <strong>Email:</strong>{' '}
                                        {patient?.email ? (
                                          <a href={`mailto:${patient.email}`} className="psico-link-subtle">
                                            {patient.email}
                                          </a>
                                        ) : '-'}
                                      </p>
                                      <p><strong>WhatsApp:</strong> {patient?.phone || '-'}</p>
                                      <p><strong>Género:</strong> {patient?.gender || '-'}</p>
                                      <p><strong>Paciente desde:</strong> {formatDate(patient?.createdAt)}</p>
                                      {patientWhatsappUrl && (
                                        <a href={patientWhatsappUrl} target="_blank" rel="noopener noreferrer" className="psico-btn-whatsapp">
                                          <MessageCircle size={14} /> WhatsApp
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <div className="psico-request-actions">
                            <button
                              className="psico-btn-accept"
                              onClick={() => handleRequestStatus(req.id, 'ACCEPTED')}
                              disabled={updatingRequest === req.id}
                            >
                              <Check size={14} /> {ACCEPT_CONTACT_NOTICE}
                            </button>
                            <button
                              className="psico-btn-danger-sm"
                              onClick={() => handleRequestStatus(req.id, 'REJECTED')}
                              disabled={updatingRequest === req.id}
                            >
                              <X size={14} /> Rechazar
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {resolvedRequests.length > 0 && (
                <div className="psico-requests-group">
                  <h3 className="psico-requests-group-title">Historial</h3>
                  <ul className="patient-requests-list">
                    {resolvedRequests.map((req) => {
                      const patient = req.patient;
                      const patientName = `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim();
                      const isAccepted = req.status === 'ACCEPTED';
                      const blockInfo = req.blockInfo;
                      const hasTerminationRequest = Boolean(req.terminationRequestedAt && !req.terminationAcceptedAt);
                      const terminationAccepted = Boolean(req.terminationAcceptedAt);
                      const patientPhone = patient?.phone;
                      const patientWhatsappUrl = patientPhone ? `https://wa.me/${patientPhone.replace(/\D/g, '')}` : null;
                      return (
                        <li key={req.id} className={`patient-request-item ${blockInfo ? 'patient-request-item-blocked' : ''}`}>
                          <div className="patient-request-psy">
                            <div className="psico-card-photo psico-card-photo-sm">
                              <div className="psico-card-initials">
                                {`${patient?.firstName?.[0] || ''}${patient?.lastName?.[0] || ''}`.toUpperCase()}
                              </div>
                            </div>
                            <div>
                              <strong>{patientName}</strong>
                              {!blockInfo && <p className="psico-secondary-text">{patient?.email}</p>}
                              {isAccepted && !blockInfo && (
                                <div className="patient-request-contact">
                                  {patientWhatsappUrl && (
                                    <a href={patientWhatsappUrl} target="_blank" rel="noopener noreferrer" className="psico-btn-whatsapp">
                                      <MessageCircle size={14} /> WhatsApp
                                    </a>
                                  )}
                                  {patient?.email && (
                                    <a href={`mailto:${patient.email}`} className="psico-btn-email">
                                      <Mail size={14} /> {patient.email}
                                    </a>
                                  )}
                                </div>
                              )}
                              {hasTerminationRequest && (
                                <p className="psico-request-message psico-request-message--termination">
                                  "{req.message || TERMINATION_MESSAGE}"
                                </p>
                              )}
                              {terminationAccepted && (
                                <p className="psico-secondary-text">Finalización de terapia aceptada.</p>
                              )}
                              {blockInfo && (
                                <p className="psico-blocked-text">{blockInfo.message}</p>
                              )}
                            </div>
                          </div>
                          <div className="psico-request-actions">
                            <span className={`psico-status-badge psico-status-${isAccepted ? 'green' : 'red'}`}>
                              {isAccepted ? <><CheckCircle size={13} /> Aceptado</> : <><XCircle size={13} /> Rechazado</>}
                            </span>
                            {blockInfo ? (
                              <>
                                <span className="psico-status-badge psico-status-red">
                                  <Ban size={13} /> Bloqueado
                                </span>
                                {blockInfo.blockedByMe && (
                                  <button
                                    className="psico-btn-unblock-sm"
                                    onClick={() => handleUnblock(req)}
                                    disabled={blockingRequest === req.id}
                                  >
                                    <Unlock size={14} /> {blockingRequest === req.id ? 'Desbloqueando...' : 'Desbloquear'}
                                  </button>
                                )}
                              </>
                            ) : isAccepted ? (
                              <>
                                {hasTerminationRequest && (
                                  <button
                                    className="psico-btn-accept"
                                    onClick={() => handleAcceptTermination(req)}
                                    disabled={updatingRequest === req.id}
                                  >
                                    <Check size={14} /> Aceptar finalización
                                  </button>
                                )}
                                <button
                                  className="psico-btn-danger-sm"
                                  onClick={() => handleBlock(req)}
                                  disabled={blockingRequest === req.id}
                                >
                                  <Ban size={14} /> {blockingRequest === req.id ? 'Bloqueando...' : 'Bloquear'}
                                </button>
                              </>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
