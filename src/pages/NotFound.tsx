
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="fixed inset-0 overflow-hidden z-0 opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-200 blur-3xl"></div>
        <div className="absolute top-1/3 -left-24 w-80 h-80 rounded-full bg-purple-200 blur-3xl"></div>
        <div className="absolute -bottom-32 right-1/4 w-72 h-72 rounded-full bg-amber-200 blur-3xl"></div>
      </div>

      <div className="glass-morphism rounded-2xl p-8 max-w-md w-full mx-4 shadow-medium border-t border-white/50 animate-fade-up">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-50 p-3 rounded-full mb-5">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">404</h1>
          <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
          <a 
            href="/" 
            className="px-6 py-3 bg-gray-900 text-white rounded-xl shadow-soft hover:bg-gray-800 
            transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
