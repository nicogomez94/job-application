import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jobOfferService } from '../../services';

const formatDate = (date) =>
  new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));

export default function CompanyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await jobOfferService.getMyOffers();
      setJobs(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudieron cargar tus ofertas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('¿Eliminar esta oferta laboral?');
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await jobOfferService.delete(id);
      toast.success('Oferta eliminada');
      await loadJobs();
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo eliminar la oferta');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
        <p>Cargando ofertas...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
        <h1>Mis Ofertas Laborales</h1>
        <Link className="btn btn-primary" to="/company/jobs/create">
          Nueva oferta
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="card">
          <p style={{ marginBottom: '0.8rem' }}>No tenés ofertas publicadas todavía.</p>
          <Link className="btn btn-primary" to="/company/jobs/create">
            Crear primera oferta
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.9rem' }}>
          {jobs.map((job) => (
            <article key={job.id} className="card" style={{ border: '1px solid #e2e8f0' }}>
              <h2 style={{ marginBottom: '0.3rem', color: '#0f172a' }}>{job.title}</h2>
              <p style={{ color: '#475569', marginBottom: '0.5rem', fontSize: '0.92rem' }}>
                {job.location} | {job.workMode} | {job.experienceLevel}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '0.7rem' }}>
                <span className={job.isActive ? 'badge badge-success' : 'badge badge-error'}>
                  {job.isActive ? 'Activa' : 'Inactiva'}
                </span>
                <span className="badge badge-info">Postulaciones: {job._count?.applications || 0}</span>
                <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Creada: {formatDate(job.createdAt)}</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <Link className="btn btn-outline" to={`/company/jobs/edit/${job.id}`}>
                  Editar
                </Link>
                <Link className="btn btn-outline" to={`/company/jobs/${job.id}/applicants`}>
                  Ver postulantes
                </Link>
                <button className="btn" style={{ background: '#fee2e2', color: '#991b1b' }} onClick={() => handleDelete(job.id)} disabled={deletingId === job.id}>
                  {deletingId === job.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
