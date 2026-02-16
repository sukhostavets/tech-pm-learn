import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Lock, Star } from 'lucide-react';

export function MilestoneMap() {
  const navigate = useNavigate();

  // Coordinates for a winding path layout (approximate percentages)
  const milestones = [
    { id: 1, x: 10, y: 80, title: "Training Arena", icon: "🏟️", status: "completed" },
    { id: 2, x: 30, y: 60, title: "Feed Storage", icon: "🥕", status: "in-progress" },
    { id: 3, x: 20, y: 30, title: "Pasture Fields", icon: "☁️", status: "locked" },
    { id: 4, x: 50, y: 15, title: "Stable Complex", icon: "🏠", status: "locked" },
    { id: 5, x: 75, y: 30, title: "Riding Trails", icon: "🛤️", status: "locked" },
    { id: 6, x: 65, y: 65, title: "Breeding Barn", icon: "🧬", status: "locked" },
    { id: 7, x: 90, y: 85, title: "Show Arena", icon: "✨", status: "locked" },
  ];

  return (
    <div className="relative w-full h-[80vh] bg-[#FFFDD0] rounded-3xl overflow-hidden border-4 border-[#8B4513] shadow-2xl">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
      
      {/* Path SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
         {/* Simple winding path connecting the points */}
         <path 
           d="M 10% 80% Q 20% 70% 30% 60% T 20% 30% T 50% 15% T 75% 30% T 65% 65% T 90% 85%" 
           fill="none" 
           stroke="#D2B48C" 
           strokeWidth="12" 
           strokeDasharray="20,10"
           strokeLinecap="round"
         />
         {/* Highlighted path for progress */}
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

      {/* Milestones */}
      {milestones.map((m, i) => (
        <motion.div
          key={m.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => m.status !== 'locked' && navigate('/lesson')}
        >
          {/* Milestone Circle */}
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 transition-transform group-hover:scale-110 relative z-10
            ${m.status === 'completed' ? 'bg-[#98FF98] border-[#8B4513]' : ''}
            ${m.status === 'in-progress' ? 'bg-[#FF69B4] border-[#8B4513] animate-pulse' : ''}
            ${m.status === 'locked' ? 'bg-gray-300 border-gray-400' : ''}
          `}>
            {m.status === 'locked' ? <Lock size={24} className="text-gray-500" /> : m.icon}
            
            {/* Stars for completed */}
            {m.status === 'completed' && (
              <div className="absolute -top-2 -right-2 bg-[#FFD700] p-1 rounded-full border border-white">
                <Star size={12} fill="white" className="text-white" />
              </div>
            )}
          </div>

          {/* Label Tooltip */}
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-md border border-[#D2B48C] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
            <span className="text-xs font-bold text-[#654321]">{m.title}</span>
          </div>
        </motion.div>
      ))}

      {/* Player Avatar moving along path - static position for now */}
      <motion.div
        className="absolute w-12 h-12 z-20 pointer-events-none"
        style={{ left: '30%', top: '60%' }}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-10 h-10 bg-[#FFB6C1] rounded-full border-2 border-[#fff] shadow-xl overflow-hidden">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Player" />
        </div>
      </motion.div>
      
      {/* Decorative Trees/Elements */}
      <div className="absolute top-10 left-10 text-4xl opacity-80 pointer-events-none">🌲</div>
      <div className="absolute bottom-20 right-40 text-4xl opacity-80 pointer-events-none">🌳</div>
      <div className="absolute top-40 right-10 text-4xl opacity-80 pointer-events-none">🏡</div>
    </div>
  );
}
