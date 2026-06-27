import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { psychologistAuthService, psychologistService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { DEBUG_FORM_DATA, DEBUG_MODE } from '../../config/debug';
import PasswordInput from '../../components/PasswordInput';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import { getPhoneValidationMessage, normalizePhoneNumber } from '../../utils/phoneNumber';
import { isValidEmail, isValidOptionalEmail } from '../../utils/emailValidation';
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

const GENDERS = ['Hombre', 'Mujer', 'Otro'];

const DEGREES = ['Psicólogo', 'Lic. en Psicología'];

const STEPS = ['Cuenta', 'Personal', 'Profesional', 'Especialidades'];

const VISIBLE_PATIENT_FIELDS = [
  'Nombre',
  'Apellido',
  'País y región',
  'Número de licencia / colegiación / matrícula',
  'Edad y género',
  'Idiomas hablados',
  'Años de experiencia',
  'Modalidad remota',
  'Costo final por sesión',
  'Tiempo de sesión / promoción',
  'Edad de atención',
  'Título, institución y formación',
  'Especialidades',
  'Breve descripción de experiencia y estudios',
];

const initial = {
  email: '', password: '', confirmPassword: '',
  firstName: '', lastName: '', gender: '', dateOfBirth: '', phone: '', contactEmail: '',
  documentType: 'Pasaporte', documentNumber: '', taxId: '',
  country: '', region: '',
  addressStreet: '', addressNumber: '', addressFloor: '', addressCity: '', addressPostalCode: '',
  universityDegree: '', licenseNumber: '', licenseEntity: '', licenseCountry: '', degreeInstitution: '',
  sessionCost: '', sessionDuration: '',
  yearsExperience: '', remoteModality: 'Telepsicología / Telemedicina', bio: '', languages: [],
  specialties: [], ageRanges: [],
};

const getInitialForm = () => (DEBUG_MODE ? { ...DEBUG_FORM_DATA.registerPsychologistINTL } : { ...initial });

const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]{2,}$/;
const TEXT_WITH_NUMBER_REGEX = /^(?=.*\d)[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s./-]{3,}$/;

const trimmed = (value) => String(value || '').trim();

