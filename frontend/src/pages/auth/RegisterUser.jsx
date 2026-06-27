import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService, userService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { useI18n } from '../../context/i18nStore';
import { DEBUG_FORM_DATA, DEBUG_MODE } from '../../config/debug';
import PasswordInput from '../../components/PasswordInput';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import { getPhoneValidationMessage, normalizePhoneNumber } from '../../utils/phoneNumber';
import { EMAIL_VALIDATION_MESSAGE, isValidEmail } from '../../utils/emailValidation';
import './Register.css';

const MAX_OTHER_FILES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const getFilesExceedingSize = (files) => files.filter((file) => file.size > MAX_FILE_SIZE);

const getValidationMessage = (details) => {
  const firstDetail = Array.isArray(details) ? details[0] : null;
  return firstDetail?.message || null;
};

const getReadableRegisterError = (error) => {
  const status = error.response?.status;
  const serverMessage = error.response?.data?.error;
  const validationMessage = getValidationMessage(error.response?.data?.details);

  if (validationMessage) {
    return validationMessage;
  }

  if (serverMessage && serverMessage !== 'Datos de entrada inválidos') {
    return serverMessage;
  }

  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'La conexión tardó demasiado. Probá nuevamente en unos segundos.';
    }

    return 'No pudimos conectarnos con el servidor. Revisá tu conexión e intentá otra vez.';
  }

  if (status === 400) {
    return 'Revisá los datos ingresados. Puede haber un email inválido, una clave muy corta o un campo incompleto.';
  }

  if (status === 401 || status === 403) {
    return 'La sesión no se pudo validar. Actualizá la página e intentá crear la cuenta nuevamente.';
  }

  if (status === 409) {
    return 'Ese email ya está registrado. Probá iniciar sesión o recuperar la contraseña.';
  }

  if (status === 413) {
    return 'Alguno de los archivos es demasiado grande. Probá subir archivos de hasta 5 MB.';
  }

  if (status >= 500) {
    return 'El servidor tuvo un problema al crear la cuenta. Probá nuevamente en unos minutos.';
  }

  return 'No se pudo crear la cuenta. Revisá los datos e intentá nuevamente.';
};

const getReadableUploadError = (error, fallbackMessage) => {
  const status = error.response?.status;
  const serverMessage = error.response?.data?.error;

  if (serverMessage) {
    return serverMessage;
  }

  if (!error.response) {
    return 'No pudimos subir el archivo por un problema de conexión. Probá nuevamente.';
  }

  if (status === 413) {
    return 'El archivo es demasiado grande. Probá subir uno de hasta 5 MB.';
  }

  if (status >= 500) {
    return 'El servidor tuvo un problema al subir el archivo. Probá nuevamente en unos minutos.';
  }

  return fallbackMessage;
};

const getInitialForm = () => {
  const base = DEBUG_MODE
    ? { ...DEBUG_FORM_DATA.registerUser }
    : {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
      };

  return {
    ...base,
    cvFile: base.cvFile || null,
    otherFiles: Array.isArray(base.otherFiles) ? base.otherFiles : [],
  };
};

