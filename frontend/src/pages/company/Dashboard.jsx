import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaIndustry, FaMapMarkerAlt, FaUsers, FaGlobe, FaUserTie } from 'react-icons/fa';
import { companyService, jobOfferService } from '../../services';
import { BACKEND_BASE_URL } from '../../services/apiBaseUrl';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const toAssetUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const clean = path.replace(/^\/?api\//i, '/');
  return `${BACKEND_BASE_URL}${clean.startsWith('/') ? clean : `/${clean}`}`;
};

const formatDate = (date) =>
  new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));

const PLAN_LABELS = { TRIAL: 'Prueba 2 meses', MONTHLY: 'Plan 3 meses', QUARTERLY: 'Plan 7 meses', ANNUAL: 'Plan 12 + 1' };
const WORKMODE_LABELS = { PRESENCIAL: 'Presencial', REMOTO: 'Remoto', HIBRIDO: 'Híbrido' };

export default function CompanyDashboard() {
  const [company, setCompany] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [companyResponse, subscriptionResponse, offersResponse] = await Promise.all([
          companyService.getProfile(),
          companyService.checkSubscription(),
          jobOfferService.getMyOffers(),
        ]);
        setCompany(companyResponse.data);
        setSubscriptionStatus(subscriptionResponse.data);
        setOffers(offersResponse.data || []);
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudo cargar el panel de empresa');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
        <p>Cargando panel...</p>
      </div>
    );
  }

  const activeOffers = offers.filter((o) => o.isActive).length;
  const inactiveOffers = offers.filter((o) => !o.isActive).length;
  const totalApplications = offers.reduce((acc, o) => acc + (o._count?.applications || 0), 0);
  const recentOffers = offers.slice(0, 5);
  const logoUrl = toAssetUrl(company?.companyLogo);
  const sub = subscriptionStatus?.subscription;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
      <BackToDashboardButton to="/" label="Ir al inicio" icon="home" />
      <h1 style={{ marginBottom: '1rem' }}>Mi perfil</h1>

      {/* ===== HEADER ===== */}
      <div className="card" style={{ marginBottom: '1.2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={company?.companyName}
            style={{ width: '90px', height: '90px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #e7dcc6', flexShrink: 0 }}
          />
        ) : (
          <div style={{
            width: '90px', height: '90px', borderRadius: '12px', background: '#c9a96e', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.2rem', fontWeight: '700', color: '#fff',
          }}>
            {(company?.companyName || 'E')[0].toUpperCase()}
          </div>
        )}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
            <h1 style={{ margin: 0 }}>{company?.companyName || 'Mi Empresa'}</h1>
            {subscriptionStatus?.isBlocked && (
              <span className="badge badge-error">Cuenta bloqueada</span>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem', color: '#6f604b', fontSize: '0.93rem', marginBottom: '0.5rem' }}>
            {company?.industry && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FaIndustry /> {company.industry}
              </span>
            )}
            {company?.location && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FaMapMarkerAlt /> {company.location}
              </span>
            )}
            {company?.size && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FaUsers /> {company.size} empleados
              </span>
            )}
            {company?.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#c9a96e', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <FaGlobe /> Sitio web
              </a>
            )}
          </div>
          {company?.description && (
            <p style={{ color: '#5e4d38', fontSize: '0.92rem', maxWidth: '620px', margin: 0 }}>
              {company.description.length > 200 ? company.description.slice(0, 200) + '…' : company.description}
            </p>
          )}
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#6f604b', fontSize: '0.88rem', marginBottom: '0.3rem' }}>Ofertas activas</p>
          <p style={{ fontSize: '2.2rem', fontWeight: '700', color: '#2f7a45', margin: 0 }}>{activeOffers}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#6f604b', fontSize: '0.88rem', marginBottom: '0.3rem' }}>Ofertas inactivas</p>
          <p style={{ fontSize: '2.2rem', fontWeight: '700', color: '#888', margin: 0 }}>{inactiveOffers}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#6f604b', fontSize: '0.88rem', marginBottom: '0.3rem' }}>Ofertas totales</p>
          <p style={{ fontSize: '2.2rem', fontWeight: '700', color: '#2f2416', margin: 0 }}>{offers.length}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#6f604b', fontSize: '0.88rem', marginBottom: '0.3rem' }}>Postulaciones recibidas</p>
          <p style={{ fontSize: '2.2rem', fontWeight: '700', color: '#2f2416', margin: 0 }}>{totalApplications}</p>
        </div>
      </div>

      {/* ===== ACCIONES RÁPIDAS ===== */}
      <div className="card" style={{ marginBottom: '1.2rem' }}>
        <h2 style={{ marginBottom: '0.8rem' }}>Acciones rápidas</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          <Link className="btn btn-primary" to="/company/jobs/create">Crear oferta</Link>
          <Link className="btn btn-outline" to="/company/jobs">Gestionar ofertas</Link>
          <Link className="btn btn-outline" to="/company/profile">Editar perfil</Link>
          <Link className="btn btn-outline" to="/company/subscription">Suscripciones</Link>
        </div>
      </div>

      {/* ===== ÚLTIMAS OFERTAS ===== */}
      <div className="card" style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <h2 style={{ margin: 0 }}>Últimas ofertas</h2>
          <Link className="btn btn-outline" style={{ fontSize: '0.88rem' }} to="/company/jobs">Ver todas</Link>
        </div>
        {recentOffers.length === 0 ? (
          <p style={{ color: '#6f604b', margin: 0 }}>
            No publicaste ofertas todavía.{' '}
            <Link to="/company/jobs/create" style={{ color: '#c9a96e' }}>Crear primera oferta</Link>
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {recentOffers.map((offer) => (
              <div
                key={offer.id}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.7rem 0.9rem', borderRadius: '8px', background: '#faf7f2',
                  border: '1px solid #e7dcc6', flexWrap: 'wrap', gap: '0.5rem',
                }}
              >
                <div style={{ minWidth: '160px' }}>
                  <p style={{ margin: '0 0 0.2rem', fontWeight: '600', color: '#2f2416', fontSize: '0.97rem' }}>{offer.title}</p>
                  <p style={{ margin: 0, color: '#7e705c', fontSize: '0.85rem' }}>
                    {offer.location} · {WORKMODE_LABELS[offer.workMode] || offer.workMode}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', color: '#5e4d38' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <FaUserTie /> {offer._count?.applications || 0} postulante{offer._count?.applications !== 1 ? 's' : ''}
                    </span>
                  </span>
                  <span className={offer.isActive ? 'badge badge-success' : 'badge badge-warning'}>
                    {offer.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                  <Link
                    className="btn btn-outline"
                    style={{ fontSize: '0.82rem', padding: '0.2rem 0.6rem' }}
                    to={`/company/jobs/${offer.id}/applicants`}
                  >
                    Ver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== SUSCRIPCIÓN ===== */}
      <div
        className="card"
        style={{
          border: subscriptionStatus?.hasActiveSubscription ? '1px solid #a8d5b5' : '1px solid #fecaca',
          background: subscriptionStatus?.hasActiveSubscription ? '#f0faf4' : '#fef2f2',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem', color: '#2f2416' }}>Suscripción</h2>
            {sub ? (
              <>
                <p style={{ margin: '0 0 0.25rem', fontWeight: '600', fontSize: '1.05rem', color: '#2f2416' }}>
                  Plan {PLAN_LABELS[sub.plan] || sub.plan}
                </p>
                <p style={{ margin: '0 0 0.2rem', color: '#5e4d38', fontSize: '0.93rem' }}>
                  Inicio: {formatDate(sub.startDate)} — Vence: {formatDate(sub.endDate)}
                </p>
                <p style={{ margin: 0, color: '#6f604b', fontSize: '0.9rem' }}>
                  {Math.max(0, Math.ceil((new Date(sub.endDate) - new Date()) / (1000 * 60 * 60 * 24)))} días restantes
                </p>
              </>
            ) : (
              <p style={{ margin: 0, color: '#991b1b' }}>Sin suscripción activa</p>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <span className={subscriptionStatus?.hasActiveSubscription ? 'badge badge-success' : 'badge badge-error'}>
              {subscriptionStatus?.hasActiveSubscription ? 'Activa' : 'Inactiva'}
            </span>
            <Link className="btn btn-outline" style={{ fontSize: '0.88rem' }} to="/company/subscription">
              {subscriptionStatus?.hasActiveSubscription ? 'Gestionar' : 'Activar'}
            </Link>
          </div>
        </div>
        {subscriptionStatus?.isBlocked && (
          <div style={{ marginTop: '0.8rem', padding: '0.6rem 0.9rem', background: '#fee2e2', borderRadius: '6px', color: '#991b1b', fontSize: '0.92rem' }}>
            Tu empresa está bloqueada por falta de suscripción activa. Activá tu plan para publicar ofertas.
          </div>
        )}
      </div>

    </div>
  );
}
