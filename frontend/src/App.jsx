import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/authStore';

// Layouts
import Layout from './components/Layout';
import PsicoLayout from './components/PsicoLayout';

// Pages - Public
import Home from './pages/Home';
import JobSearch from './pages/JobSearch';
import JobDetail from './pages/JobDetail';
import Blog from './pages/Blog';
import QuienesSomos from './pages/QuienesSomos';
import PlanesYPrecios from './pages/PlanesYPrecios';
import Sugerencias from './pages/Sugerencias';

// Auth
import Login from './pages/auth/Login';
import RegisterUser from './pages/auth/RegisterUser';
import RegisterCompany from './pages/auth/RegisterCompany';
import SelectPlan from './pages/auth/SelectPlan';
import OAuthCallback from './pages/auth/OAuthCallback';
import ResetPassword from './pages/auth/ResetPassword';

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
import PrivacyPolicy from './pages/PrivacyPolicy';

// Admin Dashboard
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminCompanies from './pages/admin/Companies';
import AdminJobOffers from './pages/admin/JobOffers';
import AdminSubscriptions from './pages/admin/Subscriptions';

// Psicólogos
import PsicologosHome from './pages/psicologos/PsicologosHome';
import PsychologistList from './pages/psicologos/PsychologistList';
import PsychologistProfile from './pages/psicologos/PsychologistProfile';
import RegisterPsychologistType from './pages/psicologos/RegisterPsychologistType';
import RegisterPsychologistAR from './pages/psicologos/RegisterPsychologistAR';
import RegisterPsychologistINTL from './pages/psicologos/RegisterPsychologistINTL';
import RegisterPsychologistDocs from './pages/psicologos/RegisterPsychologistDocs';
import RegisterPsychologistConfirmation from './pages/psicologos/RegisterPsychologistConfirmation';
import SelectPsychologistPlan from './pages/psicologos/SelectPsychologistPlan';
import PsychologistDashboard from './pages/psicologos/PsychologistDashboard';
import RegisterPatient from './pages/psicologos/RegisterPatient';
import LoginPatient from './pages/psicologos/LoginPatient';
import PatientDashboard from './pages/psicologos/PatientDashboard';
import PsicoLogin from './pages/auth/PsicoLogin';

function ProtectedRoute({ children, allowedTypes }) {
  const { isAuthenticated, userType } = useAuthStore();

  if (!isAuthenticated) {
    if (allowedTypes?.length === 1 && allowedTypes[0] === 'admin') {
      return <Navigate to="/acceso-admin" replace />;
    }
    if (allowedTypes?.includes('psychologist') && !allowedTypes?.includes('user')) {
      return <Navigate to="/psicologos/login" replace />;
    }
    if (allowedTypes?.includes('user') && !allowedTypes?.includes('psychologist')) {
      return <Navigate to="/psicologos/login-paciente" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (allowedTypes && !allowedTypes.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="jobs" element={<JobSearch />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="blog" element={<Blog />} />
        <Route path="quienes-somos" element={<QuienesSomos />} />
        <Route path="planes-y-precios" element={<PlanesYPrecios />} />
        <Route path="sugerencias" element={<Sugerencias />} />
        <Route path="terminos-y-condiciones" element={<TermsAndConditions />} />
        <Route path="politicas-y-privacidad" element={<PrivacyPolicy />} />
        
        {/* Auth */}
        <Route
          path="login"
          element={<Login allowedUserTypes={['user', 'company']} defaultUserType="user" />}
        />
        <Route
          path="acceso-admin"
          element={<Login allowedUserTypes={['admin']} defaultUserType="admin" hideUserTypeSelector />}
        />
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
        <Route path="reset-password" element={<ResetPassword />} />

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

      {/* ── Psicólogos ── sub-mundo separado con su propio layout ── */}
      <Route path="/" element={<PsicoLayout />}>
        <Route path="psicologos" element={<PsicologosHome />} />
        <Route path="psicologos/buscar" element={<PsychologistList />} />
        <Route path="psicologos/login" element={<PsicoLogin />} />
        <Route path="psicologos/login-paciente" element={<LoginPatient />} />
        <Route path="psicologos/registro-paciente" element={<RegisterPatient />} />
        <Route path="psicologos/:id" element={<PsychologistProfile />} />
        <Route path="register/psicologo" element={<RegisterPsychologistType />} />
        <Route path="register/psicologo/argentina" element={<RegisterPsychologistAR />} />
        <Route path="register/psicologo/internacional" element={<RegisterPsychologistINTL />} />
        <Route
          path="register/psicologo/documentos"
          element={
            <ProtectedRoute allowedTypes={['psychologist']}>
              <RegisterPsychologistDocs />
            </ProtectedRoute>
          }
        />
        <Route
          path="register/psicologo/confirmacion"
          element={
            <ProtectedRoute allowedTypes={['psychologist']}>
              <RegisterPsychologistConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="psicologo/plan"
          element={
            <ProtectedRoute allowedTypes={['psychologist']}>
              <SelectPsychologistPlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="psicologo/dashboard"
          element={
            <ProtectedRoute allowedTypes={['psychologist']}>
              <PsychologistDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="psicologos/mi-cuenta"
          element={
            <ProtectedRoute allowedTypes={['user']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
