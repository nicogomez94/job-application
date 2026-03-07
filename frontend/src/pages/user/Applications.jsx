import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userService } from '../../services';

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

const formatDate = (date) =>
  new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));

export default function UserApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
        <p>Cargando postulaciones...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Mis Postulaciones</h1>
      <p style={{ color: '#475569', marginBottom: '1rem' }}>
        Total: <strong>{applications.length}</strong>
      </p>

      {applications.length === 0 ? (
        <div className="card">
          <p style={{ marginBottom: '0.8rem' }}>Todavía no realizaste postulaciones.</p>
          <Link className="btn btn-primary" to="/jobs">
            Buscar ofertas
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.9rem' }}>
          {applications.map((application) => (
            <article key={application.id} className="card" style={{ border: '1px solid #e2e8f0' }}>
              <h2 style={{ marginBottom: '0.4rem' }}>{application.jobOffer?.title || 'Oferta'}</h2>
              <p style={{ color: '#334155', marginBottom: '0.4rem' }}>
                {application.jobOffer?.company?.companyName || 'Empresa'}
              </p>
              <p style={{ color: '#64748b', marginBottom: '0.6rem', fontSize: '0.92rem' }}>
                Postulado el {formatDate(application.createdAt)}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className={STATUS_CLASS[application.status] || 'badge badge-info'}>
                  {STATUS_LABELS[application.status] || application.status}
                </span>
                <Link className="btn btn-outline" to={`/jobs/${application.jobOfferId}`}>
                  Ver oferta
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
