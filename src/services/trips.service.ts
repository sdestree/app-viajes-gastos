import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  arrayUnion,
  Timestamp,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Trip } from "../types/trip";

// generar código simple
const generateJoinCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

/* =========================
   Crear viaje
========================= */
export async function createTrip(
  name: string,
  userId: string
): Promise<void> {
  await addDoc(collection(db, "trips"), {
    name,
    createdBy: userId,
    members: [userId],
    joinCode: generateJoinCode(),
    createdAt: Timestamp.now(),
    archivedBy: {},
  });
}

/* =========================
   Obtener viajes del usuario
========================= */
export async function getUserTrips(userId: string): Promise<Trip[]> {
  const q = query(
    collection(db, "trips"),
    where("members", "array-contains", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Trip, "id">),
    }))
    // 🔥 FILTRO CLAVE
    .filter((trip) => !trip.archivedBy?.[userId]);
}

/* =========================
   Unirse a un viaje
========================= */
export async function joinTripByCode(
  joinCode: string,
  userId: string
): Promise<void> {
  const q = query(
    collection(db, "trips"),
    where("joinCode", "==", joinCode)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error("Viaje no encontrado");

  const tripDoc = snapshot.docs[0];

  await updateDoc(doc(db, "trips", tripDoc.id), {
    members: arrayUnion(userId),
  });
}

/* =========================
   Actualizar nombre
========================= */
export async function updateTripName(tripId: string, name: string) {
  await updateDoc(doc(db, "trips", tripId), {
    name,
  });
}

/* =========================
   Salirse de un viaje
========================= */
export async function leaveTrip(tripId: string, userId: string) {
  await updateDoc(doc(db, "trips", tripId), {
    members: arrayRemove(userId),
  });
}

/* =========================
   Archivar viaje (por usuario)
========================= */
export async function archiveTrip(tripId: string, userId: string) {
  await updateDoc(doc(db, "trips", tripId), {
    [`archivedBy.${userId}`]: true,
  });
}
