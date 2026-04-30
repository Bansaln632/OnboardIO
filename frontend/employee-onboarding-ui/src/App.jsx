import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import UserDashboardSimple from "./user/UserDashboardSimple";
import AdminDashboardSimple from "./admin/AdminDashboardSimple";
import ActivitiesSimple from "./pages/ActivitiesSimple";
import AboutUs from "./pages/AboutUs";
import OAuth2Redirect from "./auth/OAuth2Redirect";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
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

        <Route path="/about" element={<AboutUs />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
