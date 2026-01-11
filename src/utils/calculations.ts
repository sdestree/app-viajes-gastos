import type { Expense } from "../types/expense";

export type BalanceResult = {
  uid: string;
  paid: number;
  shouldPay: number;
  balance: number;
};

export function calculateBalance(
  expenses: Expense[],
  participants: string[]
): BalanceResult[] {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perPerson = total / participants.length;

  const paidMap: Record<string, number> = {};

  for (const uid of participants) {
    paidMap[uid] = 0;
  }

  for (const expense of expenses) {
    paidMap[expense.paidBy] += expense.amount;
  }

  return participants.map((uid) => {
    const paid = paidMap[uid];
    const balance = paid - perPerson;

    return {
      uid,
      paid,
      shouldPay: perPerson,
      balance,
    };
  });
}
