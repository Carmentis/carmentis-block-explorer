import React from "react";

export class ErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback: React.ComponentType<{ error: Error }> },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError && this.state.error) {
            const FallbackComponent = this.props.fallback;
            return <FallbackComponent error={this.state.error} />;
        }

        return this.props.children;
    }
}
