import { useParams } from "react-router-dom";

export default function TripSettingsPage() {
  const { tripId } = useParams<{ tripId: string }>();

  if (!tripId) return <p>Viaje inválido</p>;

  return (
    <div>
      <h3>Configuración del viaje</h3>

      <ul>
        <li>Cambiar nombre del viaje</li>
        <li>Salir del viaje</li>
        <li>Borrar viaje (solo creador)</li>
      </ul>
    </div>
  );
}
