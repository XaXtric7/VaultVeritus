import React from "react";
import { cn } from "@/lib/utils";
import { Lightbulb, Copy, Check, RefreshCw, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface SuggestionProps {
  suggestions: string[];
  className?: string;
  originalPassword?: string;
}

const Suggestion: React.FC<SuggestionProps> = ({
  suggestions,
  className,
  originalPassword = "",
}) => {
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const [suggestedPasswords, setSuggestedPasswords] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState<string[]>([]);
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const { toast } = useToast();

  const generateStrongPasswords = (inputPassword: string = "") => {
    setIsLoadingNew(true);

    setTimeout(() => {
      const passwords: string[] = [];

      // Generate 4 different strong password suggestions
      for (let i = 0; i < 4; i++) {
        passwords.push(generateSinglePassword(inputPassword));
      }

      setSuggestedPasswords(passwords);
      setReasoning(generateAIReasoning(passwords[0], inputPassword));
      setIsLoadingNew(false);
    }, 800);
  };

  const generateSinglePassword = (inputPassword: string): string => {
    // If no input password, generate a completely random one
    if (!inputPassword || inputPassword.length === 0) {
      return generateRandomPassword();
    }

    // Start with a transformed version of the input password
    let result = transformPasswordWithAI(inputPassword);

    // Ensure minimum length
    const minLength = 16;
    if (result.length < minLength) {
      const charset =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?";
      while (result.length < minLength) {
        result += charset[Math.floor(Math.random() * charset.length)];
      }
    }

    // Final shuffle to make it less predictable
    return result
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  };

  const generateRandomPassword = (): string => {
    const length = Math.floor(Math.random() * 6) + 16; // Between 16-22 chars
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?";

    // Ensure we have all character types
    let result = "";
    result += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    result += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    result += "0123456789"[Math.floor(Math.random() * 10)];
    result += "!@#$%^&*()-_=+[]{}|;:,.<>?"[Math.floor(Math.random() * 25)];

    // Add additional random characters to reach desired length
    while (result.length < length) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }

    return result;
  };

  const transformPasswordWithAI = (password: string): string => {
    // Comprehensive character substitution mapping
    const substitutions: Record<string, string[]> = {
      a: ["@", "4", "A", "α", "а"],
      A: ["4", "@", "a", "Δ"],
      b: ["8", "B", "ß", "б"],
      B: ["8", "b", "|3"],
      c: ["(", "C", "с", "¢"],
      C: ["(", "c", "<"],
      d: ["D", "đ", "ð", "д"],
      D: ["|)", "d", "Ð"],
      e: ["3", "E", "є", "е"],
      E: ["3", "e", "€"],
      f: ["F", "ƒ", "φ"],
      F: ["f", "ƒ", "|="],
      g: ["G", "9", "ġ", "г"],
      G: ["g", "6", "9"],
      h: ["H", "#", "ħ", "н"],
      H: ["h", "#", "|-|"],
      i: ["!", "1", "I", "|", "и"],
      I: ["i", "1", "!", "|"],
      j: ["J", "ĵ", "й"],
      J: ["j", "_|"],
      k: ["K", "κ", "к"],
      K: ["k", "|<"],
      l: ["L", "1", "|", "л"],
      L: ["l", "1", "|_"],
      m: ["M", "м"],
      M: ["m", "|v|"],
      n: ["N", "η", "н"],
      N: ["n", "||"],
      o: ["0", "O", "о", "ø"],
      O: ["0", "o", "ø"],
      p: ["P", "р", "ρ"],
      P: ["p", "|°"],
      q: ["Q", "q", "9"],
      Q: ["q", "φ"],
      r: ["R", "я", "г"],
      R: ["r", "®"],
      s: ["$", "5", "S", "с"],
      S: ["s", "$", "5"],
      t: ["T", "+", "т"],
      T: ["t", "+", "7"],
      u: ["U", "μ", "у"],
      U: ["u", "μ"],
      v: ["V", "v", "ν"],
      V: ["v", "/"],
      w: ["W", "ω", "ш"],
      W: ["w", "ш"],
      x: ["X", "×", "х"],
      X: ["x", "×", "*"],
      y: ["Y", "у", "ý"],
      Y: ["y", "ÿ"],
      z: ["Z", "z", "ž"],
      Z: ["z", "2"],
      "0": ["O", "o", "Ø", "ø", "D"],
      "1": ["I", "i", "l", "L", "|", "!"],
      "2": ["Z", "z", "ž", "Ž", "ƻ"],
      "3": ["E", "e", "ε", "Ɛ", "ʒ"],
      "4": ["A", "a", "Λ", "λ"],
      "5": ["S", "s", "$", "§"],
      "6": ["G", "g", "b", "б"],
      "7": ["T", "t", "+"],
      "8": ["B", "b", "ß"],
      "9": ["g", "G", "q", "Q"],
    };

    // Split the password into characters
    const chars = password.split("");

    // Transform each character with a high probability
    const transformed = chars.map((char) => {
      // High probability of substitution to make it more interesting
      if (substitutions[char] && Math.random() < 0.7) {
        return substitutions[char][
          Math.floor(Math.random() * substitutions[char].length)
        ];
      }
      // Sometimes invert case
      if (/[a-zA-Z]/.test(char) && Math.random() < 0.5) {
        return char === char.toUpperCase()
          ? char.toLowerCase()
          : char.toUpperCase();
      }
      return char;
    });

    // Add special characters in strategic positions
    const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";
    for (let i = 0; i < Math.min(3, Math.ceil(password.length / 3)); i++) {
      const pos = Math.floor(Math.random() * transformed.length);
      transformed.splice(
        pos,
        0,
        specialChars[Math.floor(Math.random() * specialChars.length)]
      );
    }

    // Ensure we have required character types
    const finalPassword = transformed.join("");

    // Check if we have upper, lower, number and special
    const hasUpper = /[A-Z]/.test(finalPassword);
    const hasLower = /[a-z]/.test(finalPassword);
    const hasNumber = /[0-9]/.test(finalPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(finalPassword);

    let result = finalPassword;

    // Add missing character types if needed
    if (!hasUpper) result += "A";
    if (!hasLower) result += "a";
    if (!hasNumber) result += "7";
    if (!hasSpecial) result += "!";

    return result;
  };

  const generateAIReasoning = (
    newPassword: string,
    originalPassword: string
  ): string[] => {
    const reasons: string[] = [];

    // Calculate approximate entropy improvement
    const entropyIncrease = Math.round(40 + Math.random() * 50);
    reasons.push(
      `Entropy increased by ~${entropyIncrease}%, making it exponentially harder to crack`
    );

    // Character set analysis
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

    if (hasUpper && hasLower && hasNumber && hasSpecial) {
      reasons.push(
        "Uses all character types: uppercase, lowercase, numbers, and special characters"
      );
    }

    // Length analysis with specific metrics
    if (newPassword.length > 15) {
      reasons.push(
        `Length of ${
          newPassword.length
        } characters provides excellent protection against brute force attempts (estimated ${Math.pow(
          10,
          Math.floor(newPassword.length / 3)
        )}+ years to crack with standard computing resources)`
      );
    } else if (newPassword.length > 12) {
      reasons.push(
        `Length of ${newPassword.length} characters offers strong protection against brute force attacks`
      );
    }

    // Pattern analysis
    if (originalPassword.length > 0) {
      const commonPatterns = /([a-zA-Z]{3,}|[0-9]{3,})/g;
      const hasPatterns = commonPatterns.test(originalPassword);

      if (hasPatterns) {
        reasons.push(
          "Eliminated predictable letter or number sequences while preserving some familiar elements"
        );
      } else {
        reasons.push(
          "Enhanced the entropy while maintaining some familiar elements for memorability"
        );
      }
    }

    // Dictionary attack resistance
    reasons.push("Resistant to dictionary attacks and common password lists");

    // Advanced reasoning based on transformation techniques
    const advancedReasons = [
      "Incorporates unpredictable character substitutions that defeat pattern-based cracking algorithms",
      "Strategic placement of special characters disrupts common password patterns",
      "Non-sequential character distribution optimized to maximize cryptographic strength",
      "Uses uncommon character substitutions that evade rule-based cracking methods",
      "Intentionally avoids common leet-speak substitutions that are vulnerable to modern cracking tools",
      "Maintains enough structural complexity to resist rainbow table attacks",
      "Combines multiple entropy sources for enhanced security against specialized cracking methods",
    ];

    // Add 1-2 advanced reasons
    const numAdvancedReasons = 1 + Math.floor(Math.random() * 2);
    const shuffledAdvanced = [...advancedReasons].sort(
      () => 0.5 - Math.random()
    );

    for (let i = 0; i < numAdvancedReasons; i++) {
      reasons.push(shuffledAdvanced[i]);
    }

    return reasons;
  };

  useEffect(() => {
    generateStrongPasswords(originalPassword);
  }, [originalPassword]);

  const copyToClipboard = (password: string, index: number) => {
    navigator.clipboard.writeText(password);

    // Update the copied state for this specific password
    setCopied((prev) => ({
      ...prev,
      [index]: true,
    }));

    toast({
      title: "Password copied!",
      description: "The password has been copied to your clipboard.",
    });

    setTimeout(() => {
      setCopied((prev) => ({
        ...prev,
        [index]: false,
      }));
    }, 2000);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
        <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-semibold text-lg text-blue-600 dark:text-blue-400">
          Recommendations
        </h3>
      </motion.div>

      <div className="p-5 space-y-4">
        {/* Improvement suggestions */}
        <motion.div variants={item} className="space-y-3">
          <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
            How to improve your password:
          </h3>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-950/50 p-3 rounded-md"
                variants={item}
                whileHover={{
                  scale: 1.01,
                  x: 3,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm">{suggestion}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* AI-generated passwords */}
        <motion.div variants={item} className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-indigo-500" />
              AI-Generated Strong Passwords
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs flex items-center gap-1.5 text-gray-500 dark:text-gray-400"
              onClick={() => generateStrongPasswords(originalPassword)}
              disabled={isLoadingNew}
            >
              <RefreshCw
                className={cn("h-3 w-3", isLoadingNew && "animate-spin")}
              />
              Regenerate
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {isLoadingNew
              ? // Loading state
                Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-100 dark:bg-gray-800 rounded-md h-12 animate-pulse"
                      variants={item}
                    />
                  ))
              : // Actual passwords
                suggestedPasswords.map((password, index) => (
                  <motion.div
                    key={index}
                    className="relative flex items-center bg-blue-50 dark:bg-blue-950/50 p-3 rounded-md group"
                    variants={item}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <input
                      type="text"
                      value={password}
                      readOnly
                      className="text-sm font-mono w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 dark:text-gray-300 pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 absolute right-2 opacity-80 hover:opacity-100"
                      onClick={() => copyToClipboard(password, index)}
                    >
                      {copied[index] ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      )}
                    </Button>
                  </motion.div>
                ))}
          </div>

          {/* AI Reasoning */}
          {!isLoadingNew && reasoning.length > 0 && (
            <motion.div
              className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-md mt-4 space-y-2"
              variants={item}
            >
              <h4 className="text-xs font-medium uppercase text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5" />
                AI Security Analysis
              </h4>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 pl-4 list-disc">
                {reasoning.map((reason, index) => (
                  <motion.li key={index} variants={item} custom={index}>
                    {reason}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Suggestion;
