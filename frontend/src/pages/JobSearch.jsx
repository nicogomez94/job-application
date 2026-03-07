import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { applicationService, categoryService, jobOfferService } from '../services';
import { useAuthStore } from '../context/authStore';
import './JobSearch.css';

const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const backendBaseURL = apiBaseURL.replace(/\/api\/?$/, '');

const toAssetUrl = (assetPath) => {
  if (!assetPath) return null;
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) return assetPath;
  return `${backendBaseURL}${assetPath}`;
};

const formatDate = (date) => {
  if (!date) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));
};

const formatSalary = (min, max, period) => {
  if (!min && !max) return 'A convenir';
  const range = [min, max]
    .filter(Boolean)
    .map((value) => Number(value).toLocaleString('es-AR'))
    .join(' - ');
  return `${range} ${period ? `(${period})` : ''}`.trim();
};

export default function JobSearch() {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    categoryId: '',
    workMode: '',
    page: 1,
    limit: 9,
  });
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, userType } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        setCategories(response.data || []);
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudieron cargar categorías');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        );
        const response = await jobOfferService.search(params);
        setJobs(response.data?.jobOffers || []);
        setPagination(response.data?.pagination || { page: 1, pages: 1, total: 0 });
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudieron cargar ofertas');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleApply = async (jobId) => {
    if (!isAuthenticated) {
      toast.error('Iniciá sesión para postularte');
      navigate('/login');
      return;
    }

    if (userType !== 'user') {
      toast.error('Solo los candidatos pueden postularse');
      return;
    }

    const coverLetter = window.prompt('Carta de presentación (opcional):') ?? '';
    try {
      await applicationService.apply(jobId, coverLetter);
      toast.success('Postulación enviada');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo enviar la postulación');
    }
  };

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > (pagination.pages || 1)) return;
    setFilters((prev) => ({ ...prev, page: nextPage }));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', padding: '2.5rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', color: '#fff' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Buscar Empleo</h1>
          <p style={{ opacity: 0.9 }}>Encontrá ofertas activas y postulá en pocos pasos.</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '1.5rem auto 0', padding: '0 1rem' }}>
        <div
          className="job-search-header"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.3fr 1.3fr 1fr',
            gap: '0.75rem',
            background: '#fff',
            padding: '1rem',
            borderRadius: '0.75rem',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.08)',
          }}
        >
          <input
            className="input"
            name="search"
            placeholder="Título o palabra clave"
            value={filters.search}
            onChange={handleFilterChange}
          />
          <input
            className="input"
            name="location"
            placeholder="Ubicación"
            value={filters.location}
            onChange={handleFilterChange}
          />
          <select className="input" name="categoryId" value={filters.categoryId} onChange={handleFilterChange}>
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select className="input" name="workMode" value={filters.workMode} onChange={handleFilterChange}>
            <option value="">Modalidad</option>
            <option value="PRESENCIAL">Presencial</option>
            <option value="REMOTO">Remoto</option>
            <option value="HIBRIDO">Híbrido</option>
          </select>
        </div>

        <div style={{ marginTop: '1rem', color: '#475569', fontSize: '0.95rem' }}>
          {loading ? 'Cargando ofertas...' : `${pagination.total || 0} ofertas encontradas`}
        </div>

        <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
          {!loading && jobs.length === 0 && (
            <div className="card">
              <p>No hay resultados para los filtros seleccionados.</p>
            </div>
          )}

          {jobs.map((job) => (
            <article
              key={job.id}
              className="card job-card"
              style={{ border: '1px solid #e2e8f0', padding: '1.25rem' }}
            >
              <div className="job-card-content" style={{ display: 'flex', gap: '1rem' }}>
                <img
                  src={
                    toAssetUrl(job.company?.companyLogo) ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company?.companyName || 'Empresa')}&background=2563eb&color=fff`
                  }
                  alt={job.company?.companyName || 'Empresa'}
                  style={{ width: '64px', height: '64px', borderRadius: '0.5rem', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h2 style={{ color: '#0f172a', marginBottom: '0.25rem' }}>{job.title}</h2>
                  <p style={{ color: '#334155', marginBottom: '0.5rem' }}>{job.company?.companyName || 'Empresa'}</p>
                  <p style={{ color: '#64748b', marginBottom: '0.7rem', lineHeight: 1.5 }}>
                    {(job.description || '').slice(0, 180)}
                    {(job.description || '').length > 180 ? '...' : ''}
                  </p>

                  <div className="job-card-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#475569', fontSize: '0.9rem' }}>
                    <span>{job.location}</span>
                    <span>{job.workMode}</span>
                    <span>{job.experienceLevel}</span>
                    <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod)}</span>
                    <span>Publicada: {formatDate(job.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div
                className="job-card-footer"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}
              >
                <Link to={`/jobs/${job.id}`} className="btn btn-outline">
                  Ver detalle
                </Link>
                <button className="btn btn-primary" onClick={() => handleApply(job.id)}>
                  Postularme
                </button>
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <button className="btn btn-outline" disabled={(pagination.page || 1) <= 1} onClick={() => goToPage((pagination.page || 1) - 1)}>
            Anterior
          </button>
          <span style={{ alignSelf: 'center', color: '#334155' }}>
            Página {pagination.page || 1} de {pagination.pages || 1}
          </span>
          <button
            className="btn btn-outline"
            disabled={(pagination.page || 1) >= (pagination.pages || 1)}
            onClick={() => goToPage((pagination.page || 1) + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
