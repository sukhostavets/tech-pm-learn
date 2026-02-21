import { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Lock, Star } from 'lucide-react';
import { dataService } from '../../lib/services/data.service';
import { DEFAULT_AVATAR_URL, MAP_IMAGE_URL } from '../../lib/assets';
import type { Milestone, User } from '../../lib/types';

export function MilestoneMap() {
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([dataService.getMilestones(), dataService.getCurrentUser()])
      .then(([data, user]) => {
        if (!cancelled) {
          setMilestones([...data]);
          setProfile(user);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load map');
          console.error('MilestoneMap load error:', e);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const avatarPosition = useMemo(() => {
    const offsetLeft = 2;
    const offsetDown = 3;
    let x: number, y: number;
    const inProgress = milestones.find((m) => m.status === 'in-progress');
    if (inProgress != null) {
      x = inProgress.mapX ?? 50;
      y = inProgress.mapY ?? 50;
    } else {
      const completed = [...milestones].filter((m) => m.status === 'completed').pop();
      if (completed != null) {
        x = completed.mapX ?? 50;
        y = completed.mapY ?? 50;
      } else {
        const first = milestones[0];
        x = first?.mapX ?? 50;
        y = first?.mapY ?? 50;
      }
    }
    return { x: x - offsetLeft, y: y + offsetDown };
  }, [milestones]);

  const avatarUrl = profile?.avatarUrl || DEFAULT_AVATAR_URL;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p className="text-[#8B4513] font-medium">Loading map…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[80vh] bg-[#FFFDD0] rounded-3xl overflow-hidden border-4 border-[#8B4513] shadow-2xl">
      {MAP_IMAGE_URL ? (
        <div className="absolute inset-0 bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url(${MAP_IMAGE_URL})` }} />
      ) : (
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
      )}

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path
          d="M 10% 80% Q 20% 70% 30% 60% T 20% 30% T 50% 15% T 75% 30% T 65% 65% T 90% 85%"
          fill="none"
          stroke="#D2B48C"
          strokeWidth="12"
          strokeDasharray="20,10"
          strokeLinecap="round"
        />
        <motion.path
          d="M 10% 80% Q 20% 70% 30% 60%"
          fill="none"
          stroke="#FF69B4"
          strokeWidth="12"
          strokeDasharray="20,10"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5 }}
        />
      </svg>

      {milestones.map((m, i) => {
        const x = m.mapX ?? 50;
        const y = m.mapY ?? 50;
        return (
          <motion.div
            key={m.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => m.status !== 'locked' && navigate(`/lesson/${m.id}`)}
          >
            <div
              className={`
            w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 transition-transform group-hover:scale-110 relative z-10
            ${m.status === 'completed' ? 'bg-[#98FF98] border-[#8B4513]' : ''}
            ${m.status === 'in-progress' ? 'bg-[#FF69B4] border-[#8B4513] animate-pulse' : ''}
            ${m.status === 'locked' ? 'bg-gray-300 border-gray-400' : ''}
          `}
            >
              {m.status === 'locked' ? (
                <Lock size={24} className="text-gray-500" />
              ) : (
                <span>{m.icon}</span>
              )}
              {m.status === 'completed' && (
                <div className="absolute -top-2 -right-2 bg-[#FFD700] p-1 rounded-full border border-white">
                  <Star size={12} fill="white" className="text-white" />
                </div>
              )}
            </div>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-md border border-[#D2B48C] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
              <span className="text-xs font-bold text-[#654321]">{m.title}</span>
            </div>
          </motion.div>
        );
      })}

      <motion.div
        className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
        style={{ left: `${avatarPosition.x}%`, top: `${avatarPosition.y}%` }}
        initial={{ scale: 0 }}
        animate={{ scale: 1, y: [0, -8, 0] }}
        transition={{ scale: { duration: 0.3 }, y: { repeat: Infinity, duration: 2 } }}
      >
        <div className="w-12 h-12 bg-[#FFB6C1] rounded-full border-2 border-[#FFFDD0] shadow-xl overflow-hidden flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt="You" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl">🐴</span>
          )}
        </div>
      </motion.div>

    </div>
  );
}
