import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, Calendar, FileText, Upload, Briefcase } from 'lucide-react';
import './Register.css';

export default function RegisterUser() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    birthDate: '',
    cv: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, cv: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    alert('Formulario enviado (solo diseño)');
  };

  return (
    <div className="register-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '3rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="register-box" style={{
        width: '100%',
        maxWidth: '900px',
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden'
      }}>
        <div className="register-header" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2.5rem 2rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <div className="register-header-icon" style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <User size={40} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Registro de Candidato
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1rem' }}>
            Crea tu cuenta y encuentra el trabajo de tus sueños
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form" style={{ padding: '2.5rem 2rem' }}>
          <div className="register-form-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Nombre *
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <User size={20} style={{
                  position: 'absolute',
                  left: '1rem',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Juan"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Apellido *
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <User size={20} style={{
                  position: 'absolute',
                  left: '1rem',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Pérez"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Correo Electrónico *
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Mail size={20} style={{
                position: 'absolute',
                left: '1rem',
                color: '#9ca3af'
              }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="juan.perez@ejemplo.com"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Contraseña *
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Lock size={20} style={{
                  position: 'absolute',
                  left: '1rem',
                  color: '#9ca3af'
                }} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Confirmar Contraseña *
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Lock size={20} style={{
                  position: 'absolute',
                  left: '1rem',
                  color: '#9ca3af'
                }} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Teléfono
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Phone size={20} style={{
                  position: 'absolute',
                  left: '1rem',
                  color: '#9ca3af'
                }} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+54 11 1234-5678"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Fecha de Nacimiento
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Calendar size={20} style={{
                  position: 'absolute',
                  left: '1rem',
                  color: '#9ca3af'
                }} />
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Dirección
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <MapPin size={20} style={{
                position: 'absolute',
                left: '1rem',
                color: '#9ca3af',
                top: '0.875rem'
              }} />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Calle, Número, Ciudad, Provincia"
                rows="2"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Curriculum Vitae (PDF)
            </label>
            <div style={{
              position: 'relative',
              border: '2px dashed #d1d5db',
              borderRadius: '0.5rem',
              padding: '2rem',
              textAlign: 'center',
              background: '#f9fafb',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              <Upload size={40} style={{ color: '#9ca3af', margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.9375rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                {formData.cv ? formData.cv.name : 'Haz clic para subir tu CV'}
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>
                PDF, máximo 5MB
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#4b5563'
            }}>
              <input type="checkbox" required style={{ cursor: 'pointer' }} />
              <span>
                Acepto los{' '}
                <Link to="/terms" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
                  términos y condiciones
                </Link>
                {' '}y la{' '}
                <Link to="/privacy" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
                  política de privacidad
                </Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.875rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)'
            }}
          >
            Crear Cuenta
          </button>

          <p style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.9375rem',
            color: '#6b7280'
          }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
