import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  StatsCard,
  MilestoneCard,
  WelcomeBanner,
  ChoreItem,
  LeaderboardItem,
} from '../components/dashboard';
import { dataService } from '../../lib/services/data.service';
import type { User, Milestone, DailyChore, LeaderboardEntry } from '../../lib/types';

export function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [chores, setChores] = useState<DailyChore[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [horsesCount, setHorsesCount] = useState<{ collected: number; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const [userData, milestonesData, choresData, leaderboardData, horses] = await Promise.all([
        dataService.getCurrentUser(),
        dataService.getMilestones(),
        dataService.getDailyChores(),
        dataService.getLeaderboard(10),
        dataService.getHorsesCount(),
      ]);
      setUser(userData);
      setMilestones([...milestonesData]);
      setChores([...choresData]);
      setLeaderboard([...leaderboardData]);
      setHorsesCount(horses);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard');
      console.error('Dashboard load error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChoreToggle = useCallback(
    async (choreId: string) => {
      try {
        await dataService.completeChore(choreId);
        setChores((prev) =>
          prev.map((c) =>
            c.id === choreId ? { ...c, completed: !c.completed } : c
          )
        );
      } catch (e) {
        console.error('Complete chore failed:', e);
      }
    },
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-[#8B4513] font-medium">Loading your stable…</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <p className="text-red-600">{error ?? 'Something went wrong'}</p>
        <Button onClick={loadData}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div data-tour="welcome-banner">
        <WelcomeBanner
          user={user}
          milestones={milestones}
          onContinueLearning={() => navigate('/lesson/1')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-tour="stats">
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
          value={horsesCount ? `${horsesCount.collected}/${horsesCount.total}` : '—'}
          subtitle="Collect 'em all!"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#654321]">
              Your Stable Stalls (Milestones)
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/map')}>
              View Full Map
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-tour="milestone-card">
            {milestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                onClick={() =>
                  milestone.status !== 'locked' && navigate(`/lesson/${milestone.id}`)
                }
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card variant="stable" data-tour="chores">
            <CardHeader>
              <CardTitle>Daily Chores</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {chores.map((chore) => {
                  const isHangmanChore = chore.task.toLowerCase().includes('hangman');
                  return (
                    <ChoreItem
                      key={chore.id}
                      chore={chore}
                      onToggle={
                        chore.completed || isHangmanChore ? undefined : handleChoreToggle
                      }
                      onNavigate={
                        isHangmanChore ? () => navigate('/game/hangman') : undefined
                      }
                    />
                  );
                })}
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
                  <LeaderboardItem
                    key={`${entry.rank}-${entry.name}`}
                    entry={entry}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
