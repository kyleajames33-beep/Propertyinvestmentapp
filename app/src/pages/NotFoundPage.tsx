import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Map, SearchX } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="pp-container py-20">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
          <SearchX className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">404</h1>
          <p className="text-lg text-muted-foreground">This page does not exist.</p>
        </div>
        <p className="text-sm text-muted-foreground">
          The property market is unpredictable, but navigation should not be. 
          Here is where you can go instead.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/journey">
              <Map className="mr-2 h-4 w-4" />
              Start your journey
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
