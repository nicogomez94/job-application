import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { companyService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const initialForm = {
  companyName: '',
  description: '',
  website: '',
  location: '',
  industry: '',
  size: '',
};

export default function CompanyProfile() {
  const [formData, setFormData] = useState(initialForm);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { updateUser } = useAuthStore();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const response = await companyService.getProfile();
        const company = response.data;
        setFormData({
          companyName: company.companyName || '',
          description: company.description || '',
          website: company.website || '',
          location: company.location || '',
          industry: company.industry || '',
          size: company.size || '',
        });
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudo cargar el perfil de empresa');
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
        companyName: formData.companyName.trim(),
        description: formData.description.trim() || null,
        website: formData.website.trim() || null,
        location: formData.location.trim() || null,
        industry: formData.industry.trim() || null,
        size: formData.size.trim() || null,
      };
      const response = await companyService.updateProfile(payload);
      updateUser(response.data?.company || {});
      toast.success('Perfil actualizado');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadLogo = async () => {
    if (!logoFile) {
      toast.error('Seleccioná un logo');
      return;
    }
    setUploading(true);
    try {
      const response = await companyService.uploadLogo(logoFile);
      updateUser({ companyLogo: response.data?.companyLogo });
      setLogoFile(null);
      toast.success('Logo actualizado');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo subir el logo');
    } finally {
      setUploading(false);
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
      <BackToDashboardButton to="/company/dashboard" />
      <h1 style={{ marginBottom: '1rem' }}>Perfil de Empresa</h1>

      <form className="card" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <input
            className="input"
            name="companyName"
            placeholder="Nombre de la empresa"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
          <textarea
            className="input"
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            style={{ resize: 'vertical' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input className="input" name="website" placeholder="Sitio web" value={formData.website} onChange={handleChange} />
            <input className="input" name="location" placeholder="Ubicación" value={formData.location} onChange={handleChange} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input className="input" name="industry" placeholder="Industria" value={formData.industry} onChange={handleChange} />
            <input className="input" name="size" placeholder="Tamaño de empresa" value={formData.size} onChange={handleChange} />
          </div>
        </div>

        <button className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2 style={{ marginBottom: '0.8rem' }}>Logo de empresa</h2>
        <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
        <button className="btn btn-outline" style={{ marginTop: '0.8rem' }} onClick={handleUploadLogo} disabled={uploading}>
          {uploading ? 'Subiendo...' : 'Subir logo'}
        </button>
      </div>
    </div>
  );
}
