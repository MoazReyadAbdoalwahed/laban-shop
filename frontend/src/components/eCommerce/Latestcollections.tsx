import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useEffect } from 'react'
import FetchProducts from '../../store/product.tsx/thunk/thunkGetProducts'
import FetchCart from '../../store/cart/thunk/ThunkGetCart'
import { addToCartAPI } from '../../store/cart/thunk/ThunkCartAPI'
import { addtocart as addToCart } from '../../store/cart/CartSlice'
import Loading from '../feedback/Loading/Loading'
import { FallbackImg } from '../common/ImageUtils'
import type { Product } from '../../types/product'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
}

const fadeUpItem = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
}

function LatestCollections() {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { loading, error, items } = useAppSelector((state) => state.products)
    const { items: cartItems } = useAppSelector((state) => state.cart)
    const { token } = useAppSelector((state) => state.auth)

    useEffect(() => {
        dispatch(FetchProducts(''))
    }, [dispatch])

    function addToCartFun(id: string) {
        dispatch(addToCart(id))
        if (token) {
            dispatch(addToCartAPI({ productId: id, quantity: 1 }))
        }
        dispatch(FetchCart())
    }

    return (
        <div className='py-12 sm:py-20 px-4 sm:px-8 lg:px-16 bg-linear-to-b from-white to-gray-50'>
            {/* Section Title */}
            <motion.div
                className='text-center mb-12 sm:mb-16'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
            >
                <div className='flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4'>
                    <span className='w-8 sm:w-12 h-0.5 bg-gray-300'></span>
                    <p className='text-gray-500 font-semibold text-xs sm:text-sm tracking-widest'>
                        {t('latest', 'LATEST')}
                    </p>
                    <span className='w-8 sm:w-12 h-0.5 bg-gray-300'></span>
                </div>
                <h2 className='prata-regular text-2xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 sm:mb-6'>
                    {t('collections', 'COLLECTIONS')}
                </h2>
                <p className='text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed'>
                    {t(
                        'collectionsDesc',
                        'Discover our latest collection of premium fashion items. Carefully curated styles that combine quality, comfort, and contemporary design.'
                    )}
                </p>
            </motion.div>

            {/* Product Grid */}
            <Loading loading={loading} error={error}>
                <motion.div
                    className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'
                    variants={containerVariants}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {Array.isArray(items) &&
                        items.slice(0, 8).map((item: Product) => {
                            const isAdded = String(item.id) in cartItems
                            return (
                                <motion.div
                                    key={item.id}
                                    className='group bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 cursor-pointer'
                                    variants={fadeUpItem}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => navigate(`/product/${item.id}`)}
                                >
                                    {/* Image */}
                                    <div className='relative h-56 sm:h-64 md:h-72 overflow-hidden bg-gray-50'>
                                        <FallbackImg
                                            src={item.img}
                                            alt={item.title}
                                            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className='p-3 sm:p-4 flex flex-col gap-2 sm:gap-3'>
                                        <h3 className='font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 group-hover:text-black transition-colors'>
                                            {item.title}
                                        </h3>
                                        <p className='text-base sm:text-lg font-bold text-orange-600'>{item.price} EGP</p>
                                    </div>

                                    {/* Button */}
                                    <div className='px-3 sm:px-4 pb-3 sm:pb-4'>
                                        <button
                                            className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 ${isAdded
                                                ? 'bg-[#ff6900] text-white hover:bg-[#ff5900] shadow-md'
                                                : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                addToCartFun(String(item.id))
                                            }}
                                            disabled={isAdded}
                                        >
                                            {isAdded ? t('added', 'Added') : t('addToCart', 'Add to Cart')}
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        })}
                </motion.div>
            </Loading>
        </div >
    )
}

export default LatestCollections