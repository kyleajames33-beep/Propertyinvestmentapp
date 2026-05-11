import { storage } from './storage';

const BOOKMARKS_KEY = 'bookmarked_pages';

export type Bookmark = {
  id: string;
  type: 'stage' | 'reference' | 'calculator';
  title: string;
  url: string;
  createdAt: string;
};

export function getBookmarks(): Bookmark[] {
  return storage.get<Bookmark[]>(BOOKMARKS_KEY, []);
}

export function addBookmark(bookmark: Omit<Bookmark, 'createdAt'>): boolean {
  const bookmarks = getBookmarks();
  if (bookmarks.some(b => b.id === bookmark.id)) return false;
  bookmarks.push({ ...bookmark, createdAt: new Date().toISOString() });
  storage.set(BOOKMARKS_KEY, bookmarks);
  return true;
}

export function removeBookmark(id: string): boolean {
  const bookmarks = getBookmarks();
  const filtered = bookmarks.filter(b => b.id !== id);
  if (filtered.length === bookmarks.length) return false;
  storage.set(BOOKMARKS_KEY, filtered);
  return true;
}

export function isBookmarked(id: string): boolean {
  return getBookmarks().some(b => b.id === id);
}

export function toggleBookmark(bookmark: Omit<Bookmark, 'createdAt'>): boolean {
  if (isBookmarked(bookmark.id)) {
    removeBookmark(bookmark.id);
    return false;
  }
  addBookmark(bookmark);
  return true;
}
