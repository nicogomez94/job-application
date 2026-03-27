import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService, companyService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { DEBUG_FORM_DATA, DEBUG_MODE } from '../../config/debug';
import './Register.css';

const isValidImageFile = (file) => {
  if (!file) {
    return false;
  }

  return file.type.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name);
};

const getInitialForm = () => (DEBUG_MODE ? { ...DEBUG_FORM_DATA.registerCompany } : {
  companyName: '',
  email: '',
  password: '',
  confirmPassword: '',
  website: '',
  industry: '',
  size: '',
  location: '',
  description: '',
  logo: null,
});

export default function RegisterCompany() {
  const [formData, setFormData] = useState(getInitialForm);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const userType = 'company';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;

    if (!selectedFile) {
      return;
    }

    if (!isValidImageFile(selectedFile)) {
      toast.error('Solo se permiten archivos de imagen');
      e.target.value = '';
      return;
    }

    setFormData((prev) => ({ ...prev, logo: selectedFile }));
    e.target.value = '';
  };

  const handleRemoveFile = () => {
    const confirmed = window.confirm('¿Estás seguro de que querés borrar este archivo?');
    if (!confirmed) return;

    setFormData((prev) => ({ ...prev, logo: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        companyName: formData.companyName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        website: formData.website.trim() || undefined,
        industry: formData.industry.trim() || undefined,
        size: formData.size || undefined,
        location: formData.location.trim() || undefined,
        description: formData.description.trim() || undefined,
      };

      const response = await authService.registerCompany(payload);
      const { company, token } = response.data;
      setAuth(company, 'company', token);

      if (formData.logo) {
        try {
          await companyService.uploadLogo(formData.logo);
          toast.success('Logo subido exitosamente');
        } catch (uploadError) {
          toast.error(uploadError.response?.data?.error || 'No se pudo subir el logo');
        }
      }

      toast.success('Empresa registrada. Se activó tu plan gratuito por 2 meses.');
      navigate('/company/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo registrar la empresa');
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
          maxWidth: '760px',
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
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Registro de Empresa</h1>
          <p style={{ opacity: 0.9 }}>Publicá ofertas y gestioná postulantes</p>
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
              Candidato
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

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="register-company-name" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Nombre de la empresa
            </label>
            <input
              id="register-company-name"
              className="input"
              name="companyName"
              placeholder="Nombre de la empresa"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="register-company-email" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Email corporativo
              </label>
              <input
                id="register-company-email"
                className="input"
                type="email"
                name="email"
                placeholder="Email corporativo"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="register-company-website" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Sitio web
              </label>
              <input
                id="register-company-website"
                className="input"
                name="website"
                placeholder="Sitio web (opcional)"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="register-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label htmlFor="register-company-password" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Contraseña
              </label>
              <input
                id="register-company-password"
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
              <label htmlFor="register-company-confirm-password" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Confirmar contraseña
              </label>
              <input
                id="register-company-confirm-password"
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

          <div className="register-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label htmlFor="register-company-industry" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Industria
              </label>
              <input
                id="register-company-industry"
                className="input"
                name="industry"
                placeholder="Industria (ej: Tecnología)"
                value={formData.industry}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="register-company-size" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Tamaño de empresa
              </label>
              <select id="register-company-size" className="input" name="size" value={formData.size} onChange={handleChange}>
                <option value="">Tamaño de empresa</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="500+">500+</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="register-company-location" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Ubicación
            </label>
            <input
              id="register-company-location"
              className="input"
              name="location"
              placeholder="Ubicación"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="register-company-description" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Descripción
            </label>
            <textarea
              id="register-company-description"
              className="input"
              name="description"
              placeholder="Descripción de la empresa (opcional)"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="register-company-logo" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem' }}>Logo (opcional)</label>
            <input id="register-company-logo" type="file" accept="image/*" onChange={handleFileChange} />
            {formData.logo && (
              <div style={{ marginTop: '0.6rem' }}>
                <p style={{ margin: 0, color: '#6f604b', fontSize: '0.92rem' }}>
                  1 archivo seleccionado
                </p>
                <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.4rem' }}>
                  <div
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
                      title={formData.logo.name}
                      style={{
                        fontSize: '0.9rem',
                        color: '#5e4d38',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formData.logo.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
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

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
            {loading ? 'Registrando empresa...' : 'Crear Cuenta de Empresa'}
          </button>

          <p style={{ marginTop: '1rem', textAlign: 'center', color: '#6f604b' }}>
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
