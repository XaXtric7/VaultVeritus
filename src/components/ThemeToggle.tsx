
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    // Check if user has a system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set theme based on saved preference or system preference
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    
    // Apply the theme to the document
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleTheme}
        className="h-10 w-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-slate-800 shadow-md hover:shadow-lg transition-all"
      >
        {theme === 'light' ? (
          <Moon className="h-[1.2rem] w-[1.2rem] text-blue-600 dark:text-blue-400" />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500 dark:text-amber-400" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  );
};

export default ThemeToggle;
