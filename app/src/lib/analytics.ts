declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    posthog?: { capture: (event: string, props?: Record<string, unknown>) => void };
  }
}

const isDev = import.meta.env.DEV;

export function trackEvent(name: string, properties?: Record<string, unknown>) {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, properties);
  }
  // PostHog (optional)
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture(name, properties);
  }
  if (isDev) {
    // eslint-disable-next-line no-console
    console.log('[Analytics]', name, properties);
  }
}

export function pageView(path: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
    });
  }
  if (isDev) {
    // eslint-disable-next-line no-console
    console.log('[Analytics] page_view', path);
  }
}

// Funnel tracking helpers
export function trackFunnelStep(funnel: string, step: string, properties?: Record<string, unknown>) {
  trackEvent('funnel_step', { funnel, step, ...properties });
}

export function trackCalculatorResult(calculator: string, resultKey: string, resultValue: unknown) {
  trackEvent('calculator_result', { calculator, resultKey, resultValue });
}

export function trackCtaClick(location: string, ctaText: string) {
  trackEvent('cta_click', { location, cta_text: ctaText });
}

export function trackFormStart(formName: string) {
  trackEvent('form_start', { form_name: formName });
}

export function trackFormSubmit(formName: string, success: boolean) {
  trackEvent('form_submit', { form_name: formName, success });
}
