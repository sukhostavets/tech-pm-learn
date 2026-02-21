import { cn } from './utils';
import { motion } from 'motion/react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showIcon?: boolean;
  className?: string;
  color?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  label, 
  showIcon = true,
  className,
  color = '#FF69B4'
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold text-[#654321]">{label}</span>
          <span className="text-xs text-[#8B4513]">{value}/{max} XP</span>
        </div>
      )}
      <div className="relative h-6 bg-[#FFFDD0] rounded-full border-2 border-[#8B4513] overflow-visible">
        <motion.div 
          className="h-full rounded-l-full relative"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
           {showIcon && percentage > 0 && (
            <motion.div 
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10"
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.5 }}
            >
              <span className="text-xl filter drop-shadow-md">🐎</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
