import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { CheckCircle2, Lock, ArrowRight, PlayCircle } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();

  const user = {
    name: "Alex",
    stableName: "Cloud Hopper Ranch",
    level: 5,
    xp: 2450,
    nextLevelXp: 3000,
    streak: 12
  };

  const milestones = [
    { id: 1, title: "Training Arena", topic: "SDLC & DevOps", status: "completed", icon: "🏟️" },
    { id: 2, title: "Feed Storage", topic: "Data & SQL", status: "in-progress", icon: "🥕" },
    { id: 3, title: "Pasture Fields", topic: "Cloud Infra", status: "locked", icon: "☁️" },
    { id: 4, title: "Stable Complex", topic: "System Design", status: "locked", icon: "🏠" },
    { id: 5, title: "Riding Trails", topic: "APIs & Integrations", status: "locked", icon: "🛤️" },
    { id: 6, title: "Breeding Barn", topic: "Machine Learning", status: "locked", icon: "🧬" },
    { id: 7, title: "Show Arena", topic: "GenAI & LLMs", status: "locked", icon: "✨" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#FFB6C1] rounded-2xl p-8 text-[#654321] relative overflow-hidden shadow-lg border-2 border-[#FF69B4]"
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back to {user.stableName}, {user.name}! 🤠</h1>
          <p className="text-[#8B4513] mb-6 max-w-xl">
            Your horses are looking healthy! You're 75% of the way to mastering SQL. Keep up the momentum!
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/lesson')} className="bg-[#654321] text-[#FFFDD0] hover:bg-[#8B4513]">
              Continue Learning <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" className="bg-transparent border-[#654321] text-[#654321] hover:bg-[#654321]/10">
              View Daily Quests
            </Button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-64 h-64 opacity-20 pointer-events-none">
          <img src="https://images.unsplash.com/flagged/photo-1568381670226-fab8dc323343?ixlib=rb-4.1.0&q=80&w=1080" className="w-full h-full object-cover rounded-tl-[100px]" alt="Horse" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center text-2xl">
              ⭐
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#8B4513] font-bold">Experience Points</p>
              <h3 className="text-2xl font-bold text-[#654321]">{user.xp} XP</h3>
              <ProgressBar value={user.xp} max={user.nextLevelXp} showIcon={false} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF7F50]/20 rounded-full flex items-center justify-center text-2xl">
              🔥
            </div>
            <div>
              <p className="text-sm text-[#8B4513] font-bold">Day Streak</p>
              <h3 className="text-2xl font-bold text-[#654321]">{user.streak} Days</h3>
              <p className="text-xs text-[#8B4513]">You're on fire!</p>
            </div>
          </CardContent>
        </Card>

        <Card>
           <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#98FF98]/20 rounded-full flex items-center justify-center text-2xl">
              🐎
            </div>
            <div>
              <p className="text-sm text-[#8B4513] font-bold">Horses Collected</p>
              <h3 className="text-2xl font-bold text-[#654321]">4 / 12</h3>
              <p className="text-xs text-[#8B4513]">Collect 'em all!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Learning Path - Left Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#654321]">Your Stable Stalls (Milestones)</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/map')}>View Full Map</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {milestones.map((m) => (
              <motion.div 
                key={m.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => m.status !== 'locked' && navigate('/lesson')}
                className={`
                  relative p-4 rounded-xl border-2 transition-all cursor-pointer overflow-hidden
                  ${m.status === 'completed' ? 'bg-[#98FF98]/10 border-[#98FF98] hover:bg-[#98FF98]/20' : ''}
                  ${m.status === 'in-progress' ? 'bg-[#FFB6C1]/10 border-[#FF69B4] shadow-md' : ''}
                  ${m.status === 'locked' ? 'bg-gray-100 border-gray-300 opacity-70 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-3xl">{m.icon}</span>
                  {m.status === 'completed' && <CheckCircle2 className="text-[#98FF98]" />}
                  {m.status === 'locked' && <Lock className="text-gray-400" />}
                  {m.status === 'in-progress' && <PlayCircle className="text-[#FF69B4]" />}
                </div>
                <h3 className="font-bold text-[#654321]">{m.title}</h3>
                <p className="text-sm text-[#8B4513]">{m.topic}</p>
                
                {m.status === 'in-progress' && (
                  <div className="mt-3">
                    <ProgressBar value={60} max={100} showIcon={false} className="h-1.5" />
                    <p className="text-xs text-[#8B4513] mt-1 text-right">60% Complete</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Quests & Leaderboard */}
        <div className="space-y-6">
          <Card variant="stable">
            <CardHeader>
              <CardTitle>Daily Chores</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  { task: "Complete 'SQL Joins' Quiz", reward: "50 XP" },
                  { task: "Review Flashcards", reward: "20 XP" },
                  { task: "Pet your horse", reward: "10 XP" }
                ].map((chore, i) => (
                  <li key={i} className="flex items-center gap-3 p-2 hover:bg-[#FFF8DC] rounded-lg transition-colors cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-[#8B4513] flex items-center justify-center group-hover:bg-[#FF69B4] transition-colors" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#654321]">{chore.task}</p>
                      <p className="text-xs text-[#FF69B4] font-bold">+{chore.reward}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Riders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Sarah J.", xp: "12,450", rank: 1 },
                  { name: "Mike T.", xp: "11,200", rank: 2 },
                  { name: "You", xp: "2,450", rank: 145 },
                ].map((rider, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold w-4 ${rider.rank <= 3 ? 'text-[#FFD700]' : 'text-gray-400'}`}>
                        #{rider.rank}
                      </span>
                      <span className={rider.name === 'You' ? 'font-bold text-[#FF69B4]' : 'text-[#654321]'}>
                        {rider.name}
                      </span>
                    </div>
                    <span className="text-[#8B4513] font-mono">{rider.xp} XP</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
