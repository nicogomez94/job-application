import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services';
import { formatDate } from './adminUtils';
import './Admin.css';

const DEFAULT_LIMIT = 10;

export default function AdminJobOffers() {
  const [offers, setOffers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: DEFAULT_LIMIT });
  const [isActiveFilter, setIsActiveFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadOffers = async (nextPage = 1, nextActive = isActiveFilter) => {
    setLoading(true);
    try {
      const response = await adminService.getAllJobOffers({
        page: nextPage,
        limit: DEFAULT_LIMIT,
        isActive: nextActive || undefined,
      });
      setOffers(response.data?.jobOffers || []);
      setPagination(response.data?.pagination || { page: 1, pages: 1, total: 0, limit: DEFAULT_LIMIT });
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudieron cargar las ofertas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers(1, '');
  }, []);

  const handleDelete = async (offer) => {
    const confirmed = window.confirm(
      `¿Eliminar la oferta "${offer.title}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    setDeletingId(offer.id);
    try {
      await adminService.deleteJobOffer(offer.id);
      toast.success('Oferta eliminada');
      await loadOffers(pagination.page, isActiveFilter);
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo eliminar la oferta');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Cargando ofertas...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-title">Gestión de Ofertas</h1>
          <p className="admin-subtitle">Controlá el catálogo de ofertas publicadas en la plataforma.</p>
        </div>
      </header>

      <div className="card">
        <div className="admin-toolbar">
          <select
            className="input"
            value={isActiveFilter}
            onChange={(event) => {
              const nextActive = event.target.value;
              setIsActiveFilter(nextActive);
              loadOffers(1, nextActive);
            }}
            style={{ maxWidth: '220px' }}
          >
            <option value="">Todas</option>
            <option value="true">Solo activas</option>
            <option value="false">Solo inactivas</option>
          </select>
        </div>

        {offers.length === 0 ? (
          <div className="admin-empty">
            <p>No hay ofertas para el filtro seleccionado.</p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Empresa</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Postulaciones</th>
                    <th>Creada</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer.id}>
                      <td>{offer.title}</td>
                      <td>{offer.company?.companyName || '-'}</td>
                      <td>{offer.category?.name || '-'}</td>
                      <td>
                        <span className={offer.isActive ? 'badge badge-success' : 'badge badge-error'}>
                          {offer.isActive ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td>{offer._count?.applications || 0}</td>
                      <td>{formatDate(offer.createdAt)}</td>
                      <td>
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="btn admin-danger-btn"
                            disabled={deletingId === offer.id}
                            onClick={() => handleDelete(offer)}
                          >
                            {deletingId === offer.id ? 'Eliminando...' : 'Eliminar'}
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
                Mostrando página {pagination.page} de {pagination.pages} ({pagination.total} ofertas)
              </p>
              <div className="admin-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={pagination.page <= 1}
                  onClick={() => loadOffers(pagination.page - 1, isActiveFilter)}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => loadOffers(pagination.page + 1, isActiveFilter)}
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
