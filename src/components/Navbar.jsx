import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Plus, ChevronRight, ShieldCheck, Stethoscope, MessageSquare, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  const getHomePath = () => {
    if (user?.role === 'doctor') return '/dashboard';
    if (user?.role === 'patient') return '/patient-dashboard';
    if (user?.role === 'admin') return '/admin';
    return '/';
  };

  const navLinks = [
    ...(!user ? [
      { name: 'Accueil', path: '/' },
      { name: 'Médecins', path: '/doctors' },
      { name: 'À propos', path: '/about' },
      { name: 'Contact', path: '/contact' }
    ] : []),
    ...(user?.role === 'patient' ? [
      { name: 'Mon Espace', path: '/patient-dashboard', icon: Calendar },
      { name: 'Rechercher', path: '/doctors' }
    ] : []),
    ...(user?.role === 'doctor' ? [{ name: 'Dashboard', path: '/dashboard', icon: Stethoscope }] : []),
    ...(user?.role === 'admin' ? [{ name: 'Admin', path: '/admin', icon: ShieldCheck }] : []),
    ...(user ? [{ name: 'Messages', path: '/messages', icon: MessageSquare }] : []),
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-lg shadow-black/5 dark:shadow-black/20 backdrop-blur-xl'
          : 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to={getHomePath()} className="flex items-center gap-3 group">
            <div className="flex items-center justify-center">
              <img src="/logo.png" alt="Doctori Logo" className="h-[60px] md:h-[72px] w-auto object-contain drop-shadow-sm transition-transform group-hover:scale-105" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mt-1">
              Doctori
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-medical-blue dark:text-medical-accent font-bold'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-medical-blue/10 dark:bg-medical-accent/10 rounded-lg"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-medical-blue flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none">Compte {user.role}</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{user.name}</p>
                  </div>
                  <button 
                    onClick={logout}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
                    title="Déconnexion"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-medical-blue transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="btn-primary text-sm !py-2 !px-4">
                  S'inscrire
                </Link>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            <AnimatePresence>
              {user?.role !== 'doctor' && (
                <Link to="/doctors" className="hidden lg:flex btn-primary text-sm !py-2 !px-4">
                  <span className="whitespace-nowrap">Trouver un médecin</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </AnimatePresence>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors dark:text-white"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-gray-950 shadow-2xl z-[70] md:hidden flex flex-col"
              style={{ height: '100dvh' }}
            >
              <div className="flex flex-col h-full bg-white dark:bg-gray-950 rounded-l-3xl overflow-hidden p-6 gap-6 shadow-[-10px_0_30px_rgba(0,0,0,0.1)]">
                
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800/50">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Doctori" className="h-8 w-auto relative z-10" />
                    <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Doctori</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-medical-blue transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto space-y-6 pb-20">
                  
                  {user ? (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-medical-blue/10 to-medical-light/10 dark:from-medical-blue/20 dark:to-medical-light/20 border border-medical-blue/20 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-medical-blue flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-medical-blue dark:text-medical-accent uppercase tracking-widest">{user.role}</p>
                          <p className="font-bold text-gray-900 dark:text-white text-md truncate">{user.name}</p>
                        </div>
                      </div>
                      <button onClick={() => { logout(); setIsOpen(false); }} className="w-full flex items-center justify-center gap-2 py-2 mt-1 rounded-xl text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-sm font-semibold transition-colors">
                        Déconnexion
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link to="/login" onClick={() => setIsOpen(false)} className="btn-secondary text-center text-sm !py-3">Connexion</Link>
                      <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary text-center text-sm !py-3">S'inscrire</Link>
                    </div>
                  )}

                  <div className="space-y-1 pt-2">
                    {navLinks.map((link) => {
                      const isActive = location.pathname === link.path;
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-semibold transition-all duration-300 ${
                            isActive
                              ? 'bg-medical-blue text-white shadow-lg shadow-medical-blue/20'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {link.icon && <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />}
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Drawer Footer CTA */}
                {user?.role !== 'doctor' && (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800/50 mt-auto pb-4">
                    <Link
                      to="/doctors"
                      onClick={() => setIsOpen(false)}
                      className="w-full btn-primary !py-4 flex justify-center !text-base shadow-xl"
                    >
                      Trouver un médecin
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
