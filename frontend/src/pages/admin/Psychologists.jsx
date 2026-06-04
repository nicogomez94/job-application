import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Check, ExternalLink, Trash2, X } from 'lucide-react';
import { adminService } from '../../services';
import { BACKEND_BASE_URL } from '../../services/apiBaseUrl';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { formatDate } from './adminUtils';
import './Admin.css';

const DEFAULT_LIMIT = 10;

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDING_DOCS', label: 'Pendiente de documentos' },
  { value: 'PENDING', label: 'Pendiente de validación' },
  { value: 'APPROVED', label: 'Aprobado, falta plan' },
  { value: 'REJECTED', label: 'No validado' },
  { value: 'ACTIVE', label: 'Activo' },
];

const STATUS_LABELS = {
  PENDING_DOCS: 'Pendiente de documentos',
  PENDING: 'Pendiente de validación',
  APPROVED: 'Aprobado, falta plan',
  REJECTED: 'No validado',
  ACTIVE: 'Activo',
};

const statusToBadgeClass = (status) => {
  switch (status) {
    case 'ACTIVE':
    case 'APPROVED':
      return 'badge badge-success';
    case 'REJECTED':
      return 'badge badge-error';
    case 'PENDING':
      return 'badge badge-warning';
    default:
      return 'badge badge-info';
  }
};

const buildAssetUrl = (fileUrl) => {
  if (!fileUrl) return '#';
  return new URL(fileUrl, BACKEND_BASE_URL).href;
};

