import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { companyService, jobOfferService } from '../../services';

export default function CompanyDashboard() {
  const [company, setCompany] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [companyResponse, subscriptionResponse, offersResponse] = await Promise.all([
          companyService.getProfile(),
          companyService.checkSubscription(),
          jobOfferService.getMyOffers(),
        ]);
        setCompany(companyResponse.data);
        setSubscriptionStatus(subscriptionResponse.data);
        setOffers(offersResponse.data || []);
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudo cargar el dashboard de empresa');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  const activeOffers = offers.filter((offer) => offer.isActive).length;
  const totalApplications = offers.reduce((acc, offer) => acc + (offer._count?.applications || 0), 0);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '0.4rem' }}>Dashboard de Empresa</h1>
      <p style={{ color: '#6f604b', marginBottom: '1.2rem' }}>
        {company?.companyName || 'Empresa'} {subscriptionStatus?.isBlocked ? '(Cuenta bloqueada)' : ''}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card">
          <p style={{ color: '#6f604b', fontSize: '0.92rem' }}>Ofertas activas</p>
          <h2 style={{ marginTop: '0.4rem' }}>{activeOffers}</h2>
        </div>
        <div className="card">
          <p style={{ color: '#6f604b', fontSize: '0.92rem' }}>Ofertas totales</p>
          <h2 style={{ marginTop: '0.4rem' }}>{offers.length}</h2>
        </div>
        <div className="card">
          <p style={{ color: '#6f604b', fontSize: '0.92rem' }}>Postulaciones recibidas</p>
          <h2 style={{ marginTop: '0.4rem' }}>{totalApplications}</h2>
        </div>
        <div className="card">
          <p style={{ color: '#6f604b', fontSize: '0.92rem' }}>Suscripción</p>
          <h2 style={{ marginTop: '0.4rem' }}>
            {subscriptionStatus?.hasActiveSubscription ? subscriptionStatus?.subscription?.plan : 'Inactiva'}
          </h2>
        </div>
      </div>

      {subscriptionStatus?.isBlocked && (
        <div className="card" style={{ marginTop: '1rem', border: '1px solid #fecaca', background: '#fef2f2' }}>
          <p style={{ color: '#991b1b', marginBottom: '0.7rem' }}>
            Tu empresa está bloqueada por falta de suscripción activa.
          </p>
          <Link className="btn btn-primary" to="/company/subscription">
            Activar suscripción
          </Link>
        </div>
      )}

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2 style={{ marginBottom: '0.8rem' }}>Acciones rápidas</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          <Link className="btn btn-primary" to="/company/jobs/create">
            Crear oferta
          </Link>
          <Link className="btn btn-outline" to="/company/jobs">
            Gestionar ofertas
          </Link>
          <Link className="btn btn-outline" to="/company/profile">
            Editar perfil
          </Link>
          <Link className="btn btn-outline" to="/company/subscription">
            Suscripciones
          </Link>
        </div>
      </div>
    </div>
  );
}
