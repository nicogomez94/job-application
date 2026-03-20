import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { applicationService, userService } from '../../services';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import StarRatingInput from '../../components/StarRatingInput';

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  REVIEWING: 'En revisión',
  SHORTLISTED: 'Preseleccionado',
  INTERVIEWED: 'Entrevistado',
  REJECTED: 'Rechazado',
  ACCEPTED: 'Aceptado',
};

const STATUS_CLASS = {
  PENDING: 'badge badge-warning',
  REVIEWING: 'badge badge-info',
  SHORTLISTED: 'badge badge-info',
  INTERVIEWED: 'badge badge-info',
  REJECTED: 'badge badge-error',
  ACCEPTED: 'badge badge-success',
};

const getStatusLabel = (status, workType) => {
  if (workType === 'FREELANCE') {
    if (status === 'ACCEPTED') return 'Finalizado';
    if (status === 'REJECTED') return 'No finalizado';
    return 'Pendiente de finalización';
  }

  return STATUS_LABELS[status] || status;
};

const getStatusClass = (status, workType) => {
  if (workType === 'FREELANCE') {
    if (status === 'ACCEPTED') return 'badge badge-success';
    if (status === 'REJECTED') return 'badge badge-error';
    return 'badge badge-warning';
  }

  return STATUS_CLASS[status] || 'badge badge-info';
};

const formatDate = (date) =>
  new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));

export default function UserApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingUpdatingId, setRatingUpdatingId] = useState(null);
  const hasNoApplications = applications.length === 0;

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      try {
        const response = await userService.getMyApplications();
        setApplications(response.data || []);
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudieron cargar tus postulaciones');
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const handleUserRatingChange = async (applicationId, rating) => {
    setRatingUpdatingId(applicationId);
    try {
      await applicationService.rateCompany(applicationId, rating);
      setApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, ratingByUser: rating } : app)));
      toast.success('Puntuación guardada');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo guardar la puntuación');
    } finally {
      setRatingUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
        <p>Cargando postulaciones...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: hasNoApplications ? '2rem 1rem 7rem' : '2rem 1rem',
      }}
    >
      <BackToDashboardButton to="/user/dashboard" />
      <h1 style={{ marginBottom: '0.5rem' }}>Mis Postulaciones</h1>
      <p style={{ color: '#6f604b', marginBottom: '1rem' }}>
        Total: <strong>{applications.length}</strong>
      </p>

      {hasNoApplications ? (
        <div className="card">
          <p style={{ marginBottom: '0.8rem' }}>Todavía no realizaste postulaciones.</p>
          <Link className="btn btn-primary" to="/jobs">
            Buscar ofertas
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.9rem' }}>
          {applications.map((application) => (
            <article key={application.id} className="card" style={{ border: '1px solid #e7dcc6' }}>
              <h2 style={{ marginBottom: '0.4rem' }}>{application.jobOffer?.title || 'Oferta'}</h2>
              <p style={{ color: '#5e4d38', marginBottom: '0.4rem' }}>
                {application.jobOffer?.company?.companyName || 'Empresa'}
              </p>
              <p style={{ color: '#7e705c', marginBottom: '0.6rem', fontSize: '0.92rem' }}>
                Postulado el {formatDate(application.createdAt)}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className={getStatusClass(application.status, application.jobOffer?.workType)}>
                  {getStatusLabel(application.status, application.jobOffer?.workType)}
                </span>
                <Link className="btn btn-outline" to={`/jobs/${application.jobOfferId}`}>
                  Ver oferta
                </Link>
              </div>
              {application.jobOffer?.workType === 'FREELANCE' && application.status === 'ACCEPTED' && (
                <div style={{ marginTop: '0.75rem' }}>
                  <label style={{ display: 'block', color: '#6f604b', marginBottom: '0.3rem' }}>
                    Puntuar empresa
                  </label>
                  <StarRatingInput
                    value={application.ratingByUser}
                    onChange={(rating) => handleUserRatingChange(application.id, rating)}
                    disabled={ratingUpdatingId === application.id}
                  />
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
