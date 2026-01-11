type Props = {
  activeTab: "expenses" | "balance";
  onChange: (tab: "expenses" | "balance") => void;
};

export default function TripTabs({ activeTab, onChange }: Props) {
  return (
    <div className="trip-tabs">
      <button
        className={`tab ${activeTab === "expenses" ? "active" : ""}`}
        onClick={() => onChange("expenses")}
      >
        Gastos
      </button>

      <button
        className={`tab ${activeTab === "balance" ? "active" : ""}`}
        onClick={() => onChange("balance")}
      >
        Balance
      </button>
    </div>
  );
}
