import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
  info?: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // log to console for developer
    // eslint-disable-next-line no-console
    console.error('Unhandled error caught by ErrorBoundary:', error, info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      const message = this.state.error?.message ?? 'Unknown error';
      const stack = this.state.error?.stack ?? this.state.info?.componentStack ?? '';

      return (
        <div style={{ padding: 24, fontFamily: 'Inter, sans-serif' }}>
          <h2 style={{ color: '#b91c1c' }}>An unexpected error occurred</h2>
          <p style={{ color: '#374151' }}>{message}</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#111827', color: '#f8fafc', padding: 12, borderRadius: 6, overflowX: 'auto' }}>
            {stack}
          </pre>
          <p style={{ marginTop: 12, color: '#6b7280' }}>
            Check the terminal or browser console for more details.
          </p>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
