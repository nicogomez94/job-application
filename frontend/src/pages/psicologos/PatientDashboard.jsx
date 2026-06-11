import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, XCircle, MessageCircle, Mail, Trash2, Ban, Camera, Unlock } from 'lucide-react';
import toast from 'react-hot-toast';
import { psychologistRequestService, patientAuthService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { BACKEND_BASE_URL } from '../../services/apiBaseUrl';
import './Psicologos.css';

const toAssetUrl = (p) => {
  if (!p) return null;
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return `${BACKEND_BASE_URL}${p}`;
};

const REJECTED_MESSAGE = 'Estimada/o. En estos momentos estamos con agenda completa. Será un gusto asistirle en un próximo contacto. Intente nuevamente después de 7 días.';
const TERMINATION_MESSAGE = 'El usuario ha decidido finalizar la terapia por razones personales';

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
  const photoInputRef = useRef(null);

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
        </div>

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
                        <span className="psico-secondary-text psico-date-text">
                          {new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(req.createdAt))}
                        </span>
                      </div>

                      {req.status === 'ACCEPTED' && !blockInfo && (
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

                      {req.status === 'ACCEPTED' && !blockInfo && (
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

                      {req.status === 'ACCEPTED' && !blockInfo && !terminationAccepted && (
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
