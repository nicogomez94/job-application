import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';
import { authService } from '../../services';
import './ResetPassword.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error('Enlace inválido');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        token,
        newPassword: formData.newPassword,
      });

      toast.success('Clave actualizada. Ya podés iniciar sesión');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo restablecer la clave');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <div className="reset-password-header">
          <Lock className="reset-password-logo" />
          <h2 className="reset-password-title">Restablecer clave</h2>
          <p className="reset-password-subtitle">
            Elegí una nueva contraseña para tu cuenta.
          </p>
        </div>

        <div className="card reset-password-card">
          {!token ? (
            <div className="reset-password-invalid">
              <p>El enlace de recuperación es inválido o expiró.</p>
              <Link className="btn btn-primary reset-password-back-btn" to="/login">
                Volver al login
              </Link>
            </div>
          ) : (
            <form className="reset-password-form" onSubmit={handleSubmit}>
              <div className="reset-password-field">
                <label className="reset-password-label" htmlFor="newPassword">
                  Nueva contraseña
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="input"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div className="reset-password-field">
                <label className="reset-password-label" htmlFor="confirmPassword">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repetí tu nueva contraseña"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary reset-password-submit-btn"
              >
                {loading ? 'Actualizando...' : 'Guardar nueva clave'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
