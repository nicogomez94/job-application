import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { psychologistAuthService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { DEBUG_FORM_DATA, DEBUG_MODE } from '../../config/debug';
import PasswordInput from '../../components/PasswordInput';
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
  bio: '', languages: [],
  // Step 4: specialties
  specialties: [], ageRanges: [],
};

const getInitialForm = () => (DEBUG_MODE ? { ...DEBUG_FORM_DATA.registerPsychologistAR } : { ...initial });

const currentYear = new Date().getFullYear();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]{2,}$/;
const PHONE_CHARS_REGEX = /^\+?[\d\s().-]+$/;
const TEXT_WITH_NUMBER_REGEX = /^(?=.*\d)[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s./-]{3,}$/;

const digitsOnly = (value) => String(value || '').replace(/\D/g, '');
const trimmed = (value) => String(value || '').trim();

const isValidPhone = (value) => {
  if (!trimmed(value)) return true;
  const digits = digitsOnly(value);
  return PHONE_CHARS_REGEX.test(trimmed(value)) && digits.length >= 8 && digits.length <= 15;
};

const isValidOptionalEmail = (value) => !trimmed(value) || EMAIL_REGEX.test(trimmed(value));

const isValidCuitCuil = (value) => {
  if (!trimmed(value)) return true;
  const digits = digitsOnly(value);
  if (digits.length !== 11) return false;

  const factors = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = factors.reduce((total, factor, index) => total + factor * Number(digits[index]), 0);
  const remainder = 11 - (sum % 11);
  const verifier = remainder === 11 ? 0 : remainder === 10 ? 9 : remainder;
  return verifier === Number(digits[10]);
};

const isValidBirthDate = (value) => {
  if (!value) return false;
  const dob = new Date(value);
  if (Number.isNaN(dob.getTime()) || dob > new Date()) return false;
  let age = new Date().getFullYear() - dob.getFullYear();
  const monthDiff = new Date().getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && new Date().getDate() < dob.getDate())) age -= 1;
  return age >= 21 && age <= 100;
};

const textLengthBetween = (value, min, max = Infinity) => {
  const length = trimmed(value).length;
  return length >= min && length <= max;
};

