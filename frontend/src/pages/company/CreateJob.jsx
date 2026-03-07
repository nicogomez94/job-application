import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { categoryService, companyService, jobOfferService } from '../../services';

const initialForm = {
  title: '',
  description: '',
  location: '',
  categoryId: '',
  requirementsText: '',
  responsibilitiesText: '',
  languagesText: '',
  salaryMin: '',
  salaryMax: '',
  salaryPeriod: 'monthly',
  workType: 'FULL_TIME',
  workMode: 'PRESENCIAL',
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
  const [formData, setFormData] = useState(initialForm);
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
        setCategories(categoriesResponse.data || []);
        setIsBlocked(Boolean(subscriptionResponse.data?.isBlocked));
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
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Crear Oferta Laboral</h1>

      <form className="card" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <input className="input" name="title" placeholder="Título del puesto" value={formData.title} onChange={handleChange} required />
          <textarea
            className="input"
            name="description"
            placeholder="Descripción del puesto"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            style={{ resize: 'vertical' }}
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input className="input" name="location" placeholder="Ubicación" value={formData.location} onChange={handleChange} required />
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
            <input className="input" type="number" min="0" step="0.01" name="salaryMin" placeholder="Salario mínimo" value={formData.salaryMin} onChange={handleChange} />
            <input className="input" type="number" min="0" step="0.01" name="salaryMax" placeholder="Salario máximo" value={formData.salaryMax} onChange={handleChange} />
            <select className="input" name="salaryPeriod" value={formData.salaryPeriod} onChange={handleChange}>
              <option value="monthly">Mensual</option>
              <option value="annual">Anual</option>
              <option value="hourly">Por hora</option>
            </select>
          </div>

          <textarea
            className="input"
            name="requirementsText"
            placeholder="Requisitos (uno por línea)"
            rows={4}
            value={formData.requirementsText}
            onChange={handleChange}
            style={{ resize: 'vertical' }}
            required
          />
          <textarea
            className="input"
            name="responsibilitiesText"
            placeholder="Responsabilidades (una por línea)"
            rows={4}
            value={formData.responsibilitiesText}
            onChange={handleChange}
            style={{ resize: 'vertical' }}
            required
          />
          <input
            className="input"
            name="languagesText"
            placeholder="Idiomas requeridos (separados por coma)"
            value={formData.languagesText}
            onChange={handleChange}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <input className="input" name="whatsappNumber" placeholder="WhatsApp de contacto" value={formData.whatsappNumber} onChange={handleChange} />
            <input className="input" type="email" name="contactEmail" placeholder="Email de contacto" value={formData.contactEmail} onChange={handleChange} />
            <input className="input" type="date" name="expiresAt" min="1900-01-01" max="9999-12-31" value={formData.expiresAt} onChange={handleChange} />
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
