export interface PasswordAnalysis {
  score: number; // 0-100
  strength: "weak" | "medium" | "strong" | "very-strong";
  timeToBreak: string;
  suggestions: string[];
  feedbacks: {
    positives: string[];
    negatives: string[];
  };
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

// List of common passwords
const commonPasswords = [
  "password",
  "123456",
  "qwerty",
  "admin",
  "welcome",
  "login",
  "123123",
  "12345678",
  "abc123",
  "letmein",
  "1234",
  "monkey",
  "1234567890",
  "master",
  "sunshine",
  "football",
  "baseball",
  "dragon",
  "superman",
  "princess",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
  "123456789",
  "iloveyou",
];

// Analyze password strength with sophisticated algorithm
export const analyzePassword = (password: string): PasswordAnalysis => {
  if (!password) {
    return getEmptyAnalysis();
  }

  // Check for various password quality issues
  const hasLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  // Improved check for common patterns - only exact matches or significant substrings
  const lowercasePassword = password.toLowerCase();
  const hasCommonPassword = commonPasswords.some((commonPwd) => {
    // Exact match
    if (lowercasePassword === commonPwd) return true;

    // For longer passwords, check if they contain a common password
    // but only if the common password is significant (4+ chars)
    if (
      commonPwd.length >= 4 &&
      lowercasePassword.includes(commonPwd) &&
      // Avoid matching small common strings that might be part of regular words
      commonPwd.length / lowercasePassword.length > 0.4
    ) {
      return true;
    }

    return false;
  });

  const hasSequentialChars = checkForSequentialChars(password);
  const hasRepeatedChars = checkForRepeatedChars(password);

  // Add debugging information
  console.log("Password Characteristics:", {
    hasLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
    hasCommonPassword,
    hasSequentialChars,
    hasRepeatedChars,
  });

  // Calculate entropy (basic measure of password randomness)
  const entropy = calculateEntropy(password);

  // Base score from entropy
  let score = Math.min(100, entropy * 4);

  // Penalize for issues
  if (!hasLength) score *= 0.7;
  if (!hasUpperCase) score *= 0.9;
  if (!hasLowerCase) score *= 0.9;
  if (!hasNumber) score *= 0.9;
  if (!hasSpecialChar) score *= 0.85;
  if (hasCommonPassword) score *= 0.3;
  if (hasSequentialChars) score *= 0.8;
  if (hasRepeatedChars) score *= 0.8;

  // Determine time to break (simplified estimation)
  const timeToBreak = estimateTimeToBreak(password);

  // Generate suggestions for improvement
  const suggestions = generateSuggestions({
    hasLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
    hasCommonPassword,
    hasSequentialChars,
    hasRepeatedChars,
  });

  // Get positives and negatives feedback
  const feedbacks = generateFeedback({
    hasLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
    hasCommonPassword,
    hasSequentialChars,
    hasRepeatedChars,
  });

  // Determine strength category
  let strength: "weak" | "medium" | "strong" | "very-strong" = "weak";
  if (score >= 80) strength = "very-strong";
  else if (score >= 60) strength = "strong";
  else if (score >= 40) strength = "medium";

  return {
    score: Math.round(score),
    strength,
    timeToBreak,
    suggestions,
    feedbacks,
    issues: {
      hasLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      hasCommonPassword,
      hasSequentialChars,
      hasRepeatedChars,
    },
  };
};

// Get empty analysis when no password is provided
const getEmptyAnalysis = (): PasswordAnalysis => ({
  score: 0,
  strength: "weak",
  timeToBreak: "instantly",
  suggestions: ["Enter a password to analyze its strength"],
  feedbacks: {
    positives: [],
    negatives: ["No password entered"],
  },
  issues: {
    hasLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasCommonPassword: false,
    hasSequentialChars: false,
    hasRepeatedChars: false,
  },
});

// Calculate password entropy (measure of randomness)
const calculateEntropy = (password: string): number => {
  if (!password) return 0;

  let charset = 0;
  if (/[a-z]/.test(password)) charset += 26;
  if (/[A-Z]/.test(password)) charset += 26;
  if (/[0-9]/.test(password)) charset += 10;
  if (/[^A-Za-z0-9]/.test(password)) charset += 33;

  return Math.log2(Math.pow(charset, password.length));
};

// Improved check for sequential characters (like "123" or "abc")
const checkForSequentialChars = (password: string): boolean => {
  const sequences = [
    "abcdefghijklmnopqrstuvwxyz",
    "0123456789",
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm",
  ];
  const reversed = sequences.map((seq) => seq.split("").reverse().join(""));

  const allSequences = [...sequences, ...reversed];

  const lowerPass = password.toLowerCase();

  // Check for at least 3 sequential characters from our defined sequences
  for (let i = 0; i < allSequences.length; i++) {
    const seq = allSequences[i];
    for (let j = 0; j < seq.length - 2; j++) {
      const triplet = seq.substring(j, j + 3);
      if (lowerPass.includes(triplet)) {
        return true;
      }
    }
  }

  return false;
};

// Improved check for 3 or more repeated characters (like "aaa" or "111")
const checkForRepeatedChars = (password: string): boolean => {
  // Check for three or more identical consecutive characters
  for (let i = 0; i < password.length - 2; i++) {
    if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
      return true;
    }
  }

