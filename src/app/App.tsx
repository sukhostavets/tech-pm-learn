import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate, useLocation } from 'react-router';
import { ProtectedRoute } from '../lib/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { MilestoneMap } from './pages/MilestoneMap';
import { LessonView } from './pages/LessonView';
import { QuizPage } from './pages/QuizPage';
import { ProfilePage } from './pages/ProfilePage';
import { HangmanGame } from './pages/HangmanGame';
import { ProjectSubmission } from './pages/ProjectSubmission';

// Simple placeholder for pages not yet implemented
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8 text-center">
    <h1 className="text-3xl font-bold text-[#8B4513] mb-4">{title}</h1>
    <p className="text-[#654321]">Coming soon to your stable!</p>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      {isLanding ? (
        <Routes>
           <Route path="/" element={<LandingPage />} />
           <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<MilestoneMap />} />
              <Route path="/lesson" element={<LessonView />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/game/hangman" element={<HangmanGame />} />
              <Route path="/project/submission" element={<ProjectSubmission />} />
              <Route path="/achievements" element={<Placeholder title="Achievements Gallery" />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