const isValidOptionalBirthDate = (value) => {
  if (!value) return true;
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

export default function RegisterPsychologistINTL() {
  const formTopRef = useRef(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(getInitialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
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
      else if (!isValidEmail(form.email)) errors.email = 'Ingresá un email con un dominio válido';
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
      if (!trimmed(form.gender)) errors.gender = 'Campo requerido';
      if (!trimmed(form.dateOfBirth)) errors.dateOfBirth = 'Campo requerido';
      else if (!isValidOptionalBirthDate(form.dateOfBirth)) errors.dateOfBirth = 'Debe ser una fecha válida y mayor de 21 años';
      if (!trimmed(form.documentNumber)) errors.documentNumber = 'Campo requerido';
      else if (!/^[a-zA-Z0-9\s.-]{5,20}$/.test(trimmed(form.documentNumber))) errors.documentNumber = 'Documento inválido';
      if (trimmed(form.taxId) && !/^[a-zA-Z0-9\s.-]{5,25}$/.test(trimmed(form.taxId))) errors.taxId = 'Identificación fiscal como Monotributista inválida';
      if (!trimmed(form.country)) errors.country = 'Campo requerido';
      else if (!NAME_REGEX.test(trimmed(form.country))) errors.country = 'País inválido';
      if (trimmed(form.region) && !textLengthBetween(form.region, 2, 80)) errors.region = 'Región inválida';
      const phoneError = getPhoneValidationMessage(form.phone, { required: true });
      if (phoneError) errors.phone = phoneError;
      if (!isValidOptionalEmail(form.contactEmail)) errors.contactEmail = 'Email inválido';
      if (trimmed(form.addressStreet) && !textLengthBetween(form.addressStreet, 2, 80)) errors.addressStreet = 'Ingresá una calle válida';
      if (trimmed(form.addressNumber) && !/^[a-zA-Z0-9\s/-]{1,12}$/.test(trimmed(form.addressNumber))) errors.addressNumber = 'Número inválido';
      if (trimmed(form.addressCity) && !NAME_REGEX.test(trimmed(form.addressCity))) errors.addressCity = 'Ciudad inválida';
      if (trimmed(form.addressPostalCode) && !/^[a-zA-Z0-9\s-]{3,12}$/.test(trimmed(form.addressPostalCode))) errors.addressPostalCode = 'Código postal inválido';
      return showErrors(errors);
    }
    if (step === 2) {
      const errors = {};
      if (!trimmed(form.universityDegree)) errors.universityDegree = 'Campo requerido';
      if (!trimmed(form.licenseNumber)) errors.licenseNumber = 'Campo requerido';
      else if (!TEXT_WITH_NUMBER_REGEX.test(trimmed(form.licenseNumber))) errors.licenseNumber = 'La licencia debe incluir números';
      if (!trimmed(form.licenseEntity)) errors.licenseEntity = 'Campo requerido';
      else if (!textLengthBetween(form.licenseEntity, 3, 120)) errors.licenseEntity = 'Entidad inválida';
      if (!trimmed(form.licenseCountry)) errors.licenseCountry = 'Campo requerido';
      else if (!NAME_REGEX.test(trimmed(form.licenseCountry))) errors.licenseCountry = 'País inválido';
      if (!trimmed(form.degreeInstitution)) errors.degreeInstitution = 'Campo requerido';
      else if (!textLengthBetween(form.degreeInstitution, 3, 120)) errors.degreeInstitution = 'Institución inválida';
      if (!trimmed(form.sessionCost)) errors.sessionCost = 'Campo requerido';
      else if (!textLengthBetween(form.sessionCost, 2, 80)) errors.sessionCost = 'Costo inválido';
      if (!trimmed(form.sessionDuration)) errors.sessionDuration = 'Campo requerido';
      else if (!textLengthBetween(form.sessionDuration, 2, 250)) errors.sessionDuration = 'Texto demasiado largo';
      if (!trimmed(form.yearsExperience)) errors.yearsExperience = 'Campo requerido';
      else {
        const years = Number(form.yearsExperience);
        if (!Number.isInteger(years) || years < 0 || years > 50) errors.yearsExperience = 'Ingresá un número entre 0 y 50';
      }
      if (!trimmed(form.remoteModality)) errors.remoteModality = 'Campo requerido';
      else if (!textLengthBetween(form.remoteModality, 3, 80)) errors.remoteModality = 'Modalidad inválida';
      if (!trimmed(form.bio)) errors.bio = 'Campo requerido';
      else if (!textLengthBetween(form.bio, 20, 1000)) errors.bio = 'Mínimo 20 caracteres';
      if (form.languages.length === 0) errors.languages = 'Seleccioná al menos un idioma';
      return showErrors(errors);
    }
    if (step === 3) {
      const errors = {};
      if (form.specialties.length === 0) errors.specialties = 'Seleccioná al menos una especialidad';
      if (form.ageRanges.length === 0) errors.ageRanges = 'Seleccioná al menos una edad';
      if (!acceptTerms) errors.acceptTerms = 'Campo requerido';
      if (!acceptPrivacy) errors.acceptPrivacy = 'Campo requerido';
      if (!acceptAgreement) errors.acceptAgreement = 'Campo requerido';
      return showErrors(errors);
    }
    return true;
  };

  const fieldClass = (name) => (fieldErrors[name] ? 'psico-field-invalid' : '');
  const fieldError = (name) => fieldErrors[name] ? <span className="psico-field-error">{fieldErrors[name]}</span> : null;

  const scrollToFormTop = () => {
    window.requestAnimationFrame(() => {
      formTopRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
    });
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      scrollToFormTop();
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    scrollToFormTop();
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
          acceptTerms,
          acceptPrivacy,
          acceptAgreement,
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
        await psychologistService.updateProfile({
          phone: normalizePhoneNumber(form.phone),
          contactEmail: form.contactEmail || form.email,
          gender: form.gender,
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
          universityDegree: form.universityDegree,
          licenseNumber: form.licenseNumber,
          licenseEntity: form.licenseEntity,
          licenseCountry: form.licenseCountry,
          degreeInstitution: form.degreeInstitution,
          sessionCost: form.sessionCost,
          sessionDuration: form.sessionDuration,
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

      toast.success(
        regData.verificationEmailSent
          ? 'Te enviamos un enlace para confirmar tu email.'
          : 'Reenviá el enlace de confirmación desde la próxima pantalla.',
      );
      navigate('/verificar-email');
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
          <strong>Aviso importante:</strong> La atención remota no es recomendada para crisis aguda con riesgo de vida o psicosis activa.
        </div>

        <div className="psico-visible-patients-box">
          <h2>Visible para pacientes</h2>
          <ul>
            {VISIBLE_PATIENT_FIELDS.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
          <p className="psico-visible-patients-note">
            El email y el WhatsApp lo verá el paciente una vez que el profesional apruebe la solicitud de consulta enviada por el usuario/paciente.
          </p>
        </div>

        {/* Stepper */}
        <div ref={formTopRef} className="psico-stepper">
          {STEPS.map((s, i) => (
            <div key={s} className={`psico-step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
              <div className="psico-step-dot">{i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="psico-form-step">
          {step === 0 && (
            <div className="psico-form-grid">
              <label className={fieldClass('email')}>Email *<input type="email" name="email" value={form.email} onChange={handleChange} />{fieldError('email')}</label>
              <label className={fieldClass('password')}>Contraseña *<PasswordInput name="password" value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" />{fieldError('password')}</label>
              <label className={fieldClass('confirmPassword')}>Confirmar contraseña *<PasswordInput name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />{fieldError('confirmPassword')}</label>
            </div>
          )}

          {step === 1 && (
            <div className="psico-form-grid">
              <label className={fieldClass('firstName')}>Nombre *<input type="text" name="firstName" value={form.firstName} onChange={handleChange} />{fieldError('firstName')}</label>
              <label className={fieldClass('lastName')}>Apellido *<input type="text" name="lastName" value={form.lastName} onChange={handleChange} />{fieldError('lastName')}</label>
              <label className={fieldClass('gender')}>Género *
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                {fieldError('gender')}
              </label>
              <label className={fieldClass('dateOfBirth')}>Fecha de nacimiento *<input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />{fieldError('dateOfBirth')}</label>
              <label>Tipo de documento *
                <select name="documentType" value={form.documentType} onChange={handleChange}>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="DNI">DNI</option>
                  <option value="Cédula">Cédula</option>
                  <option value="Otro">Otro</option>
                </select>
              </label>
              <label className={fieldClass('documentNumber')}>Número de documento *<input type="text" name="documentNumber" value={form.documentNumber} onChange={handleChange} />{fieldError('documentNumber')}</label>
              <label className={fieldClass('taxId')}>Identificación fiscal como Monotributista (si aplica) *<input type="text" name="taxId" value={form.taxId} onChange={handleChange} />{fieldError('taxId')}</label>
              <label className={fieldClass('country')}>País *<input type="text" name="country" value={form.country} onChange={handleChange} />{fieldError('country')}</label>
              <label className={fieldClass('region')}>Estado / Provincia / Región *<input type="text" name="region" value={form.region} onChange={handleChange} />{fieldError('region')}</label>
              <PhoneNumberInput
                id="register-psychologist-intl-phone"
                label="WhatsApp"
                required
                value={form.phone}
                onChange={(phone) => updateField('phone', phone)}
                error={fieldErrors.phone}
                className={fieldClass('phone')}
              />
              <label className={fieldClass('contactEmail')}>Email de contacto público *<input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} />{fieldError('contactEmail')}</label>
              <label className={`psico-full-col ${fieldClass('addressStreet')}`}>Calle *<input type="text" name="addressStreet" value={form.addressStreet} onChange={handleChange} />{fieldError('addressStreet')}</label>
              <label className={fieldClass('addressNumber')}>Número *<input type="text" name="addressNumber" value={form.addressNumber} onChange={handleChange} />{fieldError('addressNumber')}</label>
              <label className={fieldClass('addressCity')}>Ciudad *<input type="text" name="addressCity" value={form.addressCity} onChange={handleChange} />{fieldError('addressCity')}</label>
              <label className={fieldClass('addressPostalCode')}>Código postal *<input type="text" name="addressPostalCode" value={form.addressPostalCode} onChange={handleChange} />{fieldError('addressPostalCode')}</label>
            </div>
          )}

          {step === 2 && (
            <div className="psico-form-grid">
              <label className={fieldClass('universityDegree')}>Título profesional *
                <select name="universityDegree" value={form.universityDegree} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {fieldError('universityDegree')}
              </label>
              <label className={fieldClass('licenseNumber')}>Número de licencia / colegiación / matrícula *<input type="text" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} />{fieldError('licenseNumber')}</label>
              <label className={fieldClass('licenseEntity')}>Entidad que expide la licencia *<input type="text" name="licenseEntity" value={form.licenseEntity} onChange={handleChange} />{fieldError('licenseEntity')}</label>
              <label className={fieldClass('licenseCountry')}>País de emisión de la licencia *<input type="text" name="licenseCountry" value={form.licenseCountry} onChange={handleChange} />{fieldError('licenseCountry')}</label>
              <label className={`psico-full-col ${fieldClass('degreeInstitution')}`}>Institución que otorgó el título *<input type="text" name="degreeInstitution" value={form.degreeInstitution} onChange={handleChange} />{fieldError('degreeInstitution')}</label>
              <label className={fieldClass('sessionCost')}>Costo final por sesión *<input type="text" name="sessionCost" value={form.sessionCost} onChange={handleChange} placeholder="Ej: USD 40 o EUR 35" />{fieldError('sessionCost')}</label>
              <label className={`psico-full-col ${fieldClass('sessionDuration')}`}>Tiempo de sesión / promoción *
                <textarea
                  name="sessionDuration"
                  value={form.sessionDuration}
                  onChange={handleChange}
                  rows={4}
                  placeholder={'Ej: 50 minutos\nPromoción: 2 sesiones al costo de una'}
                />
                {fieldError('sessionDuration')}
              </label>
              <label className={fieldClass('yearsExperience')}>Años de experiencia * <small>(entre 0 y 50)</small><input type="number" name="yearsExperience" value={form.yearsExperience} onChange={handleChange} min="0" max="50" />{fieldError('yearsExperience')}</label>
              <label className={fieldClass('remoteModality')}>Modalidad remota *<input type="text" name="remoteModality" value={form.remoteModality} onChange={handleChange} />{fieldError('remoteModality')}</label>
              <label className={`psico-full-col ${fieldClass('bio')}`}>Breve descripción de experiencia y estudios *
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} placeholder="Breve descripción de tu experiencia y estudios" />
                {fieldError('bio')}
              </label>
              <div className={`psico-full-col ${fieldClass('languages')}`}>
                <label className="psico-checkbox-label-heading">Idiomas hablados *</label>
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
                <label className="psico-checkbox-label-heading">Edad de atención *</label>
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
                  <li>Autorización para verificar datos ante organismos competentes.</li>
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
                    <a href="/psicologos/politicas-de-privacidad" target="_blank" rel="noopener noreferrer" style={{ color: '#7a3055', fontWeight: 600 }}>Política de Privacidad</a>
                  </span>
                </label>
                {fieldError('acceptPrivacy')}
                <label className="psico-checkbox-item" style={{ margin: '0.4rem 0' }}>
                  <input
                    type="checkbox"
                    checked={acceptAgreement}
                    onChange={(e) => {
                      setAcceptAgreement(e.target.checked);
                      setFieldErrors((prev) => {
                        if (!prev.acceptAgreement) return prev;
                        const next = { ...prev };
                        delete next.acceptAgreement;
                        return next;
                      });
                    }}
                  />
                  <span style={{ fontSize: '0.88rem' }}>
                    Acepto el{' '}
                    <a href="/psicologos/acuerdo-aceptacion-psicologo" target="_blank" rel="noopener noreferrer" style={{ color: '#7a3055', fontWeight: 600 }}>
                      Acuerdo de Aceptación del Profesional Psicólogo
                    </a>
                  </span>
                </label>
                {fieldError('acceptAgreement')}
              </div>
            </div>
          )}
        </div>

        <div className="psico-form-actions">
          {step > 0 && (
            <button type="button" className="psico-btn-secondary" onClick={handleBack} disabled={loading}>
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