  // Check for repeating patterns of 2 or more characters
  if (password.length >= 6) {
    for (let patternLength = 2; patternLength <= 3; patternLength++) {
      for (let i = 0; i <= password.length - patternLength * 2; i++) {
        const pattern = password.substring(i, i + patternLength);
        const nextChunk = password.substring(
          i + patternLength,
          i + patternLength * 2
        );
        if (pattern === nextChunk) {
          return true;
        }
      }
    }
  }

  return false;
};

// Estimate time to crack the password
const estimateTimeToBreak = (password: string): string => {
  if (!password) return "instantly";

  const entropy = calculateEntropy(password);

  // Assuming 10 billion guesses per second (modern hardware)
  const guessesPerSecond = 10000000000;
  const possibleCombinations = Math.pow(2, entropy);
  const seconds = possibleCombinations / guessesPerSecond / 2; // Divide by 2 for average case

  if (seconds < 1) return "instantly";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
  if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;

  return "centuries";
};

// Generate suggestions based on password issues
const generateSuggestions = (issues: any): string[] => {
  const suggestions: string[] = [];

  if (!issues.hasLength) {
    suggestions.push("Use at least 8 characters");
  }

  if (!issues.hasUpperCase || !issues.hasLowerCase) {
    suggestions.push("Mix uppercase and lowercase letters");
  }

  if (!issues.hasNumber) {
    suggestions.push("Add numbers");
  }

  if (!issues.hasSpecialChar) {
    suggestions.push("Include special characters like !@#$%");
  }

  if (issues.hasCommonPassword) {
    suggestions.push("Avoid using common words or patterns");
  }

  if (issues.hasSequentialChars) {
    suggestions.push("Avoid sequential characters like 123 or abc");
  }

  if (issues.hasRepeatedChars) {
    suggestions.push("Avoid repeating characters like aaa or 111");
  }

  if (suggestions.length === 0) {
    suggestions.push("Your password is already strong");
  }

  return suggestions;
};

// Generate positive and negative feedback
const generateFeedback = (
  issues: any
): { positives: string[]; negatives: string[] } => {
  const positives: string[] = [];
  const negatives: string[] = [];

  if (issues.hasLength) {
    positives.push("Good length");
  } else {
    negatives.push("Too short");
  }

  if (issues.hasUpperCase) {
    positives.push("Has uppercase letters");
  } else {
    negatives.push("No uppercase letters");
  }

  if (issues.hasLowerCase) {
    positives.push("Has lowercase letters");
  } else {
    negatives.push("No lowercase letters");
  }

  if (issues.hasNumber) {
    positives.push("Has numbers");
  } else {
    negatives.push("No numbers");
  }

  if (issues.hasSpecialChar) {
    positives.push("Has special characters");
  } else {
    negatives.push("No special characters");
  }

  if (issues.hasCommonPassword) {
    negatives.push("Contains common password patterns");
  }

  if (issues.hasSequentialChars) {
    negatives.push("Contains sequential characters");
  }

  if (issues.hasRepeatedChars) {
    negatives.push("Contains repeated characters");
  }

  return { positives, negatives };
};

// Simulate AI-enhanced future suggestions (would integrate with real AI in production)
export const getAIEnhancedSuggestions = (password: string): string[] => {
  if (!password) return [];

  const basicAnalysis = analyzePassword(password);

  // Simulate AI-enhanced suggestions based on the password
  const aiSuggestions = [...basicAnalysis.suggestions];

  if (password.length > 0) {
    // Add context-specific suggestions
    if (/[0-9]+$/.test(password)) {
      aiSuggestions.push(
        "Avoid placing all numbers at the end of your password"
      );
    }

    if (
      /^[A-Z]/.test(password) &&
      password.length > 1 &&
      /[a-z]+$/.test(password.slice(1))
    ) {
      aiSuggestions.push(
        "Avoid using only an uppercase first letter followed by all lowercase"
      );
    }

    // Check for dictionary word patterns
    if (/^[a-zA-Z]+$/.test(password) && password.length > 3) {
      aiSuggestions.push(
        "Consider adding non-alphabetic characters to strengthen your password"
      );
    }

    // Add personalized suggestion
    if (basicAnalysis.score < 60) {
      aiSuggestions.push(
        "Try creating a phrase from the first letters of a memorable sentence"
      );
    }
  }

  return aiSuggestions;
};
