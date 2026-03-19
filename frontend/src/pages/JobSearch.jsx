import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { categoryService, jobOfferService } from '../services';
import { BACKEND_BASE_URL } from '../services/apiBaseUrl';
import './JobSearch.css';
import '../components/BackToDashboardButton.css';

const toAssetUrl = (assetPath) => {
  if (!assetPath) return null;
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) return assetPath;
  return `${BACKEND_BASE_URL}${assetPath}`;
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
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldSkipHistoryPushRef = useRef(false);
  const getFiltersFromParams = () => ({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    categoryId: searchParams.get('categoryId') || searchParams.get('category') || '',
    workMode: searchParams.get('workMode') || '',
    page: Number(searchParams.get('page') || 1),
    limit: Number(searchParams.get('limit') || 9),
  });
  const [filters, setFilters] = useState(getFiltersFromParams);
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    const initialFilters = getFiltersFromParams();
    return [
      {
        search: initialFilters.search || '',
        location: initialFilters.location || '',
        categoryId: initialFilters.categoryId || '',
        workMode: initialFilters.workMode || '',
      },
    ];
  });
  const getCategoryOffersCount = (category) => category?.activeJobOffersCount ?? category?._count?.jobOffers ?? 0;
  const categoriesOrdered = useMemo(() => {
    const isOtherCategory = (name) => {
      const normalized = String(name || '')
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      return normalized === 'otros' || normalized === 'otro';
    };

    return [...categories].sort((a, b) => {
      const aIsOther = isOtherCategory(a?.name);
      const bIsOther = isOtherCategory(b?.name);

      if (aIsOther && !bIsOther) return 1;
      if (!aIsOther && bIsOther) return -1;

      return String(a?.name || '').localeCompare(String(b?.name || ''), 'es', { sensitivity: 'base' });
    });
  }, [categories]);
  const totalCategoryOffers = categoriesOrdered.reduce((total, category) => total + getCategoryOffersCount(category), 0);
  const hasPreviousSearch = searchHistory.length > 1;

  const filtersToSearchState = (sourceFilters) => ({
    search: sourceFilters.search || '',
    location: sourceFilters.location || '',
    categoryId: sourceFilters.categoryId || '',
    workMode: sourceFilters.workMode || '',
  });

  useEffect(() => {
    setFilters(getFiltersFromParams());
  }, [searchParams]);

  useEffect(() => {
    if (shouldSkipHistoryPushRef.current) {
      shouldSkipHistoryPushRef.current = false;
      return;
    }

    const currentSearchState = filtersToSearchState(filters);
    setSearchHistory((prev) => {
      const last = prev[prev.length - 1];
      if (
        last &&
        last.search === currentSearchState.search &&
        last.location === currentSearchState.location &&
        last.categoryId === currentSearchState.categoryId &&
        last.workMode === currentSearchState.workMode
      ) {
        return prev;
      }
      return [...prev, currentSearchState];
    });
  }, [filters.search, filters.location, filters.categoryId, filters.workMode]);

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
    setFilters((prev) => {
      const nextFilters = { ...prev, [name]: value, page: 1 };
      const nextParams = new URLSearchParams();

      Object.entries(nextFilters).forEach(([key, filterValue]) => {
        if (filterValue === '' || filterValue === null || filterValue === undefined) return;
        if (key === 'page' && Number(filterValue) === 1) return;
        if (key === 'limit' && Number(filterValue) === 9) return;
        nextParams.set(key, String(filterValue));
      });

      setSearchParams(nextParams);
      return nextFilters;
    });
  };

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > (pagination.pages || 1)) return;
    setFilters((prev) => {
      const nextFilters = { ...prev, page: nextPage };
      const nextParams = new URLSearchParams();

      Object.entries(nextFilters).forEach(([key, filterValue]) => {
        if (filterValue === '' || filterValue === null || filterValue === undefined) return;
        if (key === 'page' && Number(filterValue) === 1) return;
        if (key === 'limit' && Number(filterValue) === 9) return;
        nextParams.set(key, String(filterValue));
      });

      setSearchParams(nextParams);
      return nextFilters;
    });
  };

  const goToPreviousSearch = () => {
    if (!hasPreviousSearch) return;

    const nextHistory = searchHistory.slice(0, -1);
    const previousSearch = nextHistory[nextHistory.length - 1];
    const nextFilters = {
      ...filters,
      ...previousSearch,
      page: 1,
    };

    shouldSkipHistoryPushRef.current = true;
    setSearchHistory(nextHistory);
    setFilters(nextFilters);

    const nextParams = new URLSearchParams();
    Object.entries(nextFilters).forEach(([key, filterValue]) => {
      if (filterValue === '' || filterValue === null || filterValue === undefined) return;
      if (key === 'page' && Number(filterValue) === 1) return;
      if (key === 'limit' && Number(filterValue) === 9) return;
      nextParams.set(key, String(filterValue));
    });
    setSearchParams(nextParams);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fcf7ef', paddingBottom: '3rem' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)', padding: '2.5rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', color: '#fff' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Buscar Profesión</h1>
          <p style={{fontSize: '1.2rem', opacity: 0.9, color : '#f7f7f7' }}>Encontrá ofertas activas y postulá en pocos pasos.</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '1.5rem auto 0', padding: '0 1rem' }}>
        {hasPreviousSearch && (
          <button
            type="button"
            className="back-dashboard-btn"
            onClick={goToPreviousSearch}
            style={{ marginBottom: '0.8rem' }}
          >
            <ArrowLeft size={16} />
            <span>Volver a búsqueda anterior</span>
          </button>
        )}

        <div
          className="job-search-header"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.3fr 1.3fr 1fr',
            gap: '0.75rem',
            background: '#fff',
            padding: '1rem',
            borderRadius: '0.75rem',
            boxShadow: '0 2px 6px rgba(60, 42, 18, 0.08)',
          }}
        >
          <input
            className="input"
            name="search"
            placeholder="Buscar Profesión, Empresa o Habilidad"
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
            <option value="">Todas las categorías ({totalCategoryOffers})</option>
            {categoriesOrdered.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({getCategoryOffersCount(category)})
              </option>
            ))}
          </select>
          {/* <select style={{width: 'max-content'}} className="input" name="workMode" value={filters.workMode} onChange={handleFilterChange}>
            <option value="">Profesiones Anunciadas</option>
            <option value="PRESENCIAL">Presencial</option>
            <option value="REMOTO">Remoto</option>
            <option value="HIBRIDO">Híbrido</option>
          </select> */}
        </div>

        <div style={{ marginTop: '1rem', color: '#6f604b', fontSize: '0.95rem' }}>
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
              style={{ border: '1px solid #e7dcc6', padding: '1.25rem' }}
            >
              <div className="job-card-content" style={{ display: 'flex', gap: '1rem' }}>
                <img
                  src={
                    toAssetUrl(job.company?.companyLogo) ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company?.companyName || 'Empresa')}&background=EFC89A&color=4A3A2A`
                  }
                  alt={job.company?.companyName || 'Empresa'}
                  style={{ width: '64px', height: '64px', borderRadius: '0.5rem', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h2 style={{ color: '#2f2416', marginBottom: '0.25rem' }}>{job.title}</h2>
                  <p style={{ color: '#5e4d38', marginBottom: '0.5rem' }}>{job.company?.companyName || 'Empresa'}</p>
                  <p style={{ color: '#7e705c', marginBottom: '0.7rem', lineHeight: 1.5 }}>
                    {(job.description || '').slice(0, 180)}
                    {(job.description || '').length > 180 ? '...' : ''}
                  </p>

                  <div className="job-card-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#6f604b', fontSize: '0.9rem' }}>
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
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <button className="btn btn-outline" disabled={(pagination.page || 1) <= 1} onClick={() => goToPage((pagination.page || 1) - 1)}>
            Anterior
          </button>
          <span style={{ alignSelf: 'center', color: '#5e4d38' }}>
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
