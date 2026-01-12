import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Pie } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type Props = {
  data: Record<string, number>;
  usersMap: Record<string, string>;
};

export default function ExpensesChart({ data, usersMap }: Props) {
  const labels = Object.keys(data).map(
    (uid) => usersMap[uid] ?? "Usuario"
  );

  const values = Object.values(data);
  const total = values.reduce((a, b) => a + b, 0);

  if (values.length === 0 || total === 0) return null;

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#9E0059",
          "#FF0054",
          "#FF5400",
          "#FFBD00",
          "#C1FF72",
          "#7ED957",
          "#0097B2"
        ],
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 10,
        padding: 12,
      },
    },

    datalabels: {
      color: "#fff",
      font: {
        weight: 600,
        size: 12,
      },
      formatter: (value: number) => {
        const percentage = (value / total) * 100;
        return percentage >= 3
          ? `${percentage.toFixed(0)}%`
          : "";
      },
    },

    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.raw as number;
          const percentage = ((value / total) * 100).toFixed(1);
          return `${context.label}: $${value} (${percentage}%)`;
        },
      },
    },
  },

  maintainAspectRatio: false,
};


  return (
    <div className="chart-card">
      <h4>Distribución de gastos</h4>
      <div className="chart-container">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}
