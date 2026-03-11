import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService, userService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { DEBUG_FORM_DATA, DEBUG_MODE } from '../../config/debug';
import './Register.css';

const getInitialForm = () => (DEBUG_MODE ? { ...DEBUG_FORM_DATA.registerUser } : {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  cv: null,
});

export default function RegisterUser() {
  const [formData, setFormData] = useState(getInitialForm);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const userType = 'user';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, cv: e.target.files?.[0] || null }));
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
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
      };

      const response = await authService.registerUser(payload);
      const { user, token } = response.data;

      setAuth(user, 'user', token);

      if (formData.cv) {
        try {
          await userService.uploadCV(formData.cv);
          toast.success('CV subido exitosamente');
        } catch (uploadError) {
          toast.error(uploadError.response?.data?.error || 'No se pudo subir el CV');
        }
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
        background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
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
          boxShadow: '0 20px 60px rgba(15, 23, 42, 0.25)',
          overflow: 'hidden',
        }}
      >
        <div
          className="register-header"
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)',
            color: '#fff',
            padding: '2rem',
          }}
        >
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Registro de Candidato</h1>
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

          <div className="register-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input
              className="input"
              name="firstName"
              placeholder="Nombre"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              className="input"
              name="lastName"
              placeholder="Apellido"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <input
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

          <div style={{ marginTop: '1rem' }}>
            <input
              className="input"
              name="phone"
              placeholder="Teléfono (opcional)"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', color: '#334155', marginBottom: '0.35rem' }}>CV PDF (opcional)</label>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          <p style={{ marginTop: '1rem', textAlign: 'center', color: '#475569' }}>
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
