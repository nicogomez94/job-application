import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { categoryService, jobOfferService } from '../../services';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { JOB_POSTING_LANGUAGE_OPTIONS } from '../../constants/jobOfferLanguages';
import './JobForm.css';

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

const toDateInputValue = (dateValue) => {
  if (!dateValue) return '';
  return new Date(dateValue).toISOString().slice(0, 10);
};

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, myOffersResponse] = await Promise.all([
          categoryService.getAll(),
          jobOfferService.getMyOffers(),
        ]);
        setCategories(categoriesResponse.data || []);
        const offer = (myOffersResponse.data || []).find((item) => item.id === id);
        if (!offer) {
          toast.error('Oferta no encontrada');
          navigate('/company/jobs');
          return;
        }
        setJob(offer);
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudo cargar la oferta');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (!job) return;
    setFormData({
      title: job.title || '',
      description: job.description || '',
      location: job.location || '',
      categoryId: job.categoryId || '',
      postingLanguage: job.postingLanguage || 'es',
      requirementsText: (job.requirements || []).join('\n'),
      responsibilitiesText: (job.responsibilities || []).join('\n'),
      languagesText: (job.languages || []).join(', '),
      salaryMin: job.salaryMin || '',
      salaryMax: job.salaryMax || '',
      salaryPeriod: job.salaryPeriod || 'monthly',
      workType: job.workType || 'FULL_TIME',
      workMode: job.workMode || 'PRESENCIAL',
      experienceLevel: job.experienceLevel || 'MID',
      whatsappNumber: job.whatsappNumber || '',
      contactEmail: job.contactEmail || '',
      expiresAt: toDateInputValue(job.expiresAt),
      isActive: Boolean(job.isActive),
    });
  }, [job]);

  const canSubmit = useMemo(() => Boolean(formData?.title && formData?.description && formData?.location && formData?.categoryId), [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;
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
        isActive: formData.isActive,
      };
      await jobOfferService.update(id, payload);
      toast.success('Oferta actualizada');
      navigate('/company/jobs');
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'No se pudo actualizar la oferta';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
        <p>Cargando oferta...</p>
      </div>
    );
  }

  return (
    <div className="job-form-page">
      <BackToDashboardButton to="/company/dashboard" />
      <h1 style={{ marginBottom: '1rem' }}>Editar Oferta Laboral</h1>

      <form className="card" onSubmit={handleSubmit}>
        <div className="job-form-grid">
          <div>
            <label htmlFor="edit-job-title" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Título del puesto
            </label>
            <input id="edit-job-title" className="input" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="edit-job-description" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Descripción del puesto
            </label>
            <textarea id="edit-job-description" className="input" name="description" rows={5} value={formData.description} onChange={handleChange} style={{ resize: 'vertical' }} required />
          </div>

          <div className="job-form-grid-two">
            <div>
              <label htmlFor="edit-job-location" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Ubicación
              </label>
              <input id="edit-job-location" className="input" name="location" value={formData.location} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="edit-job-category" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Categoría
              </label>
              <select id="edit-job-category" className="input" name="categoryId" value={formData.categoryId} onChange={handleChange} required>
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
            <label htmlFor="edit-job-posting-language" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Idioma del anuncio
            </label>
            <select
              id="edit-job-posting-language"
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
              <label htmlFor="edit-job-work-type" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Tipo de trabajo
              </label>
              <select id="edit-job-work-type" className="input" name="workType" value={formData.workType} onChange={handleChange}>
                <option value="FULL_TIME">Tiempo completo</option>
                <option value="PART_TIME">Medio tiempo</option>
                <option value="CONTRACT">Contrato</option>
                <option value="FREELANCE">Freelance</option>
                <option value="INTERNSHIP">Pasantía</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-job-work-mode" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Modalidad
              </label>
              <select id="edit-job-work-mode" className="input" name="workMode" value={formData.workMode} onChange={handleChange}>
                <option value="REMOTO">Remoto</option>
                <option value="PRESENCIAL">Presencial</option>
                <option value="HIBRIDO">Híbrido</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-job-experience-level" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Nivel de experiencia
              </label>
              <select id="edit-job-experience-level" className="input" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
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
              <label htmlFor="edit-job-salary-min" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Salario mínimo
              </label>
              <input id="edit-job-salary-min" className="input" type="number" min="0" step="0.01" name="salaryMin" value={formData.salaryMin} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="edit-job-salary-max" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Salario máximo
              </label>
              <input id="edit-job-salary-max" className="input" type="number" min="0" step="0.01" name="salaryMax" value={formData.salaryMax} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="edit-job-salary-period" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Periodicidad salarial
              </label>
              <select id="edit-job-salary-period" className="input" name="salaryPeriod" value={formData.salaryPeriod} onChange={handleChange}>
                <option value="monthly">Mensual</option>
                <option value="annual">Anual</option>
                <option value="hourly">Por hora</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="edit-job-requirements" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Requisitos
            </label>
            <textarea id="edit-job-requirements" className="input" name="requirementsText" rows={4} value={formData.requirementsText} onChange={handleChange} style={{ resize: 'vertical' }} required />
          </div>
          <div>
            <label htmlFor="edit-job-responsibilities" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Responsabilidades
            </label>
            <textarea id="edit-job-responsibilities" className="input" name="responsibilitiesText" rows={4} value={formData.responsibilitiesText} onChange={handleChange} style={{ resize: 'vertical' }} required />
          </div>
          <div>
            <label htmlFor="edit-job-languages" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Idiomas requeridos
            </label>
            <input id="edit-job-languages" className="input" name="languagesText" value={formData.languagesText} onChange={handleChange} />
          </div>

          <div className="job-form-grid-three">
            <div>
              <label htmlFor="edit-job-whatsapp" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                WhatsApp de contacto
              </label>
              <input id="edit-job-whatsapp" className="input" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="edit-job-contact-email" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Email de contacto
              </label>
              <input id="edit-job-contact-email" className="input" type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="edit-job-expires-at" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Fecha de vencimiento
              </label>
              <input id="edit-job-expires-at" className="input" type="date" name="expiresAt" min="1900-01-01" max="9999-12-31" value={formData.expiresAt} onChange={handleChange} />
            </div>
          </div>

          <label htmlFor="edit-job-active" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <input id="edit-job-active" type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
            <span>Oferta activa</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
          <button className="btn btn-primary" disabled={saving || !canSubmit}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <Link className="btn btn-outline" to="/company/jobs">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
