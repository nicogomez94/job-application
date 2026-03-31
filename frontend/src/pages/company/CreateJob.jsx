import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { categoryService, companyService, jobOfferService } from '../../services';
import { DEBUG_FORM_DATA, DEBUG_MODE } from '../../config/debug';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { JOB_POSTING_LANGUAGE_OPTIONS } from '../../constants/jobOfferLanguages';
import './JobForm.css';

const getInitialForm = () =>
  DEBUG_MODE
    ? { ...DEBUG_FORM_DATA.createJob }
    : {
        title: '',
        description: '',
        location: '',
        categoryId: '',
        postingLanguage: 'es',
        requirementsText: '',
        responsibilitiesText: '',
        languagesText: '',
        salaryMin: '',
        salaryMax: '',
        salaryPeriod: 'monthly',
        workType: 'FULL_TIME',
        workMode: 'REMOTO',
        experienceLevel: 'MID',
        whatsappNumber: '',
        contactEmail: '',
        expiresAt: '',
      };

const parseTextToArray = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const parseCommaToArray = (text) =>
  text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export default function CreateJob() {
  const [formData, setFormData] = useState(getInitialForm);
  const [categories, setCategories] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, subscriptionResponse] = await Promise.all([
          categoryService.getAll(),
          companyService.checkSubscription(),
        ]);
        const loadedCategories = categoriesResponse.data || [];
        setCategories(loadedCategories);
        setIsBlocked(Boolean(subscriptionResponse.data?.isBlocked));
        if (DEBUG_MODE && loadedCategories.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({ ...prev, categoryId: loadedCategories[0].id }));
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudieron cargar datos para crear la oferta');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedExpiresAt = formData.expiresAt ? new Date(formData.expiresAt) : null;
    if (parsedExpiresAt && Number.isNaN(parsedExpiresAt.getTime())) {
      toast.error('La fecha de vencimiento es inválida');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        categoryId: formData.categoryId,
        postingLanguage: formData.postingLanguage,
        requirements: parseTextToArray(formData.requirementsText),
        responsibilities: parseTextToArray(formData.responsibilitiesText),
        languages: parseCommaToArray(formData.languagesText),
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
        salaryPeriod: formData.salaryPeriod || null,
        workType: formData.workType,
        workMode: formData.workMode,
        experienceLevel: formData.experienceLevel,
        whatsappNumber: formData.whatsappNumber.trim() || null,
        contactEmail: formData.contactEmail.trim() || null,
        expiresAt: parsedExpiresAt ? parsedExpiresAt.toISOString() : null,
      };

      await jobOfferService.create(payload);
      toast.success('Oferta creada exitosamente');
      navigate('/company/jobs');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'No se pudo crear la oferta';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
        <p>Cargando formulario...</p>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        <BackToDashboardButton to="/company/dashboard" />
        <div className="card" style={{ border: '1px solid #fecaca', background: '#fef2f2' }}>
          <h1 style={{ color: '#991b1b', marginBottom: '0.6rem' }}>No podés crear ofertas</h1>
          <p style={{ color: '#7f1d1d', marginBottom: '1rem' }}>Necesitás una suscripción activa para publicar empleos.</p>
          <Link className="btn btn-primary" to="/company/subscription">
            Activar suscripción
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="job-form-page">
      <BackToDashboardButton to="/company/dashboard" />
      <h1 style={{ marginBottom: '1rem' }}>Crear Oferta Laboral</h1>

      <form className="card" onSubmit={handleSubmit}>
        <div className="job-form-grid">
          <div>
            <label htmlFor="create-job-title" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Título del puesto
            </label>
            <input id="create-job-title" className="input" name="title" placeholder="Título del puesto" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="create-job-description" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Descripción del puesto
            </label>
            <textarea
              id="create-job-description"
              className="input"
              name="description"
              placeholder="Descripción del puesto"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              style={{ resize: 'vertical' }}
              required
            />
          </div>
          <div className="job-form-grid-two">
            <div>
              <label htmlFor="create-job-location" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Ubicación
              </label>
              <input id="create-job-location" className="input" name="location" placeholder="Ubicación" value={formData.location} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="create-job-category" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Categoría
              </label>
              <select id="create-job-category" className="input" name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="create-job-posting-language" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Idioma del anuncio
            </label>
            <select
              id="create-job-posting-language"
              className="input"
              name="postingLanguage"
              value={formData.postingLanguage}
              onChange={handleChange}
              required
            >
              {JOB_POSTING_LANGUAGE_OPTIONS.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>

          <div className="job-form-grid-three">
            <div>
              <label htmlFor="create-job-work-type" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Tipo de trabajo
              </label>
              <select id="create-job-work-type" className="input" name="workType" value={formData.workType} onChange={handleChange}>
                <option value="FULL_TIME">Tiempo completo</option>
                <option value="PART_TIME">Medio tiempo</option>
                <option value="CONTRACT">Contrato</option>
                <option value="FREELANCE">Freelance</option>
                <option value="INTERNSHIP">Pasantía</option>
              </select>
            </div>
            <div>
              <label htmlFor="create-job-work-mode" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Modalidad
              </label>
              <select id="create-job-work-mode" className="input" name="workMode" value={formData.workMode} onChange={handleChange}>
                <option value="REMOTO">Trabajo remoto</option>
              </select>
            </div>
            <div>
              <label htmlFor="create-job-experience-level" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Nivel de experiencia
              </label>
              <select id="create-job-experience-level" className="input" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                <option value="ENTRY">Entry</option>
                <option value="JUNIOR">Junior</option>
                <option value="MID">Mid</option>
                <option value="SENIOR">Senior</option>
                <option value="LEAD">Lead</option>
              </select>
            </div>
          </div>

          <div className="job-form-grid-three">
            <div>
              <label htmlFor="create-job-salary-min" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Salario mínimo
              </label>
              <input id="create-job-salary-min" className="input" type="number" min="0" step="0.01" name="salaryMin" placeholder="Salario mínimo" value={formData.salaryMin} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="create-job-salary-max" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Salario máximo
              </label>
              <input id="create-job-salary-max" className="input" type="number" min="0" step="0.01" name="salaryMax" placeholder="Salario máximo" value={formData.salaryMax} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="create-job-salary-period" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Periodicidad salarial
              </label>
              <select id="create-job-salary-period" className="input" name="salaryPeriod" value={formData.salaryPeriod} onChange={handleChange}>
                <option value="monthly">Mensual</option>
                <option value="annual">Anual</option>
                <option value="hourly">Por hora</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="create-job-requirements" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Requisitos
            </label>
            <textarea
              id="create-job-requirements"
              className="input"
              name="requirementsText"
              placeholder="Requisitos (uno por línea)"
              rows={4}
              value={formData.requirementsText}
              onChange={handleChange}
              style={{ resize: 'vertical' }}
              required
            />
          </div>
          <div>
            <label htmlFor="create-job-responsibilities" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Responsabilidades
            </label>
            <textarea
              id="create-job-responsibilities"
              className="input"
              name="responsibilitiesText"
              placeholder="Responsabilidades (una por línea)"
              rows={4}
              value={formData.responsibilitiesText}
              onChange={handleChange}
              style={{ resize: 'vertical' }}
              required
            />
          </div>
          <div>
            <label htmlFor="create-job-languages" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Idiomas requeridos
            </label>
            <input
              id="create-job-languages"
              className="input"
              name="languagesText"
              placeholder="Idiomas requeridos (separados por coma)"
              value={formData.languagesText}
              onChange={handleChange}
            />
          </div>

          <div className="job-form-grid-three">
            <div>
              <label htmlFor="create-job-whatsapp" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                WhatsApp de contacto
              </label>
              <input id="create-job-whatsapp" className="input" name="whatsappNumber" placeholder="WhatsApp de contacto" value={formData.whatsappNumber} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="create-job-contact-email" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Email de contacto
              </label>
              <input id="create-job-contact-email" className="input" type="email" name="contactEmail" placeholder="Email de contacto" value={formData.contactEmail} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="create-job-expires-at" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Fecha de vencimiento
              </label>
              <input id="create-job-expires-at" className="input" type="date" name="expiresAt" min="1900-01-01" max="9999-12-31" value={formData.expiresAt} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Publicar oferta'}
          </button>
          <Link className="btn btn-outline" to="/company/jobs">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
