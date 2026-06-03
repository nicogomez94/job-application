import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { psychologistService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import './Psicologos.css';

const listToText = (value) => (Array.isArray(value) ? value.join(', ') : '');
const textToList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const initialForm = {
  firstName: '',
  lastName: '',
  displayName: '',
  phone: '',
  contactEmail: '',
  country: '',
  region: '',
  practiceProvince: '',
  specialties: '',
  ageRanges: '',
  languages: '',
  yearsExperience: '',
  remoteModality: '',
  bio: '',
};

export default function PsychologistEditProfile() {
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await psychologistService.getProfile();
        const p = res.data || {};
        setForm({
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          displayName: p.displayName || '',
          phone: p.phone || '',
          contactEmail: p.contactEmail || '',
          country: p.country || '',
          region: p.region || '',
          practiceProvince: p.practiceProvince || '',
          specialties: listToText(p.specialties),
          ageRanges: listToText(p.ageRanges),
          languages: listToText(p.languages),
          yearsExperience: p.yearsExperience ?? '',
          remoteModality: p.remoteModality || '',
          bio: p.bio || '',
        });
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const displayName = useMemo(
    () => form.displayName || `${form.firstName} ${form.lastName}`.trim(),
    [form.displayName, form.firstName, form.lastName],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        specialties: textToList(form.specialties),
        ageRanges: textToList(form.ageRanges),
        languages: textToList(form.languages),
        yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : undefined,
      };
      const res = await psychologistService.updateProfile(payload);
      updateUser(res.data?.psychologist || payload);
      toast.success('Perfil actualizado');
      navigate('/psicologo/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="psico-loading psico-page-loading">Cargando perfil...</div>;
  }

  return (
    <div className="psico-dashboard-page">
      <div className="psico-dashboard-container">
        <Link to="/psicologo/dashboard" className="psico-back-link">
          <ArrowLeft size={16} /> Volver al panel
        </Link>

        <form className="psico-edit-profile" onSubmit={handleSubmit}>
          <div className="psico-edit-profile-header">
            <div>
              <h1>Editar perfil</h1>
              {displayName && <p>{displayName}</p>}
            </div>
            <button type="submit" className="psico-btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>

          <div className="psico-edit-profile-grid">
            <label>
              Nombre
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </label>
            <label>
              Apellido
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </label>
            <label>
              Nombre visible
              <input name="displayName" value={form.displayName} onChange={handleChange} />
            </label>
            <label>
              WhatsApp
              <input name="phone" value={form.phone} onChange={handleChange} />
            </label>
            <label>
              Email de contacto
              <input name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} />
            </label>
            <label>
              País
              <input name="country" value={form.country} onChange={handleChange} />
            </label>
            <label>
              Región
              <input name="region" value={form.region} onChange={handleChange} />
            </label>
            <label>
              Provincia donde ejerce
              <input name="practiceProvince" value={form.practiceProvince} onChange={handleChange} />
            </label>
            <label>
              Especialidades
              <input name="specialties" value={form.specialties} onChange={handleChange} placeholder="Separadas por coma" />
            </label>
            <label>
              Rangos etarios
              <input name="ageRanges" value={form.ageRanges} onChange={handleChange} placeholder="Separados por coma" />
            </label>
            <label>
              Idiomas
              <input name="languages" value={form.languages} onChange={handleChange} placeholder="Separados por coma" />
            </label>
            <label>
              Años de experiencia
              <input name="yearsExperience" type="number" min="0" value={form.yearsExperience} onChange={handleChange} />
            </label>
            <label className="psico-edit-profile-wide">
              Modalidad remota
              <input name="remoteModality" value={form.remoteModality} onChange={handleChange} />
            </label>
            <label className="psico-edit-profile-wide">
              Sobre mí
              <textarea name="bio" rows={6} value={form.bio} onChange={handleChange} />
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}
