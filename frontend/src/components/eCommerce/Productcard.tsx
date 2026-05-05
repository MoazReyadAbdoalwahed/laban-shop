import type { Product } from '../../types/product'
import { FallbackImg } from '../common/ImageUtils'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface ProductCardProps {
    item: Product
    isAdded: boolean
    onAddToCart: (id: string) => void
}

function ProductCard({ item, isAdded, onAddToCart }: ProductCardProps) {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const handleProductClick = () => {
        navigate(`/product/${item.id}`)
    }

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation()
        onAddToCart(String(item.id))
    }

    return (
        <div className='group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 cursor-pointer' onClick={handleProductClick}>
            {/* Image */}
            <div className='relative h-72 overflow-hidden bg-gray-50'>
                <FallbackImg
                    src={item.img}
                    alt={item.title}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
            </div>

            {/* Info */}
            <div className='p-4 flex flex-col gap-3'>
                <h3 className='font-semibold text-base text-gray-900 line-clamp-2 group-hover:text-black transition-colors'>
                    {item.title}
                </h3>
                <p className='text-lg font-bold text-orange-600'>{item.price} EGP</p>
            </div>

            {/* Button */}
            <div className='px-4 pb-4'>
                <button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${isAdded
                        ? 'bg-[#ff6900] text-white cursor-default'
                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                        }`}
                >
                    {isAdded ? t('added', 'Added') : t('addToCart', 'Add to Cart')}
                </button>
            </div>
        </div>
    )
}

export default ProductCard