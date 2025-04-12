
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  onTimeThresholdChange?: (threshold: string) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  className,
  placeholder = "Enter your password",
  onTimeThresholdChange
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showThresholdSelector, setShowThresholdSelector] = useState(false);
  const [timeThreshold, setTimeThreshold] = useState(60); // Default: 60 (Medium security - months)
  const { toast } = useToast();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleThresholdSelector = () => {
    setShowThresholdSelector(!showThresholdSelector);
  };

  // Map slider value to a human-readable time threshold
  const getTimeThresholdText = (value: number) => {
    if (value < 20) return "Minutes (Low Security)";
    if (value < 40) return "Hours (Basic Security)";
    if (value < 60) return "Days (Better Security)";
    if (value < 80) return "Months (Good Security)";
    return "Years or more (High Security)";
  };

  // Update the parent component when threshold changes
  useEffect(() => {
    if (onTimeThresholdChange) {
      onTimeThresholdChange(getTimeThresholdText(timeThreshold));
    }
  }, [timeThreshold, onTimeThresholdChange]);

  return (
    <motion.div 
      className={cn(
        "relative w-full transition-all duration-300 ease-in-out",
        isFocused ? "scale-[1.01]" : "scale-100",
        className
      )}
      whileHover={{ scale: 1.005 }}
    >
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full px-4 py-4 text-base md:text-lg rounded-xl",
            "bg-transparent dark:bg-[#111936]", // Transparent in light mode, #111936 in dark mode
            "backdrop-blur-md",
            "border border-white/20 dark:border-white/10",
            "text-gray-800 dark:text-white",
            "focus:border-blue-400 dark:focus:border-blue-500 focus:ring-0",
            "transition-all duration-300 ease-in-out",
            "placeholder:text-gray-500 dark:placeholder:text-white/70",
            "h-14 pr-14", // Ensure right padding for the button
            "shadow-sm dark:shadow-none" // Reduced shadow in dark mode
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div 
          className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center justify-center"
        >
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={cn(
              "flex items-center justify-center",
              "w-10 h-10 rounded-full", 
              "bg-white/90 dark:bg-white/10", // More transparent in dark mode
              "text-blue-600 dark:text-blue-400",
              "hover:bg-white hover:shadow-md dark:hover:bg-white/20", // Improved hover state
              "transition-all duration-200 shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-blue-400/50 dark:focus:ring-blue-600/50"
            )}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {/* Time Threshold Button */}
        <div className="absolute top-1/2 right-16 -translate-y-1/2">
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 rounded-full bg-transparent hover:bg-blue-50/50 dark:hover:bg-blue-900/30"
            onClick={toggleThresholdSelector}
            title="Set time-to-crack threshold"
          >
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </Button>
        </div>
      </div>
      
      {/* Time Threshold Selector */}
      <AnimatedCollapsible show={showThresholdSelector}>
        <div className="mt-3 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl border border-blue-100/50 dark:border-blue-900/30 shadow-md">
          <div className="mb-2 flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password crack time threshold:
            </h4>
            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-md">
              {getTimeThresholdText(timeThreshold)}
            </span>
          </div>
          
          <div className="py-2">
            <Slider
              defaultValue={[60]}
              max={100}
              step={1}
              value={[timeThreshold]}
              onValueChange={(vals) => setTimeThreshold(vals[0])}
              className="my-2"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Minutes</span>
              <span>Hours</span>
              <span>Days</span>
              <span>Months</span>
              <span>Years+</span>
            </div>
          </div>
          
          <div className="mt-3 flex justify-end">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs"
              onClick={() => {
                toast({
                  title: "Threshold set",
                  description: `Password will be evaluated against a ${getTimeThresholdText(timeThreshold)} threshold.`
                });
                setShowThresholdSelector(false);
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      </AnimatedCollapsible>
    </motion.div>
  );
};

// Animated collapsible component
const AnimatedCollapsible = ({ 
  show, 
  children 
}: { 
  show: boolean; 
  children: React.ReactNode 
}) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: show ? 'auto' : 0,
        opacity: show ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
};

export default PasswordInput;
