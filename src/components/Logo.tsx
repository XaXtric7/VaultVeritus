
import React from 'react';
import { Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <motion.div 
      className={cn(
        "flex items-center gap-2",
        className
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-md"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.7, 0.9, 0.7] 
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="relative flex items-center justify-center h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 rounded-full shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Shield className="h-5 w-5 text-white" strokeWidth={2.5} />
          <Lock className="absolute h-3 w-3 text-white" style={{ top: '55%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </motion.div>
      </div>
      <motion.div 
        className="font-bold text-xl md:text-2xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent"
        whileHover={{ scale: 1.02 }}
      >
        VaultVeritus
      </motion.div>
    </motion.div>
  );
};

export default Logo;
