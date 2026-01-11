import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export type AppUser = {
  uid: string;
  name: string;
  email: string;
};

export async function getUserById(uid: string): Promise<AppUser | null> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    uid: snap.id,
    name: snap.data().name,
    email: snap.data().email,
  };
}
