interface LoadingProps {
    loading: 'idle' | 'succeeded' | 'failed' | 'pending' | boolean;
    error: string | null;
    children: React.ReactNode;
}

function Loading({ loading, children, error }: LoadingProps) {
    if (loading === 'pending') return <p>Loading...</p>;
    if (loading === 'failed' && error) return <p>Error: {error}</p>;
    return <>{children}</>;
}

export default Loading;
