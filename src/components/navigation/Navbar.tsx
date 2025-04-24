
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed w-full top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/707d0553-01f0-4e69-9d13-66a5665635f9.png" 
            alt="HealthProAssist Logo" 
            className="h-10" 
          />
        </Link>

        {isAuthenticated && (
          <Link
            to="/dashboard"
            className="text-sm font-medium text-healthcare-600 hover:text-healthcare-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
