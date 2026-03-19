import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Briefcase, Monitor, Award,
  Calendar, Globe, Building2, Users, Tag, Check, Clock, Languages,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { applicationService, jobOfferService, userService } from '../services';
import { BACKEND_BASE_URL } from '../services/apiBaseUrl';
import { useAuthStore } from '../context/authStore';
import '../components/BackToDashboardButton.css';
import './JobDetail.css';

const toAssetUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BACKEND_BASE_URL}${path}`;
};

const formatDate = (date) =>
  new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));

const WORK_TYPE_LABEL = {
  FULL_TIME: 'Tiempo completo',
  PART_TIME: 'Medio tiempo',
  CONTRACT: 'Contrato',
  FREELANCE: 'Freelance',
  INTERNSHIP: 'Pasantía',
};

const WORK_MODE_LABEL = {
  PRESENCIAL: 'Presencial',
  REMOTO: 'Remoto',
  HIBRIDO: 'Híbrido',
};

const EXPERIENCE_LABEL = {
  ENTRY: 'Sin experiencia',
  JUNIOR: 'Junior',
  MID: 'Semi-senior',
  SENIOR: 'Senior',
  LEAD: 'Líder',
};

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
          <Link to="/jobs" className="back-dashboard-btn">
            <ArrowLeft size={16} />
            <span>Volver a búsqueda</span>
          </Link>
        </div>
      </div>
    );
  }

  const logoUrl = toAssetUrl(job.company?.companyLogo);
  return (
    <div className="jd-page">
      <div className="jd-container">
        {/* Back link */}
        <Link to="/jobs" className="back-dashboard-btn" style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>
          <ArrowLeft size={16} />
          <span>Volver a ofertas</span>
        </Link>

        {/* ── Hero card ── */}
        <div className="jd-hero">
          <div className="jd-hero-top">
            {logoUrl ? (
              <img src={logoUrl} alt={job.company?.companyName} className="jd-logo" />
            ) : (
              <div className="jd-logo-placeholder">
                <Building2 size={32} />
              </div>
            )}

            <div className="jd-hero-info">
              {job.category?.name && (
                <span className="jd-category-badge">{job.category.name}</span>
              )}
              <h1 className="jd-title">{job.title}</h1>
              <p className="jd-company-name">{job.company?.companyName}</p>

              <div className="jd-tags">
                {job.location && (
                  <span className="jd-tag"><MapPin size={13} />{job.location}</span>
                )}
                {job.workType && (
                  <span className="jd-tag"><Briefcase size={13} />{WORK_TYPE_LABEL[job.workType] ?? job.workType}</span>
                )}
                {job.workMode && (
                  <span className="jd-tag"><Monitor size={13} />{WORK_MODE_LABEL[job.workMode] ?? job.workMode}</span>
                )}
                {job.experienceLevel && (
                  <span className="jd-tag"><Award size={13} />{EXPERIENCE_LABEL[job.experienceLevel] ?? job.experienceLevel}</span>
                )}
              </div>
            </div>
          </div>

          <div className="jd-hero-meta">
            <span className="jd-meta-item">
              <Calendar size={14} />
              Publicada el {formatDate(job.createdAt)}
            </span>
            {job.expiresAt && (
              <span className="jd-meta-item">
                <Clock size={14} />
                Vence el {formatDate(job.expiresAt)}
              </span>
            )}
            {job._count?.applications > 0 && (
              <span className="jd-meta-item">
                <Users size={14} />
                {job._count.applications} postulación{job._count.applications !== 1 ? 'es' : ''}
              </span>
            )}
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="jd-layout">
          {/* Main content */}
          <div>
            {/* Description */}
            {job.description && (
              <div className="jd-section">
                <h2 className="jd-section-title"><Tag size={16} />Descripción</h2>
                <p className="jd-description">{job.description}</p>
              </div>
            )}

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className="jd-section">
                <h2 className="jd-section-title"><Check size={16} />Requisitos</h2>
                <ul className="jd-check-list">
                  {job.requirements.map((item, idx) => (
                    <li key={`req-${idx}`}>
                      <Check size={15} className="jd-check-icon" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities?.length > 0 && (
              <div className="jd-section">
                <h2 className="jd-section-title"><Briefcase size={16} />Responsabilidades</h2>
                <ul className="jd-dot-list">
                  {job.responsibilities.map((item, idx) => (
                    <li key={`res-${idx}`}>
                      <span className="jd-dot" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Languages */}
            {job.languages?.length > 0 && (
              <div className="jd-section">
                <h2 className="jd-section-title"><Languages size={16} />Idiomas requeridos</h2>
                <div className="jd-lang-list">
                  {job.languages.map((lang, idx) => (
                    <span key={`lang-${idx}`} className="jd-lang-tag">{lang}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="jd-sidebar">
            {/* Apply card */}
            <div className="jd-sidebar-card">
              {hasApplied ? (
                <div className="jd-applied-banner">
                  <Check size={18} />
                  Ya te postulaste a esta oferta
                </div>
              ) : userType === 'company' || userType === 'admin' ? (
                <>
                  <h2 className="jd-apply-title">Postularse</h2>
                  <p className="jd-apply-desc" style={{ color: '#b91c1c' }}>Solo candidatos pueden postularse.</p>
                </>
              ) : (
                <>
                  <h2 className="jd-apply-title">Postularme</h2>
                  <p className="jd-apply-desc">Adjuntá una carta de presentación para destacar tu perfil.</p>
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="Carta de presentación (opcional)"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    style={{ resize: 'vertical', marginBottom: '0.5rem' }}
                  />
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={submitting}
                    onClick={handleApply}
                  >
                    {submitting ? 'Enviando...' : 'Enviar postulación'}
                  </button>
                </>
              )}
            </div>

            {/* Company card */}
            <div className="jd-sidebar-card">
              <div className="jd-company-header">
                {logoUrl ? (
                  <img src={logoUrl} alt={job.company?.companyName} className="jd-company-logo-sm" />
                ) : (
                  <div className="jd-company-logo-sm-placeholder">
                    <Building2 size={22} />
                  </div>
                )}
                <span className="jd-company-card-name">{job.company?.companyName}</span>
              </div>

              {job.company?.industry && (
                <div className="jd-company-info-row">
                  <Briefcase size={13} />
                  {job.company.industry}
                </div>
              )}
              {job.company?.size && (
                <div className="jd-company-info-row">
                  <Users size={13} />
                  {job.company.size} empleados
                </div>
              )}
              {job.company?.location && (
                <div className="jd-company-info-row">
                  <MapPin size={13} />
                  {job.company.location}
                </div>
              )}
              {job.company?.website && (
                <div className="jd-company-info-row">
                  <Globe size={13} />
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="jd-website-link"
                  >
                    {job.company.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}

              {job.company?.description && (
                <p className="jd-company-desc">{job.company.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
