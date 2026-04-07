import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Dumbbell, 
  LayoutDashboard, 
  PieChart, 
  LogOut, 
  User as UserIcon, 
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'AI Planner', path: '/ai-planner', icon: Sparkles },
    { name: 'Progress', path: '/progress', icon: PieChart },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <nav className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <Dumbbell className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight gradient-text">MakeMeFit</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {currentUser && navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-2 transition-colors ${
                  location.pathname === item.path ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            
            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-primary transition-all"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {currentUser ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-xl border border-white/5 hover:border-primary transition-colors">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-semibold">{currentUser.displayName?.split(' ')[0] || 'Warrior'}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
                  <Link 
                    to="/signup" 
                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-3">
             <button 
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-secondary/50 text-muted-foreground pr-2"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={toggleMobileMenu}
                className="p-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/20"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-background z-[70] md:hidden flex flex-col p-8 border-l border-white/10"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2">
                  <div className="bg-primary p-2 rounded-xl">
                    <Dumbbell className="text-white w-5 h-5" />
                  </div>
                  <span className="text-lg font-bold gradient-text">MakeMeFit</span>
                </div>
                <button 
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-xl bg-secondary/50 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {currentUser && (
                <div className="flex flex-col gap-2 mb-10">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-2 mb-2">Navigation</p>
                  {navItems.map((item) => (
                    <Link 
                      key={item.path} 
                      to={item.path} 
                      onClick={toggleMobileMenu}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                        location.pathname === item.path 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                          : 'bg-secondary/50 text-foreground hover:bg-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-bold">{item.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-auto space-y-4">
                {currentUser ? (
                  <>
                    <Link 
                      to="/profile" 
                      onClick={toggleMobileMenu}
                      className="flex items-center gap-3 p-4 bg-secondary/50 rounded-2xl border border-white/5 hover:border-primary transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground leading-tight">{currentUser.displayName || 'Warrior'}</p>
                        <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                      </div>
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); toggleMobileMenu(); }}
                      className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-destructive/10 text-destructive font-bold transition-all hover:bg-destructive/20"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link 
                      to="/login" 
                      onClick={toggleMobileMenu}
                      className="w-full flex items-center justify-center p-4 rounded-2xl bg-secondary font-bold text-foreground"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      onClick={toggleMobileMenu}
                      className="w-full flex items-center justify-center p-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
