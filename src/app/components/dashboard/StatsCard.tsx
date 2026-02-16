/**
 * Reusable Stats Card Component
 * Used in Dashboard and potentially other pages
 */

import { Card, CardContent } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface StatsCardProps {
  icon: string | React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  progress?: {
    value: number;
    max: number;
  };
  className?: string;
}

export function StatsCard({ 
  icon, 
  label, 
  value, 
  subtitle, 
  progress,
  className 
}: StatsCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center text-2xl">
          {typeof icon === 'string' ? <span>{icon}</span> : icon}
        </div>
        <div className={progress ? "flex-1" : ""}>
          <p className="text-sm text-[#8B4513] font-bold">{label}</p>
          <h3 className="text-2xl font-bold text-[#654321]">{value}</h3>
          {subtitle && (
            <p className="text-xs text-[#8B4513]">{subtitle}</p>
          )}
          {progress && (
            <ProgressBar 
              value={progress.value} 
              max={progress.max} 
              showIcon={false} 
              className="h-2 mt-2" 
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
