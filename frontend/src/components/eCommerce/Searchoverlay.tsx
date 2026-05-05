import { useRef, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
interface SearchOverlayProps {
    searchOpen: boolean
    searchQuery: string
    onClose: () => void
    onQueryChange: (q: string) => void
}

function SearchOverlay({ searchOpen, searchQuery, onClose, onQueryChange }: SearchOverlayProps) {
    const { t } = useTranslation()
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Focus input when search opens
    useEffect(() => {
        if (searchOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 50)
        }
    }, [searchOpen])

    // Clear search when closing
    useEffect(() => {
        if (!searchOpen) {
            const timeoutId = setTimeout(() => onQueryChange(''), 0)
            return () => clearTimeout(timeoutId)
        }
    }, [searchOpen])

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [onClose])

    return (
        <div
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out ${searchOpen
                ? 'translate-y-0 opacity-100 pointer-events-auto'
                : '-translate-y-full opacity-0 pointer-events-none'
                }`}
        >
            {/* Backdrop */}
            <div
                className='absolute inset-0 bg-black/20 backdrop-blur-sm'
                onClick={onClose}
            />

            {/* Search Panel */}
            <div className='relative bg-white shadow-xl border-b border-gray-200 px-4 py-5 sm:px-8'>
                <div className='max-w-2xl mx-auto flex items-center gap-3'>
                    {/* Search Icon */}
                    <svg
                        className='w-5 h-5 text-gray-400 shrink-0'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z'
                        />
                    </svg>

                    {/* Input */}
                    <input
                        ref={searchInputRef}
                        type='text'
                        value={searchQuery}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder={t('searchProducts')}
                        className='flex-1 text-base text-gray-800 placeholder-gray-400 outline-none bg-transparent'
                    />

                    {/* Clear button */}
                    {searchQuery && (
                        <button
                            onClick={() => onQueryChange('')}
                            className='text-gray-400 hover:text-gray-600 transition-colors'
                            aria-label={t('clearSearch')}
                        >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6L18 18' />
                            </svg>
                        </button>
                    )}

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className='ml-2 text-gray-400 hover:text-gray-600 transition-colors'
                        aria-label={t('close')}
                    >
                        <IoClose className='w-5 h-5' />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchOverlay