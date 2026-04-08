import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Award, 
  Shield, 
  User, 
  ChevronRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const Progress = () => {
    const { currentUser, userData } = useAuth();
    const [isUpdating, setIsUpdating] = React.useState(false);

    const plans = [
        {
            title: "Beginner Strength",
            desc: "Master the fundamentals of movement and build a solid base.",
            duration: "4 Weeks",
            intensity: "Low",
            exercises: 12,
            icon: Shield
        },
        {
            title: "Muscle Hypertrophy",
            desc: "Optimized for maximum muscle growth and body composition.",
            duration: "8 Weeks",
            intensity: "Medium",
            exercises: 24,
            icon: Zap
        },
        {
            title: "Elite Athletics",
            desc: "High-intensity training for peak performance and power.",
            duration: "12 Weeks",
            intensity: "High",
            exercises: 36,
            icon: Award
        }
    ];

    const handleSelectPlan = async (plan) => {
        if (!currentUser) return;
        try {
            setIsUpdating(true);
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
                activePlan: plan.title
            });
            toast.success(`${plan.title} activated! 🚀`);
        } catch (err) {
            console.error("Error updating plan", err);
            toast.error("Failed to activate plan.");
        } finally {
            setIsUpdating(false);
        }
    };

    const weightData = [
        { month: 'Jan', weight: 80 },
        { month: 'Feb', weight: 79 },
        { month: 'Mar', weight: 78.5 },
        { month: 'Apr', weight: 77.2 },
        { month: 'May', weight: 76.8 },
        { month: 'Jun', weight: 75.5 },
    ];

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
            <header>
                <h1 className="text-4xl lg:text-5xl font-bold mb-2">Performance <span className="gradient-text">Analysis</span></h1>
                <p className="text-muted-foreground font-medium">Track your evolution and master your fitness journey.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass p-10 rounded-[3rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Body Weight Evolution</h2>
                            <p className="text-sm text-muted-foreground">Monthly weight loss tracking (kg)</p>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weightData}>
                                <defs>
                                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'black', 
                                        border: 'none', 
                                        borderRadius: '16px',
                                        color: 'white',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                                    }} 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="weight" 
                                    stroke="hsl(var(--primary))" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorWeight)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass p-10 rounded-[3rem] flex flex-col items-center justify-center text-center relative overflow-hidden bg-primary/5 border-primary/20">
                    <Sparkles className="w-16 h-16 text-primary mb-6 animate-pulse" />
                    <h2 className="text-2xl font-black mb-4">You're in the<br/><span className="text-4xl gradient-text uppercase tracking-tighter">Elite Top 5%</span></h2>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[200px]">Compared to users in your age group and fitness level.</p>
                    <div className="mt-10 w-full space-y-4">
                        <div className="bg-secondary p-4 rounded-3xl flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Consistency</span>
                            <span className="text-lg font-black text-primary">94%</span>
                        </div>
                        <div className="bg-secondary p-4 rounded-3xl flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Calories Burned</span>
                            <span className="text-lg font-black text-primary">12.5k</span>
                        </div>
                    </div>
                </div>
            </div>

            <section className="space-y-8">
                <header className="flex items-center justify-between px-4">
                    <h2 className="text-3xl font-black">Predefined Plans</h2>
                    <button className="text-primary font-bold text-sm hover:underline">View All Programs</button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => {
                        const isActive = userData?.activePlan === plan.title;
                        return (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => handleSelectPlan(plan)}
                                className={`glass p-8 rounded-[3rem] card-hover relative group cursor-pointer border-2 transition-all duration-500 scale-100 active:scale-95 ${
                                    isActive ? 'border-primary ring-4 ring-primary/20' : 'border-white/5'
                                }`}
                            >
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all duration-500 ${
                                    isActive ? 'bg-primary text-white scale-110' : 'bg-secondary group-hover:bg-primary group-hover:text-white'
                                }`}>
                                    <plan.icon className="w-8 h-8" />
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold">{plan.title}</h3>
                                    {isActive && (
                                        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                            <CheckCircle2 className="w-3 h-3" /> Active
                                        </span>
                                    )}
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-10">{plan.desc}</p>
                                
                                <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-8">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-tighter">Duration</p>
                                        <p className="text-xs font-bold">{plan.duration}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-tighter">Intensity</p>
                                        <p className={`text-xs font-bold ${isActive ? 'text-primary' : ''}`}>{plan.intensity}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-tighter">Exercises</p>
                                        <p className="text-xs font-bold">{plan.exercises}</p>
                                    </div>
                                </div>
                                
                                <div className={`absolute bottom-8 right-8 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                                        isActive ? 'bg-green-500 shadow-green-500/40' : 'bg-primary shadow-primary/40'
                                    }`}>
                                        <ChevronRight className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Progress;
