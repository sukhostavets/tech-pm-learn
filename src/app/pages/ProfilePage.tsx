import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Settings, LogOut, Edit } from 'lucide-react';
import { useAuth } from '../../lib/auth/authContext';
import { dataService } from '../../lib/services/data.service';
import { DEFAULT_AVATAR_URL } from '../../lib/assets';
import type { User } from '../../lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

type ProfileUser = User & { title?: string; horses?: { name: string; breed: string; level: number; img: string }[]; badges?: string[] };

export function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editStableName, setEditStableName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authUser?.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    dataService
      .getUserProfile(authUser.id)
      .then((p) => {
        if (!cancelled) setProfile(p as ProfileUser);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load profile');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [authUser?.id]);

  useEffect(() => {
    if (profile) {
      setEditName(profile.name);
      setEditStableName(profile.stableName);
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await dataService.updateProfile({ name: editName, stableName: editStableName });
      setProfile({ ...profile, name: editName, stableName: editStableName });
      setEditOpen(false);
    } catch (e) {
      console.error('Update profile failed', e);
    } finally {
      setSaving(false);
    }
  };

  const handleLogOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-[#8B4513] font-medium">Loading profile…</p>
      </div>
    );
  }
  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <p className="text-red-600">{error ?? 'Profile not found'}</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const horses = profile.horses ?? [];
  const badges = profile.badges ?? [];
  const joinDate = profile.joinDate instanceof Date
    ? profile.joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="overflow-visible mt-12">
        <div className="h-32 bg-[#FFB6C1] rounded-t-xl relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-full border-4 border-[#FFFDD0] bg-white overflow-hidden">
            {(profile.avatarUrl || DEFAULT_AVATAR_URL) ? (
              <img src={profile.avatarUrl || DEFAULT_AVATAR_URL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl text-[#654321] font-bold">
                {(profile.name?.[0] ?? '?').toUpperCase()}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className="absolute top-4 right-4 bg-white/50 hover:bg-white/80"
            onClick={() => setEditOpen(true)}
          >
            <Settings size={18} />
          </Button>
        </div>
        <div className="pt-16 pb-8 px-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#654321]">{profile.name}</h1>
            <p className="text-[#8B4513] font-medium">
              {profile.title ?? 'Stable Hand'} at {profile.stableName}
            </p>
            {joinDate && <p className="text-xs text-gray-500 mt-1">Member since {joinDate}</p>}
          </div>
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Edit size={16} className="mr-2" /> Edit Profile
          </Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card variant="stable">
          <CardHeader>
            <CardTitle>My Horses ({horses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {horses.map((horse, i) => (
                <div
                  key={i}
                  className="bg-[#FFF8DC] p-3 rounded-lg border border-[#D2B48C] text-center"
                >
                  <div className="text-4xl mb-2">{horse.img}</div>
                  <h4 className="font-bold text-[#654321] text-sm">{horse.name}</h4>
                  <p className="text-xs text-[#8B4513] mb-2">{horse.breed}</p>
                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-[#D2B48C]">
                    <div
                      className="h-full bg-[#FF69B4]"
                      style={{ width: `${Math.min(horse.level * 20, 100)}%` }}
                    />
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

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Training Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Technical Knowledge</span>
                  <span className="font-bold">
                    {profile.nextLevelXp ? Math.round((profile.xp / profile.nextLevelXp) * 100) : 0}%
                  </span>
                </div>
                <ProgressBar
                  value={profile.xp}
                  max={profile.nextLevelXp || 100}
                  showIcon={false}
                  color="#98FF98"
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#FFB6C1] text-[#654321] text-xs font-bold rounded-full border border-[#FF69B4]"
                  >
                    {badge}
                  </span>
                ))}
                <span className="px-3 py-1 bg-gray-100 text-gray-400 text-xs rounded-full border border-gray-300 border-dashed">
                  + locked
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center py-8">
        <Button
          variant="outline"
          className="text-red-500 border-red-200 hover:bg-red-50"
          onClick={handleLogOut}
        >
          <LogOut size={18} className="mr-2" /> Log Out
        </Button>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border-[#D2B48C]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-stable">Stable name</Label>
              <Input
                id="edit-stable"
                value={editStableName}
                onChange={(e) => setEditStableName(e.target.value)}
                className="border-[#D2B48C]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
