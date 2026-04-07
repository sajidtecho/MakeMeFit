import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { motion } from 'framer-motion';
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

const Profile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    displayName: currentUser?.displayName || '',
    weight: '',
    height: '',
    age: '',
    goalCalories: '2000',
    goalWorkouts: '4',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile({ ...profile, ...docSnap.data() });
        } else {
          // Initialize user document if it doesn't exist
          await setDoc(docRef, {
            email: currentUser.email,
            displayName: currentUser.displayName || '',
            createdAt: new Date(),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      
      // Update Firebase Auth profile if displayName changed
      if (profile.displayName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: profile.displayName });
      }

      // Convert numeric fields from string to number before saving to Firestore
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
      toast.success('Profile synced with Firebase! 🔥');
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error('Sync failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-10">
      <section className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-3xl bg-secondary flex items-center justify-center border-2 border-white/10 relative shadow-2xl shadow-primary/20 pr-2">
            <UserIcon className="w-10 h-10 text-primary" />
            <div className="absolute -bottom-2 -right-2 p-2 bg-primary rounded-xl text-white shadow-lg">
                <Settings className="w-4 h-4" />
            </div>
        </div>
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-1">Your <span className="gradient-text">Profile</span></h1>
          <p className="text-muted-foreground font-medium">{currentUser.email}</p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details */}
        <div className="space-y-6 glass p-8 rounded-3xl border-white/5">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <UserIcon className="w-5 h-5 text-primary" />
                Personal Details
            </h2>
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground ml-2">Display Name</label>
                    <input 
                        name="displayName"
                        value={profile.displayName}
                        onChange={handleChange}
                        className="w-full p-4 rounded-2xl bg-secondary/50" 
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
                            className="w-full p-4 pl-12 rounded-2xl bg-secondary/50" 
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
                            className="w-full p-4 pl-12 rounded-2xl bg-secondary/50" 
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
                          className="w-full p-4 pl-12 rounded-2xl bg-secondary/50" 
                          placeholder="25"
                      />
                    </div>
                </div>
            </div>
        </div>

        {/* Goals */}
        <div className="space-y-6 glass p-8 rounded-3xl border-white/5">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                Fitness Goals
            </h2>
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground ml-2">Daily Calorie Goal</label>
                    <div className="relative">
                      <Flame className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input 
                          name="goalCalories"
                          type="number"
                          value={profile.goalCalories}
                          onChange={handleChange}
                          className="w-full p-4 pl-12 rounded-2xl bg-secondary/50" 
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
                          className="w-full p-4 pl-12 rounded-2xl bg-secondary/50" 
                          placeholder="4"
                      />
                    </div>
                </div>
            </div>

            <div className="mt-10 p-6 bg-primary/10 rounded-2xl border border-primary/20">
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
                className="px-8 py-4 rounded-2xl bg-secondary text-foreground font-bold hover:bg-secondary/80 transition-all"
            >
                Cancel
            </button>
            <button 
                type="submit"
                disabled={saving}
                className="px-8 py-4 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 shadow-lg shadow-primary/30 hover:scale-105 disabled:opacity-50 transition-all"
            >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Profile
            </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
