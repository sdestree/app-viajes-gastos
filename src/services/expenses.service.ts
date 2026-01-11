import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Expense } from "../types/expense";

const expensesRef = collection(db, "expenses");

export async function getTripExpenses(tripId: string): Promise<Expense[]> {
  const q = query(expensesRef, where("tripId", "==", tripId));
  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Expense, "id">),
    createdAt: doc.data().createdAt.toDate(),
  }));
}

export async function createExpense(
  tripId: string,
  description: string,
  amount: number,
  paidBy: string
) {
  await addDoc(expensesRef, {
    tripId,
    description,
    amount,
    paidBy,
    createdAt: Timestamp.now(),
  });
}

export async function deleteExpense(expenseId: string) {
  await deleteDoc(doc(db, "expenses", expenseId));
}
