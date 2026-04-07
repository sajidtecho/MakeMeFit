import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Dumbbell,
  Activity, 
  Flame, 
  Calendar, 
  ChevronRight, 
  Plus, 
  Target,
  Trophy
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
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [stats, setStats] = useState({
    calories: 1250,
    activeMinutes: 45,
    streak: 5,
    goalPercent: 75
  });

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'workouts'), 
      where('userId', '==', currentUser.uid),
      orderBy('date', 'desc'),
      limit(3)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const workoutsData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setRecentWorkouts(workoutsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const chartData = [
    { day: 'Mon', calories: 450 },
    { day: 'Tue', calories: 600 },
    { day: 'Wed', calories: 300 },
    { day: 'Thu', calories: 800 },
    { day: 'Fri', calories: 500 },
    { day: 'Sat', calories: 900 },
    { day: 'Sun', calories: 650 },
  ];

  const StatCard = ({ icon: Icon, label, value, unit, color }) => (
    <div className="glass p-6 rounded-3xl card-hover relative overflow-hidden">
        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 ${color}`} />
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-2xl ${color.replace('bg-', 'bg-opacity-20 ')}`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-bold">{value}</h3>
            <span className="text-muted-foreground font-medium">{unit}</span>
        </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                    Hey, <span className="gradient-text">{currentUser.displayName?.split(' ')[0] || 'Warrior'}!</span> 👋
                </h1>
                <p className="text-muted-foreground">You're on fire! Keep pushing towards your goals.</p>
            </div>
            <Link 
                to="/workouts" 
                className="flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-all text-center justify-center"
            >
                <Plus className="w-5 h-5" />
                Track New Workout
            </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Flame} label="Calories" value={stats.calories} unit="kcal" color="bg-orange-500" />
            <StatCard icon={Activity} label="Active" value={stats.activeMinutes} unit="min" color="bg-primary" />
            <StatCard icon={Trophy} label="Streak" value={stats.streak} unit="days" color="bg-yellow-500" />
            <StatCard icon={Target} label="Goal" value={stats.goalPercent} unit="%" color="bg-green-500" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 glass p-8 rounded-3xl relative">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold">Activity Overview</h2>
                        <p className="text-muted-foreground text-sm">Weekly calorie breakdown</p>
                    </div>
                    <div className="px-4 py-2 bg-secondary rounded-xl text-xs font-bold uppercase tracking-widest">Weekly</div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis 
                                dataKey="day" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                            />
                            <YAxis hide />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'black', 
                                    border: 'none', 
                                    borderRadius: '16px',
                                    color: 'white',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                }} 
                            />
                            <Area 
                                type="monotone" 
                                dataKey="calories" 
                                stroke="hsl(var(--primary))" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorCal)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section>

            <section className="glass p-8 rounded-3xl flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Recent Activity</h2>
                    <Link to="/workouts" className="text-primary text-sm font-bold hover:underline">View All</Link>
                </div>
                <div className="space-y-6 flex-1">
                    {recentWorkouts.length > 0 ? recentWorkouts.map((workout) => (
                        <div key={workout.id} className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-2xl transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Dumbbell className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{workout.exercise}</h4>
                                    <p className="text-xs text-muted-foreground">{new Date(workout.date?.seconds * 1000).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm">{workout.duration} min</p>
                                <p className="text-xs text-primary font-bold">{workout.calories} kcal</p>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-10">
                            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                                <Calendar className="text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-sm font-medium">No workouts yet.<br/>Start your journey today!</p>
                        </div>
                    )}
                </div>
                <button className="mt-8 w-full py-4 bg-secondary hover:bg-secondary/80 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                    Daily Progress <ChevronRight className="w-4 h-4" />
                </button>
            </section>
        </div>
    </div>
  );
};

export default Dashboard;
