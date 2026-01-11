import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import {
  getUserTrips
} from "../services/trips.service";
import type { Trip } from "../types/trip";
import { useNavigate } from "react-router-dom";
import TopTabs from "./TopTabs";
import CreateTripModal from "./CreateTripModal";
import JoinTripModal from "./JoinTripModal";

export default function MyTripsPage() {
  const { user } = useAuthContext();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);


  async function loadTrips() {
    if (!user) return;
    const data = await getUserTrips(user.uid);
    setTrips(data);
    setLoading(false);
  }

  useEffect(() => {
    loadTrips();
  }, [user]);


  if (loading) {
    return <p className="text-muted">Cargando viajes...</p>;
  }

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="header">
        <h1>Gastos de Viaje</h1>
        <p className="text-muted" style={{ color: "#E5E7EB" }}>
          Gestiona tus viajes con amigos
        </p>
      </header>

      <main className="page-content">
        <TopTabs />

        {/* ACTIONS */}
        <div className="actions">
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            + Crear nuevo viaje
          </button>

          <button className="btn-outline" onClick={() => setShowJoinModal(true)}>
            Unirse a viaje
          </button>
        </div>

        {/* LISTA DE VIAJES */}
        <section className="trips-list">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="trip-card"
              onClick={() => navigate(`/trips/${trip.id}`)}
            >
              <div className="trip-icon">📍</div>

              <div className="trip-info">
                <h2>{trip.name}</h2>
                <p className="text-muted">
                  {/* después acá entran fecha / participantes */}
                  Ver detalles
                </p>
              </div>

              <span className="trip-arrow">›</span>
            </div>
          ))}
        </section>

      </main>
      {showCreateModal && (
  <CreateTripModal
    onClose={() => setShowCreateModal(false)}
    onCreated={loadTrips}
  />
)}
{showJoinModal && (
  <JoinTripModal
    onClose={() => setShowJoinModal(false)}
    onJoined={loadTrips}
  />
)}


    </div>
  );
}
