import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingView } from '../components/ui/LoadingView';
import { ErrorView } from '../components/ui/ErrorView';
import { ChevronLeft, Check, BookOpen, ExternalLink } from 'lucide-react';
import { dataService } from '../../lib/services/data.service';
import { theme } from '../../lib/theme';
import type { Milestone, Lesson, Resource } from '../../lib/types';

export function MilestoneDetail() {
  const navigate = useNavigate();
  const { milestoneId } = useParams<{ milestoneId: string }>();
  const id = milestoneId ? parseInt(milestoneId, 10) : NaN;

  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setLoading(false);
      setError('Invalid milestone');
      return;
    }
    let cancelled = false;
    Promise.all([
      dataService.getMilestoneById(id),
      dataService.getLessons(id),
      dataService.getResources(id),
    ])
      .then(([m, l, r]) => {
        if (!cancelled) {
          setMilestone(m ?? null);
          setLessons([...l]);
          setResources([...r]);
          if (m) dataService.setMilestoneInProgress(id).catch((e) => console.error('setMilestoneInProgress', e));
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  const completedCount = lessons.filter((l) => l.completed).length;
  const allLessonsDone = lessons.length > 0 && completedCount === lessons.length;
  const firstIncomplete = lessons.find((l) => !l.completed);

  if (loading) {
    return <LoadingView message="Loading milestone…" />;
  }
  if (error || !milestone) {
    return (
      <ErrorView
        message={error ?? 'Milestone not found'}
        onRetry={() => navigate('/dashboard')}
        retryLabel="Back to Dashboard"
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ChevronLeft /> Back
        </Button>
      </div>

      <div className="flex items-start gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0 border-2"
          style={{ borderColor: theme.colors.tan, backgroundColor: theme.colors.creamBg }}
        >
          {milestone.icon}
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: theme.colors.brownDark }}>
            {milestone.title}
          </h1>
          <p className="text-sm" style={{ color: theme.colors.brown }}>
            {milestone.topic}
          </p>
          {milestone.description && (
            <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.colors.brown }}>
              {milestone.description}
            </p>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lessons</CardTitle>
          {milestone.totalLessons != null && (
            <p className="text-sm mt-1" style={{ color: theme.colors.brown }}>
              {completedCount} / {milestone.totalLessons} completed
            </p>
          )}
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {lessons.map((lesson) => (
              <li
                key={lesson.id}
                className="flex items-center gap-3 p-3 rounded-lg border transition-colors"
                style={{
                  borderColor: theme.colors.tan,
                  backgroundColor: lesson.completed ? `${theme.colors.creamBg}` : 'transparent',
                }}
              >
                {lesson.completed ? (
                  <Check size={20} className="text-green-600 shrink-0" />
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 shrink-0" style={{ borderColor: theme.colors.tan }} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium" style={{ color: theme.colors.brownDark }}>
                    {lesson.title}
                  </p>
                  {lesson.estimatedMinutes > 0 && (
                    <p className="text-xs" style={{ color: theme.colors.brown }}>
                      ~{lesson.estimatedMinutes} min
                    </p>
                  )}
                </div>
                {!lesson.completed && (
                  <Button
                    size="sm"
                    onClick={() => navigate(`/lesson/${id}/${lesson.id}`)}
                  >
                    Start
                  </Button>
                )}
                {lesson.completed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/lesson/${id}/${lesson.id}`)}
                  >
                    Review
                  </Button>
                )}
              </li>
            ))}
          </ul>
          {lessons.length === 0 && (
            <p className="text-sm" style={{ color: theme.colors.brown }}>
              No lessons yet. Check back later.
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => {
                const target = firstIncomplete ?? lessons[0];
                if (target) navigate(`/lesson/${id}/${target.id}`);
              }}
              disabled={lessons.length === 0}
            >
              {firstIncomplete ? 'Continue Learning' : lessons.length > 0 ? 'Review First Lesson' : 'No Lessons'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(`/quiz?milestoneId=${id}&type=milestone_test`)}
              disabled={!allLessonsDone}
            >
              Take Milestone Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={20} /> Recommended Reading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {resources.map((r) => (
                <li key={r.id}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 group text-sm"
                    style={{ color: theme.colors.brownDark }}
                  >
                    <ExternalLink size={16} className="shrink-0 mt-0.5 opacity-70 group-hover:opacity-100" />
                    <span>
                      <span className="font-medium group-hover:underline">{r.title}</span>
                      {r.description && (
                        <span className="block text-xs mt-0.5" style={{ color: theme.colors.brown }}>
                          {r.description}
                        </span>
                      )}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
