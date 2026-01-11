import { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import MyTripsPage from "../MyTripsPage";
import ProfilePage from "../ProfilePage";


type Tab = "trips" | "profile";

export default function Travels() {
  const { user, logout } = useAuthContext();
  const [activeTab, setActiveTab] = useState<Tab>("trips");

  return (
    <div className="travels-container">
      <header className="travels-header">
        <h1>Hola, {user?.email}</h1>
        <button onClick={logout}>Logout</button>
      </header>

      {/* Tabs */}
      <div className="travels-tabs">
        <button
          className={activeTab === "trips" ? "active" : ""}
          onClick={() => setActiveTab("trips")}
        >
          Mis viajes
        </button>

        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          Perfil
        </button>
      </div>

      {/* Contenido */}
      <div className="travels-content">
        {activeTab === "trips" && <MyTripsPage />}
        {activeTab === "profile" && <ProfilePage />}
      </div>
    </div>
  );
}
