import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { dataService } from '../../lib/services/data.service';
import { theme } from '../../lib/theme';
import type { Lesson, Milestone } from '../../lib/types';

const markdownStyles = {
  color: theme.colors.brown,
  lineHeight: 1.7,
};

export function LessonView() {
  const navigate = useNavigate();
  const { milestoneId, lessonId } = useParams<{ milestoneId: string; lessonId: string }>();
  const mid = milestoneId ? parseInt(milestoneId, 10) : NaN;
  const lid = lessonId ? parseInt(lessonId, 10) : NaN;

  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (Number.isNaN(mid) || Number.isNaN(lid)) {
      setLoading(false);
      setError('Invalid milestone or lesson');
      return;
    }
    let cancelled = false;
    Promise.all([
      dataService.getMilestoneById(mid),
      dataService.getLessonById(lid),
      dataService.getLessons(mid),
    ])
      .then(([m, l, list]) => {
        if (!cancelled) {
          setMilestone(m ?? null);
          setLesson(l ?? null);
          setLessons([...list]);
          if (m) dataService.setMilestoneInProgress(mid).catch((e) => console.error('setMilestoneInProgress', e));
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [mid, lid]);

  const handleCompleteLesson = () => {
    if (!lesson) return;
    setCompleting(true);
    dataService
      .completeLesson(lesson.id)
      .then(() => navigate(`/quiz?milestoneId=${mid}&lessonId=${lesson.id}&type=lesson_check`))
      .catch((e) => {
        console.error('completeLesson', e);
        setCompleting(false);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="font-medium" style={{ color: theme.colors.brown }}>
          Loading lesson…
        </p>
      </div>
    );
  }
  if (error || !lesson || !milestone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <p className="text-red-600">{error ?? 'Lesson not found'}</p>
        <Button onClick={() => navigate(mid ? `/lesson/${mid}` : '/dashboard')}>Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/lesson/${mid}`)}>
            <ChevronLeft /> Back
          </Button>
          <div>
            <h2 className="font-bold text-lg" style={{ color: theme.colors.brownDark }}>
              {lesson.title}
            </h2>
            {lesson.subtitle && (
              <p className="text-sm mt-0.5 opacity-90" style={{ color: theme.colors.brown }}>
                {lesson.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {lessons.length > 0 && (
          <div className="w-64 hidden lg:block overflow-y-auto pr-2">
            <div className="space-y-2">
              {lessons.map((l) => (
                <button
                  key={l.id}
                  onClick={() => navigate(`/lesson/${mid}/${l.id}`)}
                  className={`w-full text-left p-3 rounded-lg text-sm flex items-center justify-between transition-colors ${
                    l.id === lesson.id
                      ? 'bg-[#FF69B4] text-[#654321] font-bold shadow-md'
                      : 'hover:bg-[#FFFDD0] text-[#8B4513]'
                  }`}
                >
                  <span className="truncate">{l.title}</span>
                  {l.completed && <Check size={16} className="text-[#98FF98] shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        <Card className="flex-1 overflow-hidden flex flex-col relative bg-white">
          <CardContent className="flex-1 overflow-y-auto p-8 md:p-12">
            <div className="max-w-3xl mx-auto prose prose-lg" style={markdownStyles}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold mt-8 mb-4 first:mt-0" style={{ color: theme.colors.brownDark }}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold mt-6 mb-3" style={{ color: theme.colors.brownDark }}>
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4" style={{ color: theme.colors.brown }}>
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-4 space-y-1" style={{ color: theme.colors.brown }}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-4 space-y-1" style={{ color: theme.colors.brown }}>
                      {children}
                    </ol>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold" style={{ color: theme.colors.brownDark }}>
                      {children}
                    </strong>
                  ),
                  code: ({ className, children, ...props }) => {
                    const isBlock = className?.includes('language-');
                    if (isBlock) {
                      return (
                        <pre
                          className="my-4 p-4 rounded-lg overflow-x-auto border-2 text-sm font-mono"
                          style={{ backgroundColor: '#2a2a2a', color: '#98FF98', borderColor: theme.colors.tan }}
                        >
                          <code {...props}>{children}</code>
                        </pre>
                      );
                    }
                    return (
                      <code
                        className="px-1.5 py-0.5 rounded font-mono text-sm"
                        style={{ backgroundColor: theme.colors.creamBg, color: theme.colors.brownDark, borderColor: theme.colors.tan }}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {lesson.contentMarkdown}
              </ReactMarkdown>
            </div>
          </CardContent>

          <div className="p-6 border-t bg-[#FFFDD0] flex justify-end" style={{ borderColor: theme.colors.tan }}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleCompleteLesson}
              disabled={completing}
            >
              Complete Lesson & Take Quiz <ChevronRight className="ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
