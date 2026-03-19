import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { formatDate } from './adminUtils';
import './Admin.css';

const DEFAULT_LIMIT = 10;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: DEFAULT_LIMIT });
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

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

  useEffect(() => {
    loadUsers(1, '');
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const nextSearch = searchInput.trim();
    setSearchQuery(nextSearch);
    loadUsers(1, nextSearch);
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

  if (loading) {
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
          <p className="admin-subtitle">Administrá cuentas de candidatos y su actividad.</p>
        </div>
      </header>

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
    </div>
  );
}
