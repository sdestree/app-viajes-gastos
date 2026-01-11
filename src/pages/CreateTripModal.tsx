import { useState } from "react";
import { createTrip } from "../services/trips.service";
import { useAuthContext } from "../contexts/AuthContext";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateTripModal({ onClose, onCreated }: Props) {
  const { user } = useAuthContext();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!name.trim() || !user) return;

    setLoading(true);
    await createTrip(name.trim(), user.uid);
    onCreated();
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>Crear nuevo viaje</h3>

        <input
          type="text"
          placeholder="Nombre del viaje"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}
