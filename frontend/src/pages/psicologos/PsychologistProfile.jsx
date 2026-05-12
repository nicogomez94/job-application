import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, Mail, ArrowLeft, MapPin, Languages, Star, BookOpen, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { psychologistService } from '../../services';
import { BACKEND_BASE_URL } from '../../services/apiBaseUrl';
import './Psicologos.css';

const toAssetUrl = (p) => {
  if (!p) return null;
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return `${BACKEND_BASE_URL}${p}`;
};

export default function PsychologistProfile() {
  const { id } = useParams();
  const [psychologist, setPsychologist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await psychologistService.getById(id);
        setPsychologist(res.data);
      } catch {
        toast.error('No se pudo cargar el perfil del psicólogo');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <div className="psico-loading psico-page-loading">Cargando perfil...</div>;
  }

  if (!psychologist) {
    return (
      <div className="psico-profile-page">
        <div className="psico-profile-notfound">
          <p>No se encontró el psicólogo.</p>
          <Link to="/psicologos" className="psico-btn-secondary">
            <ArrowLeft size={16} /> Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  const p = psychologist;
  const name = p.displayName || `${p.firstName} ${p.lastName}`;
  const photo = toAssetUrl(p.profileImage);
  const initials = `${p.firstName?.[0] || ''}${p.lastName?.[0] || ''}`.toUpperCase();
  const whatsappUrl = p.phone
    ? `https://wa.me/${p.phone.replace(/\D/g, '')}`
    : null;

  return (
    <div className="psico-profile-page">
      <div className="psico-profile-container">
        <Link to="/psicologos" className="psico-back-link">
          <ArrowLeft size={16} /> Volver al listado
        </Link>

        <div className="psico-profile-header">
          <div className="psico-profile-photo">
            {photo ? (
              <img src={photo} alt={name} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            ) : null}
            <div className="psico-profile-initials" style={photo ? { display: 'none' } : {}}>{initials}</div>
          </div>
          <div className="psico-profile-main-info">
            <h1>{name}</h1>
            {p.age && <span className="psico-profile-age">{p.age} años</span>}
            {p.country && (
              <div className="psico-profile-location">
                <MapPin size={14} /> {p.country}{p.region ? `, ${p.region}` : ''}{p.practiceProvince ? `, ${p.practiceProvince}` : ''}
              </div>
            )}
            <div className="psico-profile-contact-btns">
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="psico-btn-whatsapp psico-btn-large">
                  <MessageCircle size={18} /> Contactar por WhatsApp
                </a>
              )}
              {p.contactEmail && (
                <a href={`mailto:${p.contactEmail}`} className="psico-btn-email psico-btn-large">
                  <Mail size={18} /> Enviar Email
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="psico-profile-body">
          {p.specialties?.length > 0 && (
            <section className="psico-profile-section">
              <h2><Star size={16} /> Especialidades</h2>
              <div className="psico-tags">
                {p.specialties.map((s) => (
                  <span key={s} className="psico-tag psico-tag-specialty">{s}</span>
                ))}
              </div>
            </section>
          )}

          {p.bio && (
            <section className="psico-profile-section">
              <h2><BookOpen size={16} /> Sobre mí</h2>
              <p className="psico-profile-bio">{p.bio}</p>
            </section>
          )}

          <div className="psico-profile-details-grid">
            {p.languages?.length > 0 && (
              <div className="psico-profile-detail-card">
                <h3><Languages size={14} /> Idiomas</h3>
                <div className="psico-tags">
                  {p.languages.map((l) => <span key={l} className="psico-tag">{l}</span>)}
                </div>
              </div>
            )}

            {p.ageRanges?.length > 0 && (
              <div className="psico-profile-detail-card">
                <h3>Rango etario de atención</h3>
                <div className="psico-tags">
                  {p.ageRanges.map((a) => <span key={a} className="psico-tag">{a}</span>)}
                </div>
              </div>
            )}

            {p.yearsExperience != null && (
              <div className="psico-profile-detail-card">
                <h3><Clock size={14} /> Experiencia</h3>
                <p>{p.yearsExperience} {p.yearsExperience === 1 ? 'año' : 'años'}</p>
              </div>
            )}

            {p.remoteModality && (
              <div className="psico-profile-detail-card">
                <h3>Modalidad</h3>
                <p>{p.remoteModality}</p>
              </div>
            )}

            {(p.universityDegree || p.universityName) && (
              <div className="psico-profile-detail-card">
                <h3>Formación</h3>
                {p.universityDegree && <p>{p.universityDegree}</p>}
                {p.universityName && <p className="psico-secondary-text">{p.universityName}</p>}
              </div>
            )}
          </div>

          <div className="psico-profile-disclaimer">
            <strong>Aviso:</strong> La atención remota no es recomendada para crisis aguda con riesgo de vida o psicosis activa que requiera contención física inmediata, las cuales necesitan atención presencial de emergencia.
          </div>
        </div>
      </div>
    </div>
  );
}
