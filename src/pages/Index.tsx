import React, { useState, useEffect } from "react";
import PasswordInput from "@/components/PasswordInput";
import StrengthMeter from "@/components/StrengthMeter";
import AnalysisResult from "@/components/AnalysisResult";
import Suggestion from "@/components/Suggestion";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import PasswordStrengthChart from "@/components/PasswordStrengthChart";
import PasswordComparisonChart from "@/components/PasswordComparisonChart";
import PasswordScoreBreakdown from "@/components/PasswordScoreBreakdown";
import {
  analyzePassword,
  getAIEnhancedSuggestions,
  type PasswordAnalysis,
} from "@/utils/passwordAnalyzer";
import {
  Shield,
  ArrowDown,
  Clock,
  Check,
  AlertTriangle,
  ChartPieIcon,
  BarChart4,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PasswordHistoryEntry {
  password: string;
  score: number;
  strength: string;
  timestamp: Date;
}

const Index = () => {
  const [password, setPassword] = useState("");
  const [analysis, setAnalysis] = useState<PasswordAnalysis>(() =>
    analyzePassword("")
  );
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [timeThreshold, setTimeThreshold] = useState("Months (Good Security)");
  const [thresholdMet, setThresholdMet] = useState<boolean | null>(null);
  const [passwordHistory, setPasswordHistory] = useState<
    PasswordHistoryEntry[]
  >([]);
  const [activeTab, setActiveTab] = useState<string>("analysis");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update analysis in real-time as the user types
  useEffect(() => {
    const newAnalysis = analyzePassword(password);
    setAnalysis(newAnalysis);

    const suggestions = getAIEnhancedSuggestions(password);
    setAiSuggestions(suggestions);

    if (password.length > 0 && showResults) {
      checkThresholdRequirement(newAnalysis.timeToBreak, timeThreshold);
    }

    if (password.length === 0) {
      setShowResults(false);
      setThresholdMet(null);
    }

    // Log analysis for debugging
    console.log("Updated Password Analysis:", newAnalysis);
  }, [password, timeThreshold, showResults]);

  const checkThresholdRequirement = (crackTime: string, threshold: string) => {
    const timeRanks = {
      instantly: 0,
      seconds: 1,
      minutes: 2,
      hours: 3,
      days: 4,
      months: 5,
      years: 6,
      centuries: 7,
    };

    const thresholdUnit = threshold.split(" ")[0].toLowerCase();
    const crackTimeUnit = crackTime.includes(" ")
      ? crackTime.split(" ")[1].toLowerCase()
      : crackTime.toLowerCase();

    const thresholdRank =
      timeRanks[thresholdUnit as keyof typeof timeRanks] || 0;
    const crackTimeRank =
      timeRanks[crackTimeUnit as keyof typeof timeRanks] || 0;

    setThresholdMet(crackTimeRank >= thresholdRank);
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);

    // If the password is being cleared, reset UI state
    if (newPassword.length === 0) {
      setShowResults(false);
      setThresholdMet(null);
    }
  };

  const analyzePasswordHandler = () => {
    if (!password) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const currentAnalysis = analyzePassword(password);
      setAnalysis(currentAnalysis);

      const suggestions = getAIEnhancedSuggestions(password);
      setAiSuggestions(suggestions);

      checkThresholdRequirement(currentAnalysis.timeToBreak, timeThreshold);

      // Add to password history if it doesn't already exist
      if (!passwordHistory.some((entry) => entry.password === password)) {
        setPasswordHistory((prev) => [
          ...prev,
          {
            password,
            score: currentAnalysis.score,
            strength: currentAnalysis.strength,
            timestamp: new Date(),
          },
        ]);
      }

      setIsAnalyzing(false);
      setShowResults(true);

      // Log for debugging
      console.log("After Analyze Button Click:", currentAnalysis);
    }, 1000);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-indigo-950 flex flex-col transition-all duration-500 overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-gradient-to-r from-purple-300/60 to-blue-300/50 dark:from-purple-800/20 dark:to-blue-700/10 blur-3xl floating"></div>
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-blue-300/60 to-indigo-300/50 dark:from-blue-800/20 dark:to-indigo-700/10 blur-3xl floating-slow"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-emerald-300/60 to-teal-300/50 dark:from-emerald-800/20 dark:to-teal-700/10 blur-3xl floating-fast"></div>

        <div className="absolute left-1/2 top-10 w-1/2 h-1/2 bg-gradient-to-br from-blue-400/20 to-transparent dark:from-blue-600/5 rotating opacity-80"></div>
        <div className="absolute left-20 top-1/3 w-1/3 h-1/3 bg-gradient-to-br from-purple-400/20 to-transparent dark:from-purple-600/5 rotating-reverse opacity-80"></div>

        <div className="hidden md:block">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${
                i % 2 === 0
                  ? "bg-blue-500/40 dark:bg-blue-400/30"
                  : "bg-indigo-400/40 dark:bg-indigo-500/30"
              } pulse-glow`}
              style={{
                width: `${Math.random() * 5 + 2}px`,
                height: `${Math.random() * 5 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-r from-pink-200/60 to-purple-200/50 rounded-full blur-3xl floating-slow dark:opacity-30"></div>
        <div className="absolute top-1/2 right-0 w-32 h-32 bg-gradient-to-l from-yellow-200/60 to-orange-200/50 rounded-full blur-3xl floating dark:opacity-30"></div>
      </div>

      <div className="absolute top-4 left-4 z-50">
        <Logo />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-12 md:py-24 z-10 relative flex-grow">
        <motion.header
          className="mb-10 md:mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg mb-5 rounded-full shadow-xl border border-blue-100 dark:border-blue-900/50"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Password Strength Analyzer
          </motion.h1>
          <motion.p
            className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-base md:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Enter your password to analyze its strength using advanced AI
            techniques. We'll provide detailed feedback and suggestions to
            improve security.
          </motion.p>
        </motion.header>

        <AnimatePresence>
          {timeThreshold && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex justify-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-sm border border-blue-100/50 dark:border-blue-900/30">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Target security:{" "}
                  <span className="font-medium">{timeThreshold}</span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-8 max-w-2xl mx-auto">
          <motion.div
            className="animate-fade-up"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="glass-morphism dark:glass-morphism-dark rounded-xl p-1 shadow-xl">
              <PasswordInput
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password to analyze"
                className="w-full"
                onTimeThresholdChange={setTimeThreshold}
              />
            </div>

            <AnimatePresence>
              {thresholdMet !== null && showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-3"
                >
                  <Alert
                    variant={thresholdMet ? "default" : "destructive"}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
                  >
                    <AlertTitle className="flex items-center gap-2">
                      {thresholdMet ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Threshold Met</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-4 w-4" />
                          <span>Threshold Not Met</span>
                        </>
                      )}
                    </AlertTitle>
                    <AlertDescription>
                      {thresholdMet
                        ? `Your password would take longer than ${
                            timeThreshold.split(" ")[0]
                          } to crack, meeting your security requirement.`
                        : `Your password would be cracked faster than the ${timeThreshold
                            .split(" ")[0]
                            .toLowerCase()} you selected. Try a stronger password.`}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <StrengthMeter
                  score={analysis.score}
                  strength={analysis.strength}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden flex justify-center"
              >
                <Button
                  onClick={analyzePasswordHandler}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isAnalyzing ? (
                    <>Analyzing...</>
                  ) : (
                    <>
                      Analyze Password
                      <ArrowDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showResults && password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="mt-8 mb-16"
              >
                <Tabs
                  defaultValue="analysis"
                  className="w-full"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <TabsList className="grid grid-cols-4 mb-6 shadow-md">
                    <TabsTrigger
                      value="analysis"
                      className="flex gap-2 items-center"
                    >
                      <Shield className="h-4 w-4" />
                      <span className="hidden sm:inline">Analysis</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="breakdown"
                      className="flex gap-2 items-center"
                    >
                      <ChartPieIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Breakdown</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="comparison"
                      className="flex gap-2 items-center"
                    >
                      <BarChart4 className="h-4 w-4" />
                      <span className="hidden sm:inline">Comparison</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="history"
                      className="flex gap-2 items-center"
                    >
                      <LineChart className="h-4 w-4" />
                      <span className="hidden sm:inline">History</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="analysis" className="space-y-6">
                    <AnalysisResult
                      score={analysis.score}
                      strength={analysis.strength}
                      timeToBreak={analysis.timeToBreak}
                      feedbacks={analysis.feedbacks}
                      analysis={analysis}
                    />
                    <Suggestion
                      suggestions={aiSuggestions}
                      originalPassword={password}
                    />
                  </TabsContent>

                  <TabsContent value="breakdown" className="space-y-6">
                    <PasswordScoreBreakdown
                      score={analysis.score}
                      password={password}
                    />
                  </TabsContent>

                  <TabsContent value="comparison" className="space-y-6">
                    <PasswordComparisonChart analysis={analysis} />
                  </TabsContent>

                  <TabsContent value="history" className="space-y-6">
                    <PasswordStrengthChart history={passwordHistory} />
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <footer className="pb-8 pt-16 text-center text-gray-500 dark:text-gray-400 text-sm z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="backdrop-blur-sm px-4 py-2 rounded-full inline-block bg-white/30 dark:bg-slate-900/30 border border-gray-200/50 dark:border-gray-700/50"
        >
          All analysis is performed locally – your passwords never leave your
          device.
        </motion.p>
      </footer>
    </div>
  );
};

export default Index;
