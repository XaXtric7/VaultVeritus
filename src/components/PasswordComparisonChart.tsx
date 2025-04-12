import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface PasswordAnalysis {
  score: number;
  strength: string;
  issues: {
    hasLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    hasCommonPassword: boolean;
    hasSequentialChars: boolean;
    hasRepeatedChars: boolean;
  };
}

interface PasswordComparisonChartProps {
  analysis: PasswordAnalysis;
}

const PasswordComparisonChart: React.FC<PasswordComparisonChartProps> = ({
  analysis,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Ensure analysis.issues exists and has the expected properties
  const issues = analysis?.issues || {
    hasLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasCommonPassword: false,
    hasSequentialChars: false,
    hasRepeatedChars: false,
  };

  // Convert boolean values to numeric scores (0 or 100)
  const scores = [
    issues.hasLength ? 100 : 0,
    issues.hasUpperCase ? 100 : 0,
    issues.hasLowerCase ? 100 : 0,
    issues.hasNumber ? 100 : 0,
    issues.hasSpecialChar ? 100 : 0,
    !issues.hasCommonPassword ? 100 : 0,
    !issues.hasSequentialChars ? 100 : 0,
    !issues.hasRepeatedChars ? 100 : 0,
  ];

  // Global average scores (illustrative values)
  const globalScores = [70, 60, 90, 80, 50, 75, 65, 60];

  const data = {
    labels: [
      "Length (8+)",
      "Uppercase",
      "Lowercase",
      "Numbers",
      "Special Chars",
      "No Common Words",
      "No Sequences",
      "No Repetition",
    ],
    datasets: [
      {
        label: "Your Password",
        data: scores,
        backgroundColor: isDark
          ? "rgba(99, 102, 241, 0.2)"
          : "rgba(79, 70, 229, 0.2)",
        borderColor: isDark ? "rgba(99, 102, 241, 1)" : "rgba(79, 70, 229, 1)",
        borderWidth: 2,
        pointBackgroundColor: isDark ? "#6366f1" : "#4f46e5",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Global Average",
        data: globalScores,
        backgroundColor: isDark
          ? "rgba(239, 68, 68, 0.2)"
          : "rgba(220, 38, 38, 0.2)",
        borderColor: isDark ? "rgba(239, 68, 68, 1)" : "rgba(220, 38, 38, 1)",
        borderWidth: 2,
        pointBackgroundColor: isDark ? "#ef4444" : "#dc2626",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          display: false,
          color: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.8)",
          font: {
            weight: isDark ? "bold" : "normal",
          },
        },
        pointLabels: {
          color: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.8)",
          font: {
            size: 11,
            weight: isDark ? "bold" : "normal",
          },
        },
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.05)",
        },
        angleLines: {
          color: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.05)",
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
          font: {
            size: 12,
            weight: isDark ? "bold" : "normal",
          },
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(17, 24, 39, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        titleColor: isDark ? "#ffffff" : "#000000",
        bodyColor: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 14,
          weight: isDark ? "bold" : "600",
        },
        bodyFont: {
          size: 13,
          weight: isDark ? "bold" : "normal",
        },
        padding: 10,
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${
              context.raw === 100 ? "Yes" : "No"
            }`;
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  // Add debugging console log
  console.log("Password Analysis Issues:", issues);
  console.log("Scores:", scores);

  return (
    <Card className="w-full shadow-md transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-lg border border-blue-100 dark:border-blue-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-blue-700 dark:text-blue-400">
          Password Comparison Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <Radar data={data} options={options as any} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Your Password
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Global Average
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordComparisonChart;
