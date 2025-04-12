import React, { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface PasswordScoreBreakdownProps {
  score: number;
  password: string;
}

const PasswordScoreBreakdown: React.FC<PasswordScoreBreakdownProps> = ({
  score,
  password,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Debug when props change
  useEffect(() => {
    console.log(
      "PasswordScoreBreakdown - Score:",
      score,
      "Password:",
      password
    );
  }, [score, password]);

  // Calculate factor scores based on password characteristics
  let lengthScore = Math.min(20, password.length * 2); // Up to 20 points

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  // Calculate the character mix score (more detailed)
  const characterMixScore =
    (hasUpperCase ? 10 : 0) +
    (hasLowerCase ? 10 : 0) +
    (hasNumber ? 10 : 0) +
    (hasSpecialChar ? 10 : 0);

  // Calculate entropy-based score (randomness)
  let charset = 0;
  if (hasLowerCase) charset += 26;
  if (hasUpperCase) charset += 26;
  if (hasNumber) charset += 10;
  if (hasSpecialChar) charset += 33;

  const entropy =
    password.length > 0
      ? Math.log2(Math.pow(charset || 1, password.length))
      : 0;
  const entropyScore = Math.min(40, entropy * 1.2); // Up to 40 points

  // Adjust scores to match the overall score
  const totalCalculatedScore = lengthScore + characterMixScore + entropyScore;
  const adjustmentFactor = score > 0 ? score / (totalCalculatedScore || 1) : 0;

  const adjustedLengthScore = Math.round(lengthScore * adjustmentFactor);
  const adjustedCharacterMixScore = Math.round(
    characterMixScore * adjustmentFactor
  );
  const adjustedEntropyScore = Math.round(entropyScore * adjustmentFactor);

  // Ensure that the sum of adjusted scores equals the total score
  const sumOfAdjustedScores =
    adjustedLengthScore + adjustedCharacterMixScore + adjustedEntropyScore;
  let finalAdjustedScores = [
    adjustedLengthScore,
    adjustedCharacterMixScore,
    adjustedEntropyScore,
  ];

  // If there's a difference, add it to the largest component
  if (sumOfAdjustedScores !== score && score > 0) {
    const diff = score - sumOfAdjustedScores;
    const maxIndex = finalAdjustedScores.indexOf(
      Math.max(...finalAdjustedScores)
    );
    finalAdjustedScores[maxIndex] += diff;
  }

  // If password is empty or score is 0, use default values
  if (password.length === 0 || score === 0) {
    finalAdjustedScores = [0, 0, 0];
  }

  // Log the breakdown for debugging
  console.log("Password Score Breakdown:", {
    lengthRaw: lengthScore,
    characterMixRaw: characterMixScore,
    entropyRaw: entropyScore,
    totalRaw: totalCalculatedScore,
    adjustmentFactor,
    adjustedScores: finalAdjustedScores,
    totalScore: score,
  });

  const data = {
    labels: ["Length", "Character Mix", "Complexity/Randomness"],
    datasets: [
      {
        data: finalAdjustedScores,
        backgroundColor: [
          isDark ? "rgba(16, 185, 129, 0.8)" : "rgba(5, 150, 105, 0.8)", // Length - green
          isDark ? "rgba(99, 102, 241, 0.8)" : "rgba(79, 70, 229, 0.8)", // Character Mix - indigo
          isDark ? "rgba(249, 115, 22, 0.8)" : "rgba(234, 88, 12, 0.8)", // Entropy - amber
        ],
        borderColor: [
          isDark ? "rgba(16, 185, 129, 1)" : "rgba(5, 150, 105, 1)",
          isDark ? "rgba(99, 102, 241, 1)" : "rgba(79, 70, 229, 1)",
          isDark ? "rgba(249, 115, 22, 1)" : "rgba(234, 88, 12, 1)",
        ],
        borderWidth: 1,
        hoverOffset: 15,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
          font: {
            size: 12,
            weight: isDark ? "bold" : "normal",
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(17, 24, 39, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        titleColor: isDark ? "#ffffff" : "#000000",
        bodyColor: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.8)",
        padding: 10,
        titleFont: {
          size: 14,
          weight: isDark ? "bold" : "600",
        },
        bodyFont: {
          size: 13,
          weight: isDark ? "bold" : "normal",
        },
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            const percentage =
              score > 0 ? Math.round((value / score) * 100) : 0;
            return `${context.label}: ${value} points (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  return (
    <Card className="w-full shadow-md transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-lg border border-blue-100 dark:border-blue-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-blue-700 dark:text-blue-400">
          Password Score Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full relative">
          {score > 0 ? (
            <>
              <Doughnut data={data} options={options as any} />
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {score}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Total Score
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-300">
              Enter a password to see score breakdown
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordScoreBreakdown;
