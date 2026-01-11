import { useState } from "react";
import { updateTripName, leaveTrip } from "../../services/trips.service";
import { useAuthContext } from "../../contexts/AuthContext";
import { archiveTrip } from "../../services/trips.service";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripName: string;
  joinCode: string;
  isOwner: boolean;
  onTripUpdated: () => void;
};

export default function TripSettingsModal({
  isOpen,
  onClose,
  tripId,
  tripName,
  joinCode,
  isOwner,
  onTripUpdated,
}: Props) {
  const { user } = useAuthContext();
  const [name, setName] = useState(tripName);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  function handleCopy() {
    navigator.clipboard.writeText(joinCode);
    alert("Código copiado al portapapeles");
  }

  async function handleSaveName() {
    if (!name.trim() || name === tripName) return;

    try {
      setSaving(true);
      await updateTripName(tripId, name.trim());
      onTripUpdated();
      onClose();
    } catch (err) {
      console.error("Error actualizando viaje", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleLeaveTrip() {
    if (!user) return;

    const ok = confirm(
      "¿Seguro que querés salir de este viaje? Perderás acceso a los gastos."
    );

    if (!ok) return;

    try {
      await leaveTrip(tripId, user.uid);
      window.location.href = "/"; // volver a Mis Viajes
    } catch (err) {
      console.error("Error saliendo del viaje", err);
    }
  }

  async function handleArchiveTrip() {
    if (!isOwner) return;

    const ok = confirm(
      "Este viaje se archivará y dejará de aparecer en tus viajes.\n¿Continuar?"
    );

    if (!ok) return;

    try {
      await archiveTrip(tripId);
      window.location.href = "/";
    } catch (err) {
      console.error("Error archivando viaje", err);
    }
  }


  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card modal-settings"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="modal-header">
          <h2>Configuración del Viaje</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* EDITAR NOMBRE */}
        <div className="modal-section">
          <label>Nombre del viaje</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isOwner}
          />

          {isOwner && (
            <button
              className="btn-primary-savechanges"
              onClick={handleSaveName}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          )}
        </div>

        {/* CÓDIGO */}
        <div className="trip-code-box">
          <label>Código del viaje</label>

          <div className="trip-code-row">
            <span className="trip-code-value">{joinCode}</span>
            <button onClick={handleCopy} className="copy-btn">
              <i className="bi bi-copy"></i>
            </button>
          </div>

          <p className="trip-code-hint">
            Compartí este código para que otros se unan
          </p>
        </div>

        {/* SALIR */}
        {!isOwner && (
          <button className="btn-danger" onClick={handleLeaveTrip}>
            <i className="bi bi-box-arrow-left"></i>
            Salir del viaje
          </button>
        )}

        {isOwner && (
          <button
            className="btn-danger danger-strong"
            onClick={handleArchiveTrip}
          >
            <i className="bi bi-archive"></i>
            Archivar viaje
          </button>
        )}

      </div>
    </div>
  );
}
