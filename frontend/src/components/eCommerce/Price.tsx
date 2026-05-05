import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectCartTotalPrice } from '../../store/cart/selectors/Selectors'
import { clearCartAPI } from '../../store/cart/thunk/ThunkCartAPI'

const Price = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const totalPrice = useAppSelector(selectCartTotalPrice)
    const { productFullinformation, items } = useAppSelector((state) => state.cart)
    const { token } = useAppSelector((state) => state.auth)

    const itemCount = productFullinformation.reduce((count, product) => {
        return count + (items[String(product.id)] || 0)
    }, 0)

    const subtotal = totalPrice

    const handleClearCart = () => {
        if (window.confirm(t('confirmClearCart', 'Are you sure you want to clear your cart?'))) {
            dispatch(clearCartAPI());
        }
    }

    return (
        <motion.div
            className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
            <h3 className='font-bold text-lg mb-5 pl-3 border-l-4 border-orange-500' style={{ fontFamily: 'Playfair Display,serif' }}>
                {t('orderSummary', 'Order Summary')}
            </h3>

            <div className='flex flex-col gap-4'>
                <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-500'>
                        {t('subtotal', 'Subtotal')} ({itemCount} {itemCount === 1 ? t('item', 'item') : t('items', 'items')})
                    </span>
                    <span className='font-semibold text-gray-900'>{subtotal.toFixed(2)} EGP</span>
                </div>

                <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-500'>{t('shipping', 'Shipping')}</span>
                    <span className='font-semibold text-green-600'>{t('free', 'Free')}</span>
                </div>

                <div className='border-t border-gray-100 pt-4'>
                    <div className='flex justify-between items-center'>
                        <span className='text-lg font-bold text-gray-900'>{t('total', 'Total')}</span>
                        <span className='text-xl font-bold text-orange-600'>{totalPrice.toFixed(2)} EGP</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/placeorder')}
                    className='w-full bg-[#0f1e35] hover:bg-[#1a3a5c] text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all hover:-translate-y-1 mt-2'
                >
                    {t('checkout', 'Proceed to Checkout')}
                </button>

                {token && (
                    <button
                        onClick={handleClearCart}
                        className='w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-6 py-2.5 rounded-xl text-sm transition-all'
                    >
                        {t('clearCart', 'Clear Cart')}
                    </button>
                )}

                <Link
                    to='/categories'
                    className='block text-center text-sm text-gray-500 hover:text-orange-500 transition-colors'
                >
                    {t('continueShopping', 'Continue Shopping')}
                </Link>
            </div>
        </motion.div>
    )
}

export default Price
