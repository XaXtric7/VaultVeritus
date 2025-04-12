
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Script to check for dark mode preference
const script = document.createElement("script");
script.innerHTML = `
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
`;
document.head.appendChild(script);

createRoot(document.getElementById("root")!).render(<App />);
