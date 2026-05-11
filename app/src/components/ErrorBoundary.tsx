import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  open: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, open: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, open: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                We&apos;re sorry — an unexpected error occurred.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button onClick={this.handleReload}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reload page
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go home
                  </Link>
                </Button>
              </div>

              <Collapsible
                open={this.state.open}
                onOpenChange={(open) => this.setState({ open })}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full">
                    Technical details
                    <ChevronDown
                      className={`ml-2 h-4 w-4 transition-transform ${this.state.open ? 'rotate-180' : ''}`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 rounded-md bg-muted p-3 text-xs font-mono text-muted-foreground space-y-2">
                    <p className="font-semibold text-foreground">{this.state.error.message}</p>
                    {this.state.error.stack && (
                      <pre className="whitespace-pre-wrap break-words text-[11px] leading-relaxed opacity-80">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
