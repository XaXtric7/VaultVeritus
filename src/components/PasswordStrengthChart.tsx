import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PasswordHistoryEntry {
  password: string;
  score: number;
  strength: string;
  timestamp: Date;
}

interface PasswordStrengthChartProps {
  history: PasswordHistoryEntry[];
}

const PasswordStrengthChart: React.FC<PasswordStrengthChartProps> = ({
  history,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Prepare data for the chart
  const labels = history.map((entry, index) => `Password ${index + 1}`);
  const scores = history.map((entry) => entry.score);

  const data = {
    labels,
    datasets: [
      {
        label: "Password Strength Score",
        data: scores,
        borderColor: isDark ? "rgba(99, 102, 241, 1)" : "rgba(79, 70, 229, 1)",
        backgroundColor: isDark
          ? "rgba(99, 102, 241, 0.1)"
          : "rgba(79, 70, 229, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: isDark ? "#6366f1" : "#4f46e5",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.8)",
          font: {
            weight: isDark ? "bold" : "normal",
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.8)",
          font: {
            weight: isDark ? "bold" : "normal",
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
          font: {
            size: 12,
            weight: isDark ? "bold" : "normal",
          },
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(17, 24, 39, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        titleColor: isDark ? "#ffffff" : "#000000",
        bodyColor: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.8)",
        padding: 10,
        bodyFont: {
          size: 13,
          weight: isDark ? "bold" : "normal",
        },
        titleFont: {
          size: 14,
          weight: "bold",
        },
        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            const index = context.dataIndex;
            const entry = history[index];
            return [
              `Score: ${entry.score}`,
              `Strength: ${entry.strength}`,
              `Time: ${entry.timestamp.toLocaleTimeString()}`,
            ];
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  return (
    <Card className="w-full shadow-md transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-lg border border-blue-100 dark:border-blue-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-blue-700 dark:text-blue-400">
          Password Strength History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          {history.length > 0 ? (
            <Line data={data} options={options as any} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-300">
              No password history data available yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordStrengthChart;
