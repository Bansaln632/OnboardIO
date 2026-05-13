import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Lazy load components for code splitting
const Home = lazy(() => import("./Home"));
const UserDashboardSimple = lazy(() => import("./user/UserDashboardSimple"));
const AdminDashboardSimple = lazy(() => import("./admin/AdminDashboardSimple"));
const ActivitiesSimple = lazy(() => import("./pages/ActivitiesSimple"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const OAuth2Redirect = lazy(() => import("./auth/OAuth2Redirect"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="spinner w-16 h-16 border-4 mx-auto"></div>
      <p className="text-xl text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* OAuth2 Redirect Handler */}
          <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

          <Route
            path="/user"
            element={
              <ProtectedRoute role="ROLE_USER">
                <UserDashboardSimple />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ROLE_ADMIN">
                <AdminDashboardSimple />
              </ProtectedRoute>
            }
          />

          <Route
            path="/activities"
            element={
              <ProtectedRoute>
                <ActivitiesSimple />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route path="/about" element={<AboutUs />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
