import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  TrendingUp, 
  Dumbbell, 
  Calendar, 
  Clock, 
  Flame, 
  Trash2, 
  X,
  Target,
  ArrowRight
} from 'lucide-react';

const ActivitySVG = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

const Workouts = () => {
    const { currentUser } = useAuth();
    const [workouts, setWorkouts] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    
    const [newWorkout, setNewWorkout] = useState({
        exercise: '',
        sets: '',
        reps: '',
        duration: '',
        calories: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (!currentUser) return;

        // Fetch User Profile for AI Prediction
        const fetchProfile = async () => {
            const docRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProfile(docSnap.data());
            }
        };
        fetchProfile();

        const q = query(
            collection(db, 'workouts'), 
            where('userId', '==', currentUser.uid),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const workoutsData = querySnapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            }));
            setWorkouts(workoutsData);
        }, (err) => {
            console.error("Error fetching workouts", err);
            toast.error("Failed to load workouts.");
        });

        return () => unsubscribe();
    }, [currentUser]);

    const predictCalories = () => {
        if (!newWorkout.duration) {
            toast.error("Enter duration first!");
            return;
        }

        // ML Model Coefficients (Trained on Kaggle Dataset)
        // Coeffs: [Weight, Duration, HeartRate, BMI]
        // [0.0776, 0.2153, -0.1797, 0.3114]
        // Intercept: 304.148
        
        const weight = parseFloat(profile?.weight) || 70;
        const height = parseFloat(profile?.height) || 175;
        const bmi = parseFloat(profile?.height) ? (weight / Math.pow(height / 100, 2)) : 22;
        const duration = parseFloat(newWorkout.duration);
        const heartRate = 140; // Default context-aware heart rate
        
        // Equation: Intercept + (W * c1) + (D * c2) + (HR * c3) + (BMI * c4)
        const prediction = 304.148 + (weight * 0.077639) + (duration * 0.21534) + (heartRate * -0.17975) + (bmi * 0.31143);
        
        setNewWorkout(prev => ({ ...prev, calories: Math.round(prediction).toString() }));
        toast.success("AI prediction applied! ✨");
    };

    const handleAddWorkout = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await addDoc(collection(db, 'workouts'), {
                ...newWorkout,
                userId: currentUser.uid,
                createdAt: serverTimestamp(),
                date: new Date(newWorkout.date)
            });
            setIsAdding(false);
            setNewWorkout({
                exercise: '',
                sets: '',
                reps: '',
                duration: '',
                calories: '',
                date: new Date().toISOString().split('T')[0]
            });
            toast.success('Workout recorded! Keep it up! 💪');
        } catch (err) {
            console.error("Error adding workout", err);
            toast.error('Failed to save workout.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this workout?")) return;
        try {
            await deleteDoc(doc(db, 'workouts', id));
            toast.success('Workout deleted.');
        } catch (err) {
            console.error("Error deleting workout", err);
            toast.error('Failed to delete workout.');
        }
    };

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 animate-fade-in relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-2">Workout <span className="gradient-text">History</span></h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <ActivitySVG className="w-4 h-4 text-primary" />
                        {workouts.length} recorded sessions
                    </p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-8 py-5 bg-primary text-white rounded-3xl font-bold shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus className="w-6 h-6" />
                    Record Workout
                </button>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {workouts.map((workout) => (
                        <motion.div 
                            key={workout.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass p-8 rounded-[2rem] card-hover group"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        <Dumbbell className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{workout.exercise}</h3>
                                        <p className="text-muted-foreground text-sm font-medium">{workout.date?.seconds ? new Date(workout.date.seconds * 1000).toLocaleDateString() : workout.date}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDelete(workout.id)}
                                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-secondary/40 p-4 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-1 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                                        <Target className="w-3 h-3" /> Reps/Sets
                                    </div>
                                    <p className="text-lg font-bold">{workout.sets} x {workout.reps}</p>
                                </div>
                                <div className="bg-secondary/40 p-4 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-1 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                                        <Clock className="w-3 h-3" /> Time spent
                                    </div>
                                    <p className="text-lg font-bold">{workout.duration} min</p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <span className="text-sm font-bold text-primary flex items-center gap-2">
                                    <Flame className="w-4 h-4" /> Energy burned
                                </span>
                                <span className="text-2xl font-black gradient-text">{workout.calories} <span className="text-sm font-bold opacity-70">kcal</span></span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </section>

            {workouts.length === 0 && (
                <div className="text-center py-24 glass rounded-[3rem] border-dashed">
                    <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                        <Dumbbell className="w-10 h-10 text-muted-foreground opacity-30" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No workout history found</h2>
                    <p className="text-muted-foreground mb-8">Begin your fitness journey by recording your first session above.</p>
                </div>
            )}

            {/* Add Workout Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-card w-full max-w-xl p-10 rounded-[3rem] shadow-2xl relative border border-white/10"
                        >
                            <button 
                                onClick={() => setIsAdding(false)}
                                className="absolute top-8 right-8 p-3 hover:bg-secondary rounded-2xl transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-3xl font-black mb-10 gradient-text uppercase tracking-tight">Log Muscle <br/>Activity</h2>

                            <form onSubmit={handleAddWorkout} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground ml-4 absolute -top-2 bg-card px-2">Exercise Name</label>
                                        <input 
                                            required 
                                            value={newWorkout.exercise}
                                            onChange={(e) => setNewWorkout({...newWorkout, exercise: e.target.value})}
                                            className="w-full h-16 px-6 pt-2 rounded-2xl text-lg font-bold"
                                            placeholder="e.g. Bench Press"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <label className="text-[10px] font-black uppercase text-muted-foreground ml-4 absolute -top-2 bg-card px-2">Total Sets</label>
                                            <input 
                                                required type="number"
                                                value={newWorkout.sets}
                                                onChange={(e) => setNewWorkout({...newWorkout, sets: e.target.value})}
                                                className="w-full h-16 px-6 pt-2 rounded-2xl text-lg font-bold"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <label className="text-[10px] font-black uppercase text-muted-foreground ml-4 absolute -top-2 bg-card px-2">Reps/Set</label>
                                            <input 
                                                required type="number"
                                                value={newWorkout.reps}
                                                onChange={(e) => setNewWorkout({...newWorkout, reps: e.target.value})}
                                                className="w-full h-16 px-6 pt-2 rounded-2xl text-lg font-bold"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <label className="text-[10px] font-black uppercase text-muted-foreground ml-4 absolute -top-2 bg-card px-2">Duration (min)</label>
                                            <input 
                                                required type="number"
                                                value={newWorkout.duration}
                                                onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})}
                                                className="w-full h-16 px-6 pt-2 rounded-2xl text-lg font-bold"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <label className="text-[10px] font-black uppercase text-muted-foreground ml-4 absolute -top-2 bg-card px-2">Burn (kcal)</label>
                                            <input 
                                                required type="number"
                                                value={newWorkout.calories}
                                                onChange={(e) => setNewWorkout({...newWorkout, calories: e.target.value})}
                                                className="w-full h-16 px-6 pt-2 rounded-2xl text-lg font-bold"
                                                placeholder="0"
                                            />
                                            <button 
                                                type="button"
                                                onClick={predictCalories}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                                                title="Predict with AI"
                                            >
                                                <TrendingUp className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground ml-4 absolute -top-2 bg-card px-2">Session Date</label>
                                        <input 
                                            required type="date"
                                            value={newWorkout.date}
                                            onChange={(e) => setNewWorkout({...newWorkout, date: e.target.value})}
                                            className="w-full h-16 px-6 pt-2 rounded-2xl text-lg font-bold font-sans"
                                        />
                                    </div>
                                </div>

                                <button 
                                    disabled={loading}
                                    type="submit" 
                                    className="w-full h-20 bg-primary text-white rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all mt-10"
                                >
                                    {loading ? "Recording..." : <>Save Session <ArrowRight className="w-6 h-6" /></>}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};


export default Workouts;
