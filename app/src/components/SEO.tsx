import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  ogType?: string;
  ogImage?: string;
}

const SITE_NAME = 'PropertyPath';
const DEFAULT_OG_IMAGE = './icon-512.svg'; // Uses the PWA icon

export function SEO({ title, description, ogType = 'website', ogImage = DEFAULT_OG_IMAGE }: SEOProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, attribute: string, value: string, nameAttr: string = 'name') => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        (el as any)[nameAttr] = attribute;
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    setMeta('meta[name="description"]', 'description', description);
    setMeta('meta[property="og:title"]', 'og:title', title, 'property');
    setMeta('meta[property="og:description"]', 'og:description', description, 'property');
    setMeta('meta[property="og:type"]', 'og:type', ogType, 'property');
    setMeta('meta[property="og:image"]', 'og:image', ogImage, 'property');
    setMeta('meta[property="og:site_name"]', 'og:site_name', SITE_NAME, 'property');
    setMeta('meta[name="twitter:card"]', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'twitter:image', ogImage);
  }, [title, description, ogType, ogImage]);

  return null;
}
