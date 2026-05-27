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

const PROVINCES = [
  'Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán',
  'Entre Ríos', 'Salta', 'Misiones', 'Chaco', 'Corrientes',
  'Santiago del Estero', 'San Juan', 'Jujuy', 'Río Negro', 'Neuquén',
  'Formosa', 'Chubut', 'San Luis', 'Catamarca', 'La Rioja',
  'La Pampa', 'Santa Cruz', 'Tierra del Fuego', 'Ciudad de Buenos Aires',
];

const LANGUAGES = ['Español', 'Inglés', 'Portugués', 'Francés', 'Alemán', 'Italiano', 'Otro'];

const DEGREES = ['Psicólogo', 'Lic. en Psicología'];

const STEPS = ['Cuenta', 'Personal', 'Profesional', 'Especialidades'];

const initial = {
  // Step 1: account
  email: '', password: '', confirmPassword: '',
  // Step 2: personal
  firstName: '', lastName: '', dateOfBirth: '', phone: '', contactEmail: '',
  dni: '', cuitCuil: '',
  addressStreet: '', addressNumber: '', addressFloor: '', addressCity: '',
  addressProvince: '', addressPostalCode: '',
  practiceProvince: '',
  // Step 3: professional
  universityDegree: '', graduationYear: '', universityName: '',
  licenseNumber: '', licenseProvince: '', healthMinistryReg: '',
  yearsExperience: '', remoteModality: 'Telepsicología / Telemedicina',
  bio: '', displayName: '', languages: [],
  // Step 4: specialties
  specialties: [], ageRanges: [],
};

const getInitialForm = () => (DEBUG_MODE ? { ...DEBUG_FORM_DATA.registerPsychologistAR } : { ...initial });

export default function RegisterPsychologistAR() {
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
      if (!form.firstName || !form.lastName || !form.dni || !form.dateOfBirth) {
        toast.error('Completá los campos obligatorios (nombre, apellido, DNI, fecha de nacimiento)'); return false;
      }
      // Age check: must be >= 21
      const dob = new Date(form.dateOfBirth);
      const age = new Date().getFullYear() - dob.getFullYear();
      if (age < 21) {
        toast.error('Debés ser mayor de 21 años con título universitario'); return false;
      }
    }
    if (step === 2) {
      if (!form.universityDegree || !form.universityName || !form.licenseNumber || !form.licenseProvince) {
        toast.error('Completá los campos profesionales obligatorios'); return false;
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
          registrationType: 'ARGENTINA',
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
          dateOfBirth: form.dateOfBirth,
          dni: form.dni,
          cuitCuil: form.cuitCuil,
          addressStreet: form.addressStreet,
          addressNumber: form.addressNumber,
          addressFloor: form.addressFloor,
          addressCity: form.addressCity,
          addressProvince: form.addressProvince,
          addressPostalCode: form.addressPostalCode,
          practiceProvince: form.practiceProvince,
          universityDegree: form.universityDegree,
          graduationYear: form.graduationYear,
          universityName: form.universityName,
          licenseNumber: form.licenseNumber,
          licenseProvince: form.licenseProvince,
          healthMinistryReg: form.healthMinistryReg,
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
        <h1>Registro - Psicólogo en Argentina</h1>

        {/* Disclaimer */}
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
              <label>Email *
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" />
              </label>
              <label>Contraseña *
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" />
              </label>
              <label>Confirmar contraseña *
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
              </label>
            </div>
          )}

          {step === 1 && (
            <div className="psico-form-grid">
              <label>Nombre *<input type="text" name="firstName" value={form.firstName} onChange={handleChange} /></label>
              <label>Apellido *<input type="text" name="lastName" value={form.lastName} onChange={handleChange} /></label>
              <label>Nombre o apodo para mostrar<input type="text" name="displayName" value={form.displayName} onChange={handleChange} placeholder="Cómo querés aparecer en el listado" /></label>
              <label>Fecha de nacimiento * <small>(mayor de 21 años con título)</small><input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} /></label>
              <label>DNI *<input type="text" name="dni" value={form.dni} onChange={handleChange} /></label>
              <label>CUIT/CUIL<input type="text" name="cuitCuil" value={form.cuitCuil} onChange={handleChange} /></label>
              <label>WhatsApp<input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+54 9 11 1234-5678" /></label>
              <label>Email de contacto público<input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="El que verán los pacientes" /></label>
              <label className="psico-full-col">Calle<input type="text" name="addressStreet" value={form.addressStreet} onChange={handleChange} /></label>
              <label>Número<input type="text" name="addressNumber" value={form.addressNumber} onChange={handleChange} /></label>
              <label>Piso/Depto<input type="text" name="addressFloor" value={form.addressFloor} onChange={handleChange} /></label>
              <label>Localidad<input type="text" name="addressCity" value={form.addressCity} onChange={handleChange} /></label>
              <label>Provincia
                <select name="addressProvince" value={form.addressProvince} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
              <label>Código postal<input type="text" name="addressPostalCode" value={form.addressPostalCode} onChange={handleChange} /></label>
              <label>Provincia donde ejerce
                <select name="practiceProvince" value={form.practiceProvince} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="psico-form-grid">
              <label>Título universitario *
                <select name="universityDegree" value={form.universityDegree} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>
              <label>Año de graduación<input type="number" name="graduationYear" value={form.graduationYear} onChange={handleChange} min="1950" max={new Date().getFullYear()} /></label>
              <label className="psico-full-col">Universidad *<input type="text" name="universityName" value={form.universityName} onChange={handleChange} placeholder="Nombre oficial de la institución" /></label>
              <label>Número de matrícula *<input type="text" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} placeholder="Ej: MP 12345" /></label>
              <label>Provincia de emisión *
                <select name="licenseProvince" value={form.licenseProvince} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
              <label>Nro. Ministerio de Salud <small>(opcional)</small><input type="text" name="healthMinistryReg" value={form.healthMinistryReg} onChange={handleChange} /></label>
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
                  <li>Autorización para verificar datos ante colegios profesionales.</li>
                  <li>Aceptación de la Política de Privacidad según la Ley 25.326.</li>
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
