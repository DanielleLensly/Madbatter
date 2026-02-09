import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)'
        }}>
          <div style={{
            maxWidth: '500px',
            textAlign: 'center',
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ color: '#c98276', fontSize: '3rem', margin: '0 0 1rem 0' }}>😕</h1>
            <h2 style={{ color: '#333', marginBottom: '1rem' }}>Oops! Something went wrong</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              We're sorry for the inconvenience. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #c98276, #d29985)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(201, 130, 118, 0.3)'
              }}
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ marginTop: '2rem', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#666' }}>Error Details</summary>
                <pre style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: '#f5f5f5',
                  borderRadius: '0.5rem',
                  overflow: 'auto',
                  fontSize: '0.875rem',
                  color: '#d32f2f'
                }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
