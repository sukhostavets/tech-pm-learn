/**
 * Example refactored Dashboard using data layer and reusable components
 * This demonstrates the improved structure
 */

import { useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  StatsCard, 
  MilestoneCard, 
  WelcomeBanner, 
  ChoreItem, 
  LeaderboardItem 
} from '../components/dashboard';
import { dataService } from '../../lib/services/data.service';
import { useEffect, useState } from 'react';
import type { User, Milestone, DailyChore, LeaderboardEntry } from '../../lib/types';

export function DashboardRefactored() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [chores, setChores] = useState<DailyChore[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, milestonesData, choresData, leaderboardData] = await Promise.all([
          dataService.getCurrentUser(),
          dataService.getMilestones(),
          dataService.getDailyChores(),
          dataService.getLeaderboard(3),
        ]);

        setUser(userData);
        setMilestones([...milestonesData]);
        setChores([...choresData]);
        setLeaderboard([...leaderboardData]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <WelcomeBanner
        user={user}
        onContinueLearning={() => navigate('/lesson')}
        onViewQuests={() => {/* Handle view quests */}}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          icon="⭐"
          label="Experience Points"
          value={`${user.xp} XP`}
          progress={{ value: user.xp, max: user.nextLevelXp }}
        />
        
        <StatsCard
          icon="🔥"
          label="Day Streak"
          value={`${user.streak} Days`}
          subtitle="You're on fire!"
        />

        <StatsCard
          icon="🐎"
          label="Horses Collected"
          value="4 / 12"
          subtitle="Collect 'em all!"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Learning Path */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#654321]">Your Stable Stalls (Milestones)</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/map')}>
              View Full Map
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {milestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                onClick={() => milestone.status !== 'locked' && navigate('/lesson')}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card variant="stable">
            <CardHeader>
              <CardTitle>Daily Chores</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {chores.map((chore) => (
                  <ChoreItem
                    key={chore.id}
                    chore={chore}
                    onToggle={(id) => {
                      setChores(prev => prev.map(c => 
                        c.id === id ? { ...c, completed: !c.completed } : c
                      ));
                    }}
                  />
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
                {leaderboard.map((entry) => (
                  <LeaderboardItem key={entry.rank} entry={entry} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
