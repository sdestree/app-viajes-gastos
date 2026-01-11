import { useState } from "react";
import { joinTripByCode } from "../services/trips.service";
import { useAuthContext } from "../contexts/AuthContext";

type Props = {
  onClose: () => void;
  onJoined: () => void;
};

export default function JoinTripModal({ onClose, onJoined }: Props) {
  const { user } = useAuthContext();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!code.trim() || !user) return;

    setLoading(true);
    await joinTripByCode(code.trim(), user.uid);
    onJoined();
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>Unirse a un viaje</h3>

        <input
          type="text"
          placeholder="Código del viaje"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <div className="modal-actions">
          <button className="btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            Unirse
          </button>
        </div>
      </div>
    </div>
  );
}
