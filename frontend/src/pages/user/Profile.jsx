import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { userService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { BACKEND_BASE_URL } from '../../services/apiBaseUrl';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import RatingSummary from '../../components/RatingSummary';

const initialForm = {
  firstName: '',
  lastName: '',
  phone: '',
  title: '',
  location: '',
  bio: '',
  experienceText: '',
  linkedinUrl: '',
  portfolioUrl: '',
  skillsText: '',
  languagesText: '',
};

const MAX_OTHER_FILES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const getFilesExceedingSize = (files) => files.filter((file) => file.size > MAX_FILE_SIZE);
const getFileNameFromPath = (assetPath) => {
  if (!assetPath) return '';
  const cleaned = String(assetPath).split('?')[0].trim();
  const segments = cleaned.split('/');
  return segments[segments.length - 1] || cleaned;
};
const normalizeUploadedFiles = (uploadedFiles) =>
  (Array.isArray(uploadedFiles) ? uploadedFiles : []).filter((file) => file?.url);
const normalizeExperienceText = (experience) => {
  if (!experience) return '';
  if (typeof experience === 'string') return experience;
  if (Array.isArray(experience)) {
    return experience
      .map((item) => {
        if (!item) return '';
        if (typeof item === 'string') return item;
        if (typeof item === 'object') {
          return [item.position, item.company, item.description].filter(Boolean).join(' - ');
        }
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }
  if (typeof experience === 'object') {
    return [experience.position, experience.company, experience.description].filter(Boolean).join(' - ');
  }
  return '';
};

export default function UserProfile() {
  const [formData, setFormData] = useState(initialForm);
  const [profileImage, setProfileImage] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [ratingSummary, setRatingSummary] = useState({ average: 0, total: 0 });
  const [cvUrl, setCvUrl] = useState('');
  const [selectedCvFile, setSelectedCvFile] = useState(null);
  const [otherFiles, setOtherFiles] = useState([]);
  const [selectedOtherFiles, setSelectedOtherFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [deletingCv, setDeletingCv] = useState(false);
  const [uploadingOtherFiles, setUploadingOtherFiles] = useState(false);
  const [deletingOtherIndex, setDeletingOtherIndex] = useState(null);
  const { updateUser } = useAuthStore();
  const getFileKey = (file) => `${file.name}-${file.size}-${file.lastModified}`;

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
        setCvUrl(user.cvUrl || '');
        setRatingSummary({
          average: Number(user.ratingSummary?.average || 0),
          total: Number(user.ratingSummary?.total || 0),
        });
        setOtherFiles(normalizeUploadedFiles(user.uploadedFiles));
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
          title: user.title || '',
          location: user.location || '',
          bio: user.bio || '',
          experienceText: normalizeExperienceText(user.experience),
          linkedinUrl: user.linkedinUrl || '',
          portfolioUrl: user.portfolioUrl || '',
          skillsText: (user.skills || []).join(', '),
          languagesText: (user.languages || []).join(', '),
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
        experience: formData.experienceText.trim() || null,
        linkedinUrl: formData.linkedinUrl.trim() || null,
        portfolioUrl: formData.portfolioUrl.trim() || null,
        skills: formData.skillsText
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        languages: formData.languagesText
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

  const handleCvFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('El archivo debe pesar como máximo 5 MB');
      e.target.value = '';
      return;
    }

    setSelectedCvFile(file);
    e.target.value = '';
  };

  const handleUploadCv = async () => {
    if (!selectedCvFile) {
      toast.error('Seleccioná un CV primero');
      return;
    }

    setUploadingCv(true);
    try {
      const response = await userService.uploadCV(selectedCvFile);
      const nextCv = response.data?.cvUrl || '';
      setCvUrl(nextCv);
      updateUser({ cvUrl: nextCv });
      setSelectedCvFile(null);
      toast.success('CV actualizado');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo subir el CV');
    } finally {
      setUploadingCv(false);
    }
  };

  const handleDeleteCv = async () => {
    const confirmed = window.confirm('¿Estás seguro de que querés borrar este archivo?');
    if (!confirmed) return;

    setDeletingCv(true);
    try {
      await userService.deleteCV();
      setCvUrl('');
      updateUser({ cvUrl: null });
      toast.success('CV eliminado');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo eliminar el CV');
    } finally {
      setDeletingCv(false);
    }
  };

  const handleOtherFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) return;

    const oversizedFiles = getFilesExceedingSize(selectedFiles);
    if (oversizedFiles.length > 0) {
      toast.error('Cada archivo debe pesar como máximo 5 MB');
      e.target.value = '';
      return;
    }

    const existingKeys = new Set(selectedOtherFiles.map(getFileKey));
    const newUniqueFiles = selectedFiles.filter((file) => !existingKeys.has(getFileKey(file)));
    const mergedFiles = [...selectedOtherFiles, ...newUniqueFiles];

    if (otherFiles.length + mergedFiles.length > MAX_OTHER_FILES) {
      toast.error(`Podés subir hasta ${MAX_OTHER_FILES} archivos varios`);
      e.target.value = '';
      return;
    }

    setSelectedOtherFiles(mergedFiles);
    e.target.value = '';
  };

  const handleRemoveSelectedOtherFile = (indexToRemove) => {
    const confirmed = window.confirm('¿Estás seguro de que querés borrar este archivo?');
    if (!confirmed) return;

    setSelectedOtherFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUploadOtherFiles = async () => {
    if (!selectedOtherFiles.length) {
      toast.error('Seleccioná archivos para subir');
      return;
    }

    setUploadingOtherFiles(true);
    try {
      let latestFiles = otherFiles;

      for (const file of selectedOtherFiles) {
        const response = await userService.uploadOtherFile(file);
        latestFiles = normalizeUploadedFiles(response.data?.uploadedFiles);
      }

      setOtherFiles(latestFiles);
      updateUser({ uploadedFiles: latestFiles });
      setSelectedOtherFiles([]);
      toast.success('Archivos varios actualizados');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudieron subir los archivos');
    } finally {
      setUploadingOtherFiles(false);
    }
  };

  const handleDeleteOtherFile = async (index) => {
    const confirmed = window.confirm('¿Estás seguro de que querés borrar este archivo?');
    if (!confirmed) return;

    setDeletingOtherIndex(index);
    try {
      const response = await userService.deleteOtherFile(index);
      const nextFiles = normalizeUploadedFiles(response.data?.uploadedFiles);
      setOtherFiles(nextFiles);
      updateUser({ uploadedFiles: nextFiles });
      toast.success('Archivo eliminado');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo eliminar el archivo');
    } finally {
      setDeletingOtherIndex(null);
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
      <h1 style={{ marginBottom: '1rem' }}>MI perfil de trabajo</h1>
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
            <label htmlFor="profile-image" style={{ color: '#5e4d38', fontWeight: 600 }}>Foto de perfil (opcional)</label>
            <input id="profile-image" type="file" accept="image/*" onChange={handleProfileImageFileChange} />
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
          <div style={{ marginLeft: 'auto' }}>
            <RatingSummary
              title="Tu calificacion freelance"
              average={ratingSummary.average}
              total={ratingSummary.total}
              emptyText="Todavia no recibiste calificaciones"
            />
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gap: '0.55rem',
            marginBottom: '1rem',
            padding: '0.9rem',
            border: '1px solid #ebdfcb',
            borderRadius: '0.7rem',
            background: '#fdf9f2',
          }}
        >
          <label htmlFor="profile-cv" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.1rem' }}>
            CV (PDF, JPG o Word. máximo 1 archivo)
          </label>
          <input id="profile-cv" type="file" onChange={handleCvFileChange} />

          {selectedCvFile ? (
            <div style={{ marginTop: '0.3rem', display: 'grid', gap: '0.4rem' }}>
              <p style={{ margin: 0, color: '#6f604b', fontSize: '0.92rem' }}>1 archivo seleccionado</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', border: '1px solid #d7c9b7', borderRadius: '0.45rem', padding: '0.4rem 0.55rem', background: '#faf7f2' }}>
                <span title={selectedCvFile.name} style={{ fontSize: '0.9rem', color: '#5e4d38', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedCvFile.name}
                </span>
                <button type="button" onClick={() => setSelectedCvFile(null)} style={{ border: '1px solid #c94f4f', background: '#fff', color: '#c94f4f', borderRadius: '0.4rem', padding: '0.25rem 0.55rem', cursor: 'pointer', fontSize: '0.82rem', flexShrink: 0 }}>
                  Borrar
                </button>
              </div>
            </div>
          ) : cvUrl ? (
            <div style={{ marginTop: '0.3rem', display: 'grid', gap: '0.4rem' }}>
              <p style={{ margin: 0, color: '#6f604b', fontSize: '0.92rem' }}>CV cargado</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', border: '1px solid #d7c9b7', borderRadius: '0.45rem', padding: '0.4rem 0.55rem', background: '#faf7f2' }}>
                <a href={toAssetUrl(cvUrl)} target="_blank" rel="noreferrer" title={getFileNameFromPath(cvUrl)} style={{ fontSize: '0.9rem', color: '#5e4d38', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {getFileNameFromPath(cvUrl)}
                </a>
                <button type="button" onClick={handleDeleteCv} disabled={deletingCv} style={{ border: '1px solid #c94f4f', background: '#fff', color: '#c94f4f', borderRadius: '0.4rem', padding: '0.25rem 0.55rem', cursor: 'pointer', fontSize: '0.82rem', flexShrink: 0 }}>
                  {deletingCv ? 'Eliminando...' : 'Borrar'}
                </button>
              </div>
            </div>
          ) : (
            <p style={{ margin: 0, color: '#7e705c', fontSize: '0.92rem' }}>Sin CV cargado</p>
          )}
          <button type="button" className="btn btn-outline" onClick={handleUploadCv} disabled={uploadingCv}>
            {uploadingCv ? 'Subiendo...' : cvUrl ? 'Reemplazar CV' : 'Subir CV'}
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gap: '0.55rem',
            marginBottom: '1rem',
            padding: '0.9rem',
            border: '1px solid #ebdfcb',
            borderRadius: '0.7rem',
            background: '#fdf9f2',
          }}
        >
          <label htmlFor="profile-other-files" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.1rem' }}>
            Archivos varios (PDF, JPG o Word. máximo {MAX_OTHER_FILES} archivos)
          </label>
          <input id="profile-other-files" type="file" onChange={handleOtherFilesChange} multiple />

          {selectedOtherFiles.length > 0 && (
            <div style={{ marginTop: '0.3rem' }}>
              <p style={{ margin: 0, color: '#6f604b', fontSize: '0.92rem' }}>
                {selectedOtherFiles.length} archivo{selectedOtherFiles.length === 1 ? '' : 's'} seleccionado
                {selectedOtherFiles.length === 1 ? '' : 's'}
              </p>
              <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.4rem' }}>
                {selectedOtherFiles.map((file, index) => (
                  <div key={getFileKey(file)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', border: '1px solid #d7c9b7', borderRadius: '0.45rem', padding: '0.4rem 0.55rem', background: '#faf7f2' }}>
                    <span title={file.name} style={{ fontSize: '0.9rem', color: '#5e4d38', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </span>
                    <button type="button" onClick={() => handleRemoveSelectedOtherFile(index)} style={{ border: '1px solid #c94f4f', background: '#fff', color: '#c94f4f', borderRadius: '0.4rem', padding: '0.25rem 0.55rem', cursor: 'pointer', fontSize: '0.82rem', flexShrink: 0 }}>
                      Borrar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {otherFiles.length > 0 && (
            <div style={{ marginTop: selectedOtherFiles.length ? '0.3rem' : 0 }}>
              <p style={{ margin: 0, color: '#6f604b', fontSize: '0.92rem' }}>
                {otherFiles.length} archivo{otherFiles.length === 1 ? '' : 's'} subido
                {otherFiles.length === 1 ? '' : 's'}
              </p>
              <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.4rem' }}>
                {otherFiles.map((file, index) => (
                  <div key={`${file.url}-${index}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', border: '1px solid #d7c9b7', borderRadius: '0.45rem', padding: '0.4rem 0.55rem', background: '#faf7f2' }}>
                    <a href={toAssetUrl(file.url)} target="_blank" rel="noreferrer" title={file.name || getFileNameFromPath(file.url)} style={{ fontSize: '0.9rem', color: '#5e4d38', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name || getFileNameFromPath(file.url)}
                    </a>
                    <button type="button" onClick={() => handleDeleteOtherFile(index)} disabled={deletingOtherIndex === index} style={{ border: '1px solid #c94f4f', background: '#fff', color: '#c94f4f', borderRadius: '0.4rem', padding: '0.25rem 0.55rem', cursor: 'pointer', fontSize: '0.82rem', flexShrink: 0 }}>
                      {deletingOtherIndex === index ? 'Eliminando...' : 'Borrar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="button" className="btn btn-outline" onClick={handleUploadOtherFiles} disabled={uploadingOtherFiles}>
            {uploadingOtherFiles ? 'Subiendo...' : 'Subir archivos varios'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label htmlFor="user-first-name" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Nombre
            </label>
            <input id="user-first-name" className="input" name="firstName" placeholder="Nombre" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="user-last-name" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Apellido
            </label>
            <input id="user-last-name" className="input" name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleChange} required />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <label htmlFor="user-phone" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Whatsapp
            </label>
            <input id="user-phone" className="input" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="user-location" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Ubicación
            </label>
            <input id="user-location" className="input" name="location" placeholder="Ubicación" value={formData.location} onChange={handleChange} />
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="user-title" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
            Título profesional
          </label>
          <input id="user-title" className="input" name="title" placeholder="Título profesional" value={formData.title} onChange={handleChange} />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="user-bio" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
            Sobre mí
          </label>
          <textarea
            id="user-bio"
            className="input"
            name="bio"
            placeholder="Contá brevemente sobre vos"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="user-experience" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
            Experiencia laboral
          </label>
          <textarea
            id="user-experience"
            className="input"
            name="experienceText"
            placeholder="Contá brevemente tu experiencia laboral"
            value={formData.experienceText}
            onChange={handleChange}
            rows={4}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="user-skills" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
            Skills
          </label>
          <input
            id="user-skills"
            className="input"
            name="skillsText"
            placeholder="Skills separadas por coma (ej: React, Node.js, SQL)"
            value={formData.skillsText}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="user-languages" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
            Idiomas
          </label>
          <input
            id="user-languages"
            className="input"
            name="languagesText"
            placeholder="Idiomas separados por coma (ej: Español, Inglés, Portugués)"
            value={formData.languagesText}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <label htmlFor="user-linkedin-url" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              LinkedIn URL
            </label>
            <input id="user-linkedin-url" className="input" name="linkedinUrl" placeholder="LinkedIn URL" value={formData.linkedinUrl} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="user-portfolio-url" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Portfolio URL
            </label>
            <input id="user-portfolio-url" className="input" name="portfolioUrl" placeholder="Portfolio URL" value={formData.portfolioUrl} onChange={handleChange} />
          </div>
        </div>

        <button className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
