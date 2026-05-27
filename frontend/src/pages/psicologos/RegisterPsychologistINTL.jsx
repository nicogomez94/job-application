import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { psychologistAuthService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { DEBUG_FORM_DATA, DEBUG_MODE } from '../../config/debug';
import './Psicologos.css';

const SPECIALTIES = [
  'Psicología clínica y de la salud',
  'Psicología (diversos enfoques)',
  'Terapia de pareja y familiar',
  'Psicología del desarrollo y edades',
  'Psicología educativa',
  'Psicología laboral/organizacional',
  'Psicología social y comunitaria',
  'Psicología perinatal y abordaje de ansiedad/depresión en embarazo o posparto',
];

const LANGUAGES = ['Español', 'Inglés', 'Portugués', 'Francés', 'Alemán', 'Italiano', 'Otro'];

const STEPS = ['Cuenta', 'Personal', 'Profesional', 'Especialidades'];

const initial = {
  email: '', password: '', confirmPassword: '',
  firstName: '', lastName: '', displayName: '', dateOfBirth: '', phone: '', contactEmail: '',
  documentType: 'Pasaporte', documentNumber: '', taxId: '',
  country: '', region: '',
  addressStreet: '', addressNumber: '', addressFloor: '', addressCity: '', addressPostalCode: '',
  licenseNumber: '', licenseEntity: '', licenseCountry: '', degreeInstitution: '',
  yearsExperience: '', remoteModality: 'Telepsicología / Telemedicina', bio: '', languages: [],
  specialties: [], ageRanges: [],
};

const getInitialForm = () => (DEBUG_MODE ? { ...DEBUG_FORM_DATA.registerPsychologistINTL } : { ...initial });

export default function RegisterPsychologistINTL() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(getInitialForm);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleArrayField = (field, value) => {
    setForm((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.email || !form.password || !form.confirmPassword) {
        toast.error('Completá todos los campos'); return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        toast.error('El email no tiene un formato válido (ej: nombre@dominio.com)'); return false;
      }
      if (form.password !== form.confirmPassword) {
        toast.error('Las contraseñas no coinciden'); return false;
      }
      if (form.password.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres'); return false;
      }
    }
    if (step === 1) {
      if (!form.firstName || !form.lastName || !form.documentNumber || !form.country) {
        toast.error('Completá los campos obligatorios (nombre, apellido, documento, país)'); return false;
      }
    }
    if (step === 2) {
      if (!form.licenseNumber || !form.degreeInstitution) {
        toast.error('Completá la información de licencia e institución'); return false;
      }
    }
    if (step === 3) {
      if (form.specialties.length === 0) {
        toast.error('Seleccioná al menos una especialidad'); return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    let registrationDone = false;
    try {
      // Paso 1: Crear la cuenta
      let regData;
      try {
        const regRes = await psychologistAuthService.register({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          registrationType: 'INTERNATIONAL',
        });
        regData = regRes.data;
      } catch (regErr) {
        const status = regErr?.response?.status;
        const serverMsg = regErr?.response?.data?.error;
        if (serverMsg) {
          toast.error(serverMsg);
        } else if (status === 0 || !regErr?.response) {
          toast.error('No se pudo conectar con el servidor. Verificá tu conexión a internet.');
        } else if (status >= 500) {
          toast.error('Error en el servidor al crear la cuenta. Intentá nuevamente en unos minutos.');
        } else {
          toast.error('No se pudo crear la cuenta. Verificá los datos e intentá nuevamente.');
        }
        setLoading(false);
        return;
      }

      const { token, psychologist } = regData;
      setAuth(psychologist, 'psychologist', token);
      registrationDone = true;

      // Paso 2: Guardar perfil
      try {
        const { default: api } = await import('../../services/api');
        await api.put('/psychologists/me/profile', {
          displayName: form.displayName,
          phone: form.phone,
          contactEmail: form.contactEmail || form.email,
          dateOfBirth: form.dateOfBirth || undefined,
          documentType: form.documentType,
          documentNumber: form.documentNumber,
          taxId: form.taxId,
          country: form.country,
          region: form.region,
          addressStreet: form.addressStreet,
          addressNumber: form.addressNumber,
          addressFloor: form.addressFloor,
          addressCity: form.addressCity,
          addressPostalCode: form.addressPostalCode,
          licenseNumber: form.licenseNumber,
          licenseEntity: form.licenseEntity,
          licenseCountry: form.licenseCountry,
          degreeInstitution: form.degreeInstitution,
          yearsExperience: form.yearsExperience,
          remoteModality: form.remoteModality,
          bio: form.bio,
          specialties: form.specialties,
          ageRanges: form.ageRanges,
          languages: form.languages,
        });
      } catch (profileErr) {
        // La cuenta ya fue creada — igualmente avanzamos pero avisamos
        const serverMsg = profileErr?.response?.data?.error;
        toast.error(
          serverMsg
            ? `Tu cuenta fue creada, pero hubo un error al guardar el perfil: ${serverMsg}. Podés completarlo desde tu panel.`
            : 'Tu cuenta fue creada, pero no se pudo guardar el perfil completo. Podés completarlo desde tu panel.'
        );
      }

      navigate('/register/psicologo/documentos');
    } catch (err) {
      if (!registrationDone) {
        toast.error('Ocurrió un error inesperado al registrarse. Intentá nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="psico-register-page">
      <div className="psico-register-container">
        <div className="psico-register-back">
          <Link to="/register/psicologo">← Cambiar tipo de registro</Link>
        </div>
        <h1>Registro - Psicólogo Internacional</h1>

        {/* Disclaimer per PRD */}
        <div className="psico-intl-disclaimer">
          <strong>Aviso importante:</strong> La atención remota no es recomendada para crisis aguda con riesgo de vida o psicosis activa que requiera contención física inmediata, las cuales necesitan atención presencial de emergencia. El costo de la o las sesiones serán tratadas directamente con el profesional de su elección. ¡SIN EXCEPCIÓN!
        </div>

        {/* Stepper */}
        <div className="psico-stepper">
          {STEPS.map((s, i) => (
            <div key={s} className={`psico-step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
              <div className="psico-step-dot">{i < step ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="psico-form-step">
          {step === 0 && (
            <div className="psico-form-grid">
              <label>Email *<input type="email" name="email" value={form.email} onChange={handleChange} /></label>
              <label>Contraseña *<input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" /></label>
              <label>Confirmar contraseña *<input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} /></label>
            </div>
          )}

          {step === 1 && (
            <div className="psico-form-grid">
              <label>Nombre *<input type="text" name="firstName" value={form.firstName} onChange={handleChange} /></label>
              <label>Apellido *<input type="text" name="lastName" value={form.lastName} onChange={handleChange} /></label>
              <label>Nombre o apodo para mostrar<input type="text" name="displayName" value={form.displayName} onChange={handleChange} /></label>
              <label>Fecha de nacimiento<input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} /></label>
              <label>Tipo de documento
                <select name="documentType" value={form.documentType} onChange={handleChange}>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="DNI">DNI</option>
                  <option value="Cédula">Cédula</option>
                  <option value="Otro">Otro</option>
                </select>
              </label>
              <label>Número de documento *<input type="text" name="documentNumber" value={form.documentNumber} onChange={handleChange} /></label>
              <label>Identificación fiscal (si aplica)<input type="text" name="taxId" value={form.taxId} onChange={handleChange} /></label>
              <label>País *<input type="text" name="country" value={form.country} onChange={handleChange} /></label>
              <label>Estado / Provincia / Región<input type="text" name="region" value={form.region} onChange={handleChange} /></label>
              <label>WhatsApp<input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 000 0000" /></label>
              <label>Email de contacto público<input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} /></label>
              <label className="psico-full-col">Calle<input type="text" name="addressStreet" value={form.addressStreet} onChange={handleChange} /></label>
              <label>Número<input type="text" name="addressNumber" value={form.addressNumber} onChange={handleChange} /></label>
              <label>Ciudad<input type="text" name="addressCity" value={form.addressCity} onChange={handleChange} /></label>
              <label>Código postal<input type="text" name="addressPostalCode" value={form.addressPostalCode} onChange={handleChange} /></label>
            </div>
          )}

          {step === 2 && (
            <div className="psico-form-grid">
              <label>Número de licencia / colegiación / matrícula *<input type="text" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} /></label>
              <label>Entidad que expide la licencia<input type="text" name="licenseEntity" value={form.licenseEntity} onChange={handleChange} /></label>
              <label>País de emisión de la licencia<input type="text" name="licenseCountry" value={form.licenseCountry} onChange={handleChange} /></label>
              <label className="psico-full-col">Institución que otorgó el título *<input type="text" name="degreeInstitution" value={form.degreeInstitution} onChange={handleChange} /></label>
              <label>Años de experiencia<input type="number" name="yearsExperience" value={form.yearsExperience} onChange={handleChange} min="0" /></label>
              <label>Modalidad remota<input type="text" name="remoteModality" value={form.remoteModality} onChange={handleChange} /></label>
              <label className="psico-full-col">Descripción / Experiencia
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} placeholder="Breve descripción de tu experiencia y estudios" />
              </label>
              <div className="psico-full-col">
                <label className="psico-checkbox-label-heading">Idiomas hablados</label>
                <div className="psico-checkbox-group">
                  {LANGUAGES.map((l) => (
                    <label key={l} className="psico-checkbox-item">
                      <input type="checkbox" checked={form.languages.includes(l)} onChange={() => toggleArrayField('languages', l)} />
                      {l}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="psico-form-grid">
              <div className="psico-full-col">
                <label className="psico-checkbox-label-heading">Especialidades * <small>(puede marcar una o más)</small></label>
                <div className="psico-checkbox-group psico-checkbox-group-col">
                  {SPECIALTIES.map((s) => (
                    <label key={s} className="psico-checkbox-item">
                      <input type="checkbox" checked={form.specialties.includes(s)} onChange={() => toggleArrayField('specialties', s)} />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
              <div className="psico-full-col">
                <label className="psico-checkbox-label-heading">Rango etario de atención</label>
                <div className="psico-checkbox-group">
                  {['Adultos (mayor a 18 años)', 'Infanto-juvenil (hasta los 18 años)'].map((a) => (
                    <label key={a} className="psico-checkbox-item">
                      <input type="checkbox" checked={form.ageRanges.includes(a)} onChange={() => toggleArrayField('ageRanges', a)} />
                      {a}
                    </label>
                  ))}
                </div>
              </div>
              <div className="psico-full-col psico-legal-section">
                <h3>Declaraciones obligatorias</h3>
                <ul>
                  <li>Declaración jurada de que toda la información es verdadera.</li>
                  <li>Aceptación del Contrato de Prestación de Servicios de Suscripción.</li>
                  <li>Autorización para verificar datos ante organismos competentes.</li>
                  <li>Aceptación de la Política de Privacidad.</li>
                </ul>
                <p>Al continuar, aceptás los términos anteriores. Consultá los <Link to="/terminos-y-condiciones" target="_blank">Términos y Condiciones</Link> y la <Link to="/politicas-y-privacidad" target="_blank">Política de Privacidad</Link>.</p>
              </div>
            </div>
          )}
        </div>

        <div className="psico-form-actions">
          {step > 0 && (
            <button type="button" className="psico-btn-secondary" onClick={() => setStep((s) => s - 1)} disabled={loading}>
              Atrás
            </button>
          )}
          <button type="button" className="psico-btn-primary" onClick={handleNext} disabled={loading}>
            {loading ? 'Procesando...' : step === STEPS.length - 1 ? 'Enviar registro' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
}
