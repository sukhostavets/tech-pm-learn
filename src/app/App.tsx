import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate, useLocation } from 'react-router';
import { ProtectedRoute } from '../lib/auth/ProtectedRoute';
import { APP_LOGO_URL } from '../lib/assets';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { MilestoneMap } from './pages/MilestoneMap';
import { MilestoneDetail } from './pages/MilestoneDetail';
import { LessonView } from './pages/LessonView';
import { QuizPage } from './pages/QuizPage';
import { ProfilePage } from './pages/ProfilePage';
import { HangmanGame } from './pages/HangmanGame';

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
              <Route path="/lesson/:milestoneId/:lessonId" element={<LessonView />} />
              <Route path="/lesson/:milestoneId" element={<MilestoneDetail />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/game/hangman" element={<HangmanGame />} />
              <Route path="/achievements" element={<Placeholder title="Achievements Gallery" />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      )}
    </>
  );
}

function Favicon() {
  useEffect(() => {
    if (!APP_LOGO_URL) return;
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = APP_LOGO_URL;
  }, []);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Favicon />
      <AppContent />
    </BrowserRouter>
  );
}
