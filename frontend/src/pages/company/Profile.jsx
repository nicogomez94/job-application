import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { companyService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { BACKEND_BASE_URL } from '../../services/apiBaseUrl';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import RatingSummary from '../../components/RatingSummary';

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
  const [companyLogo, setCompanyLogo] = useState('');
  const [previewLogoUrl, setPreviewLogoUrl] = useState('');
  const [ratingSummary, setRatingSummary] = useState({ average: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { updateUser } = useAuthStore();

  const toAssetUrl = (assetPath) => {
    if (!assetPath) return '/profile-placeholder.svg';
    if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) return assetPath;

    const rawPath = String(assetPath).trim();
    const noApiPrefix = rawPath.replace(/^\/?api\//i, '/');
    const normalizedPath = noApiPrefix.startsWith('/') ? noApiPrefix : `/${noApiPrefix}`;

    return `${BACKEND_BASE_URL}${normalizedPath}`;
  };

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const response = await companyService.getProfile();
        const company = response.data;
        setCompanyLogo(company.companyLogo || '');
        setRatingSummary({
          average: Number(company.ratingSummary?.average || 0),
          total: Number(company.ratingSummary?.total || 0),
        });
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

  useEffect(() => {
    if (!logoFile) {
      setPreviewLogoUrl('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(logoFile);
    setPreviewLogoUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [logoFile]);

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
      const nextLogo = response.data?.companyLogo || '';
      setCompanyLogo(nextLogo);
      updateUser({ companyLogo: nextLogo });
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1rem',
            padding: '0.9rem',
            border: '1px solid #ebdfcb',
            borderRadius: '0.7rem',
            background: '#fdf9f2',
          }}
        >
          <img
            src={previewLogoUrl || toAssetUrl(companyLogo)}
            alt="Logo de empresa"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '999px',
              objectFit: 'cover',
              border: '2px solid #dfcfb6',
              background: '#f1eadf',
            }}
          />
          <div style={{ display: 'grid', gap: '0.45rem' }}>
            <label htmlFor="company-profile-logo" style={{ color: '#5e4d38', fontWeight: 600 }}>Logo de empresa (opcional)</label>
            <input id="company-profile-logo" type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-outline" type="button" onClick={handleUploadLogo} disabled={uploading}>
                {uploading ? 'Subiendo...' : 'Subir logo'}
              </button>
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <RatingSummary
              title="Calificacion de la empresa"
              average={ratingSummary.average}
              total={ratingSummary.total}
              emptyText="Todavia no tenes calificaciones"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label htmlFor="company-profile-name" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Nombre de la empresa
            </label>
            <input
              id="company-profile-name"
              className="input"
              name="companyName"
              placeholder="Nombre de la empresa"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="company-profile-description" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Descripción
            </label>
            <textarea
              id="company-profile-description"
              className="input"
              name="description"
              placeholder="Descripción"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="company-profile-website" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Sitio web
              </label>
              <input id="company-profile-website" className="input" name="website" placeholder="Sitio web" value={formData.website} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="company-profile-location" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Ubicación
              </label>
              <input id="company-profile-location" className="input" name="location" placeholder="Ubicación" value={formData.location} onChange={handleChange} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="company-profile-industry" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Industria
              </label>
              <input id="company-profile-industry" className="input" name="industry" placeholder="Industria" value={formData.industry} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="company-profile-size" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Tamaño de empresa
              </label>
              <input id="company-profile-size" className="input" name="size" placeholder="Tamaño de empresa" value={formData.size} onChange={handleChange} />
            </div>
          </div>
        </div>

        <button className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
