import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Clock3, Pencil, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { psychologistService } from '../../services';
import { DEBUG_FORM_DATA, DEBUG_MODE } from '../../config/debug';
import './PsychologistAgenda.css';

const STATUS_OPTIONS = [
  { value: 'SCHEDULED', label: 'Programada' },
  { value: 'CONFIRMED', label: 'Confirmada' },
  { value: 'COMPLETED', label: 'Realizada' },
  { value: 'CANCELLED', label: 'Cancelada' },
];

const STATUS_LABELS = Object.fromEntries(STATUS_OPTIONS.map((option) => [option.value, option.label]));

const buildEmptyForm = (date = new Date()) => ({
  title: DEBUG_MODE ? DEBUG_FORM_DATA.psychologistAgenda.title : '',
  patientName: DEBUG_MODE ? DEBUG_FORM_DATA.psychologistAgenda.patientName : '',
  date: format(date, 'yyyy-MM-dd'),
  startTime: DEBUG_MODE ? DEBUG_FORM_DATA.psychologistAgenda.startTime : '09:00',
  endTime: DEBUG_MODE ? DEBUG_FORM_DATA.psychologistAgenda.endTime : '09:50',
  notes: DEBUG_MODE ? DEBUG_FORM_DATA.psychologistAgenda.notes : '',
  status: 'SCHEDULED',
});

const entryDate = (entry) => parseISO(entry.startsAt);

const toApiDates = (form) => ({
  startsAt: new Date(`${form.date}T${form.startTime}:00`).toISOString(),
  endsAt: new Date(`${form.date}T${form.endTime}:00`).toISOString(),
});

