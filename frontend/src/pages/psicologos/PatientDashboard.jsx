import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, XCircle, MessageCircle, Mail, Brain, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { psychologistRequestService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { BACKEND_BASE_URL } from '../../services/apiBaseUrl';
import './Psicologos.css';

const toAssetUrl = (p) => {
  if (!p) return null;
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return `${BACKEND_BASE_URL}${p}`;
};

const STATUS_CONFIG = {
  PENDING: { label: 'Pendiente de respuesta', icon: Clock, color: 'orange' },
  ACCEPTED: { label: 'Solicitud aceptada', icon: CheckCircle, color: 'green' },
  REJECTED: { label: 'No disponible', icon: XCircle, color: 'red' },
};

export default function PatientDashboard() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

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

  if (loading) {
    return <div className="psico-loading psico-page-loading">Cargando tus solicitudes...</div>;
  }

  const name = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';

  return (
    <div className="psico-dashboard-page">
      <div className="psico-dashboard-container">
        <div className="psico-dashboard-header">
          <div className="psico-login-icon" style={{ marginBottom: '0.5rem' }}>
            <Brain size={28} strokeWidth={1.5} />
          </div>
          <h1>Mi cuenta</h1>
          {name && <p className="psico-login-subtitle">Hola, {name}</p>}
        </div>

        <div className="psico-dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="psico-dashboard-card">
            <div className="psico-dashboard-card-header">
              <h2>Mis solicitudes a psicólogos</h2>
              <Link to="/psicologos/buscar" className="psico-btn-primary psico-btn-sm">
                Buscar psicólogos
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

                  return (
                    <li key={req.id} className="patient-request-item">
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
                          <Link to={`/psicologos/${p?.id}`} className="psico-link-subtle">
                            Ver perfil →
                          </Link>
                        </div>
                      </div>

                      <div className="patient-request-status">
                        <span className={`psico-status-badge psico-status-${cfg.color}`}>
                          <StatusIcon size={13} /> {cfg.label}
                        </span>
                        <span className="psico-secondary-text psico-date-text">
                          {new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(req.createdAt))}
                        </span>
                      </div>

                      {req.status === 'ACCEPTED' && (
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
                            <a href={`mailto:${p.contactEmail}`} className="psico-btn-email">
                              <Mail size={14} /> {p.contactEmail}
                            </a>
                          )}
                        </div>
                      )}

                      {req.status === 'PENDING' && (
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
      </div>
    </div>
  );
}
