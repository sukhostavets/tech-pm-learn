import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ChevronLeft, ChevronRight, Check, BookOpen, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { dataService } from '../../lib/services/data.service';
import type { Milestone } from '../../lib/types';

const DEFAULT_SECTIONS = [
  {
    id: 'intro',
    title: 'Introduction',
    content: (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-[#654321]">The Stable's Feed Room</h3>
        <p className="text-[#8B4513] leading-relaxed">
          Imagine your stable's feed room. It's not just a pile of hay; it's an organized system.
        </p>
        <p className="text-[#8B4513] leading-relaxed">
          In the tech world, this is exactly what a <strong>Database</strong> is.
        </p>
        <div className="my-6 p-6 bg-[#FFF8DC] border border-[#D2B48C] rounded-xl flex items-center gap-6">
          <div className="text-5xl">🛖</div>
          <div>
            <h4 className="font-bold text-[#654321]">Key Concept: Database</h4>
            <p className="text-sm text-[#8B4513]">A structured set of data held in a computer.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'sql',
    title: "SQL: The Stable Hand's Checklist",
    content: (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-[#654321]">Fetching the Feed (SQL)</h3>
        <p className="text-[#8B4513] leading-relaxed">
          We use <strong>SQL (Structured Query Language)</strong> to talk to our database.
        </p>
        <div className="bg-[#2a2a2a] p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto my-4 border-2 border-[#8B4513]">
          <span className="text-purple-400">SELECT</span> feed_type, amount<br />
          <span className="text-purple-400">FROM</span> feed_inventory<br />
          <span className="text-purple-400">WHERE</span> horse_name = <span className="text-yellow-300">'Bella'</span>;
        </div>
      </div>
    ),
  },
  {
    id: 'interactive',
    title: 'Try It Yourself',
    content: (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-[#654321]">Activity: Sorting the Inventory</h3>
        <p className="text-[#8B4513]">Drag the items into the correct table columns below.</p>
        <div className="h-64 bg-white border-2 border-dashed border-[#FF69B4] rounded-xl flex items-center justify-center text-[#FF69B4]">
          [Interactive Placeholder]
        </div>
      </div>
    ),
  },
];

export function LessonView() {
  const navigate = useNavigate();
  const { milestoneId } = useParams<{ milestoneId: string }>();
  const id = milestoneId ? parseInt(milestoneId, 10) : 1;
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setLoading(false);
      setError('Invalid milestone');
      return;
    }
    let cancelled = false;
    dataService
      .getMilestoneById(id)
      .then((m) => {
        if (!cancelled && m) {
          setMilestone(m);
          dataService.setMilestoneInProgress(id).catch((e) => console.error('setMilestoneInProgress', e));
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

  const lesson = {
    title: milestone?.title ?? 'Lesson',
    module: milestone?.topic ?? '—',
    sections: DEFAULT_SECTIONS,
  };

  const nextSection = () => {
    if (currentSection < lesson.sections.length - 1) {
      setCurrentSection(curr => curr + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection((curr) => curr - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-[#8B4513] font-medium">Loading lesson…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Top Bar for Lesson */}
      <div className="mb-6 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
               <ChevronLeft /> Back
            </Button>
            <div>
              <h2 className="font-bold text-[#654321]">{lesson.module}</h2>
              <p className="text-sm text-[#8B4513]">Lesson 1: {lesson.title}</p>
            </div>
         </div>
         <div className="w-1/3">
            <ProgressBar value={((currentSection + 1) / lesson.sections.length) * 100} max={100} showIcon={true} />
         </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <div className="w-64 hidden lg:block overflow-y-auto pr-2">
           <div className="space-y-2">
             {lesson.sections.map((sec, idx) => (
               <button
                 key={sec.id}
                 onClick={() => setCurrentSection(idx)}
                 className={`w-full text-left p-3 rounded-lg text-sm flex items-center justify-between transition-colors ${
                   idx === currentSection 
                     ? 'bg-[#FF69B4] text-[#654321] font-bold shadow-md' 
                     : 'hover:bg-[#FFFDD0] text-[#8B4513]'
                 }`}
               >
                 <span>{idx + 1}. {sec.title}</span>
                 {idx < currentSection && <Check size={16} className="text-[#98FF98]" />}
               </button>
             ))}
           </div>
        </div>

        {/* Main Content */}
        <Card className="flex-1 overflow-hidden flex flex-col relative bg-white">
          <CardContent className="flex-1 overflow-y-auto p-8 md:p-12">
            <AnimatePresence mode="wait">
               <motion.div
                 key={currentSection}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.3 }}
                 className="max-w-3xl mx-auto"
               >
                 {lesson.sections[currentSection]?.content}
               </motion.div>
            </AnimatePresence>
          </CardContent>

          {/* Footer Navigation */}
          <div className="p-6 border-t border-[#D2B48C] bg-[#FFFDD0] flex justify-between items-center">
             <Button 
               variant="outline" 
               onClick={prevSection} 
               disabled={currentSection === 0}
             >
               Previous
             </Button>
             
             {isCompleted ? (
               <Button
                 variant="primary"
                 size="lg"
                 className="animate-pulse"
                 onClick={() => navigate(`/quiz?milestoneId=${id}`)}
               >
                 Take Quiz <ChevronRight className="ml-2" />
               </Button>
             ) : (
               <Button onClick={nextSection}>
                 Next <ChevronRight className="ml-2" />
               </Button>
             )}
          </div>
        </Card>

        {/* Right Sidebar - Tools */}
        <div className="w-64 hidden xl:block space-y-4">
           <Card className="bg-[#FFF8DC]">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm flex items-center gap-2">
                 <BookOpen size={16} /> Dictionary
               </CardTitle>
             </CardHeader>
             <CardContent className="text-sm text-[#8B4513]">
               <p className="font-bold">Schema</p>
               <p>The blueprint of how data is organized in a database (like the layout of the stable).</p>
             </CardContent>
           </Card>

           <Card className="bg-[#E0F7FA] border-[#4DD0E1]">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm flex items-center gap-2">
                 <Lightbulb size={16} /> Pro Tip
               </CardTitle>
             </CardHeader>
             <CardContent className="text-sm text-[#006064]">
               Always design your database schema before writing code. It's harder to move a barn than to redraw the blueprints!
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
