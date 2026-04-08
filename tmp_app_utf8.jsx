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
import Footer from './components/Footer'
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
          <Footer />
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
