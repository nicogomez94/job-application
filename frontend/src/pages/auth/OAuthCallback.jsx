import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService, subscriptionService } from '../../services';
import { useAuthStore } from '../../context/authStore';

const getDashboardPath = (type) => {
  if (type === 'admin') return '/admin/dashboard';
  if (type === 'user') return '/user/dashboard';
  return null; // companies need subscription check
};

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const finishOAuth = async () => {
      const token = searchParams.get('token');
      const typeFromQuery = searchParams.get('type');

      if (!token) {
        toast.error('No se recibió token de autenticación');
        navigate('/login', { replace: true });
        return;
      }

      if (!typeFromQuery || !['user', 'company', 'admin'].includes(typeFromQuery)) {
        toast.error('Tipo de usuario inválido');
        navigate('/login', { replace: true });
        return;
      }

      try {
        const response = await authService.getProfile(token);
        const profile = response.data?.profile;
        const resolvedType = response.data?.type || typeFromQuery;

        if (!profile) {
          throw new Error('Perfil no encontrado');
        }

        setAuth(profile, resolvedType, token);
        toast.success('Sesión iniciada con Google');

        if (resolvedType === 'company') {
          // Si la empresa no tiene suscripción activa, redirigir a selección de plan
          try {
            await subscriptionService.getActive();
            navigate('/company/dashboard', { replace: true });
          } catch (err) {
            if (err.response?.status === 404) {
              navigate('/register/company/plan', { replace: true });
            } else {
              navigate('/company/dashboard', { replace: true });
            }
          }
        } else {
          navigate(getDashboardPath(resolvedType), { replace: true });
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudo completar el login con Google');
        navigate('/login', { replace: true });
      }
    };

    finishOAuth();
  }, [navigate, searchParams, setAuth]);

  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <p style={{ color: '#475569', fontSize: '1rem' }}>Completando autenticación...</p>
    </div>
  );
}
