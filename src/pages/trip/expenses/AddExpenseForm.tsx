import { useState } from "react";
import { createExpense } from "../../../services/expenses.service"

type Props = {
  tripId: string;
  participants: string[];
  usersMap: Record<string, string>;
  onCreated: () => void;
  onClose: () => void;
};

export default function AddExpenseForm({
  tripId,
  participants,
  usersMap,
  onCreated,
  onClose,
}: Props) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(participants[0] ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!description.trim() || !amount || !paidBy) return;

  try {
    setLoading(true);

    await createExpense(
      tripId,
      description.trim(),
      Number(amount),
      paidBy
    );

    onCreated();
    onClose();
  } catch (error) {
    console.error("Error creando gasto", error);
  } finally {
    setLoading(false);
  }
}


  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h3>Agregar gasto</h3>

      <label>Descripción</label>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Ej: Cena, Uber, Hotel"
      />

      <label>Monto</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
      />

      <label>Pagó</label>
      <select
        value={paidBy}
        onChange={(e) => setPaidBy(e.target.value)}
      >
        {participants.map((uid) => (
          <option key={uid} value={uid}>
            {usersMap[uid] ?? "Usuario"}
          </option>
        ))}
      </select>

      <div className="expense-form-actions">
        <button
          type="button"
          className="secondary"
          onClick={onClose}
        >
          Cancelar
        </button>

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
