import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Globe, Search, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { psychologistService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { BACKEND_BASE_URL } from '../../services/apiBaseUrl';
import './Psicologos.css';

const LANGUAGES = [
  'Español', 'Inglés', 'Portugués', 'Francés', 'Alemán', 'Italiano',
  'Chino', 'Japonés', 'Árabe', 'Ruso',
];

const COUNTRIES = [
  'Argentina', 'Uruguay', 'Chile', 'Paraguay', 'Bolivia', 'Perú',
  'Colombia', 'Venezuela', 'México', 'España', 'Estados Unidos',
  'Brasil', 'Otro',
];

const toAssetUrl = (p) => {
  if (!p) return null;
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return `${BACKEND_BASE_URL}${p}`;
};

export default function PsychologistList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [psychologists, setPsychologists] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12 });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    language: searchParams.get('language') || '',
    country: searchParams.get('country') || '',
    page: Number(searchParams.get('page') || 1),
  });
  const { isAuthenticated, userType } = useAuthStore();

  const load = async (f) => {
    setLoading(true);
    try {
      const params = { limit: 12, page: f.page };
      if (f.search) params.search = f.search;
      if (f.language) params.language = f.language;
      if (f.country) params.country = f.country;
      const res = await psychologistService.list(params);
      setPsychologists(res.data.psychologists || []);
      setPagination({ total: res.data.total, page: res.data.page, limit: res.data.limit });
    } catch {
      toast.error('No se pudo cargar el listado de psicólogos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const next = { ...filters, [name]: value, page: 1 };
    setFilters(next);
    const params = {};
    if (next.search) params.search = next.search;
    if (next.language) params.language = next.language;
    if (next.country) params.country = next.country;
    setSearchParams(params);
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  return (
    <div className="psico-list-page">
      <div className="psico-list-hero">
        <h1>Psicólogos en Línea</h1>
        <p>Encontrá un profesional de la salud mental que te acompañe de forma remota.</p>
        {isAuthenticated && userType === 'patient' && (
          <div className="psico-list-hero-btns">
            <Link to="/psicologos/mi-cuenta" className="psico-hero-btn-solid">
              Mis solicitudes
            </Link>
          </div>
        )}
        {!isAuthenticated && (
          <div className="psico-list-hero-btns">
            <Link to="/psicologos/login-paciente" className="psico-hero-btn-outline">Iniciar sesión</Link>
            <Link to="/psicologos/registro-paciente" className="psico-hero-btn-solid">Crear cuenta</Link>
          </div>
        )}
      </div>

      <div className="psico-list-container">
        <div className="psico-filters">
          <div className="psico-filter-group psico-filter-search">
            <label htmlFor="search">Buscar psicólogo</label>
            <div className="psico-search-input-wrap">
              <Search size={18} aria-hidden="true" />
              <input
                id="search"
                name="search"
                type="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Nombre, especialidad, idioma o país"
              />
            </div>
          </div>
          <div className="psico-filter-group">
            <label htmlFor="language">Idioma</label>
            <select id="language" name="language" value={filters.language} onChange={handleFilterChange}>
              <option value="">Todos los idiomas</option>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="psico-filter-group">
            <label htmlFor="country">País</label>
            <select id="country" name="country" value={filters.country} onChange={handleFilterChange}>
              <option value="">Todos los países</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="psico-loading">Cargando psicólogos...</div>
        ) : psychologists.length === 0 ? (
          <div className="psico-empty">
            <p>No se encontraron psicólogos con los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="psico-grid">
            {psychologists.map((p) => (
              <PsychologistCard key={p.id} psychologist={p} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="psico-pagination">
            <button
              disabled={filters.page <= 1}
              onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
            >
              Anterior
            </button>
            <span>{filters.page} / {totalPages}</span>
            <button
              disabled={filters.page >= totalPages}
              onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {!isAuthenticated && (
        <div className="psico-register-cta">
          <div className="psico-register-cta-content">
            <Globe size={32} />
            <h2>¿Sos psicólogo/a?</h2>
            <p>Registrarte en la plataforma y empezá a recibir pacientes de forma remota.</p>
            <Link to="/register/psicologo" className="psico-btn-primary">
              Registrarme como psicólogo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function PsychologistCard({ psychologist: p }) {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuthStore();
  const name = p.displayName || `${p.firstName} ${p.lastName}`;
  const photo = toAssetUrl(p.profileImage);
  const initials = `${p.firstName?.[0] || ''}${p.lastName?.[0] || ''}`.toUpperCase();

  const openProfile = () => {
    navigate(`/psicologos/${p.id}`);
  };

  const handleCardKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProfile();
    }
  };

  const stopCardNavigation = (e) => {
    e.stopPropagation();
  };

  const handleHireClick = (e) => {
    stopCardNavigation(e);
    if (!isAuthenticated || userType !== 'patient') {
      navigate('/psicologos/login-paciente', { state: { from: `/psicologos/${p.id}` } });
    } else {
      navigate(`/psicologos/${p.id}`);
    }
  };

  return (
    <article
      className="psico-card psico-card-clickable"
      role="link"
      tabIndex={0}
      onClick={openProfile}
      onKeyDown={handleCardKeyDown}
      aria-label={`Ver perfil de ${name}`}
    >
      <div className="psico-card-photo">
        {photo ? (
          <img src={photo} alt={name} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
        ) : null}
        <div className="psico-card-initials" style={photo ? { display: 'none' } : {}}>{initials}</div>
      </div>
      <div className="psico-card-info">
        <h3>{name}</h3>
        {p.age && <span className="psico-card-age">{p.age} años</span>}
        {p.country && <span className="psico-card-country">{p.country}</span>}
        {p.specialties?.length > 0 && (
          <p className="psico-card-specialty">{p.specialties[0]}</p>
        )}
        {p.languages?.length > 0 && (
          <div className="psico-card-langs">
            {p.languages.slice(0, 3).map((l) => (
              <span key={l} className="psico-tag">{l}</span>
            ))}
          </div>
        )}
        <div className="psico-card-contact">
          <button
            className="psico-btn-hire"
            onClick={handleHireClick}
          >
            <UserPlus size={14} /> Contratar
          </button>
        </div>
      </div>
    </article>
  );
}
