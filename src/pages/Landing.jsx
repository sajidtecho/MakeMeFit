import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Dumbbell, 
  Users, 
  Target, 
  Zap, 
  ChevronRight, 
  Star, 
  CheckCircle2,
  TrendingUp,
  Award
} from 'lucide-react';

const Landing = () => {
  const { currentUser } = useAuth();

  const benefits = [
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Personalized Workout Plans",
      description: "Tailored routines designed for your unique body type, goals, and fitness level."
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: "Expert Guidance",
      description: "Access curated knowledge and AI-driven insights to optimize every repetition."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Elite Community Support",
      description: "Join a league of dedicated warriors who push each other to break limits every single day."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Advanced Progress Tracking",
      description: "Visualize your transformation with deep analytics and milestone markers."
    }
  ];

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Elite Member",
      text: "MakeMeFit transformed my lifestyle. The personalized plans are unlike anything I've tried before. I've lost 15kg and gained pure confidence.",
      rating: 5
    },
    {
      name: "Sarah Chen",
      role: "Fitness Enthusiast",
      text: "The community here is electric. Knowing I have people pushing me makes every early morning workout worth it.",
      rating: 5
    },
    {
      name: "Marcus Thorne",
      role: "Powerlifter",
      text: "The tracking tools are incredibly detailed. I can see exactly where I'm gaining strength and where I need to focus.",
      rating: 5
    }
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105"
          style={{ 
            backgroundImage: `url('C:/Users/Shakil Ahmad/.gemini/antigravity/brain/f21e6a36-d955-40ef-9900-6b5fc50deef3/hero_gym_premium_1775650227545.png')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary font-bold text-sm tracking-widest uppercase mb-6 border border-primary/30">
              Join the Elite
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
              EVOLVE YOUR <br />
              <span className="gradient-text">POTENTIAL</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 font-medium">
              Join the MakeMeFit Elite Community and experience a transformation that goes beyond the mirror.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to={currentUser ? "/dashboard" : "/signup"}
                className="group px-8 py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/40 hover:scale-105 transition-all flex items-center gap-2"
              >
                {currentUser ? "Go to Dashboard" : "Start Your Journey"}
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              {!currentUser && (
                <Link 
                  to="/login"
                  className="px-8 py-5 bg-white/5 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-10 inline-flex p-4 rounded-3xl bg-secondary/50 border border-white/5"
            >
              <Zap className="w-10 h-10 text-primary animate-pulse" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              UNLEASH THE <span className="text-primary italic">WARRIOR</span> WITHIN
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              Our mission is to build more than just bodies; we build character, discipline, and an elite community where every member is empowered to achieve the impossible. At MakeMeFit, your goals are our blueprints for excellence.
            </p>
          </div>
        </div>
        {/* Abstract background elements */}
        <div className="absolute top-1/2 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-background/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Elite Benefits</h2>
            <p className="text-muted-foreground font-medium">Precision-engineered tools for your physical evolution.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-8 rounded-[2rem] card-hover flex flex-col items-center text-center"
              >
                <div className="p-4 rounded-2xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Success Stories</h2>
            <p className="text-muted-foreground font-medium">Real results from our elite members.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="glass p-8 rounded-3xl relative"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-lg italic mb-8 relative z-10 text-foreground/90">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group shadow-2xl shadow-primary/20"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Dumbbell size={150} className="text-white" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-8">
                READY TO BECOME <br />
                <span className="gradient-text">UNSTOPPABLE?</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
                Don't wait for motivation. Discipline starts today. Join 10,000+ members already crushing their goals.
              </p>
              <Link 
                to={currentUser ? "/dashboard" : "/signup"}
                className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl shadow-primary/40 active:scale-95"
              >
                {currentUser ? "Go to Dashboard" : "Join the Community"}
                <CheckCircle2 className="w-6 h-6" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
