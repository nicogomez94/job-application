import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/authStore';

// Layouts
import Layout from './components/Layout';

// Pages - Public
import Home from './pages/Home';
import JobSearch from './pages/JobSearch';
import JobDetail from './pages/JobDetail';
import Blog from './pages/Blog';
import QuienesSomos from './pages/QuienesSomos';

// Auth
import Login from './pages/auth/Login';
import RegisterUser from './pages/auth/RegisterUser';
import RegisterCompany from './pages/auth/RegisterCompany';
import SelectPlan from './pages/auth/SelectPlan';
import OAuthCallback from './pages/auth/OAuthCallback';

// User Dashboard
import UserDashboard from './pages/user/Dashboard';
import UserProfile from './pages/user/Profile';
import UserApplications from './pages/user/Applications';

// Company Dashboard
import CompanyDashboard from './pages/company/Dashboard';
import CompanyProfile from './pages/company/Profile';
import CompanyJobs from './pages/company/Jobs';
import CreateJob from './pages/company/CreateJob';
import EditJob from './pages/company/EditJob';
import JobApplicants from './pages/company/JobApplicants';
import CompanySubscription from './pages/company/Subscription';

// Legal
import TermsAndConditions from './pages/TermsAndConditions';

// Admin Dashboard
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminCompanies from './pages/admin/Companies';
import AdminJobOffers from './pages/admin/JobOffers';
import AdminSubscriptions from './pages/admin/Subscriptions';

function App() {
  const { isAuthenticated, userType } = useAuthStore();

  // Componente de ruta protegida
  const ProtectedRoute = ({ children, allowedTypes }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedTypes && !allowedTypes.includes(userType)) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="jobs" element={<JobSearch />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="blog" element={<Blog />} />
        <Route path="quienes-somos" element={<QuienesSomos />} />
        <Route path="terminos-y-condiciones" element={<TermsAndConditions />} />
        
        {/* Auth */}
        <Route path="login" element={<Login />} />
        <Route path="register/user" element={<RegisterUser />} />
        <Route path="register/company" element={<RegisterCompany />} />
        <Route
          path="register/company/plan"
          element={
            <ProtectedRoute allowedTypes={['company']}>
              <SelectPlan />
            </ProtectedRoute>
          }
        />
        <Route path="auth/callback" element={<OAuthCallback />} />

        {/* User Routes */}
        <Route
          path="user/dashboard"
          element={
            <ProtectedRoute allowedTypes={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/profile"
          element={
            <ProtectedRoute allowedTypes={['user']}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/applications"
          element={
            <ProtectedRoute allowedTypes={['user']}>
              <UserApplications />
            </ProtectedRoute>
          }
        />

        {/* Company Routes */}
        <Route
          path="company/dashboard"
          element={
            <ProtectedRoute allowedTypes={['company']}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="company/profile"
          element={
            <ProtectedRoute allowedTypes={['company']}>
              <CompanyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="company/jobs"
          element={
            <ProtectedRoute allowedTypes={['company']}>
              <CompanyJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="company/jobs/create"
          element={
            <ProtectedRoute allowedTypes={['company']}>
              <CreateJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="company/jobs/edit/:id"
          element={
            <ProtectedRoute allowedTypes={['company']}>
              <EditJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="company/jobs/:id/applicants"
          element={
            <ProtectedRoute allowedTypes={['company']}>
              <JobApplicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="company/subscription"
          element={
            <ProtectedRoute allowedTypes={['company']}>
              <CompanySubscription />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/companies"
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <AdminCompanies />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/job-offers"
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <AdminJobOffers />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/subscriptions"
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <AdminSubscriptions />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Route>
    </Routes>
  );
}

export default App;
