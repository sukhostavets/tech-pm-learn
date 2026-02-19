import { useState, useLayoutEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../../../lib/services/data.service';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const MASCOT_IMAGE_URL =
  import.meta.env.VITE_MASCOT_IMAGE_URL ||
  (supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/public-assets/bit_farmer.png` : '');

export interface TourStep {
  id: string;
  target: string | null;
  title: string;
  body: string;
  route?: string | null;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    target: null,
    title: 'Welcome to Tech Stable!',
    body: "I'm Bit — your guide. I'll show you around your stable in a few quick steps.",
  },
  {
    id: 'sidebar',
    target: '[data-tour="sidebar"]',
    title: 'Navigation',
    body: 'Use this sidebar to jump to Stable Hub, Milestone Map, Achievements, or your Profile anytime.',
  },
  {
    id: 'welcome-banner',
    target: '[data-tour="welcome-banner"]',
    title: 'Your progress',
    body: "Here you'll see your progress and quick actions to continue learning.",
  },
  {
    id: 'stats',
    target: '[data-tour="stats"]',
    title: 'Stats at a glance',
    body: 'Your XP, streak, and horses collected live here. Keep learning to level up!',
  },
  {
    id: 'chores',
    target: '[data-tour="chores"]',
    title: 'Daily Chores',
    body: 'Complete daily chores for extra XP. Check them off as you go!',
  },
  {
    id: 'milestone-card',
    target: '[data-tour="milestone-card"]',
    title: 'Your learning path',
    body: 'Each milestone is a step on your path. Click one to start or continue lessons.',
  },
  {
    id: 'done',
    target: null,
    title: "You're all set!",
    body: 'Explore the stable, complete lessons, and grow your skills. Have fun!',
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;
  if (!step) return null;

  const measureTarget = useCallback(() => {
    if (!step?.target) {
      setSpotlightRect(null);
      return;
    }
    const el = document.querySelector(step.target);
    if (el) {
      setSpotlightRect(el.getBoundingClientRect());
    } else {
      setSpotlightRect(null);
    }
  }, [step.target]);

  useLayoutEffect(() => {
    measureTarget();
    window.addEventListener('resize', measureTarget);
    return () => window.removeEventListener('resize', measureTarget);
  }, [measureTarget]);

  const handleNext = useCallback(() => {
    if (isLast) {
      dataService.setTutorialCompleted().then(onComplete);
      return;
    }
    const nextStep = TOUR_STEPS[stepIndex + 1];
    if (nextStep?.route) {
      navigate(nextStep.route);
    }
    setStepIndex((i) => i + 1);
  }, [isLast, stepIndex, navigate, onComplete]);

  const handleSkip = useCallback(() => {
    dataService.setTutorialCompleted().then(onComplete);
  }, [onComplete]);

  const padding = 4;
  const hasSpotlight = spotlightRect != null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto" aria-modal="true" role="dialog" aria-label="Onboarding tour">
      {/* Dimmed overlay with cutout: four panels so the highlighted area stays clear */}
      {hasSpotlight ? (
        <>
          <div className="absolute left-0 top-0 right-0 bg-black/70" style={{ height: spotlightRect.top - padding }} />
          <div className="absolute left-0 bg-black/50" style={{ top: spotlightRect.top - padding, width: spotlightRect.left - padding, height: spotlightRect.height + padding * 2 }} />
          <div className="absolute right-0 bg-black/50" style={{ top: spotlightRect.top - padding, left: spotlightRect.right + padding, height: spotlightRect.height + padding * 2 }} />
          <div className="absolute left-0 right-0 bottom-0 bg-black/50" style={{ top: spotlightRect.bottom + padding }} />
          <div
            className="absolute pointer-events-none border-2 border-[#FF69B4] rounded-lg shadow-[0_0_0_4px_rgba(255,105,180,0.4)] transition-[top,left,width,height] duration-200"
            style={{
              top: spotlightRect.top - padding,
              left: spotlightRect.left - padding,
              width: spotlightRect.width + padding * 2,
              height: spotlightRect.height + padding * 2,
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-black/50" />
      )}

      {/* Single mascot (left) + speech bubble */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-4 p-4 md:p-6 pb-8 md:pb-10">
        <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#FFB6C1] border-4 border-[#8B4513] flex items-center justify-center overflow-hidden shadow-lg">
          {MASCOT_IMAGE_URL ? (
            <img
              src={MASCOT_IMAGE_URL}
              alt="Bit the horse"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.parentElement?.querySelector('.mascot-emoji');
                if (fallback) fallback.classList.remove('hidden');
              }}
            />
          ) : null}
          <span className={`mascot-emoji text-4xl sm:text-5xl md:text-6xl ${MASCOT_IMAGE_URL ? 'hidden' : ''}`}>🐴</span>
        </div>
        <div className="flex-1 max-w-xl bg-[#FFFDD0] border-4 border-[#8B4513] rounded-2xl shadow-xl p-4 md:p-5">
          <h3 className="font-bold text-lg text-[#654321] mb-1">{step.title}</h3>
          <p className="text-[#654321] text-sm md:text-base mb-4">{step.body}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-[#FF69B4] text-[#654321] font-bold hover:bg-[#FF7FBF] transition-colors"
            >
              {isLast ? 'Finish' : 'Next'}
            </button>
            {!isLast && (
              <button
                type="button"
                onClick={handleSkip}
                className="px-4 py-2 rounded-xl text-[#654321] hover:bg-[#D2B48C]/30 transition-colors"
              >
                Skip tutorial
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
