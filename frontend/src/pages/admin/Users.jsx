import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { formatDate } from './adminUtils';
import './Admin.css';

const DEFAULT_LIMIT = 10;

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'patients'

  // ── Users state ──────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: DEFAULT_LIMIT });
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // ── Patients state ────────────────────────────────────────────
  const [patients, setPatients] = useState([]);
  const [patientPagination, setPatientPagination] = useState({ page: 1, pages: 1, total: 0, limit: DEFAULT_LIMIT });
  const [patientSearchInput, setPatientSearchInput] = useState('');
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientsLoaded, setPatientsLoaded] = useState(false);

  // ── Psychologists state ───────────────────────────────────────
  const [psychologists, setPsychologists] = useState([]);
  const [psychPagination, setPsychPagination] = useState({ page: 1, pages: 1, total: 0, limit: DEFAULT_LIMIT });
  const [psychSearchInput, setPsychSearchInput] = useState('');
  const [psychSearchQuery, setPsychSearchQuery] = useState('');
  const [psychLoading, setPsychLoading] = useState(false);
  const [psychLoaded, setPsychLoaded] = useState(false);

  const loadUsers = async (nextPage = 1, nextSearch = searchQuery) => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers({
        page: nextPage,
        limit: DEFAULT_LIMIT,
        search: nextSearch || undefined,
      });
      setUsers(response.data?.users || []);
      setPagination(response.data?.pagination || { page: 1, pages: 1, total: 0, limit: DEFAULT_LIMIT });
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async (nextPage = 1, nextSearch = patientSearchQuery) => {
    setPatientsLoading(true);
    try {
      const response = await adminService.getAllPatients({
        page: nextPage,
        limit: DEFAULT_LIMIT,
        search: nextSearch || undefined,
      });
      setPatients(response.data?.patients || []);
      setPatientPagination(response.data?.pagination || { page: 1, pages: 1, total: 0, limit: DEFAULT_LIMIT });
      setPatientsLoaded(true);
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudieron cargar los pacientes');
    } finally {
      setPatientsLoading(false);
    }
  };

  const loadPsychologists = async (nextPage = 1, nextSearch = psychSearchQuery) => {
    setPsychLoading(true);
    try {
      const response = await adminService.listPsychologists({
        page: nextPage,
        limit: DEFAULT_LIMIT,
        search: nextSearch || undefined,
      });
      setPsychologists(response.data?.psychologists || []);
      setPsychPagination(response.data?.pagination || { page: 1, pages: 1, total: 0, limit: DEFAULT_LIMIT });
      setPsychLoaded(true);
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudieron cargar los psicólogos');
    } finally {
      setPsychLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1, '');
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'patients' && !patientsLoaded) {
      loadPatients(1, '');
    }
    if (tab === 'psychologists' && !psychLoaded) {
      loadPsychologists(1, '');
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const nextSearch = searchInput.trim();
    setSearchQuery(nextSearch);
    loadUsers(1, nextSearch);
  };

  const handlePatientSearch = (event) => {
    event.preventDefault();
    const nextSearch = patientSearchInput.trim();
    setPatientSearchQuery(nextSearch);
    loadPatients(1, nextSearch);
  };

  const handlePsychSearch = (event) => {
    event.preventDefault();
    const nextSearch = psychSearchInput.trim();
    setPsychSearchQuery(nextSearch);
    loadPsychologists(1, nextSearch);
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    setDeletingId(userId);
    try {
      await adminService.deleteUser(userId);
      toast.success('Usuario eliminado');
      await loadUsers(pagination.page, searchQuery);
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo eliminar el usuario');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && activeTab === 'users') {
    return (
      <div className="admin-loading">
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <BackToDashboardButton to="/admin/dashboard" />
      <header className="admin-page-header">
        <div>
          <h1 className="admin-title">Gestión de Usuarios</h1>
          <p className="admin-subtitle">Administrá cuentas de candidatos, pacientes y su actividad.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="admin-tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          type="button"
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleTabChange('users')}
        >
          Usuarios del sitio
        </button>
        <button
          type="button"
          className={`btn ${activeTab === 'patients' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleTabChange('patients')}
        >
          Pacientes de psicólogos
        </button>
        <button
          type="button"
          className={`btn ${activeTab === 'psychologists' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleTabChange('psychologists')}
        >
          Psicólogos
        </button>
      </div>

      {/* ── USERS TAB ── */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="admin-toolbar">
            <form onSubmit={handleSearch}>
              <label htmlFor="admin-users-search" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Buscar usuarios
              </label>
              <input
                id="admin-users-search"
                className="input"
                type="text"
                placeholder="Buscar por nombre o email"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
              <button type="submit" className="btn btn-primary">Buscar</button>
            </form>
            {searchQuery && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setSearchInput('');
                  setSearchQuery('');
                  loadUsers(1, '');
                }}
              >
                Limpiar
              </button>
            )}
          </div>

          {users.length === 0 ? (
            <div className="admin-empty">
              <p>No se encontraron usuarios para los filtros seleccionados.</p>
            </div>
          ) : (
            <>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Ubicación</th>
                      <th>Postulaciones</th>
                      <th>Fecha alta</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.location || '-'}</td>
                        <td>{user._count?.applications || 0}</td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <div className="admin-actions">
                            <button
                              type="button"
                              className="btn admin-danger-btn"
                              disabled={deletingId === user.id}
                              onClick={() => handleDelete(user.id)}
                            >
                              {deletingId === user.id ? 'Eliminando...' : 'Eliminar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-pagination">
                <p className="admin-pagination-info">
                  Mostrando página {pagination.page} de {pagination.pages} ({pagination.total} usuarios)
                </p>
                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    disabled={pagination.page <= 1}
                    onClick={() => loadUsers(pagination.page - 1, searchQuery)}
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => loadUsers(pagination.page + 1, searchQuery)}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── PATIENTS TAB ── */}
      {activeTab === 'patients' && (
        <div className="card">
          <div className="admin-toolbar">
            <form onSubmit={handlePatientSearch}>
              <label htmlFor="admin-patients-search" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Buscar pacientes
              </label>
              <input
                id="admin-patients-search"
                className="input"
                type="text"
                placeholder="Buscar por nombre o email"
                value={patientSearchInput}
                onChange={(event) => setPatientSearchInput(event.target.value)}
              />
              <button type="submit" className="btn btn-primary">Buscar</button>
            </form>
            {patientSearchQuery && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setPatientSearchInput('');
                  setPatientSearchQuery('');
                  loadPatients(1, '');
                }}
              >
                Limpiar
              </button>
            )}
          </div>

          {patientsLoading ? (
            <div className="admin-loading"><p>Cargando pacientes...</p></div>
          ) : patients.length === 0 ? (
            <div className="admin-empty">
              <p>No se encontraron pacientes para los filtros seleccionados.</p>
            </div>
          ) : (
            <>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Solicitudes</th>
                      <th>Fecha alta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.firstName} {patient.lastName}</td>
                        <td>{patient.email}</td>
                        <td>{patient.phone || '-'}</td>
                        <td>{patient._count?.psychologistRequests || 0}</td>
                        <td>{formatDate(patient.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-pagination">
                <p className="admin-pagination-info">
                  Mostrando página {patientPagination.page} de {patientPagination.pages} ({patientPagination.total} pacientes)
                </p>
                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    disabled={patientPagination.page <= 1}
                    onClick={() => loadPatients(patientPagination.page - 1, patientSearchQuery)}
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    disabled={patientPagination.page >= patientPagination.pages}
                    onClick={() => loadPatients(patientPagination.page + 1, patientSearchQuery)}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── PSYCHOLOGISTS TAB ── */}
      {activeTab === 'psychologists' && (
        <div className="card">
          <div className="admin-toolbar">
            <form onSubmit={handlePsychSearch}>
              <label htmlFor="admin-psych-search" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
                Buscar psicólogos
              </label>
              <input
                id="admin-psych-search"
                className="input"
                type="text"
                placeholder="Buscar por nombre, email o matrícula"
                value={psychSearchInput}
                onChange={(event) => setPsychSearchInput(event.target.value)}
              />
              <button type="submit" className="btn btn-primary">Buscar</button>
            </form>
            {psychSearchQuery && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setPsychSearchInput('');
                  setPsychSearchQuery('');
                  loadPsychologists(1, '');
                }}
              >
                Limpiar
              </button>
            )}
          </div>

          {psychLoading ? (
            <div className="admin-loading"><p>Cargando psicólogos...</p></div>
          ) : psychologists.length === 0 ? (
            <div className="admin-empty">
              <p>No se encontraron psicólogos para los filtros seleccionados.</p>
            </div>
          ) : (
            <>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Matrícula</th>
                      <th>Estado</th>
                      <th>Tipo registro</th>
                      <th>Fecha alta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {psychologists.map((psych) => (
                      <tr key={psych.id}>
                        <td>{psych.firstName} {psych.lastName}</td>
                        <td>{psych.email}</td>
                        <td>{psych.licenseNumber || '-'}</td>
                        <td>{psych.status}</td>
                        <td>{psych.registrationType || '-'}</td>
                        <td>{formatDate(psych.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-pagination">
                <p className="admin-pagination-info">
                  Mostrando página {psychPagination.page} de {psychPagination.pages} ({psychPagination.total} psicólogos)
                </p>
                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    disabled={psychPagination.page <= 1}
                    onClick={() => loadPsychologists(psychPagination.page - 1, psychSearchQuery)}
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    disabled={psychPagination.page >= psychPagination.pages}
                    onClick={() => loadPsychologists(psychPagination.page + 1, psychSearchQuery)}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

