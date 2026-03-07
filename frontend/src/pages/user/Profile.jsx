import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { userService } from '../../services';
import { useAuthStore } from '../../context/authStore';

const initialForm = {
  firstName: '',
  lastName: '',
  phone: '',
  title: '',
  location: '',
  bio: '',
  linkedinUrl: '',
  portfolioUrl: '',
  skillsText: '',
};

export default function UserProfile() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { updateUser } = useAuthStore();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const response = await userService.getProfile();
        const user = response.data;
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
          title: user.title || '',
          location: user.location || '',
          bio: user.bio || '',
          linkedinUrl: user.linkedinUrl || '',
          portfolioUrl: user.portfolioUrl || '',
          skillsText: (user.skills || []).join(', '),
        });
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudo cargar tu perfil');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim() || null,
        title: formData.title.trim() || null,
        location: formData.location.trim() || null,
        bio: formData.bio.trim() || null,
        linkedinUrl: formData.linkedinUrl.trim() || null,
        portfolioUrl: formData.portfolioUrl.trim() || null,
        skills: formData.skillsText
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const response = await userService.updateProfile(payload);
      updateUser(response.data?.user || {});
      toast.success('Perfil actualizado');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Mi Perfil</h1>
      <form className="card" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <input className="input" name="firstName" placeholder="Nombre" value={formData.firstName} onChange={handleChange} required />
          <input className="input" name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleChange} required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <input className="input" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} />
          <input className="input" name="location" placeholder="Ubicación" value={formData.location} onChange={handleChange} />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <input className="input" name="title" placeholder="Título profesional" value={formData.title} onChange={handleChange} />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <textarea
            className="input"
            name="bio"
            placeholder="Resumen profesional"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <input
            className="input"
            name="skillsText"
            placeholder="Skills separadas por coma (ej: React, Node.js, SQL)"
            value={formData.skillsText}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <input className="input" name="linkedinUrl" placeholder="LinkedIn URL" value={formData.linkedinUrl} onChange={handleChange} />
          <input className="input" name="portfolioUrl" placeholder="Portfolio URL" value={formData.portfolioUrl} onChange={handleChange} />
        </div>

        <button className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
