import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { WifiOff, Home, Map, RotateCcw, BookOpen, ListChecks } from 'lucide-react';

export function OfflinePage() {
  const handleTryAgain = () => {
    window.location.reload();
  };

  return (
    <div className="pp-container py-20">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
          <WifiOff className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">You are offline</h1>
          <p className="text-lg text-muted-foreground">
            PropertyPath requires an internet connection to load content.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Some pages may still be available if they were previously visited and cached.
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={handleTryAgain} className="w-full sm:w-auto mx-auto">
            <RotateCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
        <div className="pt-6 border-t">
          <p className="text-sm font-medium text-muted-foreground mb-4">
            Cached pages that might work:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/journey">
                <Map className="mr-2 h-4 w-4" />
                Journey overview
              </Link>
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-3">
            <Button variant="outline" asChild>
              <Link to="/reference">
                <BookOpen className="mr-2 h-4 w-4" />
                Reference
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/checklists">
                <ListChecks className="mr-2 h-4 w-4" />
                Checklists
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
