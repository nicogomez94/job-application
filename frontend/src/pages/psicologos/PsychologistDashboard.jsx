import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, FileText, CreditCard, CheckCircle, Clock, XCircle, Edit, Users, Check, X } from 'lucide-react';
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
  PENDING: { label: 'En revisión (~5 días hábiles)', icon: Clock, color: 'orange' },
  APPROVED: { label: 'Aprobado - Elegí tu plan para activarte', icon: CheckCircle, color: 'blue' },
  REJECTED: { label: 'Rechazado', icon: XCircle, color: 'red' },
  ACTIVE: { label: 'Activo - Visible para pacientes', icon: CheckCircle, color: 'green' },
};

export default function PsychologistDashboard() {
  const { updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [updatingRequest, setUpdatingRequest] = useState(null);

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
  const name = p?.displayName || `${p?.firstName || ''} ${p?.lastName || ''}`.trim();
  const photo = toAssetUrl(p?.profileImage);
  const initials = `${p?.firstName?.[0] || ''}${p?.lastName?.[0] || ''}`.toUpperCase();
  const statusInfo = STATUS_LABELS[p?.status] || STATUS_LABELS.PENDING;
  const StatusIcon = statusInfo.icon;

  const formatDate = (d) =>
    d ? new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(d)) : '-';

  const handleRequestStatus = async (requestId, status) => {
    setUpdatingRequest(requestId);
    try {
      await psychologistService.updateRequestStatus(requestId, status);
      setIncomingRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status } : r)),
      );
      toast.success(status === 'ACCEPTED' ? 'Solicitud aceptada' : 'Solicitud rechazada');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al actualizar la solicitud');
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

        <div className={`psico-status-banner psico-status-${statusInfo.color}`}>
          <StatusIcon size={20} />
          <span>{statusInfo.label}</span>
          {p?.status === 'APPROVED' && (
            <Link to="/psicologo/plan" className="psico-btn-primary psico-btn-sm">
              Elegir plan →
            </Link>
          )}
          {p?.status === 'REJECTED' && p?.rejectionReason && (
            <span className="psico-rejection-reason">Motivo: {p.rejectionReason}</span>
          )}
        </div>

        <div className="psico-dashboard-grid">
          <div className="psico-dashboard-card">
            <div className="psico-dashboard-card-header">
              <User size={18} />
              <h2>Mi perfil</h2>
              <Link to="/psicologo/perfil" className="psico-icon-btn" title="Editar perfil">
                <Edit size={16} />
              </Link>
            </div>
            <div className="psico-dashboard-profile">
              <div className="psico-dashboard-photo">
                {photo ? (
                  <img src={photo} alt={name} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                ) : null}
                <div className="psico-card-initials" style={photo ? { display: 'none' } : {}}>{initials}</div>
              </div>
              <div>
                <h3>{name}</h3>
                <p>{p?.email}</p>
                {p?.country && <p>{p.country}</p>}
                {p?.specialties?.length > 0 && (
                  <div className="psico-tags psico-tags-sm">
                    {p.specialties.slice(0, 2).map((s) => (
                      <span key={s} className="psico-tag">{s}</span>
                    ))}
                    {p.specialties.length > 2 && <span className="psico-tag">+{p.specialties.length - 2}</span>}
                  </div>
                )}
              </div>
            </div>
            <p className="psico-independent-notice psico-independent-notice--sm">
              Este profesional actúa de manera independiente.<br />
              La plataforma no interviene en sesiones, pagos ni resultados del servicio.
            </p>
          </div>

          <div className="psico-dashboard-card">
            <div className="psico-dashboard-card-header">
              <CreditCard size={18} />
              <h2>Suscripción</h2>
            </div>
            {subscription ? (
              <div className="psico-dashboard-sub">
                <p><strong>Plan:</strong> {subscription.plan}</p>
                <p><strong>Estado:</strong> {subscription.status}</p>
                <p><strong>Válido hasta:</strong> {formatDate(subscription.endDate)}</p>
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
              {(p?.status === 'APPROVED' || p?.status === 'ACTIVE') && (
                <li><Link to="/psicologo/plan">Gestionar suscripción</Link></li>
              )}
              <li><Link to="/psicologos">Ver cómo aparezco en el listado</Link></li>
            </ul>
          </div>
        </div>

        {/* ── Incoming Hiring Requests ── */}
        <div className="psico-dashboard-card psico-dashboard-requests-card">
          <div className="psico-dashboard-card-header">
            <Users size={18} />
            <h2>Solicitudes de consulta</h2>
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
                      const u = req.user;
                      const userName = `${u?.firstName || ''} ${u?.lastName || ''}`.trim();
                      return (
                        <li key={req.id} className="patient-request-item">
                          <div className="patient-request-psy">
                            <div className="psico-card-photo psico-card-photo-sm">
                              <div className="psico-card-initials">
                                {`${u?.firstName?.[0] || ''}${u?.lastName?.[0] || ''}`.toUpperCase()}
                              </div>
                            </div>
                            <div>
                              <strong>{userName}</strong>
                              <p className="psico-secondary-text">{u?.email}</p>
                              {req.message && (
                                <p className="psico-request-message">"{req.message}"</p>
                              )}
                              <span className="psico-secondary-text psico-date-text">
                                {formatDate(req.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="psico-request-actions">
                            <button
                              className="psico-btn-accept"
                              onClick={() => handleRequestStatus(req.id, 'ACCEPTED')}
                              disabled={updatingRequest === req.id}
                            >
                              <Check size={14} /> Aceptar
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
                      const u = req.user;
                      const userName = `${u?.firstName || ''} ${u?.lastName || ''}`.trim();
                      const isAccepted = req.status === 'ACCEPTED';
                      return (
                        <li key={req.id} className="patient-request-item">
                          <div className="patient-request-psy">
                            <div className="psico-card-photo psico-card-photo-sm">
                              <div className="psico-card-initials">
                                {`${u?.firstName?.[0] || ''}${u?.lastName?.[0] || ''}`.toUpperCase()}
                              </div>
                            </div>
                            <div>
                              <strong>{userName}</strong>
                              <p className="psico-secondary-text">{u?.email}</p>
                            </div>
                          </div>
                          <span className={`psico-status-badge psico-status-${isAccepted ? 'green' : 'red'}`}>
                            {isAccepted ? <><CheckCircle size={13} /> Aceptado</> : <><XCircle size={13} /> Rechazado</>}
                          </span>
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
