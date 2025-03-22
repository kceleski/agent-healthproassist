
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/833e17f2-9c98-45bd-b480-4bf61140209b.png" 
            alt="HealthProAssist Logo" 
            className="h-8 md:h-10" 
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={cn(
              'text-sm font-medium transition-colors',
              location.pathname === '/'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Home
          </Link>
          <Link
            to="/#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            to="/#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            to="/#contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <Button asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t animate-slide-in">
          <div className="container py-4 flex flex-col gap-4">
            <Link
              to="/"
              className={cn(
                'py-2 text-sm font-medium transition-colors',
                location.pathname === '/'
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              Home
            </Link>
            <Link
              to="/#features"
              className="py-2 text-sm font-medium text-muted-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              to="/#pricing"
              className="py-2 text-sm font-medium text-muted-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/#contact"
              className="py-2 text-sm font-medium text-muted-foreground transition-colors"
            >
              Contact
            </Link>

            <div className="border-t pt-4 mt-2 flex flex-col gap-3">
              {isAuthenticated ? (
                <Button asChild className="w-full">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
