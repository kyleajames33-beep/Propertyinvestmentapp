import { useEffect, useRef } from 'react';
import { trackEvent } from './analytics';

/**
 * Track time on page and scroll depth.
 * Sends a single engagement event when user navigates away.
 */
export function useEngagementTracking(pagePath: string) {
  const startTime = useRef(Date.now());
  const maxScroll = useRef(0);
  const tracked = useRef(false);

  useEffect(() => {
    startTime.current = Date.now();
    maxScroll.current = 0;
    tracked.current = false;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = Math.round((scrollTop / docHeight) * 100);
        if (pct > maxScroll.current) {
          maxScroll.current = pct;
        }
      }
    };

    const sendEngagement = () => {
      if (tracked.current) return;
      tracked.current = true;
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      if (duration < 2) return; // Skip accidental visits

      trackEvent('page_engagement', {
        page_path: pagePath,
        duration_seconds: duration,
        scroll_depth_percent: Math.min(maxScroll.current, 100),
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') sendEngagement();
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      sendEngagement();
    };
  }, [pagePath]);
}

/**
 * Track milestone scroll depths (25%, 50%, 75%, 90%, 100%)
 * Each milestone fires at most once per page view.
 */
export function useScrollMilestones(pagePath: string) {
  const milestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    milestones.current = new Set();

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((window.scrollY / docHeight) * 100);

      for (const threshold of [25, 50, 75, 90, 100]) {
        if (pct >= threshold && !milestones.current.has(threshold)) {
          milestones.current.add(threshold);
          trackEvent('scroll_milestone', {
            page_path: pagePath,
            depth_percent: threshold,
          });
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pagePath]);
}
