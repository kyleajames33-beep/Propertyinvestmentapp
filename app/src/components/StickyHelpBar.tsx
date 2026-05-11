import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, X, Users, MessageSquare, ChevronRight } from 'lucide-react';

import type { Persona } from '@/types/content';

interface StickyHelpBarProps {
  stageName?: string;
  persona?: Persona;
}

const personaProSuggestions: Record<string, { label: string; desc: string; link: string }[]> = {
  'fhb-oo': [
    { label: 'Mortgage Broker', desc: 'Pre-approval info', link: '/professionals' },
    { label: 'Conveyancer', desc: 'Review contracts', link: '/professionals' },
    { label: 'Building Inspector', desc: 'Pre-purchase checks', link: '/professionals' },
  ],
  'inv-new': [
    { label: 'Mortgage Broker', desc: 'Investment loans', link: '/professionals' },
    { label: "Buyer's Agent", desc: 'Find deals', link: '/professionals' },
    { label: 'Property Accountant', desc: 'Tax structure', link: '/professionals' },
  ],
  'inv-exp': [
    { label: 'Mortgage Broker', desc: 'Portfolio finance', link: '/professionals' },
    { label: "Buyer's Agent", desc: 'Off-market deals', link: '/professionals' },
    { label: 'Property Accountant', desc: 'Portfolio tax', link: '/professionals' },
  ],
  'downsizer': [
    { label: 'Financial Advisor', desc: 'Wealth planning', link: '/professionals' },
    { label: 'Conveyancer', desc: 'Contract review', link: '/professionals' },
    { label: 'Mortgage Broker', desc: 'Financing options', link: '/professionals' },
  ],
};

export function StickyHelpBar({ stageName, persona = 'fhb-oo' }: StickyHelpBarProps) {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (dismissed) return null;

  return (
    <>
      {/* Collapsed bar */}
      {!expanded && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 shadow-lg">
          <div className="pp-container">
            <div className="flex items-center justify-between h-14 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    Need help{stageName ? ` with ${stageName}?` : ' with your property purchase?'}
                  </p>
                  <p className="text-slate-400 text-xs truncate hidden sm:block">
                    Connect with vetted mortgage brokers, conveyancers, and inspectors
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setExpanded(true)}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Users className="h-3.5 w-3.5" />
                  Get help
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDismissed(true)}
                  className="p-2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded panel */}
      {expanded && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 shadow-2xl">
          <div className="pp-container py-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Get professional help</h3>
                  <p className="text-slate-400 text-sm">Free introductions to verified professionals</p>
                </div>
              </div>
              <button onClick={() => setExpanded(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick action cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                ...(personaProSuggestions[persona] || personaProSuggestions['fhb-oo']).map(p => ({ ...p, icon: '👤' })),
                { icon: '📊', label: 'All Professionals', desc: 'Browse directory', link: '/professionals' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.link}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 transition-all group"
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-white text-sm font-semibold group-hover:text-primary transition-colors">{item.label}</div>
                  <div className="text-slate-400 text-xs">{item.desc}</div>
                </Link>
              ))}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between border-t border-slate-700 pt-3">
              <p className="text-xs text-slate-500">
                PropertyPath may receive referral fees. This does not affect the service you receive.
              </p>
              <div className="flex items-center gap-3">
                <Link to="/questions" className="text-sm text-primary hover:underline">
                  Questions to ask professionals →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for content above the fixed bar */}
      <div className="h-14" />
    </>
  );
}
