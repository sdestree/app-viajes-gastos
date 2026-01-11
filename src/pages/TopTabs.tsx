import { useLocation, useNavigate } from "react-router-dom";

export default function TopTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const isTrips = location.pathname === "/trips";
  const isProfile = location.pathname === "/profile";

  return (
    <div className="segmented">
      <button
        className={isTrips ? "active" : ""}
        onClick={() => navigate("/trips")}
      >
        Mis Viajes
      </button>

      <button
        className={isProfile ? "active" : ""}
        onClick={() => navigate("/profile")}
      >
        Perfil
      </button>
    </div>
  );
}
