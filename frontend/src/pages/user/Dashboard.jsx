import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaLinkedin, FaBriefcase, FaFileAlt } from 'react-icons/fa';
import { userService } from '../../services';
import { BACKEND_BASE_URL } from '../../services/apiBaseUrl';

const toAssetUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const clean = path.replace(/^\/?api\//i, '/');
  return `${BACKEND_BASE_URL}${clean.startsWith('/') ? clean : `/${clean}`}`;
};

const formatDate = (date) =>
  new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [profileResponse, applicationsResponse] = await Promise.all([
          userService.getProfile(),
          userService.getMyApplications(),
        ]);
        setProfile(profileResponse.data);
        setApplications(applicationsResponse.data || []);
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudo cargar el panel');
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

  const total      = applications.length;
  const inProgress = applications.filter((a) => ['PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEWED'].includes(a.status)).length;
  const accepted   = applications.filter((a) => a.status === 'ACCEPTED').length;
  const rejected   = applications.filter((a) => a.status === 'REJECTED').length;
  const recentApps = applications.slice(0, 5);
  const photoUrl   = toAssetUrl(profile?.profileImage);
  const cvUrl      = toAssetUrl(profile?.cvUrl);
  const fullName   = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ');

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>MI perfil de trabajo</h1>

      {/* ===== HEADER ===== */}
      <div className="card" style={{ marginBottom: '1.2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={fullName || 'Perfil'}
            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e7dcc6', flexShrink: 0 }}
          />
        ) : (
          <div style={{
            width: '90px', height: '90px', borderRadius: '50%', background: '#c9a96e', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.2rem', fontWeight: '700', color: '#fff',
          }}>
            {(profile?.firstName || 'U')[0].toUpperCase()}
          </div>
        )}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h1 style={{ margin: '0 0 0.2rem' }}>{fullName || 'MI perfil de trabajo'}</h1>
          {profile?.title && (
            <p style={{ margin: '0 0 0.4rem', color: '#5e4d38', fontWeight: '500', fontSize: '1rem' }}>{profile.title}</p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem', color: '#6f604b', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
            {profile?.location && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FaMapMarkerAlt /> {profile.location}
              </span>
            )}
            {profile?.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#c9a96e', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <FaLinkedin /> LinkedIn
              </a>
            )}
            {profile?.portfolioUrl && (
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#c9a96e', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <FaBriefcase /> Portfolio
              </a>
            )}
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#c9a96e', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <FaFileAlt /> Ver CV
              </a>
            )}
          </div>
          {profile?.skills && profile.skills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {profile.skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  style={{ background: '#f5ede0', color: '#7a5c2e', padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.82rem', border: '1px solid #e3cba8' }}
                >
                  {skill}
                </span>
              ))}
              {profile.skills.length > 5 && (
                <span style={{ color: '#9e8467', fontSize: '0.82rem', alignSelf: 'center' }}>+{profile.skills.length - 5} más</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#6f604b', fontSize: '0.88rem', marginBottom: '0.3rem' }}>Postulaciones totales</p>
          <p style={{ fontSize: '2.2rem', fontWeight: '700', color: '#2f2416', margin: 0 }}>{total}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#6f604b', fontSize: '0.88rem', marginBottom: '0.3rem' }}>En proceso</p>
          <p style={{ fontSize: '2.2rem', fontWeight: '700', color: '#1553a0', margin: 0 }}>{inProgress}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#6f604b', fontSize: '0.88rem', marginBottom: '0.3rem' }}>Aceptadas</p>
          <p style={{ fontSize: '2.2rem', fontWeight: '700', color: '#166534', margin: 0 }}>{accepted}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#6f604b', fontSize: '0.88rem', marginBottom: '0.3rem' }}>Rechazadas</p>
          <p style={{ fontSize: '2.2rem', fontWeight: '700', color: '#991b1b', margin: 0 }}>{rejected}</p>
        </div>
      </div>

      {/* ===== POSTULACIONES RECIENTES ===== */}
      <div className="card" style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.8rem' }}>
          <h2 style={{ margin: 0 }}>Postulaciones recientes</h2>
          <Link className="btn btn-outline" style={{ fontSize: '0.88rem' }} to="/user/applications">Ver todas</Link>
        </div>
        {recentApps.length === 0 ? (
          <div>
            <p style={{ color: '#6f604b', marginBottom: '0.7rem' }}>Aún no te postulaste a ninguna oferta.</p>
            <Link className="btn btn-primary" to="/jobs">Buscar ofertas</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {recentApps.map((app) => {
              const companyLogoUrl = toAssetUrl(app.jobOffer?.company?.companyLogo);
              return (
                <div
                  key={app.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.8rem',
                    padding: '0.7rem 0.9rem', borderRadius: '8px', background: '#faf7f2',
                    border: '1px solid #e7dcc6', flexWrap: 'wrap',
                  }}
                >
                  {companyLogoUrl ? (
                    <img
                      src={companyLogoUrl}
                      alt={app.jobOffer?.company?.companyName}
                      style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e0d0b8', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '6px', background: '#d6b980', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', fontWeight: '700', color: '#fff',
                    }}>
                      {(app.jobOffer?.company?.companyName || 'E')[0].toUpperCase()}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <p style={{ margin: '0 0 0.15rem', fontWeight: '600', color: '#2f2416', fontSize: '0.97rem' }}>
                      {app.jobOffer?.title || 'Oferta'}
                    </p>
                    <p style={{ margin: 0, color: '#7e705c', fontSize: '0.83rem' }}>
                      {app.jobOffer?.company?.companyName || 'Empresa'} · {formatDate(app.createdAt)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <span className="badge badge-applied" style={{ fontSize: '0.82rem' }}>Postulado</span>
                    <Link
                      className="btn btn-outline"
                      style={{ fontSize: '0.82rem', padding: '0.2rem 0.6rem' }}
                      to={`/jobs/${app.jobOfferId}`}
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== ACCIONES RÁPIDAS ===== */}
      <div className="card">
        <h2 style={{ marginBottom: '0.8rem' }}>Acciones rápidas</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {/* <Link className="btn btn-primary" to="/jobs">Buscar ofertas</Link> */}
          <Link className="btn btn-outline" to="/user/applications">Mis postulaciones</Link>
          <Link className="btn btn-outline" to="/user/profile">Editar perfil</Link>
          {cvUrl && (
            <a className="btn btn-outline" href={cvUrl} target="_blank" rel="noopener noreferrer">Ver CV</a>
          )}
        </div>
      </div>

    </div>
  );
}
