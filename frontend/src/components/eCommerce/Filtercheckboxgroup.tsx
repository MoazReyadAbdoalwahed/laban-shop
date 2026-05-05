import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

import { useTranslation } from 'react-i18next';

interface CheckboxOption {
    value: string
    label?: string
    labelKey?: string
    emoji?: string
}

interface FilterCheckboxGroupProps {
    title: string
    sectionKey: string
    options: CheckboxOption[]
    selected: string[]
    expanded: boolean
    onToggleSection: (key: string) => void
    onToggleOption: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function FilterCheckboxGroup({
    title,
    sectionKey,
    options,
    selected,
    expanded,
    onToggleSection,
    onToggleOption,
}: FilterCheckboxGroupProps) {
    const { t } = useTranslation();

    return (
        <div className='bg-gray-50 rounded-xl p-4'>
            <button
                onClick={() => onToggleSection(sectionKey)}
                className='w-full flex items-center justify-between'
            >
                <h3 className='font-bold text-gray-900 text-sm tracking-wide'>{title}</h3>
                {expanded ? (
                    <FaChevronUp className='w-4 h-4 text-gray-500' />
                ) : (
                    <FaChevronDown className='w-4 h-4 text-gray-500' />
                )}
            </button>

            {expanded && (
                <div className='mt-4 flex flex-col gap-3'>
                    {options.map(({ value, labelKey, emoji }) => (
                        <label key={value} className='flex items-center gap-3 cursor-pointer group'>
                            <input
                                type='checkbox'
                                value={value}
                                checked={selected.includes(value)}
                                onChange={onToggleOption}
                                className='w-5 h-5 accent-orange-500 rounded'
                            />
                            <span className='text-sm text-gray-700 group-hover:text-gray-900 transition-colors'>
                                {labelKey ? `${t(labelKey)} ${emoji || ''}` : value}
                            </span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FilterCheckboxGroup