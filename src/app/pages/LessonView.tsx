import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ChevronLeft, ChevronRight, Check, BookOpen, Lightbulb, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function LessonView() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const lesson = {
    title: "Understanding Databases as Feed Storage",
    module: "Data & SQL",
    sections: [
      {
        id: "intro",
        title: "Introduction",
        content: (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#654321]">The Stable's Feed Room</h3>
            <p className="text-[#8B4513] leading-relaxed">
              Imagine your stable's feed room. It's not just a pile of hay; it's an organized system. You have bins for oats, shelves for supplements, and bales of hay stacked in specific corners.
            </p>
            <p className="text-[#8B4513] leading-relaxed">
              In the tech world, this is exactly what a <strong>Database</strong> is. It's not just a random collection of data; it's an organized storage facility where applications "feed" from.
            </p>
            <div className="my-6 p-6 bg-[#FFF8DC] border border-[#D2B48C] rounded-xl flex items-center gap-6">
               <div className="text-5xl">🛖</div>
               <div>
                 <h4 className="font-bold text-[#654321]">Key Concept: Database</h4>
                 <p className="text-sm text-[#8B4513]">A structured set of data held in a computer, especially one that is accessible in various ways.</p>
               </div>
            </div>
          </div>
        )
      },
      {
        id: "sql",
        title: "SQL: The Stable Hand's Checklist",
        content: (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#654321]">Fetching the Feed (SQL)</h3>
            <p className="text-[#8B4513] leading-relaxed">
              When you tell a stable hand to "Go get 3 scoops of oats for Bella," you are issuing a query. In tech, we use a language called <strong>SQL (Structured Query Language)</strong> to talk to our database.
            </p>
            <div className="bg-[#2a2a2a] p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto my-4 border-2 border-[#8B4513]">
              <span className="text-purple-400">SELECT</span> feed_type, amount<br/>
              <span className="text-purple-400">FROM</span> feed_inventory<br/>
              <span className="text-purple-400">WHERE</span> horse_name = <span className="text-yellow-300">'Bella'</span>;
            </div>
            <p className="text-[#8B4513] leading-relaxed">
              Just like that clear instruction ensures Bella gets the right food, a SQL query ensures the app gets the right data.
            </p>
          </div>
        )
      },
      {
        id: "interactive",
        title: "Try It Yourself",
        content: (
          <div className="space-y-4">
             <h3 className="text-2xl font-bold text-[#654321]">Activity: Sorting the Inventory</h3>
             <p className="text-[#8B4513]">
               Drag the items into the correct table columns below to structure your database.
             </p>
             <div className="h-64 bg-white border-2 border-dashed border-[#FF69B4] rounded-xl flex items-center justify-center text-[#FF69B4]">
               [Interactive Drag & Drop Placeholder]
             </div>
          </div>
        )
      }
    ]
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
      setCurrentSection(curr => curr - 1);
    }
  };

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
                 {lesson.sections[currentSection].content}
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
                 onClick={() => navigate('/quiz')}
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
