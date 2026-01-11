import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuthContext } from "../../contexts/AuthContext";

import TripHeader from "./TripHeader";
import TripTabs from "./TripTabs";
import ExpensesTab from "./ExpensesTab";
import BalanceTab from "./BalanceTab";
import TripSettingsModal from "./TripSettingsModal";

import type { Trip } from "../../types/trip";
import { getUserById } from "../../services/users.service";

export default function TripPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuthContext();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  const [activeTab, setActiveTab] = useState<"expenses" | "balance">(
    "expenses"
  );
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!tripId || !user) {
      setLoading(false);
      return;
    }

    const safeTripId = tripId;
    const userId = user.uid;

    async function fetchTrip() {
      try {
        const ref = doc(db, "trips", safeTripId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setTrip(null);
          return;
        }

        const data = snap.data();

        const tripData: Trip = {
          id: snap.id,
          ...(data as Omit<Trip, "id">),
        };

        const isMember =
          tripData.createdBy === userId ||
          tripData.members.includes(userId);

        if (!isMember) {
          setForbidden(true);
          return;
        }

        setTrip(tripData);

        const map: Record<string, string> = {};
        const allParticipants = [
          tripData.createdBy,
          ...tripData.members,
        ];

        for (const uid of allParticipants) {
          const u = await getUserById(uid);
          if (u) {
            map[uid] = u.name || u.email;
          }
        }

        setUsersMap(map);
      } catch (error) {
        console.error("Error cargando viaje", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrip();
  }, [tripId, user]);

  if (loading) return <p>Cargando viaje...</p>;
  if (forbidden) return <p>No tenés acceso a este viaje</p>;
  if (!trip || !user) return <p>Viaje no encontrado</p>;

  const participants = Array.from(
    new Set([trip.createdBy, ...trip.members])
  );

  //const isOwner = trip.createdBy === user.uid;

  return (
    <div>
      <TripHeader
        tripName={trip.name}
        participantsCount={participants.length}
        onSettingsClick={() => setShowSettings(true)}
      />

      <TripTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "expenses" && (
        <ExpensesTab
          tripId={trip.id}
          participants={participants}
          usersMap={usersMap}
        />
      )}

      {activeTab === "balance" && (
        <BalanceTab
          tripId={trip.id}
          participants={participants}
          usersMap={usersMap}
        />
      )}

      <TripSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        tripId={trip.id}
        tripName={trip.name}
        joinCode={trip.joinCode}
        isOwner={trip.createdBy === user.uid}
        onTripUpdated={() => {
          setTrip({ ...trip, name: trip.name });
        }}
      />


    </div>
  );
}
