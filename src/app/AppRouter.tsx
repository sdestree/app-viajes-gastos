import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import MyTripsPage from "../pages/MyTripsPage";
import ProfilePage from "../pages/ProfilePage";
import TripPage from "../pages/trip/TripPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* HOME → MIS VIAJES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/trips" />
            </ProtectedRoute>
          }
        />

        {/* MIS VIAJES */}
        <Route
          path="/trips"
          element={
            <ProtectedRoute>
              <MyTripsPage />
            </ProtectedRoute>
          }
        />

        {/* PERFIL */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* DETALLE DE VIAJE */}
        <Route
          path="/trips/:tripId"
          element={
            <ProtectedRoute>
              <TripPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
