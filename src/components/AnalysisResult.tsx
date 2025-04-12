import React from "react";
import { cn } from "@/lib/utils";
import { Check, X, Shield, AlertTriangle } from "lucide-react";
import { PasswordAnalysis } from "@/utils/passwordAnalyzer";
import { motion } from "framer-motion";

interface AnalysisResultProps {
  analysis?: PasswordAnalysis;
  score?: number;
  strength?: string;
  timeToBreak?: string;
  feedbacks?: {
    positives: string[];
    negatives: string[];
  };
  className?: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({
  analysis,
  score,
  strength,
  timeToBreak,
  feedbacks,
  className,
}) => {
  // Use analysis object if provided, otherwise use individual props
  const resolvedScore = analysis?.score ?? score ?? 0;
  const resolvedStrength = analysis?.strength ?? strength ?? "weak";
  const resolvedTimeToBreak =
    analysis?.timeToBreak ?? timeToBreak ?? "instantly";
  const resolvedFeedbacks = analysis?.feedbacks ??
    feedbacks ?? { positives: [], negatives: [] };
  const issues = analysis?.issues ?? {
    hasLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasCommonPassword: false,
    hasSequentialChars: false,
    hasRepeatedChars: false,
  };

  // Estimate crack time based on score
  const getCrackTimeEstimate = (score: number) => {
    if (score < 30) return "Instantly";
    if (score < 50) return "Minutes to hours";
    if (score < 70) return "Days to weeks";
    if (score < 90) return "Years";
    return "Centuries";
  };

  // Calculate entropy based on password characteristics
  const calculateEntropy = (pwd: string) => {
    const charsetSize =
      (/[a-z]/.test(pwd) ? 26 : 0) +
      (/[A-Z]/.test(pwd) ? 26 : 0) +
      (/[0-9]/.test(pwd) ? 10 : 0) +
      (/[^A-Za-z0-9]/.test(pwd) ? 33 : 0);

    return Math.round(pwd.length * Math.log2(charsetSize || 1));
  };

  // Check for common patterns and vulnerabilities using the issues from analysis
  const hasCommonPattern = issues.hasCommonPassword;
  const sequentialChars = issues.hasSequentialChars;
  const repeatedChars = issues.hasRepeatedChars;

  // Calculate entropy based on the actual password characteristics
  const entropy = Math.round(resolvedScore * 0.7); // Approximating entropy from score
  const crackTime = resolvedTimeToBreak || getCrackTimeEstimate(resolvedScore);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className={cn(
        "overflow-hidden rounded-xl border border-blue-100 dark:border-blue-900/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg",
        className
      )}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/5 dark:from-blue-500/20 dark:to-indigo-500/10 border-b border-blue-100 dark:border-blue-900/30 flex items-center gap-2"
        variants={item}
      >
        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-semibold text-lg text-blue-600 dark:text-blue-400">
          Password Analysis
        </h3>
      </motion.div>

      <div className="p-5 space-y-6">
        <motion.div variants={item} className="space-y-3">
          <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
            Password Characteristics:
          </h3>
          <ul className="space-y-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <motion.li
              className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 p-3 rounded-md"
              variants={item}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              {issues.hasLength ? (
                <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="h-4 w-4 text-red-500" />
                </div>
              )}
              <span className="text-sm">
                Length: {issues.hasLength ? "8+" : "Less than 8"} characters{" "}
                {!issues.hasLength && "(recommended: 12+)"}
              </span>
            </motion.li>

            <motion.li
              className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 p-3 rounded-md"
              variants={item}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              {issues.hasUpperCase ? (
                <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="h-4 w-4 text-red-500" />
                </div>
              )}
              <span className="text-sm">Uppercase letters</span>
            </motion.li>

            <motion.li
              className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 p-3 rounded-md"
              variants={item}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              {issues.hasLowerCase ? (
                <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="h-4 w-4 text-red-500" />
                </div>
              )}
              <span className="text-sm">Lowercase letters</span>
            </motion.li>

            <motion.li
              className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 p-3 rounded-md"
              variants={item}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              {issues.hasNumber ? (
                <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="h-4 w-4 text-red-500" />
                </div>
              )}
              <span className="text-sm">Numbers</span>
            </motion.li>

            <motion.li
              className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 p-3 rounded-md"
              variants={item}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              {issues.hasSpecialChar ? (
                <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="h-4 w-4 text-red-500" />
                </div>
              )}
              <span className="text-sm">Special characters</span>
            </motion.li>
          </ul>
        </motion.div>

        <motion.div variants={item} className="space-y-3">
          <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
            Vulnerabilities:
          </h3>
          <ul className="space-y-2">
            {hasCommonPattern && (
              <motion.li
                className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-md"
                variants={item}
                whileHover={{
                  scale: 1.02,
                  x: 3,
                  transition: { duration: 0.2 },
                }}
              >
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Contains common pattern or word</span>
              </motion.li>
            )}

            {sequentialChars && (
              <motion.li
                className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-md"
                variants={item}
                whileHover={{
                  scale: 1.02,
                  x: 3,
                  transition: { duration: 0.2 },
                }}
              >
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Contains sequential characters</span>
              </motion.li>
            )}

            {repeatedChars && (
              <motion.li
                className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-md"
                variants={item}
                whileHover={{
                  scale: 1.02,
                  x: 3,
                  transition: { duration: 0.2 },
                }}
              >
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Contains repeated characters</span>
              </motion.li>
            )}

            {!hasCommonPattern && !sequentialChars && !repeatedChars && (
              <motion.li
                className="flex items-center gap-2 text-green-500 bg-green-500/10 p-3 rounded-md"
                variants={item}
                whileHover={{
                  scale: 1.02,
                  x: 3,
                  transition: { duration: 0.2 },
                }}
              >
                <Check className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">
                  No common vulnerabilities detected
                </span>
              </motion.li>
            )}
          </ul>
        </motion.div>

        <motion.div variants={item} className="space-y-3">
          <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
            Security Metrics:
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-md"
              variants={item}
              whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
            >
              <div className="text-xs text-muted-foreground mb-1">Entropy</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {entropy} <span className="text-sm font-normal">bits</span>
              </div>
            </motion.div>
            <motion.div
              className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-md"
              variants={item}
              whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
            >
              <div className="text-xs text-muted-foreground mb-1">
                Crack Time
              </div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {crackTime}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalysisResult;
