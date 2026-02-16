/**
 * Reusable Milestone Card Component
 */

import { motion } from 'motion/react';
import { CheckCircle2, Lock, PlayCircle } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import type { Milestone } from '../../../lib/types';

interface MilestoneCardProps {
  milestone: Milestone;
  onClick?: () => void;
  showProgress?: boolean;
}

export function MilestoneCard({ 
  milestone, 
  onClick,
  showProgress = true 
}: MilestoneCardProps) {
  const isLocked = milestone.status === 'locked';
  const isCompleted = milestone.status === 'completed';
  const isInProgress = milestone.status === 'in-progress';

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      onClick={isLocked ? undefined : onClick}
      className={`
        relative p-4 rounded-xl border-2 transition-all overflow-hidden
        ${isCompleted ? 'bg-[#98FF98]/10 border-[#98FF98] hover:bg-[#98FF98]/20' : ''}
        ${isInProgress ? 'bg-[#FFB6C1]/10 border-[#FF69B4] shadow-md' : ''}
        ${isLocked ? 'bg-gray-100 border-gray-300 opacity-70 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-3xl">{milestone.icon}</span>
        {isCompleted && <CheckCircle2 className="text-[#98FF98]" />}
        {isLocked && <Lock className="text-gray-400" />}
        {isInProgress && <PlayCircle className="text-[#FF69B4]" />}
      </div>
      <h3 className="font-bold text-[#654321]">{milestone.title}</h3>
      <p className="text-sm text-[#8B4513]">{milestone.topic}</p>
      
      {isInProgress && showProgress && milestone.progress !== undefined && (
        <div className="mt-3">
          <ProgressBar value={milestone.progress} max={100} showIcon={false} className="h-1.5" />
          <p className="text-xs text-[#8B4513] mt-1 text-right">{milestone.progress}% Complete</p>
        </div>
      )}
    </motion.div>
  );
}
