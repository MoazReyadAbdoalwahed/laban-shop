import { useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import FeatchProducts from '../store/product.tsx/thunk/thunkGetProducts'
import FetchCart from '../store/cart/thunk/ThunkGetCart'
import { addToCartAPI } from '../store/cart/thunk/ThunkCartAPI'
import { addtocart as addToCart } from '../store/cart/CartSlice'
import type { Product } from '../types/product'
import { FaSlidersH } from 'react-icons/fa'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import SearchOverlay from '../components/eCommerce/Searchoverlay'
import FilterSidebar from '../components/eCommerce/Filtersidebar'
import FilterDrawer from '../components/eCommerce/Filterdrawer'
import ProductsGrid from '../components/eCommerce/Productsgrid'

function AllCategories() {
    const { t } = useTranslation()

    const [myCategory, setCategory] = useState<string[]>([])
    const [subCategory, setSubCategory] = useState<string[]>([])
    const [sortProduct, setSortProduct] = useState('Relevant')
    const [filterOpen, setFilterOpen] = useState(false)
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        category: true,
        type: true,
    })
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const dispatch = useAppDispatch()
    const { loading, error, items } = useAppSelector((state) => state.products)
    const cartItems = useAppSelector((state) => state.cart.productFullinformation)
    const { token } = useAppSelector((state) => state.auth)

    useEffect(() => {
        dispatch(FeatchProducts(''))
    }, [dispatch])

    // ── Handlers ────────────────────────────────────────────────

    function addToCartFun(id: string) {
        dispatch(addToCart(id))
        if (token) {
            dispatch(addToCartAPI({ productId: id, quantity: 1 }))
        }
        dispatch(FetchCart())
    }

    function toggleCategory(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value
        setCategory((prev) =>
            prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
        )
    }

    function toggleSubCategory(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value
        setSubCategory((prev) =>
            prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
        )
    }

    function toggleSection(key: string) {
        setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    function clearAllFilters() {
        setCategory([])
        setSubCategory([])
        setSearchQuery('')
    }

    // ── Filtered & Sorted Products ───────────────────────────────

    const filterProducts = useMemo(() => {
        if (!Array.isArray(items)) return []

        let productsCopy: Product[] = [...items]

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            productsCopy = productsCopy.filter(
                (item) =>
                    item.title?.toLowerCase().includes(q) ||
                    item.category?.toLowerCase().includes(q) ||
                    item.subcategory?.toLowerCase().includes(q)
            )
        }

        if (myCategory.length > 0) {
            productsCopy = productsCopy.filter((item) => myCategory.includes(item.category))
        }

        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter((item) => subCategory.includes(item.subcategory))
        }

        switch (sortProduct) {
            case 'Low to High':
                productsCopy = [...productsCopy].sort((a, b) => a.price - b.price)
                break
            case 'High to Low':
                productsCopy = [...productsCopy].sort((a, b) => b.price - a.price)
                break
            default:
                break
        }

        return productsCopy
    }, [items, myCategory, subCategory, sortProduct, searchQuery])

    // ── Render ───────────────────────────────────────────────────

    return (
        <div className='relative'>

            {/* Search Overlay */}
            <SearchOverlay
                searchOpen={searchOpen}
                searchQuery={searchQuery}
                onClose={() => setSearchOpen(false)}
                onQueryChange={setSearchQuery}
            />

            {/* Mobile Filter Button + Search Button */}
            <div className='flex justify-between items-center px-4 sm:px-8 lg:px-16 pt-4'>
                <button
                    onClick={() => setFilterOpen(true)}
                    className='lg:hidden flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:border-orange-500 transition-colors'
                    aria-label={t('openFilters')}
                >
                    <FaSlidersH className='w-4 h-4' />
                    <span>{t('filters')}</span>
                    {(myCategory.length + subCategory.length) > 0 && (
                        <span className='bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center'>
                            {myCategory.length + subCategory.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setSearchOpen(true)}
                    className='flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:border-orange-500 transition-colors'
                    aria-label={t('openSearch')}
                >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z' />
                    </svg>
                    <span className='hidden sm:inline'>{t('search')}</span>
                </button>
            </div>

            {/* Active Search Badge */}
            {searchQuery && (
                <div className='px-4 sm:px-8 lg:px-16 pt-2'>
                    <div className='inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-3 py-1'>
                        <svg className='w-4 h-4 text-orange-500' fill='currentColor' viewBox='0 0 24 24'>
                            <path d='M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z' />
                        </svg>
                        <span>"{searchQuery}"</span>
                        <button
                            onClick={() => setSearchQuery('')}
                            className='hover:text-orange-800 transition-colors'
                            aria-label={t('removeSearchFilter')}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Filter Drawer */}
            <FilterDrawer
                filterOpen={filterOpen}
                myCategory={myCategory}
                subCategory={subCategory}
                expandedSections={expandedSections}
                onToggleCategory={toggleCategory}
                onToggleSubCategory={toggleSubCategory}
                onToggleSection={toggleSection}
                onClose={() => setFilterOpen(false)}
                onClearAll={clearAllFilters}
            />

            {/* Main Layout */}
            <div className='flex gap-8 px-4 sm:px-8 lg:px-16 pt-8 pb-16'>

                {/* Desktop Sidebar */}
                <FilterSidebar
                    myCategory={myCategory}
                    subCategory={subCategory}
                    expandedSections={expandedSections}
                    onToggleCategory={toggleCategory}
                    onToggleSubCategory={toggleSubCategory}
                    onToggleSection={toggleSection}
                    onClearAll={clearAllFilters}
                />

                {/* Products Grid */}
                <ProductsGrid
                    products={filterProducts}
                    cartItems={cartItems}
                    loading={loading === 'pending'}
                    error={error}
                    searchQuery={searchQuery}
                    sortProduct={sortProduct}
                    myCategory={myCategory}
                    subCategory={subCategory}
                    onSort={setSortProduct}
                    onAddToCart={addToCartFun}
                    onClearAll={clearAllFilters}
                />
            </div>
        </div>
    )
}

export default AllCategories