const getPagination = (data) => {
  if (data?.pagination) return data.pagination;

  const total = data?.total || 0;
  const limit = data?.limit || DEFAULT_LIMIT;
  return {
    page: data?.page || 1,
    limit,
    total,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
};

export default function AdminPsychologists() {
  const [psychologists, setPsychologists] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: DEFAULT_LIMIT });
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadPsychologists = async (nextPage = 1, nextSearch = searchQuery, nextStatus = statusFilter, nextType = typeFilter) => {
    setLoading(true);
    try {
      const response = await adminService.listPsychologists({
        page: nextPage,
        limit: DEFAULT_LIMIT,
        search: nextSearch || undefined,
        status: nextStatus || undefined,
        registrationType: nextType || undefined,
      });
      setPsychologists(response.data?.psychologists || []);
      setPagination(getPagination(response.data));
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudieron cargar los psicólogos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPsychologists(1, '', 'PENDING', '');
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const nextSearch = searchInput.trim();
    setSearchQuery(nextSearch);
    loadPsychologists(1, nextSearch, statusFilter, typeFilter);
  };

  const handleStatusChange = (event) => {
    const nextStatus = event.target.value;
    setStatusFilter(nextStatus);
    loadPsychologists(1, searchQuery, nextStatus, typeFilter);
  };

  const handleTypeChange = (event) => {
    const nextType = event.target.value;
    setTypeFilter(nextType);
    loadPsychologists(1, searchQuery, statusFilter, nextType);
  };

  const handleApprove = async (psychologist) => {
    const confirmed = window.confirm(
      `¿Validar la cuenta de ${psychologist.firstName} ${psychologist.lastName}?`
    );
    if (!confirmed) return;

    setUpdatingId(psychologist.id);
    try {
      await adminService.approvePsychologist(psychologist.id);
      toast.success('Cuenta de psicólogo validada');
      await loadPsychologists(pagination.page, searchQuery, statusFilter, typeFilter);
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo validar la cuenta');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = async (psychologist) => {
    const reason = window.prompt(
      `Motivo para no validar, invalidar o pausar la cuenta de ${psychologist.firstName} ${psychologist.lastName} (opcional):`
    );
    if (reason === null) return;

    setUpdatingId(psychologist.id);
    try {
      await adminService.rejectPsychologist(psychologist.id, reason.trim());
      toast.success('Cuenta marcada como no validada');
      await loadPsychologists(pagination.page, searchQuery, statusFilter, typeFilter);
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo rechazar la cuenta');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (psychologist) => {
    const confirmed = window.confirm(
      `¿Borrar definitivamente la cuenta de ${psychologist.firstName} ${psychologist.lastName}? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    setUpdatingId(psychologist.id);
    try {
      await adminService.deletePsychologist(psychologist.id);
      toast.success('Cuenta de psicólogo borrada');
      await loadPsychologists(pagination.page, searchQuery, statusFilter, typeFilter);
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo borrar la cuenta');
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setStatusFilter('');
    setTypeFilter('');
    loadPsychologists(1, '', '', '');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Cargando psicólogos...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <BackToDashboardButton to="/admin/dashboard" />
      <header className="admin-page-header">
        <div>
          <h1 className="admin-title">Validación de Psicólogos</h1>
          <p className="admin-subtitle">Revisá documentación y aprobá o rechazá cuentas profesionales.</p>
        </div>
      </header>

      <div className="card">
        <div className="admin-toolbar">
          <form onSubmit={handleSearch}>
            <label htmlFor="admin-psychologists-search" className="admin-field-label">
              Buscar psicólogos
            </label>
            <input
              id="admin-psychologists-search"
              className="input"
              type="text"
              placeholder="Nombre, email o matrícula"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <button type="submit" className="btn btn-primary">Buscar</button>
          </form>

          <div className="admin-filter-field">
            <label htmlFor="admin-psychologists-status" className="admin-field-label">
              Estado
            </label>
            <select
              id="admin-psychologists-status"
              className="input"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value || 'all'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-filter-field">
            <label htmlFor="admin-psychologists-type" className="admin-field-label">
              Tipo de registro
            </label>
            <select
              id="admin-psychologists-type"
              className="input"
              value={typeFilter}
              onChange={handleTypeChange}
            >
              <option value="">Todos</option>
              <option value="ARGENTINA">Psicólogos Argentinos</option>
              <option value="INTERNATIONAL">Psicólogos Internacionales</option>
            </select>
          </div>

          {(searchQuery || statusFilter || typeFilter) && (
            <button type="button" className="btn btn-outline" onClick={clearFilters}>
              Limpiar
            </button>
          )}
        </div>

        {psychologists.length === 0 ? (
          <div className="admin-empty">
            <p>No se encontraron psicólogos para los filtros seleccionados.</p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table admin-table-wide">
                <thead>
                  <tr>
                    <th>Profesional</th>
                    <th>Estado</th>
                    <th>Registro</th>
                    <th>Matrícula / país</th>
                    <th>Documentación</th>
                    <th>Alta</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {psychologists.map((psychologist) => {
                    const hasDocuments = Boolean(psychologist.documents?.length);
                    const hasPatientBlock = psychologist.patientBlocks?.some((block) => block.blockedBy === 'PATIENT');
                    const canApprove = ['PENDING', 'REJECTED'].includes(psychologist.status) && hasDocuments;
                    const canReject = psychologist.status !== 'REJECTED';
                    const isUpdating = updatingId === psychologist.id;
                    const displayName = psychologist.displayName
                      || `${psychologist.firstName} ${psychologist.lastName}`;

                    return (
                      <tr key={psychologist.id}>
                        <td>
                          <p className="admin-cell-primary">{displayName}</p>
                          <p className="admin-muted">{psychologist.email}</p>
                          {psychologist.contactEmail && psychologist.contactEmail !== psychologist.email ? (
                            <p className="admin-muted">Contacto: {psychologist.contactEmail}</p>
                          ) : null}
                        </td>
                        <td>
                          <span className={statusToBadgeClass(psychologist.status)}>
                            {STATUS_LABELS[psychologist.status] || psychologist.status}
                          </span>
                          {hasPatientBlock ? (
                            <span className="badge badge-error" style={{ marginLeft: '0.5rem' }}>
                              Bloqueado
                            </span>
                          ) : null}
                          {psychologist.rejectionReason ? (
                            <p className="admin-muted admin-rejection-note">
                              Motivo: {psychologist.rejectionReason}
                            </p>
                          ) : null}
                        </td>
                        <td>{psychologist.registrationType === 'ARGENTINA' ? 'Argentina' : 'Internacional'}</td>
                        <td>
                          <p>{psychologist.licenseNumber || '-'}</p>
                          <p className="admin-muted">
                            {psychologist.licenseProvince || psychologist.licenseCountry || psychologist.country || '-'}
                          </p>
                        </td>
                        <td>
                          {psychologist.documents?.length ? (
                            <div className="admin-document-links">
                              {psychologist.documents.map((document) => (
                                <a
                                  key={document.id}
                                  href={buildAssetUrl(document.fileUrl)}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {document.documentType}
                                  <ExternalLink size={13} />
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span className="admin-muted">Sin documentos</span>
                          )}
                        </td>
                        <td>{formatDate(psychologist.createdAt)}</td>
                        <td>
                          <div className="admin-actions">
                            <button
                              type="button"
                              className="btn btn-outline admin-icon-btn"
                              disabled={!canApprove || isUpdating}
                              onClick={() => handleApprove(psychologist)}
                            >
                              <Check size={14} />
                              {isUpdating ? 'Validando...' : 'Validar'}
                            </button>
                            <button
                              type="button"
                              className="btn admin-danger-btn admin-icon-btn"
                              disabled={!canReject || isUpdating}
                              onClick={() => handleReject(psychologist)}
                            >
                              <X size={14} />
                              {isUpdating ? 'Actualizando...' : 'No validar'}
                            </button>
                            <button
                              type="button"
                              className="btn admin-danger-btn admin-icon-btn"
                              disabled={isUpdating}
                              onClick={() => handleDelete(psychologist)}
                            >
                              <Trash2 size={14} />
                              {isUpdating ? 'Borrando...' : 'Borrar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <p className="admin-pagination-info">
                Mostrando página {pagination.page} de {pagination.pages} ({pagination.total} psicólogos)
              </p>
              <div className="admin-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={pagination.page <= 1}
                  onClick={() => loadPsychologists(pagination.page - 1, searchQuery, statusFilter, typeFilter)}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => loadPsychologists(pagination.page + 1, searchQuery, statusFilter, typeFilter)}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
