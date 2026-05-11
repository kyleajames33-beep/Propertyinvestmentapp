import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, MapPin, DollarSign, Clock, Home } from 'lucide-react';
import { storage, type PropertyProfile } from '@/lib/storage';
import { trackActivity } from '@/lib/badges';
import { showToast } from '@/lib/toast';

export function MyProfileBadge() {
  const [profile, setProfile] = useState<PropertyProfile | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setProfile(storage.get<PropertyProfile | null>('property_profile', null));
  }, []);

  if (!profile) {
    return (
      <Link to="/">
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => {
          // Scroll to profile section if on homepage
        }}>
          <User className="h-3.5 w-3.5" />
          Set up your profile
        </Button>
      </Link>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/5 text-primary text-xs font-medium hover:bg-primary/10 transition-colors"
      >
        <User className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">
          {profile.targetSuburb ? `${profile.targetSuburb}` : 'Your profile'}
          {profile.budgetMax ? ` · $${(profile.budgetMax / 1000).toFixed(0)}k` : ''}
        </span>
        <span className="sm:hidden">Profile</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Your Property Profile</DialogTitle>
          </DialogHeader>
          <ProfileForm
            initial={profile}
            onSave={(p) => {
              storage.set('property_profile', p);
              setProfile(p);
              setOpen(false);
              showToast.saved('Profile');
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ProfileSetupModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [profile, setProfile] = useState<PropertyProfile | null>(null);

  useEffect(() => {
    setProfile(storage.get<PropertyProfile | null>('property_profile', null));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Personalise your experience</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">
          Tell us a little about your property goals. We will use this to pre-fill calculators and tailor your journey.
        </p>
        <ProfileForm
          initial={profile || {}}
          onSave={(p) => {
            storage.set('property_profile', p);
            onClose();
            showToast.saved('Profile');
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function ProfileForm({ initial, onSave }: { initial: PropertyProfile | null; onSave: (p: PropertyProfile) => void }) {
  const [form, setForm] = useState<PropertyProfile>(initial || {});

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        trackActivity('profile_setup');
        onSave(form);
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="buyerType">I am a...</Label>
        <select
          id="buyerType"
          value={form.buyerType || ''}
          onChange={(e) => setForm({ ...form, buyerType: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Select buyer type</option>
          <option value="fhb-oo">First home buyer</option>
          <option value="inv-new">First-time investor</option>
          <option value="inv-exp">Experienced investor</option>
          <option value="downsizer">Downsizer</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetSuburb">Target suburb or area</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="targetSuburb"
            value={form.targetSuburb || ''}
            onChange={(e) => setForm({ ...form, targetSuburb: e.target.value })}
            placeholder="e.g. Parramatta"
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="budgetMin">Budget min</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="budgetMin"
              type="number"
              value={form.budgetMin || ''}
              onChange={(e) => setForm({ ...form, budgetMin: Number(e.target.value) })}
              placeholder="500000"
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="budgetMax">Budget max</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="budgetMax"
              type="number"
              value={form.budgetMax || ''}
              onChange={(e) => setForm({ ...form, budgetMax: Number(e.target.value) })}
              placeholder="900000"
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="depositSaved">Deposit saved</Label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="depositSaved"
              type="number"
              value={form.depositSaved || ''}
              onChange={(e) => setForm({ ...form, depositSaved: Number(e.target.value) })}
              placeholder="100000"
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeline">Buying timeline</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              id="timeline"
              value={form.timeline || ''}
              onChange={(e) => setForm({ ...form, timeline: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-9"
            >
              <option value="">Select</option>
              <option value="0-3">0–3 months</option>
              <option value="3-6">3–6 months</option>
              <option value="6-12">6–12 months</option>
              <option value="12+">1+ years</option>
            </select>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save profile
      </Button>
    </form>
  );
}
