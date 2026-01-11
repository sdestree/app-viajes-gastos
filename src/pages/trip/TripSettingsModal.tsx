type Props = {
  isOpen: boolean;
  onClose: () => void;
  tripName: string;
  joinCode: string;
};

export default function TripSettingsModal({
  isOpen,
  onClose,
  tripName,
  joinCode,
}: Props) {
  if (!isOpen) return null;

  function handleCopy() {
    navigator.clipboard.writeText(joinCode);
    alert("Código copiado al portapapeles");
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

        {/* NOMBRE */}
        <div className="modal-section">
          <label>Nombre del viaje</label>
          <p className="trip-name">{tripName}</p>
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
            Comparte este código para que otros se unan
          </p>
        </div>
      </div>
    </div>
  );
}
