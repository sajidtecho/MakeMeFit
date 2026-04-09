import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState(localStorage.getItem('rememberMeEmail') || '');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberMeEmail'));
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, googleLogin, currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            
            if (rememberMe) {
                localStorage.setItem('rememberMeEmail', email);
            } else {
                localStorage.removeItem('rememberMeEmail');
            }

            toast.success('Logged in successfully! 🚀');
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
            toast.error('Login failed. Check your details.');
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            await googleLogin();
            toast.success('Logged in with Google! 🚀');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            toast.error('Google login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-primary/5">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="glass p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-white/10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16" />

                    <div className="relative text-center mb-10">
                        <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
                            <LogIn className="text-white w-8 h-8" />
                        </div>
                        <h2 className="text-4xl font-extrabold tracking-tight gradient-text mb-2">Welcome Back</h2>
                        <p className="text-muted-foreground text-sm font-medium">Log in to sync your progress</p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold p-4 rounded-2xl mb-6 flex items-start gap-3"
                        >
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground ml-4">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="email" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary/30 ring-1 ring-white/10 focus:ring-2 focus:ring-primary transition-all text-foreground font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground ml-4">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-secondary/30 ring-1 ring-white/10 focus:ring-2 focus:ring-primary transition-all text-foreground font-bold"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-muted-foreground hover:bg-white/5 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-white/20 bg-secondary/30 text-primary focus:ring-primary"
                                />
                                <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
                            </label>
                            <Link to="/forgot-password" size="sm" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
                        </div>

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-lg shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8 text-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <span className="relative bg-background px-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Or continue with</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <button 
                            onClick={handleGoogleLogin}
                            className="w-full py-4 flex items-center justify-center gap-3 bg-secondary/30 hover:bg-secondary/50 rounded-2xl border border-white/5 font-bold transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                <path fill="none" d="M0 0h24v24H0z"/>
                            </svg>
                            Google
                        </button>
                    </div>

                    <p className="mt-10 text-center text-sm font-bold text-muted-foreground">
                        Don't have an account? {' '}
                        <Link to="/signup" className="text-primary hover:underline">Register Now</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
