import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingView } from '../components/ui/LoadingView';
import { ErrorView } from '../components/ui/ErrorView';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import { dataService } from '../../lib/services/data.service';
import { useQuiz } from '../../hooks/useQuiz';
import type { Question, Milestone } from '../../lib/types';
import { theme } from '../../lib/theme';

type QuizMode = 'lesson_check' | 'milestone_test' | null;

export function QuizPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const milestoneIdParam = searchParams.get('milestoneId');
  const lessonIdParam = searchParams.get('lessonId');
  const typeParam = searchParams.get('type');
  const milestoneId = milestoneIdParam ? parseInt(milestoneIdParam, 10) : null;
  const lessonId = lessonIdParam ? parseInt(lessonIdParam, 10) : null;
  const quizMode: QuizMode =
    typeParam === 'lesson_check' || typeParam === 'milestone_test' ? typeParam : null;

  const [questions, setQuestions] = useState<readonly Question[]>([]);
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recorded, setRecorded] = useState(false);

  const {
    currentQuestion: q,
    currentQuestionIndex,
    selectedOption,
    isAnswered,
    showResult,
    progress,
    result,
    totalQuestions,
    selectOption,
    checkAnswer,
    nextQuestion,
  } = useQuiz({ questions });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        if (quizMode === 'lesson_check' && lessonId != null && milestoneId != null) {
          const [qs, m] = await Promise.all([
            dataService.getQuestions(undefined, undefined, 'lesson_check', lessonId),
            dataService.getMilestoneById(milestoneId),
          ]);
          if (!cancelled) {
            setQuestions(qs);
            setMilestone(m ?? null);
          }
        } else if (quizMode === 'milestone_test' && milestoneId != null) {
          const [qs, m] = await Promise.all([
            dataService.getQuestions(undefined, milestoneId, 'milestone_test'),
            dataService.getMilestoneById(milestoneId),
          ]);
          if (!cancelled) {
            setQuestions(qs);
            setMilestone(m ?? null);
          }
        } else if (milestoneId != null && !Number.isNaN(milestoneId)) {
          const [qs, m] = await Promise.all([
            dataService.getQuestions(undefined, milestoneId),
            dataService.getMilestoneById(milestoneId),
          ]);
          if (!cancelled) {
            setQuestions(qs);
            setMilestone(m ?? null);
          }
        } else {
          const qs = await dataService.getQuestions('database');
          if (!cancelled) setQuestions(qs);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load quiz');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [milestoneId, lessonId, quizMode]);

  useEffect(() => {
    if (!result || recorded || totalQuestions === 0) return;
    const topic = milestone?.topic ?? 'general';
    dataService
      .recordQuizAttempt({
        milestoneId: quizMode === 'milestone_test' ? milestoneId ?? undefined : undefined,
        topic,
        score: result.score,
        totalQuestions: result.totalQuestions,
        passed: result.passed,
        xpEarned: result.passed ? 50 : 0,
      })
      .then(() => setRecorded(true))
      .catch((e) => console.error('recordQuizAttempt', e));
  }, [result, recorded, totalQuestions, milestoneId, milestone?.topic, quizMode]);

  if (loading) {
    return <LoadingView message="Loading quiz…" />;
  }
  if (error || !questions.length) {
    return (
      <ErrorView
        message={error ?? 'No questions available'}
        onRetry={() => navigate('/dashboard')}
        retryLabel="Back to Dashboard"
      />
    );
  }

  const handleLessonCheckContinue = async () => {
    if (milestoneId == null || lessonId == null) {
      navigate('/dashboard');
      return;
    }
    const lessons = await dataService.getLessons(milestoneId);
    const idx = lessons.findIndex((l) => l.id === lessonId);
    const nextLesson = idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : null;
    if (nextLesson) {
      navigate(`/lesson/${milestoneId}/${nextLesson.id}`);
    } else {
      navigate(`/quiz?milestoneId=${milestoneId}&type=milestone_test`);
    }
  };

  if (showResult && result) {
    const isLessonCheck = quizMode === 'lesson_check';
    const isMilestoneTest = quizMode === 'milestone_test';

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
        {result.passed && <Confetti recycle={false} numberOfPieces={500} />}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl border-4 max-w-lg w-full"
          style={{ borderColor: theme.colors.pink }}
        >
          <div className="text-6xl mb-4">{result.passed ? '🏆' : '🐴'}</div>
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: theme.colors.brownDark }}
          >
            {isLessonCheck
              ? (result.passed ? 'Lesson Check Passed!' : 'Review and Try Again')
              : result.passed
                ? 'Stellar Performance!'
                : 'Keep Practicing!'}
          </h2>
          <p className="mb-6" style={{ color: theme.colors.brown }}>
            You scored {result.score} out of {result.totalQuestions}.
            {isLessonCheck
              ? (result.passed ? ' Continue to the next lesson or take the milestone test.' : ' Review the lesson and try the quiz again.')
              : result.passed
                ? " You've unlocked a new horse for your stable!"
                : ' Review the lesson and try again to unlock your reward.'}
          </p>
          {result.passed && isMilestoneTest && (
            <div
              className="mb-8 p-4 rounded-xl border"
              style={{
                backgroundColor: theme.colors.cream,
                borderColor: theme.colors.tan,
              }}
            >
              <p
                className="text-sm font-bold mb-2"
                style={{ color: theme.colors.brown }}
              >
                Unlocked Reward:
              </p>
              <div className="flex items-center gap-4 justify-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style={{ backgroundColor: theme.colors.pinkLight }}
                >
                  🦄
                </div>
                <div className="text-left">
                  <p
                    className="font-bold"
                    style={{ color: theme.colors.brownDark }}
                  >
                    Data Draft Horse
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: theme.colors.brown }}
                  >
                    Strong and reliable with heavy loads.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-4 justify-center">
            {isLessonCheck && (
              <>
                <Button
                  variant="outline"
                  onClick={() => lessonId != null && milestoneId != null && navigate(`/lesson/${milestoneId}/${lessonId}`)}
                >
                  Review Lesson
                </Button>
                {result.passed && (
                  <Button onClick={handleLessonCheckContinue}>
                    Continue
                  </Button>
                )}
              </>
            )}
            {isMilestoneTest && (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate(milestoneId != null ? `/lesson/${milestoneId}` : '/dashboard')}
                >
                  Review Lessons
                </Button>
                <Button onClick={() => navigate('/dashboard')}>Return to Stable</Button>
              </>
            )}
            {!isLessonCheck && !isMilestoneTest && (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate(milestoneId != null ? `/lesson/${milestoneId}` : '/lesson/1')}
                >
                  Review Lesson
                </Button>
                <Button onClick={() => navigate('/dashboard')}>Return to Stable</Button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8 flex items-center justify-between">
        <h2
          className="text-2xl font-bold"
          style={{ color: theme.colors.brownDark }}
        >
          {quizMode === 'lesson_check' ? 'Lesson Check' : quizMode === 'milestone_test' ? 'Milestone Test' : 'Quiz'}
          {milestone ? `: ${milestone.title}` : ': Database Basics'}
        </h2>
        <span
          className="font-mono"
          style={{ color: theme.colors.brown }}
        >
          Question {currentQuestionIndex + 1}/{totalQuestions}
        </span>
      </div>
      <div className="relative mb-8 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            backgroundColor: theme.colors.pink,
          }}
        />
      </div>
      <Card className="min-h-[400px] flex flex-col justify-between p-6 md:p-10">
        <div>
          <h3
            className="text-xl font-medium mb-8 leading-relaxed"
            style={{ color: theme.colors.brownDark }}
          >
            {q.question}
          </h3>
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let stateStyles = 'hover:bg-[#FFF8DC] border-[#D2B48C] bg-white';
              if (isAnswered) {
                if (idx === q.correct)
                  stateStyles =
                    'bg-[#98FF98]/20 border-[#98FF98] text-green-800 font-bold';
                else if (idx === selectedOption)
                  stateStyles = 'bg-red-100 border-red-300 text-red-800';
                else stateStyles = 'opacity-50 border-gray-200';
              } else if (selectedOption === idx) {
                stateStyles =
                  'bg-[#FFB6C1] border-[#FF69B4] font-bold text-[#654321]';
              }
              return (
                <button
                  key={idx}
                  onClick={() => selectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${stateStyles}`}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === q.correct && (
                    <CheckCircle2 className="text-green-600" />
                  )}
                  {isAnswered &&
                    idx === selectedOption &&
                    idx !== q.correct && (
                      <XCircle className="text-red-500" />
                    )}
                </button>
              );
            })}
          </div>
        </div>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl border flex gap-3 items-start"
            style={{
              backgroundColor: theme.colors.cream,
              borderColor: theme.colors.tan,
            }}
          >
            <div className="mt-1">
              <AlertCircle size={20} style={{ color: theme.colors.pink }} />
            </div>
            <div>
              <p
                className="font-bold text-sm mb-1"
                style={{ color: theme.colors.brownDark }}
              >
                Explanation:
              </p>
              <p className="text-sm" style={{ color: theme.colors.brown }}>
                {q.explanation}
              </p>
            </div>
          </motion.div>
        )}
        <div className="mt-8 flex justify-end">
          {!isAnswered ? (
            <Button
              onClick={checkAnswer}
              disabled={selectedOption === null}
              size="lg"
            >
              Check Answer
            </Button>
          ) : (
            <Button onClick={nextQuestion} size="lg">
              {currentQuestionIndex < totalQuestions - 1
                ? 'Next Question'
                : 'Finish Quiz'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
