import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenLine, Save } from 'lucide-react';
import { storage } from '@/lib/storage';
import { showToast } from '@/lib/toast';

interface PropertyDiaryProps {
  stageId: string;
}

const DIARY_KEY = 'property_diary';

export function PropertyDiary({ stageId }: PropertyDiaryProps) {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState('');

  useEffect(() => {
    const allNotes = storage.get<Record<string, string>>(DIARY_KEY, {});
    const existing = allNotes[stageId] || '';
    setNote(existing);
    setSaved(existing);
  }, [stageId]);

  const handleSave = useCallback(() => {
    const allNotes = storage.get<Record<string, string>>(DIARY_KEY, {});
    allNotes[stageId] = note;
    storage.set(DIARY_KEY, allNotes);
    setSaved(note);
    showToast.saved('Note');
  }, [note, stageId]);

  const hasChanges = note !== saved;

  return (
    <Card className="p-5 mt-8 border-dashed border-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <PenLine className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Your property diary</h3>
        </div>
        {hasChanges && (
          <Button size="sm" variant="outline" onClick={handleSave} className="h-7 text-xs gap-1">
            <Save className="h-3 w-3" />
            Save note
          </Button>
        )}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Jot down thoughts, properties you saw, or questions to ask your professional..."
        className="w-full min-h-[100px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
      />
      <p className="text-[11px] text-muted-foreground mt-2">
        These notes are private and saved only on your device.
      </p>
    </Card>
  );
}
