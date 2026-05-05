import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FaShoppingBag } from 'react-icons/fa'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import CartItem from '../components/eCommerce/CartItem'
import Price from '../components/eCommerce/Price'
import FetchCart from '../store/cart/thunk/ThunkGetCart'

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } }
}

const Cart = () => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { productFullinformation, loading, items } = useAppSelector((state) => state.cart)
    const isEmpty = (productFullinformation.length === 0 || Object.values(items).every((qty: number) => qty === 0)) && loading !== 'pending'

    // Ensure product details are loaded when cart page loads
    useEffect(() => {
        const hasItems = Object.keys(items).length > 0;
        const productsLoaded = productFullinformation.length > 0;

        // If we have items but no product details, fetch them
        if (hasItems && !productsLoaded && loading !== 'pending') {
            dispatch(FetchCart());
        }
    }, [items, productFullinformation.length, loading, dispatch]);

    return (
        <div className='bg-white text-gray-900 min-h-screen'>
            {/* Page Header */}
            <div className='bg-[#f0f4ff] text-center py-14 px-4'>
                <motion.div variants={fadeUp} initial='hidden' animate='visible'>
                    <h1 className='text-4xl sm:text-5xl font-bold mb-3' style={{ fontFamily: 'Playfair Display,serif' }}>
                        {t('yourCart', 'Your Cart')}
                    </h1>
                    <p className='text-gray-500 text-sm leading-relaxed max-w-md mx-auto'>
                        Review your items and proceed to checkout when you are ready.
                    </p>
                </motion.div>
            </div>

            {/* Content */}
            <div className='px-4 sm:px-8 lg:px-16 py-10 max-w-6xl mx-auto'>
                {isEmpty ? (
                    <motion.div
                        className='flex flex-col items-center justify-center py-20'
                        variants={fadeUp}
                        initial='hidden'
                        animate='visible'
                    >
                        <div className='w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6'>
                            <FaShoppingBag size={32} className='text-gray-400' />
                        </div>
                        <h2 className='text-2xl font-bold mb-2'>{t('emptyCart', 'Your cart is empty')}</h2>
                        <p className='text-gray-500 mb-8'>Looks like you have not added anything yet.</p>
                        <Link
                            to='/categories'
                            className='bg-[#0f1e35] hover:bg-[#1a3a5c] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all hover:-translate-y-1'
                        >
                            {t('continueShopping', 'Continue Shopping')}
                        </Link>
                    </motion.div>
                ) : (
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        <motion.div
                            className='lg:col-span-2'
                            variants={fadeUp}
                            initial='hidden'
                            animate='visible'
                        >
                            <CartItem />
                        </motion.div>
                        <motion.div
                            className='lg:col-span-1'
                            variants={fadeUp}
                            initial='hidden'
                            animate='visible'
                            transition={{ delay: 0.1 }}
                        >
                            <div className='lg:sticky lg:top-8'>
                                <Price />
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart

