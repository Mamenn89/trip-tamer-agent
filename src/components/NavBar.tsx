
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out successfully",
      duration: 3000,
    });
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-subtle py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-black font-medium"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50">
            <MapPin className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-xl font-semibold">Dika Travel Mate</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" label="Home" currentPath={location.pathname} />
          {isAuthenticated && (
            <NavLink to="/planner" label="Plan a Trip" currentPath={location.pathname} />
          )}
          <NavLink to="/inspiration" label="Inspiration" currentPath={location.pathname} />
          <NavLink to="/about" label="About" currentPath={location.pathname} />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Hi, {currentUser?.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </nav>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4 md:hidden animate-slide-down">
            <nav className="flex flex-col space-y-4">
              <MobileNavLink to="/" label="Home" onClick={() => setIsMobileMenuOpen(false)} />
              {isAuthenticated && (
                <MobileNavLink to="/planner" label="Plan a Trip" onClick={() => setIsMobileMenuOpen(false)} />
              )}
              <MobileNavLink to="/inspiration" label="Inspiration" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink to="/about" label="About" onClick={() => setIsMobileMenuOpen(false)} />
              
              {isAuthenticated ? (
                <div className="pt-2 border-t border-gray-100">
                  <div className="text-sm text-gray-600 mb-2">Signed in as {currentUser?.email}</div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-100">
                  <Link to="/login" className="block w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">Login</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  currentPath: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, currentPath }) => {
  const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={`relative py-2 font-medium transition-colors ${
        isActive 
          ? 'text-blue-600' 
          : 'text-gray-600 hover:text-blue-600'
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
      )}
    </Link>
  );
};

interface MobileNavLinkProps {
  to: string;
  label: string;
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, label, onClick }) => {
  return (
    <Link 
      to={to} 
      className="block py-2 px-4 rounded-md text-gray-800 font-medium hover:bg-gray-50"
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default NavBar;
