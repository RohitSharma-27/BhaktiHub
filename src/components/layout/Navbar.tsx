import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Singers', path: '/singers' },
  { label: 'Musicians', path: '/musicians' },
  { label: 'Sound Providers', path: '/sound-providers' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        'bg-[#fff0dc]/95 backdrop-blur-md border-b border-[#e7c895]',
        scrolled && 'shadow-soft',
      )}
    >
      <nav className="container-page flex items-center justify-between h-16 lg:h-20">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-saffron-gradient flex items-center justify-center">
            <span className="font-display text-white text-xl font-bold">
              B
            </span>
          </div>

          <div>
            <span className="font-display text-xl font-bold text-neutral-900">
              BhaktiHub
            </span>

            <p className="text-[10px] text-saffron-600 font-medium -mt-1 hidden sm:block">
              Devotional Artist Booking
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'relative px-4 py-2 text-sm font-medium transition-colors',
                'after:absolute after:left-4 after:right-4 after:-bottom-0.5 after:h-0.5 after:rounded-full',
                'after:bg-saffron-500 after:origin-center after:transition-transform after:duration-200',
                location.pathname === link.path
                  ? 'text-saffron-700 after:scale-x-100'
                  : 'text-neutral-600 hover:text-saffron-700 hover:after:scale-x-100 after:scale-x-0',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop User Menu */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-cream-300 hover:bg-cream-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-white font-semibold text-sm">
                  {user.name?.trim()?.[0]?.toUpperCase() ||
                    user.email?.trim()?.[0]?.toUpperCase() ||
                    'U'}
                </div>

                <span className="text-sm font-medium text-neutral-700 max-w-[120px] truncate">
                  {user.name ?? user.email?.split('@')[0]}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-card border border-cream-200 py-2 animate-fade-in-scale">

                  {!isAdmin && location.pathname !== '/dashboard' && (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-cream-100"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  )}

                  {isAdmin && location.pathname !== '/admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-cream-100"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>

                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">
                Login
              </Link>

              <Link to="/register" className="btn-primary text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg text-neutral-700 hover:bg-cream-100"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-cream-200 shadow-card animate-fade-in">
          <div className="container-page py-4 space-y-1">

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === link.path
                    ? 'text-saffron-700 bg-saffron-50'
                    : 'text-neutral-600 hover:bg-cream-100',
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-cream-200 space-y-2">

              {user ? (
                <>
                  {!isAdmin && location.pathname !== '/dashboard' && (
                    <Link
                      to="/dashboard"
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-neutral-700 hover:bg-cream-100"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  )}

                  {isAdmin && location.pathname !== '/admin' && (
                    <Link
                      to="/admin"
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-neutral-700 hover:bg-cream-100"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-neutral-700 hover:bg-cream-100"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-white bg-saffron-gradient text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </header>
  );
}