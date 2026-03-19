import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { applicationService, jobOfferService, userService } from '../services';
import { useAuthStore } from '../context/authStore';
import '../components/BackToDashboardButton.css';

const formatDate = (date) =>
  new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuthStore();

  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      try {
        const [jobResponse, applicationsResponse] = await Promise.all([
          jobOfferService.getById(id),
          isAuthenticated && userType === 'user' ? userService.getMyApplications() : Promise.resolve(null),
        ]);

        setJob(jobResponse.data);

        if (applicationsResponse) {
          const alreadyApplied = (applicationsResponse.data || []).some(
            (application) => application.jobOfferId === jobResponse.data.id || application.jobOffer?.id === jobResponse.data.id,
          );
          setHasApplied(alreadyApplied);
        } else {
          setHasApplied(false);
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudo cargar la oferta');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, isAuthenticated, userType]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Iniciá sesión para postularte');
      navigate('/login');
      return;
    }

    if (userType !== 'user') {
      toast.error('Solo los candidatos pueden postularse');
      return;
    }

    setSubmitting(true);
    try {
      await applicationService.apply(job.id, coverLetter);
      toast.success('Postulación enviada');
      setCoverLetter('');
      setHasApplied(true);
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo enviar la postulación');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
        <p>Cargando detalle...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
        <div className="card">
          <p style={{ marginBottom: '1rem' }}>No se encontró la oferta.</p>
          <Link to="/jobs" className="btn btn-primary">
            Volver a búsqueda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#fcf7ef', minHeight: '100vh', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <Link to="/jobs" className="back-dashboard-btn">
          <ArrowLeft size={16} />
          <span>Volver a ofertas</span>
        </Link>

        <div className="card" style={{ marginBottom: '1rem' }}>
          <h1 style={{ marginBottom: '0.3rem', color: '#2f2416' }}>{job.title}</h1>
          <p style={{ color: '#5e4d38', marginBottom: '0.8rem' }}>{job.company?.companyName}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem', color: '#6f604b', fontSize: '0.92rem' }}>
            <span>{job.location}</span>
            <span>{job.workType}</span>
            <span>{job.workMode}</span>
            <span>{job.experienceLevel}</span>
            <span>Publicada: {formatDate(job.createdAt)}</span>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ marginBottom: '0.6rem' }}>Descripción</h2>
          <p style={{ color: '#5e4d38', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{job.description}</p>
        </div>

        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ marginBottom: '0.6rem' }}>Requisitos</h2>
          <ul style={{ paddingLeft: '1.2rem', color: '#5e4d38', lineHeight: 1.6 }}>
            {(job.requirements || []).map((item, idx) => (
              <li key={`${item}-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ marginBottom: '0.6rem' }}>Responsabilidades</h2>
          <ul style={{ paddingLeft: '1.2rem', color: '#5e4d38', lineHeight: 1.6 }}>
            {(job.responsibilities || []).map((item, idx) => (
              <li key={`${item}-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>

        {(userType === 'company' || userType === 'admin' || !hasApplied) && (
          <div className="card">
            <h2 style={{ marginBottom: '0.8rem' }}>Postularme</h2>
            {userType === 'company' || userType === 'admin' ? (
              <p style={{ color: '#b91c1c' }}>Solo usuarios candidatos pueden postularse.</p>
            ) : (
              <>
                <textarea
                  className="input"
                  rows={5}
                  placeholder="Carta de presentación (opcional)"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  style={{ resize: 'vertical', marginBottom: '0.8rem' }}
                />
                <button className="btn btn-primary" disabled={submitting} onClick={handleApply}>
                  {submitting ? 'Enviando...' : 'Enviar postulación'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
