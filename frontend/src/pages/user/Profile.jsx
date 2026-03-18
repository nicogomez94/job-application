import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { userService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { BACKEND_BASE_URL } from '../../services/apiBaseUrl';
import BackToDashboardButton from '../../components/BackToDashboardButton';

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
  const [profileImage, setProfileImage] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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
        const response = await userService.getProfile();
        const user = response.data;
        setProfileImage(user.profileImage || '');
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

  useEffect(() => {
    if (!selectedImageFile) {
      setPreviewImageUrl('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedImageFile);
    setPreviewImageUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImageFile]);

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

  const handleProfileImageFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedImageFile(file);
  };

  const handleUploadProfileImage = async () => {
    if (!selectedImageFile) {
      toast.error('Seleccioná una imagen primero');
      return;
    }

    setUploadingImage(true);
    try {
      const response = await userService.uploadProfileImage(selectedImageFile);
      const nextProfileImage = response.data?.profileImage || '';
      setProfileImage(nextProfileImage);
      updateUser({ profileImage: nextProfileImage });
      setSelectedImageFile(null);
      toast.success('Foto de perfil actualizada');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo subir la foto de perfil');
    } finally {
      setUploadingImage(false);
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
      <BackToDashboardButton to="/user/dashboard" />
      <h1 style={{ marginBottom: '1rem' }}>Mi Perfil</h1>
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
            src={previewImageUrl || toAssetUrl(profileImage)}
            alt="Foto de perfil"
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
            <label style={{ color: '#5e4d38', fontWeight: 600 }}>Foto de perfil (opcional)</label>
            <input type="file" accept="image/*" onChange={handleProfileImageFileChange} />
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleUploadProfileImage}
                disabled={uploadingImage}
              >
                {uploadingImage ? 'Subiendo...' : 'Subir foto'}
              </button>
            </div>
          </div>
        </div>

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
