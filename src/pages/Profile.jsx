import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  User as UserIcon, 
  Settings, 
  Weight, 
  Ruler, 
  Calendar, 
  Target, 
  Save, 
  Loader2, 
  Flame, 
  Dumbbell 
} from 'lucide-react';

const ProfileSkeleton = () => (
  <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-10 animate-pulse">
    <div className="flex items-center gap-6">
      <div className="w-24 h-24 rounded-3xl bg-secondary/50" />
      <div className="space-y-2">
        <div className="h-10 w-48 bg-secondary/50 rounded-xl" />
        <div className="h-5 w-32 bg-secondary/30 rounded-lg" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[1, 2].map(i => (
        <div key={i} className="h-[400px] glass rounded-3xl border-white/5 bg-secondary/10" />
      ))}
    </div>
  </div>
);

const Profile = () => {
  const { currentUser, userData } = useAuth();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    displayName: '',
    weight: '',
    height: '',
    age: '',
    goalCalories: '2000',
    goalWorkouts: '4',
  });

  // Sync profile state with userData from context
  useEffect(() => {
    if (userData) {
      setProfile({
        displayName: userData.displayName || currentUser?.displayName || '',
        weight: userData.weight || '',
        height: userData.height || '',
        age: userData.age || '',
        goalCalories: userData.goalCalories || '2000',
        goalWorkouts: userData.goalWorkouts || '4',
      });
    }
  }, [userData, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading('Syncing with cloud...');
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      
      if (profile.displayName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: profile.displayName });
      }

      const cleanProfile = {
        ...profile,
        weight: profile.weight ? parseFloat(profile.weight) : '',
        height: profile.height ? parseFloat(profile.height) : '',
        age: profile.age ? parseInt(profile.age) : '',
        goalCalories: profile.goalCalories ? parseInt(profile.goalCalories) : 2000,
        goalWorkouts: profile.goalWorkouts ? parseInt(profile.goalWorkouts) : 4,
        lastUpdated: serverTimestamp(),
      };

      await setDoc(docRef, cleanProfile, { merge: true });
      toast.success('Profile updated successfully! 🔥', { id: toastId });
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error('Failed to update profile.', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  if (!userData) return <ProfileSkeleton />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-10 max-w-4xl mx-auto space-y-10"
    >
      <header className="flex items-center gap-6">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-24 h-24 rounded-3xl bg-secondary flex items-center justify-center border-2 border-white/10 relative shadow-2xl shadow-primary/20"
        >
            <UserIcon className="w-10 h-10 text-primary" />
            <div className="absolute -bottom-2 -right-2 p-2 bg-primary rounded-xl text-white shadow-lg">
                <Settings className="w-4 h-4" />
            </div>
        </motion.div>
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-1">Your <span className="gradient-text">Profile</span></h1>
          <p className="text-muted-foreground font-medium">{currentUser.email}</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details */}
        <div className="space-y-6 glass p-8 rounded-3xl border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <UserIcon size={80} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 relative z-10">
                <UserIcon className="w-5 h-5 text-primary" />
                Personal Details
            </h2>
            <div className="grid grid-cols-1 gap-6 relative z-10">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground ml-2">Display Name</label>
                    <input 
                        name="displayName"
                        value={profile.displayName}
                        onChange={handleChange}
                        className="w-full p-4 rounded-2xl bg-secondary/50 border border-white/5 focus:border-primary/50 outline-none transition-all" 
                        placeholder="Warrior Name"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground ml-2">Weight (kg)</label>
                      <div className="relative">
                        <Weight className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <input 
                            name="weight"
                            type="number"
                            value={profile.weight}
                            onChange={handleChange}
                            className="w-full p-4 pl-12 rounded-2xl bg-secondary/50 border border-white/5 focus:border-primary/50 outline-none transition-all" 
                            placeholder="70"
                        />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground ml-2">Height (cm)</label>
                      <div className="relative">
                        <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <input 
                            name="height"
                            type="number"
                            value={profile.height}
                            onChange={handleChange}
                            className="w-full p-4 pl-12 rounded-2xl bg-secondary/50 border border-white/5 focus:border-primary/50 outline-none transition-all" 
                            placeholder="175"
                        />
                      </div>
                  </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground ml-2">Age</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input 
                          name="age"
                          type="number"
                          value={profile.age}
                          onChange={handleChange}
                          className="w-full p-4 pl-12 rounded-2xl bg-secondary/50 border border-white/5 focus:border-primary/50 outline-none transition-all" 
                          placeholder="25"
                      />
                    </div>
                </div>
            </div>
        </div>

        {/* Goals */}
        <div className="space-y-6 glass p-8 rounded-3xl border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target size={80} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 relative z-10">
                <Target className="w-5 h-5 text-primary" />
                Fitness Goals
            </h2>
            <div className="grid grid-cols-1 gap-6 relative z-10">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground ml-2">Daily Calorie Goal</label>
                    <div className="relative">
                      <Flame className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input 
                          name="goalCalories"
                          type="number"
                          value={profile.goalCalories}
                          onChange={handleChange}
                          className="w-full p-4 pl-12 rounded-2xl bg-secondary/50 border border-white/5 focus:border-primary/50 outline-none transition-all" 
                          placeholder="2000"
                      />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground ml-2">Workouts Per Week</label>
                    <div className="relative">
                      <Dumbbell className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input 
                          name="goalWorkouts"
                          type="number"
                          value={profile.goalWorkouts}
                          onChange={handleChange}
                          className="w-full p-4 pl-12 rounded-2xl bg-secondary/50 border border-white/5 focus:border-primary/50 outline-none transition-all" 
                          placeholder="4"
                      />
                    </div>
                </div>
            </div>

            <div className="mt-10 p-6 bg-primary/10 rounded-2xl border border-primary/20 relative z-10">
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Tip</p>
                <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                  Setting realistic goals is the key to consistency. Start small and level up!
                </p>
            </div>
        </div>

        <div className="md:col-span-2 flex justify-end gap-4">
            <button 
                type="button"
                onClick={() => window.history.back()}
                className="px-8 py-4 rounded-2xl bg-secondary text-foreground font-bold hover:bg-secondary/80 transition-all active:scale-95"
            >
                Cancel
            </button>
            <button 
                type="submit"
                disabled={saving}
                className="px-8 py-4 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50 transition-all font-outfit"
            >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
            </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Profile;
