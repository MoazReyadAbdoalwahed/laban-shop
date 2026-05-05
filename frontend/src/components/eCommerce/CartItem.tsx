import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FaMinus, FaPlus, FaTimes } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import Loading from '../feedback/Loading/Loading'
import { FallbackImg } from '../common/ImageUtils'
import {
    removeFromCartAPI,
    updateCartItemAPI,
    syncCartFromBackend
} from '../../store/cart/thunk/ThunkCartAPI'
import { removeItem, changeQuantity } from '../../store/cart/CartSlice'
import FetchCart from '../../store/cart/thunk/ThunkGetCart'

const fadeUpItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } }
}

const Cartitem = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation()
    const { loading, error, productFullinformation, items } = useAppSelector((state) => state.cart);
    const { token } = useAppSelector((state) => state.auth);

    // Sync cart from backend on mount if user is logged in, then fetch products
    useEffect(() => {
        if (token) {
            // Sync cart from backend first
            const syncPromise = dispatch(syncCartFromBackend());

            // After sync completes, fetch the product details
            syncPromise.then(() => {
                dispatch(FetchCart());
            }).catch(() => {
                // Even if sync fails, still try to fetch cart
                dispatch(FetchCart());
            });
        } else {
            // If not logged in, just fetch cart items from local state
            const hasItems = Object.keys(items).length > 0;
            if (hasItems) {
                dispatch(FetchCart());
            }
        }
    }, [dispatch, token]);

    const handleQuantityChange = (id: number | string, qty: number) => {
        const productId = String(id);
        if (qty <= 0) {
            // qty 0 or negative → remove
            if (token) {
                dispatch(removeFromCartAPI(productId));
            } else {
                dispatch(removeItem(productId));
            }
            return;
        }
        if (token) {
            dispatch(updateCartItemAPI({ productId, quantity: qty }));
        } else {
            dispatch(changeQuantity({ id: productId, qty }));
        }
    };

    const decrement = (productId: number | string) => {
        const id = String(productId);
        const current = items[id] || 0;
        handleQuantityChange(productId, current - 1);
    };

    const increment = (productId: number | string) => {
        const id = String(productId);
        const current = items[id] || 0;
        handleQuantityChange(productId, current + 1);
    };

    function remover(id: number | string) {
        const productId = String(id);
        if (token) {
            dispatch(removeFromCartAPI(productId));
        } else {
            dispatch(removeItem(productId));
        }
    };

    return (
        <Loading loading={loading} error={error}>
            <div className='flex flex-col gap-4'>
                {productFullinformation
                    .filter(product => {
                        const qty = items[String(product.id)] || 0;
                        return qty > 0;
                    })
                    .map((product, index) => {
                        const id = String(product.id);
                        const qty = items[id] || 0;
                        const subtotal = Number(product.price) * qty;

                        return (
                            <motion.div
                                key={product.id}
                                className='flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow'
                                variants={fadeUpItem}
                                initial='hidden'
                                animate='visible'
                                transition={{ delay: index * 0.08 }}
                            >
                                {/* Image */}
                                <div className='shrink-0'>
                                    <FallbackImg
                                        src={product.img}
                                        alt={product.title}
                                        className='w-24 h-28 object-cover rounded-xl bg-gray-50'
                                    />
                                </div>

                                {/* Info */}
                                <div className='flex-1 min-w-0'>
                                    <h2 className='font-bold text-gray-900 text-base sm:text-lg truncate'>{product.title}</h2>
                                    <p className='text-gray-500 text-sm mt-0.5'>{product.price} EGP / {t('item', 'item')}</p>
                                    <p className='text-orange-600 font-bold text-sm mt-1 sm:hidden'>
                                        {subtotal.toFixed(2)} EGP
                                    </p>
                                </div>

                                {/* Quantity Stepper */}
                                <div className='flex items-center gap-3'>
                                    <button
                                        onClick={() => decrement(product.id)}
                                        className='w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-colors'
                                        aria-label='Decrease quantity'
                                    >
                                        <FaMinus size={10} />
                                    </button>
                                    <input
                                        type='number'
                                        min='0'
                                        inputMode='numeric'
                                        className='w-12 h-8 text-center border border-gray-200 rounded-lg text-sm font-semibold outline-none focus:border-orange-400 transition-colors'
                                        value={qty}
                                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                                    />
                                    <button
                                        onClick={() => increment(product.id)}
                                        className='w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-colors'
                                        aria-label='Increase quantity'
                                    >
                                        <FaPlus size={10} />
                                    </button>
                                </div>

                                {/* Subtotal — hidden on mobile, shown on sm+ */}
                                <div className='hidden sm:block text-right min-w-20'>
                                    <p className='text-sm text-gray-400'>{t('subtotal', 'Subtotal')}</p>
                                    <p className='text-orange-600 font-bold'>{subtotal.toFixed(2)} EGP</p>
                                </div>

                                {/* Remove */}
                                <button
                                    onClick={() => remover(product.id)}
                                    className='shrink-0 w-9 h-9 rounded-full border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-50 hover:border-red-400 transition-colors'
                                    aria-label={t('remove', 'Remove')}
                                    title={t('remove', 'Remove')}
                                >
                                    <FaTimes size={12} />
                                </button>
                            </motion.div>
                        );
                    })}
            </div>
        </Loading>
    );
}

export default Cartitem
