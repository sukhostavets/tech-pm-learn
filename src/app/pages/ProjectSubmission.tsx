import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Upload, FileText, CheckSquare, Send, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function ProjectSubmission() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate upload
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl border-4 border-[#98FF98] max-w-lg w-full"
        >
          <div className="w-20 h-20 bg-[#98FF98] rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            📬
          </div>
          <h2 className="text-3xl font-bold text-[#654321] mb-2">Project Delivered!</h2>
          <p className="text-[#8B4513] mb-6">
            Your "Database Schema Design" project has been safely stored in the hayloft. Our stable masters will review it shortly.
          </p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
        <ArrowLeft className="mr-2" /> Back
      </Button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Upload Area */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project: Design a Database Schema</CardTitle>
              <p className="text-sm text-[#8B4513] mt-2">
                Create a schema for a library management system. Include tables for Books, Authors, and Loans.
              </p>
            </CardHeader>
            <CardContent>
              <div 
                className="border-4 border-dashed border-[#FF69B4]/40 rounded-xl bg-[#FFF0F5] h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FF69B4]/10 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                
                {file ? (
                  <div className="text-center">
                    <FileText size={48} className="mx-auto text-[#FF69B4] mb-4" />
                    <p className="font-bold text-[#654321]">{file.name}</p>
                    <p className="text-sm text-[#8B4513]">{(file.size / 1024).toFixed(2)} KB</p>
                    <Button size="sm" variant="ghost" className="mt-4 text-red-500 hover:bg-red-50" onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}>Remove</Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload size={48} className="mx-auto text-[#FF69B4] mb-4" />
                    <p className="font-bold text-[#654321] text-lg">Drag & Drop your project here</p>
                    <p className="text-sm text-[#8B4513]">or click to browse files (PDF, PNG, SQL)</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <Button 
                  size="lg" 
                  onClick={handleSubmit} 
                  disabled={!file || isSubmitting}
                  isLoading={isSubmitting}
                >
                  <Send className="mr-2" /> Submit Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Checklist */}
        <div className="space-y-6">
           <Card variant="stable">
             <CardHeader>
               <CardTitle>Submission Checklist</CardTitle>
             </CardHeader>
             <CardContent>
               <ul className="space-y-3">
                 {[
                   "Defined at least 3 tables",
                   "Included Primary Keys",
                   "Established Foreign Key relationships",
                   "Exported as SQL or Diagram Image"
                 ].map((item, i) => (
                   <li key={i} className="flex items-start gap-3">
                     <div className="mt-1">
                       <CheckSquare size={16} className="text-[#FF69B4]" />
                     </div>
                     <span className="text-sm text-[#654321]">{item}</span>
                   </li>
                 ))}
               </ul>
             </CardContent>
           </Card>

           <Card className="bg-[#E0F2F1] border-[#4DB6AC]">
             <CardContent className="p-4">
               <p className="font-bold text-[#00695C] mb-1">XP Reward</p>
               <div className="flex items-center gap-2">
                 <span className="text-2xl">🏆</span>
                 <span className="text-xl font-bold text-[#004D40]">500 XP</span>
               </div>
               <p className="text-xs text-[#00695C] mt-2">Plus a chance to unlock the "Architect" badge!</p>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