export default function RegisterUser() {
  const [formData, setFormData] = useState(getInitialForm);
  const [loading, setLoading] = useState(false);
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const { language } = useI18n();
  const { setAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const userType = 'user';

  const getFileKey = (file) => `${file.name}-${file.size}-${file.lastModified}`;

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'phone') setPhoneError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  const handleCvFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error('El archivo debe pesar como máximo 5 MB');
      e.target.value = '';
      return;
    }
    setFormData((prev) => ({ ...prev, cvFile: file }));
    e.target.value = '';
  };

  const handleOtherFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    const oversizedFiles = getFilesExceedingSize(selectedFiles);

    if (oversizedFiles.length > 0) {
      toast.error('Cada archivo debe pesar como máximo 5 MB');
      e.target.value = '';
      return;
    }

    const existingKeys = new Set(formData.otherFiles.map(getFileKey));
    const newUniqueFiles = selectedFiles.filter((file) => !existingKeys.has(getFileKey(file)));
    const mergedFiles = [...formData.otherFiles, ...newUniqueFiles];

    if (mergedFiles.length > MAX_OTHER_FILES) {
      toast.error(
        language === 'en'
          ? `You can upload up to ${MAX_OTHER_FILES} files`
          : `Podés subir hasta ${MAX_OTHER_FILES} archivos`
      );
      e.target.value = '';
      return;
    }

    setFormData((prev) => ({ ...prev, otherFiles: mergedFiles }));
    e.target.value = '';
  };

  const handleRemoveOtherFile = (fileIndex) => {
    const confirmed = window.confirm('¿Estás seguro de que querés borrar este archivo?');
    if (!confirmed) return;

    setFormData((prev) => ({
      ...prev,
      otherFiles: prev.otherFiles.filter((_, index) => index !== fileIndex),
    }));
  };

  const handleRemoveCv = () => {
    const confirmed = window.confirm('¿Estás seguro de que querés borrar este archivo?');
    if (!confirmed) return;

    setFormData((prev) => ({ ...prev, cvFile: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      toast.error(EMAIL_VALIDATION_MESSAGE);
      return;
    }

    if (!acceptedLegal) {
      toast.error('Debés aceptar los términos y condiciones y las políticas de privacidad para continuar');
      return;
    }

    if (!formData.cvFile) {
      toast.error('Debés subir tu CV para crear la cuenta');
      return;
    }

    if (formData.cvFile && formData.cvFile.size > MAX_FILE_SIZE) {
      toast.error('El CV debe pesar como máximo 5 MB');
      return;
    }

    if (getFilesExceedingSize(formData.otherFiles).length > 0) {
      toast.error('Cada archivo debe pesar como máximo 5 MB');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    const nextPhoneError = getPhoneValidationMessage(formData.phone);
    if (nextPhoneError) {
      setPhoneError(nextPhoneError);
      toast.error(nextPhoneError);
      return;
    }

    setPhoneError('');
    setLoading(true);
    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: normalizePhoneNumber(formData.phone) || undefined,
      };

      const response = await authService.registerUser(payload);
      const { user, token, verificationEmailSent } = response.data;

      setAuth(user, 'user', token);

      try {
        await userService.uploadCV(formData.cvFile);
      } catch (cvError) {
        console.error('Error al subir el CV durante el registro:', cvError);
        try {
          await userService.deleteAccount(token);
        } catch (deleteError) {
          console.error('No se pudo eliminar la cuenta tras fallar la subida del CV:', deleteError);
        }
        logout();
        toast.error(getReadableUploadError(cvError, 'No se pudo subir el CV. Probá con otro archivo.'));
        return;
      }

      let uploadedOtherFiles = 0;
      try {
        for (const file of formData.otherFiles) {
          await userService.uploadOtherFile(file);
          uploadedOtherFiles += 1;
        }
        const totalUploaded = 1 + uploadedOtherFiles;
        if (totalUploaded > 0) {
          toast.success(
            language === 'en'
              ? totalUploaded === 1
                ? 'File uploaded successfully'
                : `${totalUploaded} files uploaded successfully`
              : totalUploaded === 1
                ? 'Archivo subido exitosamente'
                : `${totalUploaded} archivos subidos exitosamente`
          );
        }
      } catch (uploadError) {
        console.error('Error al subir archivos adicionales durante el registro:', uploadError);
        toast.error(
          getReadableUploadError(
            uploadError,
            'La cuenta se creó, pero no se pudieron subir algunos archivos adicionales.'
          )
        );
      }

      toast.success(
        verificationEmailSent
          ? 'Cuenta creada. Te enviamos un enlace para confirmar tu email.'
          : 'Cuenta creada. Reenviá el enlace de confirmación desde la próxima pantalla.',
      );
      navigate('/verificar-email');
    } catch (error) {
      console.error('Error al crear cuenta de profesional:', error);
      toast.error(getReadableRegisterError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-container"
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/fondo2.jfif')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
          boxShadow: '0 20px 60px rgba(60, 42, 18, 0.22)',
          overflow: 'hidden',
        }}
      >
        <div
          className="register-header"
          style={{
            background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
            color: '#fff',
            padding: '2rem',
          }}
        >
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Registro de Profesional</h1>
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
              {language === 'en' ? 'Professional' : 'Profesional'}
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
              {language === 'en' ? 'Company' : 'Empresa'}
            </button>
          </div>

          <div className="register-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="register-user-first-name" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Nombre
              </label>
              <input
                id="register-user-first-name"
                className="input"
                name="firstName"
                placeholder="Nombre"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="register-user-last-name" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Apellido
              </label>
              <input
                id="register-user-last-name"
                className="input"
                name="lastName"
                placeholder="Apellido"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="register-user-email" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Email
            </label>
            <input
              id="register-user-email"
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
            <div>
              <label htmlFor="register-user-password" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Contraseña
              </label>
              <PasswordInput
                id="register-user-password"
                inputClassName="input"
                name="password"
                placeholder="Contraseña (mín. 6)"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>
            <div>
              <label htmlFor="register-user-confirm-password" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Confirmar contraseña
              </label>
              <PasswordInput
                id="register-user-confirm-password"
                inputClassName="input"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <PhoneNumberInput
              id="register-user-phone"
              label="Teléfono"
              value={formData.phone}
              onChange={(phone) => updateField('phone', phone)}
              error={phoneError}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="register-user-cv" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem' }}>
              CV (PDF, JPG o Word. máximo 1 archivo)
            </label>
            <input id="register-user-cv" type="file" onChange={handleCvFileChange} />
            {formData.cvFile && (
              <div style={{ marginTop: '0.6rem' }}>
                <p style={{ margin: 0, color: '#6f604b', fontSize: '0.92rem' }}>
                  1 archivo seleccionado
                </p>
                <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.4rem' }}>
                  <div
                    key={getFileKey(formData.cvFile)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.6rem',
                      border: '1px solid #d7c9b7',
                      borderRadius: '0.45rem',
                      padding: '0.4rem 0.55rem',
                      background: '#faf7f2',
                    }}
                  >
                    <span
                      title={formData.cvFile.name}
                      style={{
                        fontSize: '0.9rem',
                        color: '#5e4d38',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formData.cvFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCv}
                      style={{
                        border: '1px solid #c94f4f',
                        background: '#fff',
                        color: '#c94f4f',
                        borderRadius: '0.4rem',
                        padding: '0.25rem 0.55rem',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        flexShrink: 0,
                      }}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="register-user-other-files" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem' }}>
              Archivos varios (PDF, JPG o Word. máximo 4 archivos)
            </label>
            <input id="register-user-other-files" type="file" onChange={handleOtherFilesChange} multiple />
            {formData.otherFiles.length > 0 && (
              <div style={{ marginTop: '0.6rem' }}>
                <p style={{ margin: 0, color: '#6f604b', fontSize: '0.92rem' }}>
                  {formData.otherFiles.length} archivo{formData.otherFiles.length === 1 ? '' : 's'} seleccionado
                  {formData.otherFiles.length === 1 ? '' : 's'}
                </p>
                <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.4rem' }}>
                  {formData.otherFiles.map((file, index) => (
                    <div
                      key={getFileKey(file)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.6rem',
                        border: '1px solid #d7c9b7',
                        borderRadius: '0.45rem',
                        padding: '0.4rem 0.55rem',
                        background: '#faf7f2',
                      }}
                    >
                      <span
                        title={file.name}
                        style={{
                          fontSize: '0.9rem',
                          color: '#5e4d38',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOtherFile(index)}
                        style={{
                          border: '1px solid #c94f4f',
                          background: '#fff',
                          color: '#c94f4f',
                          borderRadius: '0.4rem',
                          padding: '0.25rem 0.55rem',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          flexShrink: 0,
                        }}
                      >
                        Borrar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            <input
              id="register-user-terms"
              type="checkbox"
              checked={acceptedLegal}
              onChange={(e) => setAcceptedLegal(e.target.checked)}
              style={{ marginTop: '0.2rem', accentColor: 'var(--primary-600)', cursor: 'pointer', flexShrink: 0 }}
            />
            <label htmlFor="register-user-terms" style={{ color: '#5e4d38', fontSize: '0.9rem', cursor: 'pointer' }}>
              Acepto los{' '}
              <Link to="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer">
                Términos y Condiciones
              </Link>{' '}
              y las{' '}
              <Link to="/politicas-y-privacidad" target="_blank" rel="noopener noreferrer">
                Políticas y Privacidad
              </Link>
            </label>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          <p style={{ marginTop: '1rem', textAlign: 'center', color: '#6f604b' }}>
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
