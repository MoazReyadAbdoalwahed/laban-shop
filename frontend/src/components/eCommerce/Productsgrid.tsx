import type { Product } from '../../types/product'
import { useTranslation } from 'react-i18next'
import Loading from '../feedback/Loading/Loading'
import ProductCard from './Productcard'

interface ProductsGridProps {
    products: Product[]
    cartItems: Product[]
    loading: boolean
    error: string | null
    searchQuery: string
    sortProduct: string
    myCategory: string[]
    subCategory: string[]
    onSort: (val: string) => void
    onAddToCart: (id: string) => void
    onClearAll: () => void
}

function ProductsGrid({
    products,
    cartItems,
    loading,
    error,
    searchQuery,
    sortProduct,
    myCategory,
    subCategory,
    onSort,
    onAddToCart,
    onClearAll,
}: ProductsGridProps) {
    const { t } = useTranslation()
    const hasActiveFilters = searchQuery || myCategory.length > 0 || subCategory.length > 0

    return (
        <div className='flex-1'>
            {/* Header + Sort */}
            <div className='mb-8'>
                <div className='flex items-center justify-between mb-6'>
                    <h2>{t('all')} <span className='text-gray-400 font-normal'>{t('products')}</span></h2>
                    <div className='h-1 flex-1 ml-4 bg-gradient-to-r from-gray-300 to-transparent'></div>
                </div>

                <div className='flex items-center justify-between'>
                    <p className='text-sm text-gray-500'>
                        {products.length} {products.length !== 1 ? t('productsFound') : t('productFound')}
                    </p>
                    <select
                        onChange={(e) => onSort(e.target.value)}
                        value={sortProduct}
                        className='border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 cursor-pointer'
                    >
                        <option value='Relevant'>{t('sortBy')} {t('relevant')}</option>
                        <option value='Low to High'>{t('sortBy')} {t('priceLowToHigh')}</option>
                        <option value='High to Low'>{t('sortBy')} {t('priceHighToLow')}</option>
                    </select>
                </div>
            </div>

            <Loading loading={loading} error={error}>
                {products.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-20'>
                        <span className='text-6xl mb-4'>🧀</span>
                        <p className='text-xl font-semibold text-gray-800 mb-2'>{t('noProductsFound')}</p>
                        <p className='text-sm text-gray-500 mb-6'>
                            {searchQuery
                                ? t('tryRemovingFilters')
                                : t('tryRemovingFilters')}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={onClearAll}
                                className='px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium'
                            >
                                {t('clearAllFilters')}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {products.map((item: Product) => {
                            const isAdded =
                                Array.isArray(cartItems) &&
                                cartItems.some(
                                    (cartItem: Product) => String(cartItem.id) === String(item.id)
                                )
                            return (
                                <ProductCard
                                    key={item.id}
                                    item={item}
                                    isAdded={isAdded}
                                    onAddToCart={onAddToCart}
                                />
                            )
                        })}
                    </div>
                )}
            </Loading>
        </div>
    )
}

export default ProductsGrid