export default function RegisterPsychologistAR() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(getInitialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const toggleArrayField = (field, value) => {
    setForm((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateStep = () => {
    const showErrors = (errors) => {
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        toast.error('Complete los campos requeridos');
        return false;
      }
      setFieldErrors({});
      return true;
    };

    if (step === 0) {
      const errors = {};
      if (!trimmed(form.email)) errors.email = 'Campo requerido';
      else if (!EMAIL_REGEX.test(trimmed(form.email))) errors.email = 'Email inválido';
      if (!form.password) errors.password = 'Campo requerido';
      else if (form.password.length < 6) errors.password = 'Mínimo 6 caracteres';
      if (!form.confirmPassword) errors.confirmPassword = 'Campo requerido';
      else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden';
      return showErrors(errors);
    }
    if (step === 1) {
      const errors = {};
      if (!trimmed(form.firstName)) errors.firstName = 'Campo requerido';
      else if (!NAME_REGEX.test(trimmed(form.firstName))) errors.firstName = 'Usá solo letras y al menos 2 caracteres';
      if (!trimmed(form.lastName)) errors.lastName = 'Campo requerido';
      else if (!NAME_REGEX.test(trimmed(form.lastName))) errors.lastName = 'Usá solo letras y al menos 2 caracteres';
      if (!trimmed(form.dateOfBirth)) errors.dateOfBirth = 'Campo requerido';
      else if (!isValidBirthDate(form.dateOfBirth)) errors.dateOfBirth = 'Debe ser una fecha válida y mayor de 21 años';
      if (!trimmed(form.dni)) errors.dni = 'Campo requerido';
      else if (!/^\d{7,8}$/.test(digitsOnly(form.dni))) errors.dni = 'Ingresá 7 u 8 números';
      if (!isValidCuitCuil(form.cuitCuil)) errors.cuitCuil = 'CUIT/CUIL inválido';
      if (!isValidPhone(form.phone)) errors.phone = 'Ingresá un WhatsApp válido, solo números y prefijo';
      if (!isValidOptionalEmail(form.contactEmail)) errors.contactEmail = 'Email inválido';
      if (trimmed(form.addressStreet) && !textLengthBetween(form.addressStreet, 2, 80)) errors.addressStreet = 'Ingresá una calle válida';
      if (trimmed(form.addressNumber) && !/^[a-zA-Z0-9\s/-]{1,12}$/.test(trimmed(form.addressNumber))) errors.addressNumber = 'Número inválido';
      if (trimmed(form.addressFloor) && !/^[a-zA-Z0-9\s/-]{1,12}$/.test(trimmed(form.addressFloor))) errors.addressFloor = 'Piso/depto inválido';
      if (trimmed(form.addressCity) && !NAME_REGEX.test(trimmed(form.addressCity))) errors.addressCity = 'Localidad inválida';
      if (trimmed(form.addressPostalCode) && !/^[a-zA-Z0-9\s-]{4,10}$/.test(trimmed(form.addressPostalCode))) errors.addressPostalCode = 'Código postal inválido';
      return showErrors(errors);
    }
    if (step === 2) {
      const errors = {};
      if (!trimmed(form.universityDegree)) errors.universityDegree = 'Campo requerido';
      if (trimmed(form.graduationYear)) {
        const year = Number(form.graduationYear);
        if (!Number.isInteger(year) || year < 1950 || year > currentYear) errors.graduationYear = `Ingresá un año entre 1950 y ${currentYear}`;
      }
      if (!trimmed(form.universityName)) errors.universityName = 'Campo requerido';
      else if (!textLengthBetween(form.universityName, 3, 120)) errors.universityName = 'Ingresá una universidad válida';
      if (!trimmed(form.licenseNumber)) errors.licenseNumber = 'Campo requerido';
      else if (!TEXT_WITH_NUMBER_REGEX.test(trimmed(form.licenseNumber))) errors.licenseNumber = 'La matrícula debe incluir números';
      if (!trimmed(form.licenseProvince)) errors.licenseProvince = 'Campo requerido';
      if (trimmed(form.healthMinistryReg) && !TEXT_WITH_NUMBER_REGEX.test(trimmed(form.healthMinistryReg))) errors.healthMinistryReg = 'Registro inválido';
      if (trimmed(form.yearsExperience)) {
        const years = Number(form.yearsExperience);
        if (!Number.isInteger(years) || years < 0 || years > 80) errors.yearsExperience = 'Ingresá un número entre 0 y 80';
      }
      if (!trimmed(form.remoteModality)) errors.remoteModality = 'Campo requerido';
      else if (!textLengthBetween(form.remoteModality, 3, 80)) errors.remoteModality = 'Modalidad inválida';
      if (trimmed(form.bio) && !textLengthBetween(form.bio, 20, 1000)) errors.bio = 'Mínimo 20 caracteres';
      if (form.languages.length === 0) errors.languages = 'Seleccioná al menos un idioma';
      return showErrors(errors);
    }
    if (step === 3) {
      const errors = {};
      if (form.specialties.length === 0) errors.specialties = 'Seleccioná al menos una especialidad';
      if (form.ageRanges.length === 0) errors.ageRanges = 'Seleccioná al menos un rango etario';
      if (!acceptTerms) errors.acceptTerms = 'Campo requerido';
      if (!acceptPrivacy) errors.acceptPrivacy = 'Campo requerido';
      return showErrors(errors);
    }
    return true;
  };

  const fieldClass = (name) => (fieldErrors[name] ? 'psico-field-invalid' : '');
  const fieldError = (name) => fieldErrors[name] ? <span className="psico-field-error">{fieldErrors[name]}</span> : null;

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
              <div className="psico-step-dot">{i < step ? '' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="psico-form-step">
          {step === 0 && (
            <div className="psico-form-grid">
              <label className={fieldClass('email')}>Email *
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" />
                {fieldError('email')}
              </label>
              <label className={fieldClass('password')}>Contraseña *
                <PasswordInput name="password" value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" />
                {fieldError('password')}
              </label>
              <label className={fieldClass('confirmPassword')}>Confirmar contraseña *
                <PasswordInput name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
                {fieldError('confirmPassword')}
              </label>
            </div>
          )}

          {step === 1 && (
            <div className="psico-form-grid">
              <label className={fieldClass('firstName')}>Nombre *<input type="text" name="firstName" value={form.firstName} onChange={handleChange} />{fieldError('firstName')}</label>
              <label className={fieldClass('lastName')}>Apellido *<input type="text" name="lastName" value={form.lastName} onChange={handleChange} />{fieldError('lastName')}</label>
              <label className={fieldClass('dateOfBirth')}>Fecha de nacimiento * <small>(mayor de 21 años con título)</small><input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />{fieldError('dateOfBirth')}</label>
              <label className={fieldClass('dni')}>DNI *<input type="text" name="dni" value={form.dni} onChange={handleChange} />{fieldError('dni')}</label>
              <label className={fieldClass('cuitCuil')}>CUIT/CUIL<input type="text" name="cuitCuil" value={form.cuitCuil} onChange={handleChange} />{fieldError('cuitCuil')}</label>
              <label className={fieldClass('phone')}>WhatsApp<input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+54 9 11 1234-5678" />{fieldError('phone')}</label>
              <label className={fieldClass('contactEmail')}>Email de contacto público<input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="El que verán los pacientes" />{fieldError('contactEmail')}</label>
              <label className={`psico-full-col ${fieldClass('addressStreet')}`}>Calle<input type="text" name="addressStreet" value={form.addressStreet} onChange={handleChange} />{fieldError('addressStreet')}</label>
              <label className={fieldClass('addressNumber')}>Número<input type="text" name="addressNumber" value={form.addressNumber} onChange={handleChange} />{fieldError('addressNumber')}</label>
              <label className={fieldClass('addressFloor')}>Piso/Depto<input type="text" name="addressFloor" value={form.addressFloor} onChange={handleChange} />{fieldError('addressFloor')}</label>
              <label className={fieldClass('addressCity')}>Localidad<input type="text" name="addressCity" value={form.addressCity} onChange={handleChange} />{fieldError('addressCity')}</label>
              <label>Provincia
                <select name="addressProvince" value={form.addressProvince} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
              <label className={fieldClass('addressPostalCode')}>Código postal<input type="text" name="addressPostalCode" value={form.addressPostalCode} onChange={handleChange} />{fieldError('addressPostalCode')}</label>
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
              <label className={fieldClass('universityDegree')}>Título universitario *
                <select name="universityDegree" value={form.universityDegree} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {fieldError('universityDegree')}
              </label>
              <label className={fieldClass('graduationYear')}>Año de graduación<input type="number" name="graduationYear" value={form.graduationYear} onChange={handleChange} min="1950" max={new Date().getFullYear()} />{fieldError('graduationYear')}</label>
              <label className={`psico-full-col ${fieldClass('universityName')}`}>Universidad *<input type="text" name="universityName" value={form.universityName} onChange={handleChange} placeholder="Nombre oficial de la institución" />{fieldError('universityName')}</label>
              <label className={fieldClass('licenseNumber')}>Número de matrícula *<input type="text" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} placeholder="Ej: MP 12345" />{fieldError('licenseNumber')}</label>
              <label className={fieldClass('licenseProvince')}>Provincia de emisión *
                <select name="licenseProvince" value={form.licenseProvince} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {fieldError('licenseProvince')}
              </label>
              <label className={fieldClass('healthMinistryReg')}>Nro. Ministerio de Salud <small>(opcional)</small><input type="text" name="healthMinistryReg" value={form.healthMinistryReg} onChange={handleChange} />{fieldError('healthMinistryReg')}</label>
              <label className={fieldClass('yearsExperience')}>Años de experiencia<input type="number" name="yearsExperience" value={form.yearsExperience} onChange={handleChange} min="0" />{fieldError('yearsExperience')}</label>
              <label className={fieldClass('remoteModality')}>Modalidad remota<input type="text" name="remoteModality" value={form.remoteModality} onChange={handleChange} />{fieldError('remoteModality')}</label>
              <label className={`psico-full-col ${fieldClass('bio')}`}>Descripción / Experiencia
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} placeholder="Breve descripción de tu experiencia y estudios" />
                {fieldError('bio')}
              </label>
              <div className={`psico-full-col ${fieldClass('languages')}`}>
                <label className="psico-checkbox-label-heading">Idiomas hablados</label>
                <div className="psico-checkbox-group">
                  {LANGUAGES.map((l) => (
                    <label key={l} className="psico-checkbox-item">
                      <input type="checkbox" checked={form.languages.includes(l)} onChange={() => toggleArrayField('languages', l)} />
                      {l}
                    </label>
                  ))}
                </div>
                {fieldError('languages')}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="psico-form-grid">
              <div className={`psico-full-col ${fieldClass('specialties')}`}>
                <label className="psico-checkbox-label-heading">Especialidades * <small>(puede marcar una o más)</small></label>
                <div className="psico-checkbox-group psico-options-grid psico-specialty-options">
                  {SPECIALTIES.map((s) => (
                    <label key={s} className="psico-checkbox-item psico-option-card">
                      <input type="checkbox" checked={form.specialties.includes(s)} onChange={() => toggleArrayField('specialties', s)} />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
                {fieldError('specialties')}
              </div>
              <div className={`psico-full-col ${fieldClass('ageRanges')}`}>
                <label className="psico-checkbox-label-heading">Rango etario de atención</label>
                <div className="psico-checkbox-group psico-options-grid psico-age-options">
                  {['Adultos (mayor a 18 años)', 'Infanto-juvenil (hasta los 18 años)'].map((a) => (
                    <label key={a} className="psico-checkbox-item psico-option-card">
                      <input type="checkbox" checked={form.ageRanges.includes(a)} onChange={() => toggleArrayField('ageRanges', a)} />
                      <span>{a}</span>
                    </label>
                  ))}
                </div>
                {fieldError('ageRanges')}
              </div>
              <div className="psico-full-col psico-legal-section">
                <h3>Declaraciones obligatorias</h3>
                <ul>
                  <li>Declaración jurada de que toda la información es verdadera.</li>
                  <li>Aceptación del Contrato de Prestación de Servicios de Suscripción.</li>
                  <li>Autorización para verificar datos ante colegios profesionales.</li>
                </ul>
                <label className="psico-checkbox-item" style={{ margin: '0.75rem 0 0.4rem' }}>
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked);
                      setFieldErrors((prev) => {
                        if (!prev.acceptTerms) return prev;
                        const next = { ...prev };
                        delete next.acceptTerms;
                        return next;
                      });
                    }}
                  />
                  <span style={{ fontSize: '0.88rem' }}>
                    Acepto los{' '}
                    <a href="/psicologos/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" style={{ color: '#7a3055', fontWeight: 600 }}>Términos y Condiciones</a>
                  </span>
                </label>
                {fieldError('acceptTerms')}
                <label className="psico-checkbox-item" style={{ margin: '0.4rem 0' }}>
                  <input
                    type="checkbox"
                    checked={acceptPrivacy}
                    onChange={(e) => {
                      setAcceptPrivacy(e.target.checked);
                      setFieldErrors((prev) => {
                        if (!prev.acceptPrivacy) return prev;
                        const next = { ...prev };
                        delete next.acceptPrivacy;
                        return next;
                      });
                    }}
                  />
                  <span style={{ fontSize: '0.88rem' }}>
                    Acepto la{' '}
                    <a href="/psicologos/politicas-de-privacidad" target="_blank" rel="noopener noreferrer" style={{ color: '#7a3055', fontWeight: 600 }}>Política de Privacidad</a>{' '}
                    (Ley 25.326)
                  </span>
                </label>
                {fieldError('acceptPrivacy')}
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
