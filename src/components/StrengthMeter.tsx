
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StrengthMeterProps {
  score: number;
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  className?: string;
}

const StrengthMeter: React.FC<StrengthMeterProps> = ({
  score,
  strength,
  className
}) => {
  const [currentWidth, setCurrentWidth] = useState(0);
  
  // Colors mapped to strength levels
  const strengthColors = {
    'weak': 'bg-gradient-to-r from-red-500 to-red-400',
    'medium': 'bg-gradient-to-r from-orange-500 to-amber-400',
    'strong': 'bg-gradient-to-r from-green-500 to-emerald-400',
    'very-strong': 'bg-gradient-to-r from-emerald-500 to-teal-400'
  };
  
  // Text colors mapped to strength levels
  const strengthTextColors = {
    'weak': 'text-red-500',
    'medium': 'text-orange-500',
    'strong': 'text-green-500',
    'very-strong': 'text-emerald-500'
  };
  
  // Background colors for the track
  const strengthBackgrounds = {
    'weak': 'bg-red-100 dark:bg-red-950/30',
    'medium': 'bg-orange-100 dark:bg-orange-950/30',
    'strong': 'bg-green-100 dark:bg-green-950/30',
    'very-strong': 'bg-emerald-100 dark:bg-emerald-950/30'
  };
  
  // Labels mapped to strength levels
  const strengthLabels = {
    'weak': 'Weak',
    'medium': 'Medium',
    'strong': 'Strong',
    'very-strong': 'Very Strong'
  };

  // Animate the progress bar when score changes
  useEffect(() => {
    // Small delay for smooth animation
    const timeout = setTimeout(() => {
      setCurrentWidth(score);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [score]);

  return (
    <motion.div 
      className={cn(
        "space-y-2 p-5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg border border-blue-100/60 dark:border-blue-900/30",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
          Password Strength
        </div>
        <motion.div 
          className={cn(
            "text-sm font-semibold px-3 py-1 rounded-full",
            strengthTextColors[strength],
            `bg-${strength === 'weak' ? 'red' : strength === 'medium' ? 'orange' : strength === 'strong' ? 'green' : 'emerald'}-100/50 dark:bg-${strength === 'weak' ? 'red' : strength === 'medium' ? 'orange' : strength === 'strong' ? 'green' : 'emerald'}-900/20`
          )}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          {strengthLabels[strength]}
        </motion.div>
      </div>
      
      <div className={cn(
        "h-3 w-full rounded-full overflow-hidden shadow-inner",
        strengthBackgrounds[strength]
      )}>
        <motion.div 
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out transform",
            strengthColors[strength]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${currentWidth}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      
      <div className="flex justify-between pt-1">
        <div className="relative w-full">
          {[25, 50, 75].map((mark) => (
            <motion.div 
              key={mark}
              className={cn(
                "absolute top-0 h-1 w-px bg-gray-300 dark:bg-gray-600",
                score >= mark ? "bg-gray-400 dark:bg-gray-500" : ""
              )}
              style={{ left: `${mark}%` }}
              initial={{ height: 0 }}
              animate={{ height: 4 }}
              transition={{ duration: 0.4, delay: mark / 100 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StrengthMeter;
