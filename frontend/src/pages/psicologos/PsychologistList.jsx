import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MessageCircle, Mail, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { psychologistService } from '../../services';
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
    language: searchParams.get('language') || '',
    country: searchParams.get('country') || '',
    page: Number(searchParams.get('page') || 1),
  });

  const load = async (f) => {
    setLoading(true);
    try {
      const params = { limit: 12, page: f.page };
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
      </div>

      <div className="psico-list-container">
        {/* Filters */}
        <div className="psico-filters">
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

        {/* Results */}
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

        {/* Pagination */}
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

      {/* Register CTA */}
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
    </div>
  );
}

function PsychologistCard({ psychologist: p }) {
  const name = p.displayName || `${p.firstName} ${p.lastName}`;
  const photo = toAssetUrl(p.profileImage);
  const initials = `${p.firstName?.[0] || ''}${p.lastName?.[0] || ''}`.toUpperCase();

  const whatsappUrl = p.phone
    ? `https://wa.me/${p.phone.replace(/\D/g, '')}`
    : null;

  return (
    <Link to={`/psicologos/${p.id}`} className="psico-card">
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
        <div className="psico-card-contact" onClick={(e) => e.preventDefault()}>
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="psico-btn-whatsapp">
              <MessageCircle size={14} /> WhatsApp
            </a>
          )}
          {p.contactEmail && (
            <a href={`mailto:${p.contactEmail}`} className="psico-btn-email">
              <Mail size={14} /> Email
            </a>
          )}
        </div>
      </div>
    </Link>
  );
}
