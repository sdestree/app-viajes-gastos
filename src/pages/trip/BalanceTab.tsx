import { useEffect, useState } from "react";
import type { Expense } from "../../types/expense";
import { getTripExpenses } from "../../services/expenses.service";
import {
  calculateBalances,
  settleDebts,
} from "../../utils/balance";

type Props = {
  tripId: string;
  participants: string[];
  usersMap: Record<string, string>;
};

export default function BalanceTab({
  tripId,
  participants,
  usersMap,
}: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getTripExpenses(tripId);
      setExpenses(data);
      setLoading(false);
    }
    load();
  }, [tripId]);

  if (loading) return <p className="text-muted">Cargando balance...</p>;
  if (expenses.length === 0) return <p>No hay gastos todavía</p>;
  if (Object.keys(usersMap).length === 0)
    return <p>Cargando usuarios...</p>;

  const balance = calculateBalances(expenses, participants);
  const settlements = settleDebts(balance);

  const total = expenses.reduce((acc, e) => acc + e.amount, 0);
  const perPerson = total / participants.length;

  return (
    <div className="balance-tab">
      {/* POR PERSONA */}
      <div className="card balance-summary">
        <span className="balance-label">Por persona</span>
        <strong className="balance-amount">
          ${perPerson.toFixed(2)}
        </strong>
      </div>

      {/* BALANCE INDIVIDUAL */}
      <h3 className="section-title">Balance individual</h3>

      <div className="balance-list">
        {Object.entries(balance).map(([uid, amount]) => (
          <div key={uid} className="balance-item">
            <div>
              <strong>{usersMap[uid] ?? uid}</strong>
              <p className="text-muted">
                Pagó: $
                {expenses
                  .filter((e) => e.paidBy === uid)
                  .reduce((a, e) => a + e.amount, 0)
                  .toFixed(2)}
              </p>
            </div>

            <span
              className={
                amount > 0
                  ? "amount-positive"
                  : amount < 0
                  ? "amount-negative"
                  : "amount-zero"
              }
            >
              {amount > 0 && `+$${amount.toFixed(2)}`}
              {amount < 0 && `-$${Math.abs(amount).toFixed(2)}`}
              {amount === 0 && "$0.00"}
            </span>
          </div>
        ))}
      </div>

      {/* AJUSTES */}
      <h3 className="section-title">Cómo ajustar cuentas</h3>

      {settlements.length === 0 && (
        <p className="text-muted"><i className="bi bi-clipboard2-check"></i> Todos están al día</p>
      )}

      <div className="settlements-list">
        {settlements.map((s, i) => (
          <div key={i} className="settlement-card">
            <strong>{usersMap[s.from]}</strong>
            <span className="arrow"><i className="bi bi-arrow-right"></i></span>
            <strong>{usersMap[s.to]}</strong>

            <span className="settlement-amount">
              ${s.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
