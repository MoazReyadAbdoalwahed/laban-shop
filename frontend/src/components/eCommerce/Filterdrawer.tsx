import { FaSlidersH } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import FilterCheckboxGroup from './Filtercheckboxgroup'
import { categories, subCategories } from '../../constants/filterOptions'

interface FilterDrawerProps {
    filterOpen: boolean
    myCategory: string[]
    subCategory: string[]
    expandedSections: Record<string, boolean>
    onToggleCategory: (e: React.ChangeEvent<HTMLInputElement>) => void
    onToggleSubCategory: (e: React.ChangeEvent<HTMLInputElement>) => void
    onToggleSection: (section: string) => void
    onClose: () => void
    onClearAll: () => void
}

function FilterDrawer({
    filterOpen,
    myCategory,
    subCategory,
    expandedSections,
    onToggleCategory,
    onToggleSubCategory,
    onToggleSection,
    onClose,
    onClearAll,
}: FilterDrawerProps) {
    const { t } = useTranslation()
    const activeCount = myCategory.length + subCategory.length

    return (
        <div
            className={`fixed inset-0 z-50 transition-all duration-300 ease-out ${filterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
        >
            {/* Backdrop */}
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                className={`absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto transition-transform duration-300 ease-out ${filterOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Drawer Header */}
                <div className='sticky top-0 z-10 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <FaSlidersH className='w-5 h-5 text-gray-700' />
                        <h2 className='font-bold text-lg'>{t('filters')}</h2>
                        {activeCount > 0 && (
                            <span className='bg-black dark:bg-white text-white dark:text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center'>
                                {activeCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                    >
                        <IoClose className='w-5 h-5 text-gray-500' />
                    </button>
                </div>

                {/* Drawer Content */}
                <div className='p-5 space-y-6'>
                    {/* Category */}
                    <FilterCheckboxGroup
                        title={t('category')}
                        sectionKey='category'
                        options={categories}
                        selected={myCategory}
                        expanded={expandedSections.category}
                        onToggleSection={onToggleSection}
                        onToggleOption={onToggleCategory}
                    />

                    {/* Type */}
                    <FilterCheckboxGroup
                        title={t('type')}
                        sectionKey='type'
                        options={subCategories}
                        selected={subCategory}
                        expanded={expandedSections.type}
                        onToggleSection={onToggleSection}
                        onToggleOption={onToggleSubCategory}
                    />
                </div>

                {/* Drawer Footer */}
                <div className='sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 flex gap-3'>
                    <button
                        onClick={() => {
                            onClearAll()
                            onClose()
                        }}
                        className='flex-1 py-3 px-4 border border-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors'
                    >
                        {t('clearAll')}
                    </button>
                    <button
                        onClick={onClose}
                        className='flex-1 py-3 px-4 bg-black dark:bg-white dark:text-black text-white rounded-xl font-semibold text-sm hover:bg-gray-100 dark:hover:bg-black transition-colors'
                    >
                        {t('showResults')}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FilterDrawer