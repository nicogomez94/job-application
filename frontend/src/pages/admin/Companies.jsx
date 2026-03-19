import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services';
import { formatDate } from './adminUtils';
import './Admin.css';

const DEFAULT_LIMIT = 10;

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: DEFAULT_LIMIT });
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [blockingId, setBlockingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadCompanies = async (nextPage = 1, nextSearch = searchQuery) => {
    setLoading(true);
    try {
      const response = await adminService.getAllCompanies({
        page: nextPage,
        limit: DEFAULT_LIMIT,
        search: nextSearch || undefined,
      });
      setCompanies(response.data?.companies || []);
      setPagination(response.data?.pagination || { page: 1, pages: 1, total: 0, limit: DEFAULT_LIMIT });
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudieron cargar las empresas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies(1, '');
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const nextSearch = searchInput.trim();
    setSearchQuery(nextSearch);
    loadCompanies(1, nextSearch);
  };

  const handleBlockToggle = async (company) => {
    const nextBlockedState = !company.isBlocked;
    const confirmed = window.confirm(
      nextBlockedState
        ? `¿Bloquear a ${company.companyName}?`
        : `¿Desbloquear a ${company.companyName}?`
    );
    if (!confirmed) return;

    setBlockingId(company.id);
    try {
      await adminService.toggleCompanyBlock(company.id, nextBlockedState);
      toast.success(nextBlockedState ? 'Empresa bloqueada' : 'Empresa desbloqueada');
      await loadCompanies(pagination.page, searchQuery);
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo actualizar el estado de la empresa');
    } finally {
      setBlockingId(null);
    }
  };

  const handleDelete = async (company) => {
    const confirmed = window.confirm(
      `¿Eliminar la empresa ${company.companyName}? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    setDeletingId(company.id);
    try {
      await adminService.deleteCompany(company.id);
      toast.success('Empresa eliminada');
      await loadCompanies(pagination.page, searchQuery);
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo eliminar la empresa');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Cargando empresas...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-title">Gestión de Empresas</h1>
          <p className="admin-subtitle">Controlá estado operativo, suscripciones y actividad.</p>
        </div>
      </header>

      <div className="card">
        <div className="admin-toolbar">
          <form onSubmit={handleSearch}>
            <label htmlFor="admin-companies-search" style={{ display: 'block', color: '#5e4d38', marginBottom: '0.35rem', fontWeight: 600 }}>
              Buscar empresas
            </label>
            <input
              id="admin-companies-search"
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
                loadCompanies(1, '');
              }}
            >
              Limpiar
            </button>
          )}
        </div>

        {companies.length === 0 ? (
          <div className="admin-empty">
            <p>No se encontraron empresas para los filtros seleccionados.</p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Email</th>
                    <th>Industria</th>
                    <th>Estado</th>
                    <th>Ofertas / Subs.</th>
                    <th>Fecha alta</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id}>
                      <td>{company.companyName}</td>
                      <td>{company.email}</td>
                      <td>{company.industry || '-'}</td>
                      <td>
                        <span className={company.isBlocked ? 'badge badge-error' : 'badge badge-success'}>
                          {company.isBlocked ? 'Bloqueada' : 'Activa'}
                        </span>
                      </td>
                      <td>
                        {company._count?.jobOffers || 0} / {company._count?.subscriptions || 0}
                      </td>
                      <td>{formatDate(company.createdAt)}</td>
                      <td>
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="btn btn-outline"
                            disabled={blockingId === company.id}
                            onClick={() => handleBlockToggle(company)}
                          >
                            {blockingId === company.id
                              ? 'Actualizando...'
                              : company.isBlocked
                                ? 'Desbloquear'
                                : 'Bloquear'}
                          </button>
                          <button
                            type="button"
                            className="btn admin-danger-btn"
                            disabled={deletingId === company.id}
                            onClick={() => handleDelete(company)}
                          >
                            {deletingId === company.id ? 'Eliminando...' : 'Eliminar'}
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
                Mostrando página {pagination.page} de {pagination.pages} ({pagination.total} empresas)
              </p>
              <div className="admin-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={pagination.page <= 1}
                  onClick={() => loadCompanies(pagination.page - 1, searchQuery)}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => loadCompanies(pagination.page + 1, searchQuery)}
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
