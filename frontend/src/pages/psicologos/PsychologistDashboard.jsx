import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, FileText, CreditCard, CheckCircle, Clock, XCircle, Edit } from 'lucide-react';
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
  APPROVED: { label: 'Aprobado — Elegí tu plan para activarte', icon: CheckCircle, color: 'blue' },
  REJECTED: { label: 'Rechazado', icon: XCircle, color: 'red' },
  ACTIVE: { label: 'Activo — Visible para pacientes', icon: CheckCircle, color: 'green' },
};

export default function PsychologistDashboard() {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

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
          setSubscription(subRes.value.data.subscription);
        }
      } catch {
        toast.error('No se pudo cargar el panel');
      } finally {
        setLoading(false);
      }
    };
    load();
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

  return (
    <div className="psico-dashboard-page">
      <div className="psico-dashboard-container">
        <h1>Mi panel de psicólogo</h1>

        {/* Status Banner */}
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
          {/* Profile card */}
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
          </div>

          {/* Subscription card */}
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

          {/* Quick actions */}
          <div className="psico-dashboard-card">
            <div className="psico-dashboard-card-header">
              <h2>Acciones rápidas</h2>
            </div>
            <ul className="psico-quick-actions">
              <li><Link to="/psicologo/perfil">✏️ Editar perfil</Link></li>
              <li><Link to="/psicologo/documentos">📎 Ver / subir documentos</Link></li>
              {(p?.status === 'APPROVED' || p?.status === 'ACTIVE') && (
                <li><Link to="/psicologo/plan">💳 Gestionar suscripción</Link></li>
              )}
              <li><Link to="/psicologos">👁️ Ver cómo aparezco en el listado</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
