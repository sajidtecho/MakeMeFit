import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Weight, 
  Clock, 
  Activity, 
  Zap, 
  Flame, 
  Info,
  ChevronRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AIPlanner = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        weight: '70',
        duration: '30',
        heartRate: '140',
        bmi: '22'
    });
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const w = data.weight || '70';
                    const h = data.height || '175';
                    const bmi = data.height ? (parseFloat(w) / Math.pow(parseFloat(h) / 100, 2)).toFixed(1) : '22';
                    setStats({
                        weight: w.toString(),
                        duration: '30',
                        heartRate: '140',
                        bmi: bmi.toString()
                    });
                }
            } catch (err) {
                console.error("Error fetching profile", err);
            } finally {
                setLoading(false);
            }
        };
        if (currentUser) fetchProfile();
    }, [currentUser]);

    const handlePredict = () => {
        // ML Model Coefficients (Trained on Kaggle Dataset)
        // [Weight, Duration, HeartRate, BMI]
        // [0.0776, 0.2153, -0.1797, 0.3114]
        // Intercept: 304.148
        
        const w = parseFloat(stats.weight);
        const d = parseFloat(stats.duration);
        const hr = parseFloat(stats.heartRate);
        const b = parseFloat(stats.bmi);

        if (isNaN(w) || isNaN(d) || isNaN(hr) || isNaN(b)) {
            toast.error("Please fill all metrics correctly.");
            return;
        }

        const result = 304.148 + (w * 0.077639) + (d * 0.21534) + (hr * -0.17975) + (b * 0.31143);
        setPrediction(Math.max(0, Math.round(result)));
        toast.success("AI Prediction Generated! ✨");
    };

    return (
        <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-10">
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold mb-2 tracking-tight">
                        AI <span className="gradient-text">Predictor</span> 🤖
                    </h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4 text-primary" />
                        Powered by Kaggle's Exercise & Fitness Metrics Dataset
                    </p>
                </div>
                <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase text-primary">Model: Linear Regression v1.0</span>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                        
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            Input Your Metrics
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-muted-foreground ml-2">Weight (kg)</label>
                                <div className="relative">
                                    <Weight className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                    <input 
                                        type="number"
                                        value={stats.weight}
                                        onChange={(e) => setStats({...stats, weight: e.target.value})}
                                        className="w-full p-5 pl-14 rounded-2xl bg-secondary/30 ring-1 ring-white/10 focus:ring-primary text-xl font-bold transition-all"
                                        placeholder="70"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-muted-foreground ml-2">Duration (min)</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                    <input 
                                        type="number"
                                        value={stats.duration}
                                        onChange={(e) => setStats({...stats, duration: e.target.value})}
                                        className="w-full p-5 pl-14 rounded-2xl bg-secondary/30 ring-1 ring-white/10 focus:ring-primary text-xl font-bold transition-all"
                                        placeholder="30"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-muted-foreground ml-2">Avg Heart Rate (bpm)</label>
                                <div className="relative">
                                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                    <input 
                                        type="number"
                                        value={stats.heartRate}
                                        onChange={(e) => setStats({...stats, heartRate: e.target.value})}
                                        className="w-full p-5 pl-14 rounded-2xl bg-secondary/30 ring-1 ring-white/10 focus:ring-primary text-xl font-bold transition-all"
                                        placeholder="140"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-muted-foreground ml-2">Current BMI</label>
                                <div className="relative">
                                    <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                    <input 
                                        type="number"
                                        value={stats.bmi}
                                        onChange={(e) => setStats({...stats, bmi: e.target.value})}
                                        className="w-full p-5 pl-14 rounded-2xl bg-secondary/30 ring-1 ring-white/10 focus:ring-primary text-xl font-bold transition-all"
                                        placeholder="22"
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handlePredict}
                            className="mt-10 w-full p-6 bg-primary text-white rounded-3xl font-black text-xl shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            <Sparkles className="w-6 h-6" />
                            Run AI Analysis
                        </button>
                    </div>

                    <div className="p-6 bg-secondary/20 rounded-3xl border border-white/5 flex items-start gap-4">
                        <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                            <p className="text-sm font-bold mb-1">Scientific Methodology</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Our algorithm utilizes a multivariate linear regression model. While it provides accurate estimates based on dataset patterns, individual metabolism and specific exercise efficiency may cause real-world variations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Result */}
                <div className="space-y-8">
                    <div className="glass p-8 rounded-[2.5rem] border-white/10 h-full flex flex-col justify-center text-center relative overflow-hidden min-h-[400px]">
                        {prediction !== null ? (
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Flame className="w-10 h-10 text-primary animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-sm font-black uppercase text-muted-foreground tracking-widest mb-1">Estimated Burn</p>
                                    <h3 className="text-7xl font-black text-foreground">{prediction}</h3>
                                    <p className="text-2xl font-bold text-primary">Calories</p>
                                </div>
                                <div className="pt-8 grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-2xl">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Intensity</p>
                                        <p className="text-sm font-bold">{prediction > 300 ? 'High' : (prediction > 150 ? 'Moderate' : 'Low')}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Efficiency</p>
                                        <p className="text-sm font-bold">Optimal</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="space-y-6 opacity-40">
                                <Sparkles className="w-20 h-20 text-muted-foreground mx-auto" />
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Ready to Calculate</h3>
                                    <p className="text-sm font-medium">Input your latest metrics to see <br/>your personalized AI analysis.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIPlanner;
