import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { useAuth } from '../../lib/auth/authContext';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Trophy, Users } from 'lucide-react';

type AuthModal = 'login' | 'signup' | null;

export function LandingPage() {
  const navigate = useNavigate();
  const { user, loading, isConfigured, signIn, signUp } = useAuth();
  const [authModal, setAuthModal] = useState<AuthModal>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');

  const openLogin = () => {
    setAuthError(null);
    setAuthModal('login');
  };
  const openSignup = () => {
    setAuthError(null);
    setAuthModal('signup');
  };
  const closeModal = () => {
    setAuthModal(null);
    setAuthError(null);
    setLoginEmail('');
    setLoginPassword('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupName('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      await signIn(loginEmail, loginPassword);
      closeModal();
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      await signUp(signupEmail, signupPassword, signupName);
      closeModal();
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setAuthLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#FFFDD0] font-sans text-[#654321]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#D2B48C]">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#FFB6C1] rounded-full flex items-center justify-center text-2xl border-2 border-[#8B4513]">
            🐴
          </div>
          <span className="font-bold text-xl text-[#8B4513]">Tech Stable Academy</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="hover:text-[#FF69B4] font-medium transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[#FF69B4] font-medium transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-[#FF69B4] font-medium transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          {!loading && user ? (
            <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          ) : isConfigured ? (
            <>
              <Button variant="ghost" onClick={openLogin}>Login</Button>
              <Button onClick={openSignup}>Get Started</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>Login</Button>
              <Button onClick={() => navigate('/dashboard')}>Get Started</Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-[#FFC0CB]/30 pt-16 pb-32">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-20 bg-[url('https://images.unsplash.com/photo-1629752697417-29761e4c6ec4?ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center rounded-bl-[100px]" />
        
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1 bg-[#FF69B4]/20 text-[#FF69B4] rounded-full font-bold text-sm mb-6 border border-[#FF69B4]/30">
              New: Stable Management Simulation 2.0 🚀
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#654321] leading-tight mb-6">
              Build Your Tech Skills, <span className="text-[#FF69B4]">Grow Your Stable</span>
            </h1>
            <p className="text-xl text-[#8B4513] mb-8 leading-relaxed max-w-lg">
              Master Technical Product Management concepts by managing your own digital horse stable. From API "trails" to Database "feed stores".
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-lg px-8"
                onClick={() => (user ? navigate('/dashboard') : isConfigured ? openSignup() : navigate('/dashboard'))}
              >
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm text-[#8B4513]/80">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                ))}
              </div>
              <p>Joined by 2,000+ Aspiring PMs</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
             {/* Mockup / Image */}
             <div className="relative z-10 bg-white p-4 rounded-2xl shadow-2xl border-4 border-[#FFFDD0] transform rotate-2 hover:rotate-0 transition-transform duration-500">
               <img 
                 src="https://images.unsplash.com/photo-1448346325971-67fa7313079a?ixlib=rb-4.1.0&q=80&w=1080" 
                 alt="Stable Dashboard" 
                 className="rounded-xl w-full h-auto object-cover aspect-video"
               />
               <div className="absolute -bottom-6 -right-6 bg-[#FFFDD0] p-4 rounded-xl shadow-lg border border-[#D2B48C] flex items-center gap-3">
                 <div className="bg-[#FF69B4] text-white p-2 rounded-lg">
                   <Trophy size={24} />
                 </div>
                 <div>
                   <p className="text-xs text-[#8B4513]">Achievement Unlocked</p>
                   <p className="font-bold text-[#654321]">API Whisperer</p>
                 </div>
               </div>
             </div>
             
             {/* Decorative blobs */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#FFB6C1]/30 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#654321] mb-4">Why Learn at the Stable?</h2>
            <p className="text-[#8B4513] max-w-2xl mx-auto">
              We translate complex technical concepts into intuitive stable management metaphors, making learning natural and memorable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: BookOpen, 
                title: "Story-Based Learning", 
                desc: "Forget dry textbooks. Learn SQL by managing feed inventory and APIs by planning trail routes." 
              },
              { 
                icon: Trophy, 
                title: "Gamified Progress", 
                desc: "Earn horses, badges, and expand your stable as you master new technical domains." 
              },
              { 
                icon: Users, 
                title: "Community Rides", 
                desc: "Join cohort-based challenges and compete in friendly stable shows to test your knowledge." 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-[#FFFDD0] p-8 rounded-2xl border border-[#D2B48C] shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-[#FFB6C1] rounded-xl flex items-center justify-center text-[#654321] mb-6">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#654321] mb-3">{feature.title}</h3>
                <p className="text-[#8B4513] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#654321] text-[#FFFDD0] relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to Saddle Up?</h2>
          <p className="text-xl text-[#D2B48C] mb-8 max-w-2xl mx-auto">
            Join thousands of product managers building their technical confidence one stall at a time.
          </p>
          <Button
            size="lg"
            className="bg-[#FF69B4] text-[#654321] hover:bg-[#ff85c1] text-lg px-10 py-6 h-auto"
            onClick={() => (user ? navigate('/dashboard') : isConfigured ? openSignup() : navigate('/dashboard'))}
          >
            Create Your Free Stable
          </Button>
          <p className="mt-4 text-sm text-[#D2B48C]">No credit card required • Cancel anytime</p>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
      </section>

      <footer className="bg-[#4E342E] text-[#D2B48C] py-12 border-t border-[#8B4513]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🐴</div>
            <span className="font-bold text-xl text-[#FFFDD0]">Tech Stable Academy</span>
          </div>
          <div className="text-sm">
            © 2024 Tech Stable Academy. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#FF69B4]">Terms</a>
            <a href="#" className="hover:text-[#FF69B4]">Privacy</a>
            <a href="#" className="hover:text-[#FF69B4]">Contact</a>
          </div>
        </div>
      </footer>

      {/* Login modal */}
      <Dialog open={authModal === 'login'} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="bg-[#FFFDD0] border-[#D2B48C] text-[#654321]">
          <DialogHeader>
            <DialogTitle className="text-[#8B4513]">Log in to your stable</DialogTitle>
            <DialogDescription className="text-[#8B4513]/80">
              Enter your email and password to continue.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="grid gap-4">
            {authError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {authError}
              </p>
            )}
            <div className="grid gap-2">
              <label htmlFor="login-email" className="text-sm font-medium text-[#8B4513]">
                Email
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="border-[#D2B48C] bg-white"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="login-password" className="text-sm font-medium text-[#8B4513]">
                Password
              </label>
              <Input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="border-[#D2B48C] bg-white"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={authLoading}>
                {authLoading ? 'Signing in…' : 'Log in'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sign up modal */}
      <Dialog open={authModal === 'signup'} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="bg-[#FFFDD0] border-[#D2B48C] text-[#654321]">
          <DialogHeader>
            <DialogTitle className="text-[#8B4513]">Create your stable</DialogTitle>
            <DialogDescription className="text-[#8B4513]/80">
              Sign up with email to start learning.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignup} className="grid gap-4">
            {authError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {authError}
              </p>
            )}
            <div className="grid gap-2">
              <label htmlFor="signup-name" className="text-sm font-medium text-[#8B4513]">
                Display name
              </label>
              <Input
                id="signup-name"
                type="text"
                placeholder="Stable Keeper"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="border-[#D2B48C] bg-white"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="signup-email" className="text-sm font-medium text-[#8B4513]">
                Email
              </label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                className="border-[#D2B48C] bg-white"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="signup-password" className="text-sm font-medium text-[#8B4513]">
                Password
              </label>
              <Input
                id="signup-password"
                type="password"
                placeholder="At least 6 characters"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                minLength={6}
                className="border-[#D2B48C] bg-white"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={authLoading}>
                {authLoading ? 'Creating account…' : 'Sign up'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
