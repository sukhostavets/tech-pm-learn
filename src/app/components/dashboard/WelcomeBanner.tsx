/**
 * Reusable Welcome Banner Component
 */

import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';
import type { User } from '../../../lib/types';

interface WelcomeBannerProps {
  user: User;
  onContinueLearning?: () => void;
  onViewQuests?: () => void;
  className?: string;
}

export function WelcomeBanner({ 
  user, 
  onContinueLearning,
  onViewQuests,
  className 
}: WelcomeBannerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#FFB6C1] rounded-2xl p-8 text-[#654321] relative overflow-hidden shadow-lg border-2 border-[#FF69B4] ${className}`}
    >
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back to {user.stableName}, {user.name}! 🤠
        </h1>
        <p className="text-[#8B4513] mb-6 max-w-xl">
          Your horses are looking healthy! You're 75% of the way to mastering SQL. Keep up the momentum!
        </p>
        <div className="flex gap-4">
          {onContinueLearning && (
            <Button 
              onClick={onContinueLearning} 
              className="bg-[#654321] text-[#FFFDD0] hover:bg-[#8B4513]"
            >
              Continue Learning <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
          {onViewQuests && (
            <Button 
              variant="outline" 
              className="bg-transparent border-[#654321] text-[#654321] hover:bg-[#654321]/10"
              onClick={onViewQuests}
            >
              View Daily Quests
            </Button>
          )}
        </div>
      </div>
      <div className="absolute right-0 bottom-0 w-64 h-64 opacity-20 pointer-events-none">
        <img 
          src="https://images.unsplash.com/flagged/photo-1568381670226-fab8dc323343?ixlib=rb-4.1.0&q=80&w=1080" 
          className="w-full h-full object-cover rounded-tl-[100px]" 
          alt="Horse" 
        />
      </div>
    </motion.div>
  );
}