export default function PsychologistAgenda() {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => buildEmptyForm(new Date()));

  const calendarStart = useMemo(
    () => startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
    [currentMonth],
  );
  const calendarEnd = useMemo(
    () => endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
    [currentMonth],
  );
  const calendarDays = useMemo(
    () => eachDayOfInterval({ start: calendarStart, end: calendarEnd }),
    [calendarStart, calendarEnd],
  );

  useEffect(() => {
    const loadEntries = async () => {
      setLoading(true);
      try {
        const response = await psychologistService.getAgenda({
          from: calendarStart.toISOString(),
          to: calendarEnd.toISOString(),
        });
        setEntries(response.data || []);
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudo cargar la agenda');
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, [calendarStart, calendarEnd]);

  const selectedEntries = useMemo(
    () => entries.filter((entry) => isSameDay(entryDate(entry), selectedDate)),
    [entries, selectedDate],
  );

  const chooseDate = (day) => {
    setSelectedDate(day);
    setEditingId(null);
    setForm(buildEmptyForm(day));
    if (!isSameMonth(day, currentMonth)) setCurrentMonth(startOfMonth(day));
  };

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const resetEditor = () => {
    setEditingId(null);
    setForm(buildEmptyForm(selectedDate));
  };

  const editEntry = (entry) => {
    const startsAt = parseISO(entry.startsAt);
    const endsAt = parseISO(entry.endsAt);
    setSelectedDate(startsAt);
    setEditingId(entry.id);
    setForm({
      title: entry.title || '',
      patientName: entry.patientName || '',
      date: format(startsAt, 'yyyy-MM-dd'),
      startTime: format(startsAt, 'HH:mm'),
      endTime: format(endsAt, 'HH:mm'),
      notes: entry.notes || '',
      status: entry.status || 'SCHEDULED',
    });
  };

  const saveEntry = async (event) => {
    event.preventDefault();
    const dates = toApiDates(form);
    if (new Date(dates.endsAt) <= new Date(dates.startsAt)) {
      toast.error('La hora de finalización debe ser posterior a la de inicio');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        patientName: form.patientName.trim() || null,
        notes: form.notes.trim() || null,
        status: form.status,
        ...dates,
      };
      const response = editingId
        ? await psychologistService.updateAgendaEntry(editingId, payload)
        : await psychologistService.createAgendaEntry(payload);
      const saved = response.data;
      setEntries((previous) => {
        const next = editingId
          ? previous.map((entry) => (entry.id === editingId ? saved : entry))
          : [...previous, saved];
        return next.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
      });
      setSelectedDate(parseISO(saved.startsAt));
      setEditingId(null);
      setForm(buildEmptyForm(parseISO(saved.startsAt)));
      toast.success(editingId ? 'Cita actualizada' : 'Cita agregada a la agenda');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo guardar la cita');
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async (entry) => {
    if (!window.confirm(`¿Eliminar la cita “${entry.title}”?`)) return;
    setDeletingId(entry.id);
    try {
      await psychologistService.deleteAgendaEntry(entry.id);
      setEntries((previous) => previous.filter((item) => item.id !== entry.id));
      if (editingId === entry.id) resetEditor();
      toast.success('Cita eliminada');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo eliminar la cita');
    } finally {
      setDeletingId(null);
    }
  };

  const moveMonth = (direction) => {
    const nextMonth = direction > 0 ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
    chooseDate(nextMonth);
  };

  return (
    <div className="agenda-page">
      <div className="agenda-shell">
        <Link to="/psicologo/dashboard" className="agenda-back">
          <ArrowLeft size={17} /> Volver al panel
        </Link>

        <header className="agenda-hero">
          <div>
            <span className="agenda-eyebrow">Organización profesional</span>
            <h1>Mi agenda</h1>
            <p>Ordená tus citas y horarios. Esta información es privada y solo está disponible en tu cuenta profesional.</p>
          </div>
          <div className="agenda-hero-mark" aria-hidden="true">
            <CalendarDays size={38} />
            <span>{format(currentMonth, 'MMM', { locale: es })}</span>
          </div>
        </header>

        <div className="agenda-layout">
          <section className="agenda-calendar-card" aria-label="Calendario mensual">
            <div className="agenda-month-toolbar">
              <button type="button" onClick={() => moveMonth(-1)} aria-label="Mes anterior"><ChevronLeft /></button>
              <h2>{format(currentMonth, 'MMMM yyyy', { locale: es })}</h2>
              <button type="button" onClick={() => moveMonth(1)} aria-label="Mes siguiente"><ChevronRight /></button>
            </div>

            <div className="agenda-weekdays" aria-hidden="true">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => <span key={day}>{day}</span>)}
            </div>

            <div className={`agenda-grid ${loading ? 'agenda-grid--loading' : ''}`}>
              {calendarDays.map((day) => {
                const dayEntries = entries.filter((entry) => isSameDay(entryDate(entry), day));
                const selected = isSameDay(day, selectedDate);
                return (
                  <button
                    type="button"
                    key={day.toISOString()}
                    className={`agenda-day ${selected ? 'agenda-day--selected' : ''} ${!isSameMonth(day, currentMonth) ? 'agenda-day--outside' : ''}`}
                    onClick={() => chooseDate(day)}
                    aria-pressed={selected}
                  >
                    <span className="agenda-day-number">{format(day, 'd')}</span>
                    <span className="agenda-day-dots" aria-label={`${dayEntries.length} citas`}>
                      {dayEntries.slice(0, 3).map((entry) => <i key={entry.id} className={`agenda-dot agenda-dot--${String(entry.status || 'SCHEDULED').toLowerCase()}`} />)}
                    </span>
                    {dayEntries.length > 3 && <small>+{dayEntries.length - 3}</small>}
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="agenda-editor-card">
            <div className="agenda-editor-heading">
              <div>
                <span>{editingId ? 'Editar cita' : 'Nueva cita'}</span>
                <h2>{format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}</h2>
              </div>
              {editingId && <button type="button" onClick={resetEditor} aria-label="Cancelar edición"><X size={18} /></button>}
            </div>

            <form onSubmit={saveEntry} className="agenda-form">
              <label>Motivo de la cita *<input name="title" value={form.title} onChange={updateForm} required placeholder="Ej. Sesión de seguimiento" /></label>
              <label>Paciente / referencia<input name="patientName" value={form.patientName} onChange={updateForm} placeholder="Nombre o referencia privada" /></label>
              <div className="agenda-form-row">
                <label>Fecha<input type="date" name="date" value={form.date} onChange={updateForm} required /></label>
                <label>Estado<select name="status" value={form.status} onChange={updateForm}>{STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
              </div>
              <div className="agenda-form-row">
                <label>Desde<input type="time" name="startTime" value={form.startTime} onChange={updateForm} required /></label>
                <label>Hasta<input type="time" name="endTime" value={form.endTime} onChange={updateForm} required /></label>
              </div>
              <label>Notas<textarea name="notes" value={form.notes} onChange={updateForm} rows={3} placeholder="Información útil para preparar la cita" /></label>
              <button className="agenda-save" type="submit" disabled={saving}>
                {editingId ? <Pencil size={16} /> : <Plus size={17} />}
                {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Agregar a la agenda'}
              </button>
            </form>
          </aside>
        </div>

        <section className="agenda-day-list">
          <div className="agenda-day-list-heading">
            <div><Clock3 size={20} /><h2>Citas del {format(selectedDate, 'd/MM/yyyy')}</h2></div>
            <span>{selectedEntries.length} {selectedEntries.length === 1 ? 'cita' : 'citas'}</span>
          </div>
          {selectedEntries.length === 0 ? (
            <p className="agenda-empty">No hay horarios cargados para este día.</p>
          ) : (
            <div className="agenda-entry-list">
              {selectedEntries.map((entry) => (
                <article key={entry.id} className={`agenda-entry agenda-entry--${String(entry.status || 'SCHEDULED').toLowerCase()}`}>
                  <time>{format(parseISO(entry.startsAt), 'HH:mm')} – {format(parseISO(entry.endsAt), 'HH:mm')}</time>
                  <div><h3>{entry.title}</h3>{entry.patientName && <p>{entry.patientName}</p>}{entry.notes && <small>{entry.notes}</small>}</div>
                  <span className="agenda-status">{STATUS_LABELS[entry.status] || entry.status}</span>
                  <div className="agenda-entry-actions">
                    <button type="button" onClick={() => editEntry(entry)} aria-label="Editar cita"><Pencil size={16} /></button>
                    <button type="button" onClick={() => deleteEntry(entry)} disabled={deletingId === entry.id} aria-label="Eliminar cita"><Trash2 size={16} /></button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
