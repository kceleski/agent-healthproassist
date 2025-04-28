
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-white py-5'
      )}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/707d0553-01f0-4e69-9d13-66a5665635f9.png" 
            alt="HealthProAssist Logo" 
            className="h-8 md:h-10" 
          />
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-healthcare-600 hover:text-healthcare-700 font-medium">
              Home
            </Link>
            <Link to="/search" className="text-healthcare-600 hover:text-healthcare-700 font-medium">
              Search
            </Link>
            <Link to="/map" className="text-healthcare-600 hover:text-healthcare-700 font-medium">
              Map
            </Link>
          </div>
        )}

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button
              asChild
              className="text-sm font-medium text-white bg-healthcare-600 hover:bg-healthcare-700 transition-colors px-4 py-2 rounded-md"
            >
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button
              asChild
              className="text-sm font-medium text-white bg-healthcare-600 hover:bg-healthcare-700 transition-colors px-4 py-2 rounded-md"
            >
              <Link to="/login">Sign In</Link>
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-healthcare-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md py-4 px-6 flex flex-col space-y-3 z-50">
            <Link to="/" className="text-healthcare-600 py-2" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/search" className="text-healthcare-600 py-2" onClick={() => setMobileMenuOpen(false)}>
              Search
            </Link>
            <Link to="/map" className="text-healthcare-600 py-2" onClick={() => setMobileMenuOpen(false)}>
              Map
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-healthcare-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/profile" className="text-healthcare-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-red-500 py-2 text-left">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-healthcare-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/register" className="text-healthcare-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
