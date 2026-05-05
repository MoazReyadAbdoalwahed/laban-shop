import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useMemo } from "react"
import { FetchSingleProduct } from '../store/product.tsx/thunk/thunkGetProducts';
import FetchProducts from '../store/product.tsx/thunk/thunkGetProducts';
import FetchCart from '../store/cart/thunk/ThunkGetCart';
import { addToCartAPI } from '../store/cart/thunk/ThunkCartAPI';
import { addtocart as addToCart } from "../store/cart/CartSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { FaArrowLeft } from 'react-icons/fa'
import type { Product } from '../types/product'
import { FallbackImg } from '../components/common/ImageUtils'

function ProductPage() {
    const { t } = useTranslation()
    const { id } = useParams()
    const navigate = useNavigate()

    const dispatch = useAppDispatch();
    const { loading, error, selectedProduct, items } = useAppSelector((state) => state.products);
    const { items: cartItems } = useAppSelector((state) => state.cart);
    const { token } = useAppSelector((state) => state.auth);

    const product = selectedProduct;
    const isAdded = product ? String(product.id) in cartItems : false;

    useEffect(() => {
        if (id) {
            dispatch(FetchSingleProduct(id));
        }
    }, [dispatch, id]);

    // Fetch all products if not already loaded (for related products)
    useEffect(() => {
        if (!items || items.length === 0) {
            dispatch(FetchProducts(''))
        }
    }, [dispatch, items])

    // Related products: same category, exclude current product, max 4
    const relatedProducts = useMemo(() => {
        if (!product || !Array.isArray(items)) return []
        return items
            .filter(
                (item: Product) =>
                    item.category === product.category &&
                    String(item.id) !== String(product.id)
            )
            .slice(0, 4)
    }, [items, product])

    function addtocartfun(id: string) {
        dispatch(addToCart(id))
        if (token) {
            // Wait for API to complete, then fetch cart
            dispatch(addToCartAPI({ productId: id, quantity: 1 })).then(() => {
                dispatch(FetchCart())
            });
        } else {
            // If not logged in, just fetch local cart items
            dispatch(FetchCart())
        }
    }

    return (
        <>
            <div className="py-8 px-4 sm:px-8 lg:px-16">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
                >
                    <FaArrowLeft />
                    {t('back', 'Back')}
                </button>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
                        <p className="font-semibold mb-2">Error loading product:</p>
                        <p>{error}</p>
                    </div>
                )}

                {loading === 'pending' && !product ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
                            <p className="text-gray-600">{t('loading', 'Loading product...')}</p>
                        </div>
                    </div>
                ) : product ? (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto"
                        >
                            {/* Image */}
                            <div className="relative h-96 md:h-125 overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center">
                                {product.img ? (
                                    <FallbackImg
                                        src={product.img}
                                        alt={product.title || 'Product'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <p>{t('noImage', 'No image available')}</p>
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex flex-col gap-6 justify-center">
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">
                                        {product.category || 'Category'} {product.subcategory ? `/ ${product.subcategory}` : ''}
                                    </p>
                                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                                        {product.title || 'Product Title'}
                                    </h1>
                                </div>

                                <p className="text-3xl font-bold text-orange-600">
                                    {product.price ? `${product.price} EGP` : 'Price N/A'}
                                </p>

                                {product.description && (
                                    <p className="text-gray-600 leading-relaxed">
                                        {product.description}
                                    </p>
                                )}

                                <button
                                    className={`w-full py-3.5 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${isAdded
                                        ? 'bg-[#ff6900] text-white hover:bg-[#ff5900]'
                                        : 'bg-black text-white hover:bg-gray-800'
                                        }`}
                                    onClick={() => addtocartfun(String(product.id))}
                                    disabled={isAdded}
                                >
                                    {isAdded ? t('added', 'Added to Cart') : t('addToCart', 'Add to Cart')}
                                </button>
                            </div>
                        </motion.div>

                        {/* ── Related Products ── */}
                        {relatedProducts.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mt-20 max-w-7xl mx-auto"
                            >
                                {/* Section Header */}
                                <div className="text-center mb-12">
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        <span className="h-0.5 w-12 bg-linear-to-r from-transparent to-gray-400"></span>
                                        <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-widest">
                                            {t('relatedProducts', 'Related Products')}
                                        </p>
                                        <span className="h-0.5 w-12 bg-linear-to-l from-transparent to-gray-400"></span>
                                    </div>
                                    <h2 className="prata-regular text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4">
                                        {t('moreOptions', 'More Options')}
                                    </h2>
                                    <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                                        {t('discoverProducts', 'Discover similar products from the same category')}
                                    </p>
                                </div>

                                {/* Grid: lg 4, md 2, sm 1 */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {relatedProducts.map((item: Product, index: number) => {
                                        const relatedIsAdded = String(item.id) in cartItems
                                        return (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 0.08 * index }}
                                                whileHover={{ y: -8, scale: 1.02 }}
                                                className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 cursor-pointer"
                                                onClick={() => navigate(`/product/${item.id}`)}
                                            >
                                                {/* Image Container */}
                                                <div className="relative h-72 overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-10"></div>
                                                    <FallbackImg
                                                        src={item.img}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>

                                                {/* Info */}
                                                <div className="p-4 sm:p-5 flex flex-col gap-3">
                                                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-lg sm:text-xl font-bold text-orange-600">
                                                        {item.price} EGP
                                                    </p>
                                                    <p className="text-xs text-gray-500 capitalize">
                                                        {item.category}
                                                    </p>
                                                </div>

                                                {/* Button */}
                                                <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            addtocartfun(String(item.id))
                                                        }}
                                                        disabled={relatedIsAdded}
                                                        className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${relatedIsAdded
                                                            ? 'bg-[#ff6900] text-white hover:bg-[#ff5900] shadow-md'
                                                            : 'bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                                                            }`}
                                                    >
                                                        {relatedIsAdded ? '✓ ' + t('added', 'Added') : t('addToCart', 'Add to Cart')}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">{t('productNotFound', 'Product not found')}</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default ProductPage
