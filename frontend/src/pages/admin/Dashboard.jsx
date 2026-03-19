import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminService } from '../../services';
import { formatDate } from './adminUtils';
import './Admin.css';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [recent, setRecent] = useState({ users: [], companies: [], jobOffers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const response = await adminService.getDashboardMetrics();
        setMetrics(response.data?.metrics || null);
        setRecent(response.data?.recent || { users: [], companies: [], jobOffers: [] });
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudo cargar el panel de administración');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Cargando panel de administración...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-title">Panel de Administración</h1>
          <p className="admin-subtitle">Métricas generales y control operativo del sistema.</p>
        </div>
      </header>

      <div className="admin-module-links">
        <Link className="btn btn-outline" to="/admin/users">Gestionar usuarios</Link>
        <Link className="btn btn-outline" to="/admin/companies">Gestionar empresas</Link>
        <Link className="btn btn-outline" to="/admin/subscriptions">Control de suscripciones</Link>
        <Link className="btn btn-outline" to="/admin/job-offers">Gestionar ofertas</Link>
      </div>

      <section className="admin-kpi-grid">
        <article className="card">
          <p className="admin-kpi-label">Usuarios totales</p>
          <h2 className="admin-kpi-value">{metrics?.totalUsers ?? 0}</h2>
        </article>
        <article className="card">
          <p className="admin-kpi-label">Empresas totales</p>
          <h2 className="admin-kpi-value">{metrics?.totalCompanies ?? 0}</h2>
        </article>
        <article className="card">
          <p className="admin-kpi-label">Ofertas totales</p>
          <h2 className="admin-kpi-value">{metrics?.totalJobOffers ?? 0}</h2>
        </article>
        <article className="card">
          <p className="admin-kpi-label">Postulaciones totales</p>
          <h2 className="admin-kpi-value">{metrics?.totalApplications ?? 0}</h2>
        </article>
        <article className="card">
          <p className="admin-kpi-label">Suscripciones activas</p>
          <h2 className="admin-kpi-value">{metrics?.activeSubscriptions ?? 0}</h2>
        </article>
      </section>

      <section className="admin-grid-3">
        <article className="card">
          <h2 style={{ marginBottom: '0.8rem' }}>Usuarios recientes</h2>
          {recent.users?.length ? (
            <div className="admin-list">
              {recent.users.map((user) => (
                <div key={user.id} className="admin-list-item">
                  <p><strong>{user.firstName} {user.lastName}</strong></p>
                  <p className="admin-muted">{user.email}</p>
                  <p className="admin-muted">Alta: {formatDate(user.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-muted">No hay usuarios recientes.</p>
          )}
        </article>

        <article className="card">
          <h2 style={{ marginBottom: '0.8rem' }}>Empresas recientes</h2>
          {recent.companies?.length ? (
            <div className="admin-list">
              {recent.companies.map((company) => (
                <div key={company.id} className="admin-list-item">
                  <p><strong>{company.companyName}</strong></p>
                  <p className="admin-muted">{company.email}</p>
                  <p className="admin-muted">Alta: {formatDate(company.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-muted">No hay empresas recientes.</p>
          )}
        </article>

        <article className="card">
          <h2 style={{ marginBottom: '0.8rem' }}>Ofertas recientes</h2>
          {recent.jobOffers?.length ? (
            <div className="admin-list">
              {recent.jobOffers.map((offer) => (
                <div key={offer.id} className="admin-list-item">
                  <p><strong>{offer.title}</strong></p>
                  <p className="admin-muted">Empresa: {offer.company?.companyName || 'N/D'}</p>
                  <p className="admin-muted">Postulaciones: {offer._count?.applications || 0}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-muted">No hay ofertas recientes.</p>
          )}
        </article>
      </section>
    </div>
  );
}
