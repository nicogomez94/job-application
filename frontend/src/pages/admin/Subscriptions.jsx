import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { formatCurrency, formatDate, statusToBadgeClass } from './adminUtils';
import './Admin.css';

const DEFAULT_LIMIT = 10;

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: DEFAULT_LIMIT });
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadSubscriptions = async (nextPage = 1, nextStatus = statusFilter) => {
    setLoading(true);
    try {
      const response = await adminService.getAllSubscriptions({
        page: nextPage,
        limit: DEFAULT_LIMIT,
        status: nextStatus || undefined,
      });
      setSubscriptions(response.data?.subscriptions || []);
      setPagination(response.data?.pagination || { page: 1, pages: 1, total: 0, limit: DEFAULT_LIMIT });
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudieron cargar las suscripciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions(1, '');
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Cargando suscripciones...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <BackToDashboardButton to="/admin/dashboard" />
      <header className="admin-page-header">
        <div>
          <h1 className="admin-title">Control de Suscripciones</h1>
          <p className="admin-subtitle">Seguimiento de estado y vigencia por empresa.</p>
        </div>
      </header>

      <div className="card">
        <div className="admin-toolbar">
          <select
            className="input"
            value={statusFilter}
            onChange={(event) => {
              const nextStatus = event.target.value;
              setStatusFilter(nextStatus);
              loadSubscriptions(1, nextStatus);
            }}
            style={{ maxWidth: '220px' }}
          >
            <option value="">Todos los estados</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>

        {subscriptions.length === 0 ? (
          <div className="admin-empty">
            <p>No hay suscripciones para el filtro seleccionado.</p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Plan</th>
                    <th>Estado</th>
                    <th>Monto</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.id}>
                      <td>{subscription.company?.companyName || '-'}</td>
                      <td>{subscription.plan}</td>
                      <td>
                        <span className={statusToBadgeClass(subscription.status)}>{subscription.status}</span>
                      </td>
                      <td>{formatCurrency(subscription.amount, subscription.currency)}</td>
                      <td>{formatDate(subscription.startDate)}</td>
                      <td>{formatDate(subscription.endDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <p className="admin-pagination-info">
                Mostrando página {pagination.page} de {pagination.pages} ({pagination.total} suscripciones)
              </p>
              <div className="admin-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={pagination.page <= 1}
                  onClick={() => loadSubscriptions(pagination.page - 1, statusFilter)}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => loadSubscriptions(pagination.page + 1, statusFilter)}
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
