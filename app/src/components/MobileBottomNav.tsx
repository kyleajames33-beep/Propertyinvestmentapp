import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Calculator, Scale, CalendarDays } from 'lucide-react';

const items = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/journey', icon: Map, label: 'Journey' },
  { to: '/compare', icon: Scale, label: 'Compare' },
  { to: '/tracker', icon: CalendarDays, label: 'Tracker' },
  { to: '/calculators', icon: Calculator, label: 'Calc' },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-14 safe-area-pb">
        {items.map((item) => {
          const isActive =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
