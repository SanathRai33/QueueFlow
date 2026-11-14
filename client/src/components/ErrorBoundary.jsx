import { Component } from 'react';

class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error) {
        console.error(error);
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold">Something broke on this page</h1>
                    <p className="mt-2 text-slate-500">Reload and try again</p>
                    <a
                        href="/"
                        className="mt-6 inline-block rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2"
                    >
                        Reload
                    </a>
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;