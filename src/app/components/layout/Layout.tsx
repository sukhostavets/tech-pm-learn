import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { cn } from '../ui/Button';
import { 
  Home, 
  Map, 
  BookOpen, 
  Trophy, 
  User, 
  Bell, 
  Menu, 
  X,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Stable Hub', path: '/dashboard' },
    { icon: Map, label: 'Milestone Map', path: '/map' },
    { icon: BookOpen, label: 'Lesson', path: '/lesson' }, // Normally dynamic
    { icon: Trophy, label: 'Achievements', path: '/achievements' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#FFFDD0] font-sans text-[#654321] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden h-16 bg-[#8B4513] text-[#FFFDD0] flex items-center justify-between px-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <button onClick={toggleSidebar} className="p-1 hover:bg-[#a05218] rounded">
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg">Tech Stable</span>
        </div>
        <div className="flex items-center gap-3">
          <Bell size={20} />
          <div className="w-8 h-8 bg-[#FFB6C1] rounded-full border-2 border-[#FFFDD0] flex items-center justify-center text-[#8B4513] font-bold">
            U
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className={cn(
              "fixed md:sticky top-0 left-0 h-screen w-64 bg-[#8B4513] text-[#FFFDD0] shadow-xl z-40 flex flex-col border-r-4 border-[#654321]",
              "md:translate-x-0" // Always visible on desktop
            )}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 border-b border-[#a05218]">
              <div className="bg-[#FFB6C1] p-2 rounded-lg text-2xl">🐴</div>
              <div>
                <h1 className="font-bold text-lg leading-tight">Tech Stable</h1>
                <p className="text-xs text-[#D2B48C]">Academy</p>
              </div>
              <button onClick={toggleSidebar} className="md:hidden ml-auto">
                <X size={20} />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 py-6 px-3 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                      isActive 
                        ? "bg-[#FF69B4] text-[#654321] font-bold shadow-md" 
                        : "hover:bg-[#a05218] text-[#FFFDD0]"
                    )}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Profile Mini */}
            <div className="p-4 bg-[#654321] mt-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFB6C1] rounded-full border-2 border-[#FFFDD0] flex items-center justify-center text-[#8B4513] font-bold overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                </div>
                <div>
                  <p className="font-bold text-sm">Stable Keeper</p>
                  <p className="text-xs text-[#D2B48C]">Lvl 5 Rancher</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)] md:h-screen overflow-y-auto bg-[#FFFDD0]">
        {/* Desktop Top Bar */}
        <div className="hidden md:flex h-16 bg-[#FFFDD0] border-b border-[#D2B48C] items-center justify-between px-8 sticky top-0 z-30">
          <h2 className="font-bold text-xl text-[#8B4513]">
             {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 bg-[#FFF8DC] px-3 py-1 rounded-full border border-[#D2B48C]">
                <span>🌾</span>
                <span className="font-bold text-[#8B4513]">1,250 Hay Coins</span>
             </div>
             <button className="relative">
                <Bell className="text-[#8B4513]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
           {children}
        </div>
      </main>
    </div>
  );
}
