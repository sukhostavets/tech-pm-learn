import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Settings, LogOut, Edit } from 'lucide-react';

export function ProfilePage() {
  const user = {
    name: "Alex Smith",
    title: "Senior Stable Hand",
    stableName: "Cloud Hopper Ranch",
    joinDate: "October 2023",
    horses: [
      { name: "Query", breed: "SQL Stallion", level: 5, img: "🐴" },
      { name: "Git", breed: "Version Control Pony", level: 3, img: "🐎" },
      { name: "Pixel", breed: "Frontend Foal", level: 1, img: "🦄" },
      { name: "Docker", breed: "Container Clydesdale", level: 2, img: "🦓" },
    ],
    badges: ["First Ride", "Bug Hunter", "Clean Code", "Night Owl"]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card className="overflow-visible mt-12">
        <div className="h-32 bg-[#FFB6C1] rounded-t-xl relative">
           <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-full border-4 border-[#FFFDD0] bg-white overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full" />
           </div>
           <Button variant="ghost" className="absolute top-4 right-4 bg-white/50 hover:bg-white/80">
             <Settings size={18} />
           </Button>
        </div>
        <div className="pt-16 pb-8 px-8 flex justify-between items-start">
           <div>
             <h1 className="text-2xl font-bold text-[#654321]">{user.name}</h1>
             <p className="text-[#8B4513] font-medium">{user.title} at {user.stableName}</p>
             <p className="text-xs text-gray-500 mt-1">Member since {user.joinDate}</p>
           </div>
           <Button variant="outline">
             <Edit size={16} className="mr-2" /> Edit Profile
           </Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Horse Collection */}
        <Card variant="stable">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>My Horses ({user.horses.length})</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">Manage Stable</Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {user.horses.map((horse, i) => (
                <div key={i} className="bg-[#FFF8DC] p-3 rounded-lg border border-[#D2B48C] text-center">
                  <div className="text-4xl mb-2">{horse.img}</div>
                  <h4 className="font-bold text-[#654321] text-sm">{horse.name}</h4>
                  <p className="text-xs text-[#8B4513] mb-2">{horse.breed}</p>
                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-[#D2B48C]">
                    <div className="h-full bg-[#FF69B4]" style={{ width: `${horse.level * 20}%` }} />
                  </div>
                  <p className="text-[10px] text-[#8B4513] mt-1">Lvl {horse.level}</p>
                </div>
              ))}
              <div className="bg-gray-100 p-3 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 min-h-[140px]">
                <div className="text-2xl mb-1">🔒</div>
                <span className="text-xs">Next unlock at Lvl 6</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Badges */}
        <div className="space-y-8">
           <Card>
             <CardHeader>
               <CardTitle>Training Progress</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span>Technical Knowledge</span>
                   <span className="font-bold">78%</span>
                 </div>
                 <ProgressBar value={78} max={100} showIcon={false} color="#98FF98" className="h-2" />
               </div>
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span>Stable Management</span>
                   <span className="font-bold">45%</span>
                 </div>
                 <ProgressBar value={45} max={100} showIcon={false} color="#FFD700" className="h-2" />
               </div>
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span>Riding Skills</span>
                   <span className="font-bold">20%</span>
                 </div>
                 <ProgressBar value={20} max={100} showIcon={false} color="#FF69B4" className="h-2" />
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle>Badges</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="flex flex-wrap gap-2">
                 {user.badges.map((badge, i) => (
                   <span key={i} className="px-3 py-1 bg-[#FFB6C1] text-[#654321] text-xs font-bold rounded-full border border-[#FF69B4]">
                     {badge}
                   </span>
                 ))}
                 <span className="px-3 py-1 bg-gray-100 text-gray-400 text-xs rounded-full border border-gray-300 border-dashed">
                   + 12 locked
                 </span>
               </div>
             </CardContent>
           </Card>
        </div>
      </div>
      
      <div className="flex justify-center py-8">
        <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
          <LogOut size={18} className="mr-2" /> Log Out
        </Button>
      </div>
    </div>
  );
}
