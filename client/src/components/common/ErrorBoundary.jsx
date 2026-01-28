import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container" style={{
                    height: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}>
                    <div className="brute-frame" style={{ maxWidth: '600px', padding: '2rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-danger)' }}>
                            SYSTEM FAILURE
                        </h2>
                        <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
                            Something went wrong in the application core.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div style={{
                                background: '#333',
                                padding: '1rem',
                                marginBottom: '2rem',
                                textAlign: 'left',
                                overflow: 'auto',
                                border: '1px solid #555'
                            }}>
                                <code style={{ color: '#ff5555' }}>
                                    {this.state.error.toString()}
                                </code>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => window.location.reload()}
                            >
                                RELOAD SYSTEM
                            </button>
                            <a href="/" className="btn btn-secondary">
                                RETURN HOME
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
