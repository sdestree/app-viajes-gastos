import { useNavigate } from "react-router-dom";

type Props = {
  tripName: string;
  participantsCount: number;
  onSettingsClick: () => void;
};

export default function TripHeader({
  tripName,
  participantsCount,
  onSettingsClick,
}: Props) {
  const navigate = useNavigate();

  return (
    <header className="trip-header">
      {/* VOLVER */}
      <button
        className="trip-back"
        onClick={() => navigate("/trips")}
      >
        <i className="bi bi-box-arrow-left"></i>
      </button>

      {/* INFO */}
      <div className="trip-header-info">
        <h2>{tripName}</h2>
        <p className="text-muted">
          {participantsCount} participante
          {participantsCount !== 1 && "s"}
        </p>
      </div>

      {/* SETTINGS */}
      <button
        className="trip-settings"
        onClick={onSettingsClick}
        aria-label="Configuración del viaje"
      >
        <i className="bi bi-gear"></i>
      </button>
    </header>
  );
}
