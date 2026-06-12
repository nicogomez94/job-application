import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { psychologistService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import { getPhoneValidationMessage, normalizePhoneNumber } from '../../utils/phoneNumber';
import './Psicologos.css';

const listToText = (value) => (Array.isArray(value) ? value.join(', ') : '');
const textToList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const initialForm = {
  firstName: '',
  lastName: '',
  displayName: '',
  gender: '',
  dateOfBirth: '',
  phone: '',
  contactEmail: '',
  dni: '',
  cuitCuil: '',
  addressStreet: '',
  addressNumber: '',
  addressFloor: '',
  addressCity: '',
  addressProvince: '',
  addressPostalCode: '',
  country: '',
  region: '',
  registrationType: '',
  practiceProvince: '',
  universityDegree: '',
  graduationYear: '',
  universityName: '',
  degreeInstitution: '',
  licenseNumber: '',
  licenseProvince: '',
  healthMinistryReg: '',
  virtualConsultingAuthorization: '',
  documentType: '',
  documentNumber: '',
  taxId: '',
  licenseEntity: '',
  licenseCountry: '',
  sessionCost: '',
  sessionDuration: '',
  specialties: '',
  ageRanges: '',
  languages: '',
  yearsExperience: '',
  remoteModality: '',
  bio: '',
};

export default function PsychologistEditProfile() {
  const navigate = useNavigate();
  const { updateUser, logout } = useAuthStore();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await psychologistService.getProfile();
        const p = res.data || {};
        const isArgentina = p.registrationType === 'ARGENTINA';
        setForm({
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          displayName: p.displayName || '',
          gender: p.gender || '',
          dateOfBirth: p.dateOfBirth ? String(p.dateOfBirth).slice(0, 10) : '',
          phone: p.phone || '',
          contactEmail: p.contactEmail || '',
          dni: p.dni || '',
          cuitCuil: p.cuitCuil || '',
          addressStreet: p.addressStreet || '',
          addressNumber: p.addressNumber || '',
          addressFloor: p.addressFloor || '',
          addressCity: p.addressCity || '',
          addressProvince: p.addressProvince || '',
          addressPostalCode: p.addressPostalCode || '',
          country: p.country || (isArgentina ? 'Argentina' : ''),
          region: p.region || p.practiceProvince || p.licenseProvince || p.addressProvince || '',
          registrationType: p.registrationType || '',
          practiceProvince: p.practiceProvince || '',
          universityDegree: p.universityDegree || '',
          graduationYear: p.graduationYear ?? '',
          universityName: p.universityName || '',
          degreeInstitution: p.degreeInstitution || '',
          licenseNumber: p.licenseNumber || '',
          licenseProvince: p.licenseProvince || '',
          healthMinistryReg: p.healthMinistryReg || '',
          virtualConsultingAuthorization: p.virtualConsultingAuthorization || '',
          documentType: p.documentType || '',
          documentNumber: p.documentNumber || '',
          taxId: p.taxId || '',
          licenseEntity: p.licenseEntity || '',
          licenseCountry: p.licenseCountry || '',
          sessionCost: p.sessionCost || '',
          sessionDuration: p.sessionDuration || '',
          specialties: listToText(p.specialties),
          ageRanges: listToText(p.ageRanges),
          languages: listToText(p.languages),
          yearsExperience: p.yearsExperience ?? '',
          remoteModality: p.remoteModality || '',
          bio: p.bio || '',
        });
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const displayName = useMemo(
    () => form.displayName || `${form.firstName} ${form.lastName}`.trim(),
    [form.displayName, form.firstName, form.lastName],
  );
  const isArgentina = form.registrationType === 'ARGENTINA';

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'phone') setPhoneError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    updateField(name, value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextPhoneError = getPhoneValidationMessage(form.phone);
    if (nextPhoneError) {
      setPhoneError(nextPhoneError);
      toast.error(nextPhoneError);
      return;
    }

    setPhoneError('');
    setSaving(true);

    try {
      const payload = {
        ...form,
        phone: normalizePhoneNumber(form.phone) || null,
        specialties: textToList(form.specialties),
        ageRanges: textToList(form.ageRanges),
        languages: textToList(form.languages),
        sessionCost: form.sessionCost,
        sessionDuration: form.sessionDuration,
        yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : undefined,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
      };
      const res = await psychologistService.updateProfile(payload);
      updateUser(res.data?.psychologist || payload);
      toast.success('Perfil actualizado');
      navigate('/psicologo/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('¿Seguro que querés borrar tu perfil? Esta acción elimina la cuenta definitivamente.');
    if (!confirmed) return;

    setDeletingAccount(true);
    try {
      await psychologistService.deleteAccount();
      logout();
      toast.success('Perfil borrado');
      navigate('/psicologos');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo borrar el perfil');
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return <div className="psico-loading psico-page-loading">Cargando perfil...</div>;
  }

  return (
    <div className="psico-dashboard-page">
      <div className="psico-dashboard-container">
        <Link to="/psicologo/dashboard" className="psico-back-link">
          <ArrowLeft size={16} /> Volver al panel
        </Link>

        <form className="psico-edit-profile" onSubmit={handleSubmit}>
          <div className="psico-edit-profile-header">
            <div>
              <h1>Editar perfil</h1>
              {displayName && <p>{displayName}</p>}
            </div>
            <button type="submit" className="psico-btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>

          <div className="psico-edit-profile-grid">
            <label>
              Nombre
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </label>
            <label>
              Apellido
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </label>
            <label>
              Género
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
                <option value="Otro">Otro</option>
              </select>
            </label>
            <label>
              Fecha de nacimiento
              <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
            </label>
            <PhoneNumberInput
              id="psychologist-profile-phone"
              label="WhatsApp"
              value={form.phone}
              onChange={(phone) => updateField('phone', phone)}
              error={phoneError}
            />
            <label>
              Email de contacto
              <input name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} />
            </label>
            <label>
              DNI / documento
              <input name="dni" value={form.dni} onChange={handleChange} />
            </label>
            <label>
              Identificación fiscal como Monotributista
              <input name="cuitCuil" value={form.cuitCuil} onChange={handleChange} />
            </label>
            {!isArgentina && (
              <>
                <label>
                  Tipo de documento
                  <input name="documentType" value={form.documentType} onChange={handleChange} />
                </label>
                <label>
                  Número de documento
                  <input name="documentNumber" value={form.documentNumber} onChange={handleChange} />
                </label>
                <label>
                  Identificación fiscal como Monotributista
                  <input name="taxId" value={form.taxId} onChange={handleChange} />
                </label>
              </>
            )}
            <label>
              País
              <input name="country" value={form.country} onChange={handleChange} />
            </label>
            <label>
              Región
              <input name="region" value={form.region} onChange={handleChange} />
            </label>
            <label>
              Provincia donde ejerce
              <input name="practiceProvince" value={form.practiceProvince} onChange={handleChange} />
            </label>
            <label>
              Calle
              <input name="addressStreet" value={form.addressStreet} onChange={handleChange} />
            </label>
            <label>
              Número
              <input name="addressNumber" value={form.addressNumber} onChange={handleChange} />
            </label>
            <label>
              Piso / departamento
              <input name="addressFloor" value={form.addressFloor} onChange={handleChange} />
            </label>
            <label>
              Ciudad
              <input name="addressCity" value={form.addressCity} onChange={handleChange} />
            </label>
            <label>
              Provincia de domicilio
              <input name="addressProvince" value={form.addressProvince} onChange={handleChange} />
            </label>
            <label>
              Código postal
              <input name="addressPostalCode" value={form.addressPostalCode} onChange={handleChange} />
            </label>
            <label>
              Título profesional
              <input name="universityDegree" value={form.universityDegree} onChange={handleChange} />
            </label>
            <label>
              Año de graduación
              <input name="graduationYear" type="number" min="1900" max="2100" value={form.graduationYear} onChange={handleChange} />
            </label>
            <label>
              Universidad
              <input name="universityName" value={form.universityName} onChange={handleChange} />
            </label>
            <label>
              Institución emisora del título
              <input name="degreeInstitution" value={form.degreeInstitution} onChange={handleChange} />
            </label>
            <label>
              Matrícula Nacional/Profesional Número
              <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} />
            </label>
            <label>
              Matrícula Provincial Numero
              <input name="licenseProvince" value={form.licenseProvince} onChange={handleChange} placeholder="Provincia/Número" />
            </label>
            <label>
              Entidad que expide la licencia
              <input name="licenseEntity" value={form.licenseEntity} onChange={handleChange} />
            </label>
            <label>
              País de licencia
              <input name="licenseCountry" value={form.licenseCountry} onChange={handleChange} />
            </label>
            <label>
              Registro Ministerio de Salud
              <input name="healthMinistryReg" value={form.healthMinistryReg} onChange={handleChange} />
            </label>
            <label className="psico-edit-profile-wide">
              Licencia Sanitaria Federal
              <input name="virtualConsultingAuthorization" value={form.virtualConsultingAuthorization} onChange={handleChange} />
            </label>
            <label>
              Costo final por sesión
              <input name="sessionCost" value={form.sessionCost} onChange={handleChange} placeholder="Ej: ARS 25.000" required />
            </label>
            <label className="psico-edit-profile-wide">
              Tiempo de sesión / promoción
              <textarea
                name="sessionDuration"
                rows={4}
                value={form.sessionDuration}
                onChange={handleChange}
                placeholder="Ej: 50 minutos
Promoción: 2 sesiones al costo de una"
                required
              />
            </label>
            <label>
              Especialidades
              <input name="specialties" value={form.specialties} onChange={handleChange} placeholder="Separadas por coma" />
            </label>
            <label>
              Edad
              <input name="ageRanges" value={form.ageRanges} onChange={handleChange} placeholder="Separados por coma" />
            </label>
            <label>
              Idiomas
              <input name="languages" value={form.languages} onChange={handleChange} placeholder="Separados por coma" />
            </label>
            <label>
              Años de experiencia
              <input name="yearsExperience" type="number" min="0" max="50" value={form.yearsExperience} onChange={handleChange} />
            </label>
            <label className="psico-edit-profile-wide">
              Modalidad remota
              <input name="remoteModality" value={form.remoteModality} onChange={handleChange} />
            </label>
            <label className="psico-edit-profile-wide">
              Sobre mí
              <textarea name="bio" rows={6} value={form.bio} onChange={handleChange} />
            </label>
          </div>
        </form>

        <button
          type="button"
          className="psico-delete-profile-btn"
          onClick={handleDeleteAccount}
          disabled={deletingAccount}
        >
          {deletingAccount ? 'Borrando perfil...' : 'Borrar perfil'}
        </button>
      </div>
    </div>
  );
}
