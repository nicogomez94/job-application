import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService, companyService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { DEBUG_FORM_DATA, DEBUG_MODE } from '../../config/debug';
import './Register.css';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, logo: e.target.files?.[0] || null }));
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

      toast.success('Empresa registrada exitosamente');
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
        background: 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)',
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
          boxShadow: '0 20px 60px rgba(15, 23, 42, 0.25)',
          overflow: 'hidden',
        }}
      >
        <div
          className="register-header"
          style={{
            background: 'linear-gradient(135deg, #0369a1 0%, #1e3a8a 100%)',
            color: '#fff',
            padding: '2rem',
          }}
        >
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Registro de Empresa</h1>
          <p style={{ opacity: 0.9 }}>Publicá ofertas y gestioná postulantes</p>
        </div>

        <form className="register-form" style={{ padding: '2rem' }} onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              className="input"
              name="companyName"
              placeholder="Nombre de la empresa"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email corporativo"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              className="input"
              name="website"
              placeholder="Sitio web (opcional)"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="register-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Contraseña (mín. 6)"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
            <input
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

          <div className="register-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <input
              className="input"
              name="industry"
              placeholder="Industria (ej: Tecnología)"
              value={formData.industry}
              onChange={handleChange}
            />
            <select className="input" name="size" value={formData.size} onChange={handleChange}>
              <option value="">Tamaño de empresa</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="500+">500+</option>
            </select>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <input
              className="input"
              name="location"
              placeholder="Ubicación"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <textarea
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
            <label style={{ display: 'block', color: '#334155', marginBottom: '0.35rem' }}>Logo (opcional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
            {loading ? 'Registrando empresa...' : 'Crear Cuenta de Empresa'}
          </button>

          <p style={{ marginTop: '1rem', textAlign: 'center', color: '#475569' }}>
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
