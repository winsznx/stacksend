import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error);
      }
      return this.props.fallback || (
        <div className="p-4 rounded-lg bg-red-50 text-red-900 border border-red-200">
          <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
          <p className="text-sm font-mono whitespace-pre-wrap">{this.state.error.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export type {};
