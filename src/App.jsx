import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Workouts from './pages/Workouts'
import Progress from './pages/Progress'
import Profile from './pages/Profile'
import AIPlanner from './pages/AIPlanner'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { useEffect } from 'react'
import { Dumbbell } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'glass !bg-background !text-foreground !border-white/10 !rounded-2xl !font-bold',
              duration: 4000,
            }} 
          />
          <Navbar />
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/login" element={
                  <PageTransition>
                    <Login />
                  </PageTransition>
                } />
                <Route path="/signup" element={
                  <PageTransition>
                    <Signup />
                  </PageTransition>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Dashboard />
                    </PageTransition>
                  </ProtectedRoute>
                } />
                <Route path="/workouts" element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Workouts />
                    </PageTransition>
                  </ProtectedRoute>
                } />
                <Route path="/progress" element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Progress />
                    </PageTransition>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Profile />
                    </PageTransition>
                  </ProtectedRoute>
                } />
                <Route path="/ai-planner" element={
                  <ProtectedRoute>
                    <PageTransition>
                      <AIPlanner />
                    </PageTransition>
                  </ProtectedRoute>
                } />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </AnimatePresence>
          </main>
          
          <footer className="py-12 border-t border-white/5 bg-secondary/20">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary p-2 rounded-xl">
                    <Dumbbell className="text-white w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold tracking-tight gradient-text">MakeMeFit</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium max-w-[300px]">
                  The world’s most advanced personal fitness tracking ecosystem. Built for elites, accessible to all.
                </p>
              </div>
              
              <div className="flex items-center gap-10 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                <a href="#" className="hover:text-primary transition-colors">Contact</a>
              </div>
              
              <p className="text-xs font-medium text-muted-foreground opacity-40">
                © 2026 MakeMeFit. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

export default App
