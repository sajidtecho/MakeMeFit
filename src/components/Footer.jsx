import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  Github, 
  Twitter, 
  Instagram, 
  Mail, 
  Heart,
  TrendingUp,
  BrainCircuit,
  Sparkles
} from 'lucide-react';

const Footer = () => {
    return (
        <footer className="mt-20 border-t border-white/5 bg-background/50 backdrop-blur-xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                <Dumbbell className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter">
                                MakeMe<span className="text-primary tracking-tight">Fit</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                            The elite fitness ecosystem powered by real-time analytics and predictive machine learning. Built for the modern athlete.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Github, Twitter, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="p-2 bg-secondary/50 rounded-lg hover:bg-primary hover:text-white transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary">Ecosystem</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Dashboard', path: '/dashboard' },
                                { name: 'Workout Log', path: '/workouts' },
                                { name: 'AI Planner', path: '/ai-planner' },
                                { name: 'Progress Tracking', path: '/progress' }
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link to={link.path} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* AI Insights Section */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary text-primary">AI & Data</h4>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-black text-primary">
                                    <BrainCircuit className="w-4 h-4" />
                                    <span>ML ENGINE ACTIVE</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground font-bold">
                                    Our predictor analyzes over 3,800 metrics from Kaggle to ensure your training stays ahead of the curve.
                                </p>
                            </div>
                            <div className="flex items-center gap-4 px-2">
                                <div className="text-center">
                                    <p className="text-xs font-black">98.4%</p>
                                    <p className="text-[9px] text-muted-foreground">Accuracy</p>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="text-center">
                                    <p className="text-xs font-black">2.4ms</p>
                                    <p className="text-[9px] text-muted-foreground">Latency</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter/Action Section */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary">Stay Elite</h4>
                        <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                            Join the elite community for weekly fitness insights and AI training protocols.
                        </p>
                        <div className="relative group">
                            <input 
                                type="email" 
                                placeholder="your@email.com"
                                className="w-full pl-4 pr-12 py-3 rounded-xl bg-secondary/30 ring-1 ring-white/10 focus:ring-primary text-xs font-bold"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary rounded-lg text-white">
                                <Mail className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <p className="text-xs font-bold text-muted-foreground">
                        © {new Date().getFullYear()} MakeMeFit. All rights reserved.
                    </p>
                    <p className="text-sm font-black flex items-center gap-2 group">
                        Built with 
                        <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" /> 
                        by 
                        <span className="text-foreground group-hover:text-primary transition-colors">Sajid Ahmad</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
