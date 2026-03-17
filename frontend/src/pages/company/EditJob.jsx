import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { categoryService, jobOfferService } from '../../services';
import BackToDashboardButton from '../../components/BackToDashboardButton';

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
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1rem' }}>
      <BackToDashboardButton to="/company/dashboard" />
      <h1 style={{ marginBottom: '1rem' }}>Editar Oferta Laboral</h1>

      <form className="card" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <input className="input" name="title" value={formData.title} onChange={handleChange} required />
          <textarea className="input" name="description" rows={5} value={formData.description} onChange={handleChange} style={{ resize: 'vertical' }} required />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input className="input" name="location" value={formData.location} onChange={handleChange} required />
            <select className="input" name="categoryId" value={formData.categoryId} onChange={handleChange} required>
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <select className="input" name="workType" value={formData.workType} onChange={handleChange}>
              <option value="FULL_TIME">Tiempo completo</option>
              <option value="PART_TIME">Medio tiempo</option>
              <option value="CONTRACT">Contrato</option>
              <option value="FREELANCE">Freelance</option>
              <option value="INTERNSHIP">Pasantía</option>
            </select>
            <select className="input" name="workMode" value={formData.workMode} onChange={handleChange}>
              <option value="PRESENCIAL">Presencial</option>
              <option value="REMOTO">Remoto</option>
              <option value="HIBRIDO">Híbrido</option>
            </select>
            <select className="input" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
              <option value="ENTRY">Entry</option>
              <option value="JUNIOR">Junior</option>
              <option value="MID">Mid</option>
              <option value="SENIOR">Senior</option>
              <option value="LEAD">Lead</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <input className="input" type="number" min="0" step="0.01" name="salaryMin" value={formData.salaryMin} onChange={handleChange} />
            <input className="input" type="number" min="0" step="0.01" name="salaryMax" value={formData.salaryMax} onChange={handleChange} />
            <select className="input" name="salaryPeriod" value={formData.salaryPeriod} onChange={handleChange}>
              <option value="monthly">Mensual</option>
              <option value="annual">Anual</option>
              <option value="hourly">Por hora</option>
            </select>
          </div>

          <textarea className="input" name="requirementsText" rows={4} value={formData.requirementsText} onChange={handleChange} style={{ resize: 'vertical' }} required />
          <textarea className="input" name="responsibilitiesText" rows={4} value={formData.responsibilitiesText} onChange={handleChange} style={{ resize: 'vertical' }} required />
          <input className="input" name="languagesText" value={formData.languagesText} onChange={handleChange} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <input className="input" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} />
            <input className="input" type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
            <input className="input" type="date" name="expiresAt" min="1900-01-01" max="9999-12-31" value={formData.expiresAt} onChange={handleChange} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
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
