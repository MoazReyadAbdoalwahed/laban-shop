import { FaSlidersH } from 'react-icons/fa'
import FilterCheckboxGroup from './Filtercheckboxgroup'
import { categories, subCategories } from '../../constants/filterOptions'
import { useTranslation } from 'react-i18next'

interface FilterSidebarProps {
    myCategory: string[]
    subCategory: string[]
    expandedSections: Record<string, boolean>
    onToggleCategory: (e: React.ChangeEvent<HTMLInputElement>) => void
    onToggleSubCategory: (e: React.ChangeEvent<HTMLInputElement>) => void
    onToggleSection: (section: string) => void
    onClearAll: () => void
}

function FilterSidebar({
    myCategory,
    subCategory,
    expandedSections,
    onToggleCategory,
    onToggleSubCategory,
    onToggleSection,
    onClearAll,
}: FilterSidebarProps) {
    const { t } = useTranslation()
    const activeCount = myCategory.length + subCategory.length

    return (
        <div className='hidden lg:block w-64 shrink-0'>
            <div className='sticky top-24 space-y-6'>
                {/* Header */}
                <div className='flex items-center gap-2 pb-4 border-b border-gray-200'>
                    <FaSlidersH className='w-5 h-5 text-gray-700' />
                    <p className='font-bold text-lg tracking-wide'>FILTERS</p>
                    {activeCount > 0 && (
                        <span className='bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center'>
                            {activeCount}
                        </span>
                    )}
                </div>

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

                {/* Clear Filters */}
                {activeCount > 0 && (
                    <button
                        onClick={onClearAll}
                        className='w-full py-2.5 text-sm text-gray-500 hover:text-orange-500 border border-gray-200 rounded-lg hover:border-orange-200 transition-colors'
                    >
                        {t('clearAllFilters')}
                    </button>
                )}
            </div>
        </div>
    )
}

export default FilterSidebar