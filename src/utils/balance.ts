import type { Expense } from "../types/expense";

export type Settlement = {
  from: string;
  to: string;
  amount: number;
};

// 1️⃣ balance por persona
export function calculateBalances(
  expenses: Expense[],
  participants: string[]
): Record<string, number> {
  const balances: Record<string, number> = {};

  participants.forEach(uid => {
    balances[uid] = 0;
  });

  const count = participants.length;

  for (const expense of expenses) {
    const share = expense.amount / count;

    // el que pagó suma todo
    balances[expense.paidBy] += expense.amount;

    // todos deben su parte
    for (const uid of participants) {
      balances[uid] -= share;
    }
  }

  return balances;
}

// 2️⃣ convertir balance → quién le debe a quién
export function settleDebts(
  balances: Record<string, number>
): Settlement[] {
  const debtors: { uid: string; amount: number }[] = [];
  const creditors: { uid: string; amount: number }[] = [];

  for (const [uid, balance] of Object.entries(balances)) {
    if (balance < 0) debtors.push({ uid, amount: -balance });
    if (balance > 0) creditors.push({ uid, amount: balance });
  }

  const settlements: Settlement[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amount, creditors[j].amount);

    settlements.push({
      from: debtors[i].uid,
      to: creditors[j].uid,
      amount: Number(pay.toFixed(2)),
    });

    debtors[i].amount -= pay;
    creditors[j].amount -= pay;

    if (debtors[i].amount === 0) i++;
    if (creditors[j].amount === 0) j++;
  }

  return settlements;
}
