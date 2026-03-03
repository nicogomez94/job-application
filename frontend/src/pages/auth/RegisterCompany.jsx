import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Lock, Phone, MapPin, Globe, Users, FileText, Upload } from 'lucide-react';
import './Register.css';

export default function RegisterCompany() {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    website: '',
    industry: '',
    companySize: '',
    description: '',
    logo: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, logo: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    alert('Formulario enviado (solo diseño)');
  };

  return (
    <div className="register-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
            <Building2 size={40} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Registro de Empresa
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1rem' }}>
            Publica ofertas de trabajo y encuentra el mejor talento
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form" style={{ padding: '2.5rem 2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Nombre de la Empresa *
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Building2 size={20} style={{
                position: 'absolute',
                left: '1rem',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Tech Solutions SA"
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Correo Electrónico Corporativo *
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
                placeholder="contacto@empresa.com"
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
                Teléfono *
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
                Sitio Web
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Globe size={20} style={{
                  position: 'absolute',
                  left: '1rem',
                  color: '#9ca3af'
                }} />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.empresa.com"
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
                Industria *
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Building2 size={20} style={{
                  position: 'absolute',
                  left: '1rem',
                  color: '#9ca3af',
                  pointerEvents: 'none',
                  zIndex: 1
                }} />
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    background: 'white'
                  }}
                >
                  <option value="">Selecciona una industria</option>
                  <option value="technology">Tecnología</option>
                  <option value="finance">Finanzas</option>
                  <option value="healthcare">Salud</option>
                  <option value="education">Educación</option>
                  <option value="retail">Retail</option>
                  <option value="marketing">Marketing</option>
                  <option value="other">Otra</option>
                </select>
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
                Tamaño de la Empresa *
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Users size={20} style={{
                  position: 'absolute',
                  left: '1rem',
                  color: '#9ca3af',
                  pointerEvents: 'none',
                  zIndex: 1
                }} />
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    background: 'white'
                  }}
                >
                  <option value="">Selecciona el tamaño</option>
                  <option value="1-10">1-10 empleados</option>
                  <option value="11-50">11-50 empleados</option>
                  <option value="51-200">51-200 empleados</option>
                  <option value="201-500">201-500 empleados</option>
                  <option value="500+">Más de 500 empleados</option>
                </select>
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
              Dirección *
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <MapPin size={20} style={{
                position: 'absolute',
                left: '1rem',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Av. Corrientes 1234, CABA, Buenos Aires"
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Descripción de la Empresa
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FileText size={20} style={{
                position: 'absolute',
                left: '1rem',
                color: '#9ca3af',
                top: '0.875rem'
              }} />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe tu empresa, misión, valores y cultura organizacional..."
                rows="4"
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
              Logo de la Empresa (opcional)
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
                accept="image/*"
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
                {formData.logo ? formData.logo.name : 'Haz clic para subir el logo'}
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>
                PNG, JPG o SVG, máximo 2MB
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
                <Link to="/terms" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
                  términos y condiciones
                </Link>
                {' '}y la{' '}
                <Link to="/privacy" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
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
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
            }}
          >
            Crear Cuenta de Empresa
          </button>

          <p style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.9375rem',
            color: '#6b7280'
          }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{
              color: '#3b82f6',
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
