import { toast } from 'sonner';

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },
  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },
  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },
  copy: (text: string) => {
    toast.success('Copied to clipboard', { description: text.slice(0, 60) + (text.length > 60 ? '...' : '') });
  },
  saved: (what: string) => {
    toast.success(`${what} saved`);
  },
  shared: () => {
    toast.success('Shared successfully');
  },
  badgeEarned: (badgeName: string) => {
    toast.success('Badge earned!', {
      description: `You unlocked: ${badgeName}`,
      duration: 4000,
    });
  },
};
