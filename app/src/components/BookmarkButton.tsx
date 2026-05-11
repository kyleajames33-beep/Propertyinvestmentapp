import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toggleBookmark, isBookmarked, type Bookmark } from '@/lib/bookmarks';
import { showToast } from '@/lib/toast';

interface BookmarkButtonProps {
  bookmark: Omit<Bookmark, 'createdAt'>;
  variant?: 'default' | 'ghost';
}

export function BookmarkButton({ bookmark, variant = 'default' }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(bookmark.id));
  }, [bookmark.id]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowBookmarked = toggleBookmark(bookmark);
    setBookmarked(nowBookmarked);
    showToast.success(nowBookmarked ? 'Saved to My Items' : 'Removed from My Items');
  };

  if (variant === 'ghost') {
    return (
      <button
        onClick={handleClick}
        className={`p-2 rounded-md transition-colors ${
          bookmarked ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:text-rose-500 hover:bg-slate-50'
        }`}
        aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        <Heart className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
        bookmarked
          ? 'bg-rose-50 text-rose-700 border-rose-200'
          : 'bg-white text-slate-600 border-slate-200 hover:border-rose-200 hover:text-rose-600'
      }`}
    >
      <Heart className={`h-3.5 w-3.5 ${bookmarked ? 'fill-current' : ''}`} />
      {bookmarked ? 'Saved' : 'Save'}
    </button>
  );
}
