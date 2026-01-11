export type Expense = {
  id: string;
  tripId: string;
  description: string;
  amount: number;
  paidBy: string;     // uid
  createdAt: Date;
};
