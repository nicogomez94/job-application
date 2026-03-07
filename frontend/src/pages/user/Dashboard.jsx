import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userService } from '../../services';

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [profileResponse, applicationsResponse] = await Promise.all([
          userService.getProfile(),
          userService.getMyApplications(),
        ]);
        setProfile(profileResponse.data);
        setApplications(applicationsResponse.data || []);
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudo cargar el dashboard');
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

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Dashboard de Candidato</h1>
      <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
        Bienvenido{profile?.firstName ? `, ${profile.firstName}` : ''}. Desde acá podés seguir tus postulaciones.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', color: '#475569' }}>Postulaciones Totales</h3>
          <p style={{ fontSize: '1.8rem', marginTop: '0.4rem' }}>{applications.length}</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', color: '#475569' }}>Estado Pendiente/Revisión</h3>
          <p style={{ fontSize: '1.8rem', marginTop: '0.4rem' }}>
            {applications.filter((item) => ['PENDING', 'REVIEWING'].includes(item.status)).length}
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2 style={{ marginBottom: '0.8rem' }}>Acciones rápidas</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          <Link className="btn btn-primary" to="/jobs">
            Buscar ofertas
          </Link>
          <Link className="btn btn-outline" to="/user/applications">
            Ver mis postulaciones
          </Link>
          <Link className="btn btn-outline" to="/user/profile">
            Editar perfil
          </Link>
        </div>
      </div>
    </div>
  );
}
