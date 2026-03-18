import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jobOfferService } from '../../services';
import { BACKEND_BASE_URL } from '../../services/apiBaseUrl';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const toAssetUrl = (assetPath) => {
  if (!assetPath) return null;
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) return assetPath;

  const rawPath = String(assetPath).trim();
  const noApiPrefix = rawPath.replace(/^\/?api\//i, '/');
  const normalizedPath = noApiPrefix.startsWith('/') ? noApiPrefix : `/${noApiPrefix}`;

  return `${BACKEND_BASE_URL}${normalizedPath}`;
};

const toProfileImageUrl = (imagePath) => toAssetUrl(imagePath) || '/profile-placeholder.svg';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'REVIEWING', label: 'En revisión' },
  { value: 'SHORTLISTED', label: 'Preseleccionado' },
  { value: 'INTERVIEWED', label: 'Entrevistado' },
  { value: 'REJECTED', label: 'Rechazado' },
  { value: 'ACCEPTED', label: 'Aceptado' },
];

const formatDate = (date) =>
  new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));

export default function JobApplicants() {
  const { id } = useParams();
  const [jobOffer, setJobOffer] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedApplicationId, setExpandedApplicationId] = useState(null);

  const loadApplicants = async () => {
    setLoading(true);
    try {
      const response = await jobOfferService.getApplicants(id);
      setJobOffer(response.data?.jobOffer || null);
      setApplications(response.data?.applications || []);
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo cargar la lista de postulantes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, [id]);

  const handleStatusChange = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      await jobOfferService.updateApplicationStatus(applicationId, status);
      setApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, status } : app)));
      toast.success('Estado actualizado');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo actualizar el estado');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpanded = (applicationId) => {
    setExpandedApplicationId((prev) => (prev === applicationId ? null : applicationId));
  };

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
        <p>Cargando postulantes...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
      <BackToDashboardButton to="/company/dashboard" />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.8rem', marginBottom: '1rem' }}>
        <div>
          <h1>Postulantes</h1>
          <p style={{ color: '#6f604b' }}>{jobOffer?.title || 'Oferta'}</p>
        </div>
        <Link className="btn btn-outline" to="/company/jobs">
          Volver a ofertas
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="card">
          <p>Esta oferta no tiene postulantes todavía.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.9rem' }}>
          {applications.map((application) => (
            <article key={application.id} className="card" style={{ border: '1px solid #e7dcc6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={toProfileImageUrl(application.user?.profileImage)}
                    alt={`Foto de ${application.user?.firstName || 'postulante'}`}
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '999px',
                      objectFit: 'cover',
                      border: '2px solid #dfcfb6',
                      background: '#f1eadf',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <h2 style={{ marginBottom: '0.2rem' }}>
                      {application.user?.firstName} {application.user?.lastName}
                    </h2>
                    <p style={{ color: '#7e705c', fontSize: '0.88rem' }}>Postulado: {formatDate(application.createdAt)}</p>
                  </div>
                </div>
                <div style={{ minWidth: '220px' }}>
                  <label style={{ display: 'block', color: '#6f604b', marginBottom: '0.3rem' }}>Estado</label>
                  <select
                    className="input"
                    value={application.status}
                    onChange={(e) => handleStatusChange(application.id, e.target.value)}
                    disabled={updatingId === application.id}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '0.8rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => toggleExpanded(application.id)}
                  style={{ minWidth: '170px' }}
                >
                  {expandedApplicationId === application.id ? 'Ocultar detalle' : 'Ampliar postulante'}
                </button>
              </div>

              {expandedApplicationId === application.id && (
                <div style={{ marginTop: '0.9rem', display: 'grid', gap: '0.9rem' }}>
                  <div
                    style={{
                      padding: '0.8rem',
                      border: '1px solid #efe4d1',
                      borderRadius: '0.6rem',
                      background: '#fffdfa',
                    }}
                  >
                    <h3 style={{ marginBottom: '0.55rem', fontSize: '1rem', color: '#5a452f' }}>Datos de contacto</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.75rem' }}>
                      <img
                        src={toProfileImageUrl(application.user?.profileImage)}
                        alt={`Foto de ${application.user?.firstName || 'postulante'}`}
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '999px',
                          objectFit: 'cover',
                          border: '2px solid #dfcfb6',
                          background: '#f1eadf',
                          flexShrink: 0,
                        }}
                      />
                    </div>
                    <div style={{ display: 'grid', gap: '0.3rem' }}>
                      <p style={{ color: '#5e4d38', margin: 0 }}>
                        <strong>Email:</strong> {application.user?.email || 'No disponible'}
                      </p>
                      <p style={{ color: '#5e4d38', margin: 0 }}>
                        <strong>Teléfono:</strong> {application.user?.phone || 'No disponible'}
                      </p>
                      <p style={{ color: '#5e4d38', margin: 0 }}>
                        <strong>Ubicación:</strong> {application.user?.location || 'No disponible'}
                      </p>
                      <p style={{ color: '#5e4d38', margin: 0 }}>
                        <strong>Título:</strong> {application.user?.title || 'No disponible'}
                      </p>
                    </div>
                    <div style={{ marginTop: '0.8rem', display: 'grid', gap: '0.45rem' }}>
                      <p style={{ color: '#5e4d38', margin: 0 }}>
                        <strong>Archivos subidos:</strong> {application.user?.cvUrl ? 'Cargados' : 'Sin archivos subidos'}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {application.user?.cvUrl ? (
                          <a className="btn btn-outline" href={toAssetUrl(application.user.cvUrl)} target="_blank" rel="noreferrer">
                            Ver CV
                          </a>
                        ) : null}

                        {application.user?.linkedinUrl ? (
                          <a className="btn btn-outline" href={application.user.linkedinUrl} target="_blank" rel="noreferrer">
                            LinkedIn
                          </a>
                        ) : (
                          <span style={{ color: '#7e705c', fontSize: '0.92rem' }}>Sin LinkedIn</span>
                        )}

                        {application.user?.portfolioUrl ? (
                          <a className="btn btn-outline" href={application.user.portfolioUrl} target="_blank" rel="noreferrer">
                            Portfolio
                          </a>
                        ) : (
                          <span style={{ color: '#7e705c', fontSize: '0.92rem' }}>Sin portfolio</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {application.user?.bio && (
                    <div style={{ padding: '0.8rem', background: '#fcf7ef', borderRadius: '0.5rem' }}>
                      <h3 style={{ marginBottom: '0.4rem', fontSize: '1rem', color: '#5a452f' }}>Sobre el postulante</h3>
                      <p style={{ color: '#5e4d38', whiteSpace: 'pre-wrap', margin: 0 }}>{application.user.bio}</p>
                    </div>
                  )}

                  {application.coverLetter && (
                    <div style={{ padding: '0.8rem', background: '#fcf7ef', borderRadius: '0.5rem' }}>
                      <h3 style={{ marginBottom: '0.4rem', fontSize: '1rem', color: '#5a452f' }}>Carta de presentación</h3>
                      <p style={{ color: '#5e4d38', whiteSpace: 'pre-wrap', margin: 0 }}>{application.coverLetter}</p>
                    </div>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
