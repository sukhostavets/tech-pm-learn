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
import { LoadingView } from '../components/ui/LoadingView';
import { ErrorView } from '../components/ui/ErrorView';
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

  if (loading) {
    return <LoadingView message="Loading your stable…" />;
  }

  if (error || !user) {
    return (
      <ErrorView
        message={error ?? 'Something went wrong'}
        onRetry={loadData}
        retryLabel="Try again"
      />
    );
  }

  return (
    <div className="space-y-8">
      <div data-tour="welcome-banner">
        <WelcomeBanner
          user={user}
          milestones={milestones}
          onContinueLearning={() => {
            const inProgress = milestones.find((m) => m.status === 'in-progress');
            const next = milestones.find((m) => m.status === 'locked');
            if (inProgress) navigate(`/lesson/${inProgress.id}`);
            else if (next) navigate(`/lesson/${next.id}`);
            else navigate('/dashboard');
          }}
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
                {chores
                  .filter((chore) => chore.task.toLowerCase().includes('hangman'))
                  .map((chore) => (
                    <ChoreItem
                      key={chore.id}
                      chore={chore}
                      onNavigate={() => navigate('/game/hangman')}
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
