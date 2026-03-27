import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService, userService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { DEBUG_FORM_DATA, DEBUG_MODE } from '../../config/debug';
import './Register.css';

const MAX_OTHER_FILES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const getFilesExceedingSize = (files) => files.filter((file) => file.size > MAX_FILE_SIZE);

const getInitialForm = () => {
  const base = DEBUG_MODE
    ? { ...DEBUG_FORM_DATA.registerUser }
    : {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
      };

  return {
    ...base,
    cvFile: base.cvFile || null,
    otherFiles: Array.isArray(base.otherFiles) ? base.otherFiles : [],
  };
};

export default function RegisterUser() {
  const [formData, setFormData] = useState(getInitialForm);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const userType = 'user';

  const getFileKey = (file) => `${file.name}-${file.size}-${file.lastModified}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCvFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error('El archivo debe pesar como máximo 5 MB');
      e.target.value = '';
      return;
    }
    setFormData((prev) => ({ ...prev, cvFile: file }));
    e.target.value = '';
  };

  const handleOtherFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    const oversizedFiles = getFilesExceedingSize(selectedFiles);

    if (oversizedFiles.length > 0) {
      toast.error('Cada archivo debe pesar como máximo 5 MB');
      e.target.value = '';
      return;
    }

    const existingKeys = new Set(formData.otherFiles.map(getFileKey));
    const newUniqueFiles = selectedFiles.filter((file) => !existingKeys.has(getFileKey(file)));
    const mergedFiles = [...formData.otherFiles, ...newUniqueFiles];

    if (mergedFiles.length > MAX_OTHER_FILES) {
      toast.error(`Podés subir hasta ${MAX_OTHER_FILES} archivos`);
      e.target.value = '';
      return;
    }

    setFormData((prev) => ({ ...prev, otherFiles: mergedFiles }));
    e.target.value = '';
  };

  const handleRemoveOtherFile = (fileIndex) => {
    const confirmed = window.confirm('¿Estás seguro de que querés borrar este archivo?');
    if (!confirmed) return;

    setFormData((prev) => ({
      ...prev,
      otherFiles: prev.otherFiles.filter((_, index) => index !== fileIndex),
    }));
  };

  const handleRemoveCv = () => {
    const confirmed = window.confirm('¿Estás seguro de que querés borrar este archivo?');
    if (!confirmed) return;

    setFormData((prev) => ({ ...prev, cvFile: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.cvFile && formData.cvFile.size > MAX_FILE_SIZE) {
      toast.error('El CV debe pesar como máximo 5 MB');
      return;
    }

    if (getFilesExceedingSize(formData.otherFiles).length > 0) {
      toast.error('Cada archivo debe pesar como máximo 5 MB');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
      };

      const response = await authService.registerUser(payload);
      const { user, token } = response.data;

      setAuth(user, 'user', token);

      try {
        if (formData.cvFile) {
          await userService.uploadCV(formData.cvFile);
        }
        for (const file of formData.otherFiles) {
          await userService.uploadOtherFile(file);
        }
        const totalUploaded = (formData.cvFile ? 1 : 0) + formData.otherFiles.length;
        if (totalUploaded > 0) {
          toast.success(
            totalUploaded === 1
              ? 'Archivo subido exitosamente'
              : `${totalUploaded} archivos subidos exitosamente`
          );
        }
      } catch (uploadError) {
        toast.error(uploadError.response?.data?.error || 'No se pudieron subir los archivos');
      }

      toast.success('Cuenta creada exitosamente');
      navigate('/user/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-container"
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/fondo2.jfif')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '2rem 1rem',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div
        className="register-box"
        style={{
          width: '100%',
          maxWidth: '680px',
          background: '#fff',
          borderRadius: '1rem',
          boxShadow: '0 20px 60px rgba(60, 42, 18, 0.22)',
          overflow: 'hidden',
        }}
      >
        <div
          className="register-header"
          style={{
            background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
            color: '#fff',
            padding: '2rem',
          }}
        >
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Registro de Profesional</h1>
          <p style={{ opacity: 0.9 }}>Creá tu cuenta para postularte a ofertas laborales</p>
        </div>

        <form className="register-form" style={{ padding: '2rem' }} onSubmit={handleSubmit}>
          <div className="register-user-type-selector">
            <button
              type="button"
              onClick={() => navigate('/register/user')}
              className={`register-user-type-btn ${
                userType === 'user'
                  ? 'register-user-type-btn-active'
                  : 'register-user-type-btn-inactive'
              }`}
            >
              Profesional
            </button>
            <button
              type="button"
              onClick={() => navigate('/register/company')}
              className={`register-user-type-btn ${
                userType === 'company'
                  ? 'register-user-type-btn-active'
                  : 'register-user-type-btn-inactive'
              }`}
            >
              Empresa
            </button>
          </div>

          <div className="register-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="register-user-first-name" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Nombre
              </label>
              <input
                id="register-user-first-name"
                className="input"
                name="firstName"
                placeholder="Nombre"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="register-user-last-name" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Apellido
              </label>
              <input
                id="register-user-last-name"
                className="input"
                name="lastName"
                placeholder="Apellido"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="register-user-email" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Email
            </label>
            <input
              id="register-user-email"
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label htmlFor="register-user-password" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Contraseña
              </label>
              <input
                id="register-user-password"
                className="input"
                type="password"
                name="password"
                placeholder="Contraseña (mín. 6)"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>
            <div>
              <label htmlFor="register-user-confirm-password" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Confirmar contraseña
              </label>
              <input
                id="register-user-confirm-password"
                className="input"
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="register-user-phone" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Teléfono
            </label>
            <input
              id="register-user-phone"
              className="input"
              name="phone"
              placeholder="Teléfono (opcional)"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="register-user-cv" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem' }}>
              CV (PDF, JPG o Word. máximo 1 archivo)
            </label>
            <input id="register-user-cv" type="file" onChange={handleCvFileChange} />
            {formData.cvFile && (
              <div style={{ marginTop: '0.6rem' }}>
                <p style={{ margin: 0, color: '#6f604b', fontSize: '0.92rem' }}>
                  1 archivo seleccionado
                </p>
                <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.4rem' }}>
                  <div
                    key={getFileKey(formData.cvFile)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.6rem',
                      border: '1px solid #d7c9b7',
                      borderRadius: '0.45rem',
                      padding: '0.4rem 0.55rem',
                      background: '#faf7f2',
                    }}
                  >
                    <span
                      title={formData.cvFile.name}
                      style={{
                        fontSize: '0.9rem',
                        color: '#5e4d38',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formData.cvFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCv}
                      style={{
                        border: '1px solid #c94f4f',
                        background: '#fff',
                        color: '#c94f4f',
                        borderRadius: '0.4rem',
                        padding: '0.25rem 0.55rem',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        flexShrink: 0,
                      }}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="register-user-other-files" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem' }}>
              Archivos varios (PDF, JPG o Word. máximo 4 archivos)
            </label>
            <input id="register-user-other-files" type="file" onChange={handleOtherFilesChange} multiple />
            {formData.otherFiles.length > 0 && (
              <div style={{ marginTop: '0.6rem' }}>
                <p style={{ margin: 0, color: '#6f604b', fontSize: '0.92rem' }}>
                  {formData.otherFiles.length} archivo{formData.otherFiles.length === 1 ? '' : 's'} seleccionado
                  {formData.otherFiles.length === 1 ? '' : 's'}
                </p>
                <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.4rem' }}>
                  {formData.otherFiles.map((file, index) => (
                    <div
                      key={getFileKey(file)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.6rem',
                        border: '1px solid #d7c9b7',
                        borderRadius: '0.45rem',
                        padding: '0.4rem 0.55rem',
                        background: '#faf7f2',
                      }}
                    >
                      <span
                        title={file.name}
                        style={{
                          fontSize: '0.9rem',
                          color: '#5e4d38',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOtherFile(index)}
                        style={{
                          border: '1px solid #c94f4f',
                          background: '#fff',
                          color: '#c94f4f',
                          borderRadius: '0.4rem',
                          padding: '0.25rem 0.55rem',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          flexShrink: 0,
                        }}
                      >
                        Borrar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          <p style={{ marginTop: '1rem', textAlign: 'center', color: '#6f604b' }}>
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
