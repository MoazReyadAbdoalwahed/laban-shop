import { useState, useCallback } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const PLACEHOLDER = 'https://placehold.co/400x300/eee/ccc?text=No+Image';

/**
 * Resolves the image src to a fully qualified URL.
 * - Already absolute (http/https)  → use as-is
 * - Relative path (/uploads/...)   → prefix with BASE_URL
 * - Anything else                  → prefix with BASE_URL + "/"
 */
function resolveUrl(src: string): string {
    if (!src) return PLACEHOLDER;
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    if (src.startsWith('/')) return `${BASE_URL}${src}`;
    return `${BASE_URL}/${src}`;
}

type FallbackStage = 'resolved' | 'placeholder';

export function useImageFallback(originalSrc: string, className?: string) {
    const resolved = resolveUrl(originalSrc);
    const [src, setSrc] = useState<string>(resolved);
    const [stage, setStage] = useState<FallbackStage>('resolved');

    const handleError = useCallback(() => {
        if (stage === 'resolved') {
            // First failure → show placeholder
            setSrc(PLACEHOLDER);
            setStage('placeholder');
        }
        // Already on placeholder, do nothing (prevents infinite loop)
    }, [stage]);

    return {
        src,
        onError: handleError,
        imgProps: {
            src,
            onError: handleError,
            className,
            loading: 'lazy' as const,
        },
    };
}

interface FallbackImgProps {
    src: string;
    alt: string;
    className?: string;
}

export function FallbackImg({ src, alt, className }: FallbackImgProps) {
    const { imgProps } = useImageFallback(src, className);
    return <img {...imgProps} alt={alt} />;
}