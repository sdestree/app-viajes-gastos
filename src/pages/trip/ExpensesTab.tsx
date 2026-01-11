import { useEffect, useState } from "react";
import type { Expense } from "../../types/expense";
import {
  getTripExpenses,
  deleteExpense,
} from "../../services/expenses.service";
//import { useAuthContext } from "../../contexts/AuthContext"; //servía para que solo el usuario borre sus propios gastos
import "./expenses/expenses.css"
import AddExpenseModal from "./expenses/AddExpenseModal";
import AddExpenseForm from "./expenses/AddExpenseForm";
import ExpensesChart from "./expenses/ExpensesChart";

type Props = {
  tripId: string;
  participants: string[];
  usersMap: Record<string, string>;
};

export default function ExpensesTab({
  tripId,
  participants,
  usersMap,
}: Props) {
  //const { user } = useAuthContext();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  async function loadExpenses() {
    const data = await getTripExpenses(tripId);
    setExpenses(data);
    setLoading(false);
  }

  useEffect(() => {
    loadExpenses();
  }, [tripId]);

  if (loading) return <p>Cargando gastos...</p>;

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const expensesByUser: Record<string, number> = {};

  expenses.forEach((e) => {
    expensesByUser[e.paidBy] =
      (expensesByUser[e.paidBy] || 0) + e.amount;
  });


  return (
    <div className="expenses-tab">
      {/* Header */}
      <div className="expenses-header">
        <div className="expenses-summary-card">
  <span className="label">Total gastado</span>
  <span className="total">${total}</span>
</div>
        <button
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Agregar gasto
        </button>
      </div>

      <ExpensesChart
        data={expensesByUser}
        usersMap={usersMap}
      />


      {/* Lista */}
      <ul className="expenses-list">
        {expenses.map((expense) => (
          <li key={expense.id} className="expense-item">
            <div>
              <strong>{expense.description}</strong>
              <p>
                Pagó{" "}
                <strong>
                  {usersMap[expense.paidBy] ?? "Desconocido"}
                </strong>
              </p>
            </div>

            <div className="expense-right">
              <span className="amount">
                ${expense.amount}
              </span>

              
                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteExpense(expense.id).then(loadExpenses)
                  }
                >
                  <i className="bi bi-trash3"></i>
                </button>
              
            </div>
          </li>
        ))}
      </ul>

      {/* Modal */}
      <AddExpenseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      >
        <AddExpenseForm
          tripId={tripId}
          participants={participants}
          usersMap={usersMap}
          onCreated={loadExpenses}
          onClose={() => setShowAddModal(false)}
        />
      </AddExpenseModal>
    </div>
  );
}
