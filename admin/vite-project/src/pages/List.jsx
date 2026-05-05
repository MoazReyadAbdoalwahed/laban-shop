import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ token }) => {
    const { t } = useTranslation();
    const [list, setList] = useState([]);

    const fetchList = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}products/listproducts`);
            if (response.data.status === "success") {
                setList(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching list:", error);
            toast.error(t('failedToFetchProducts'));
        }
    };

    const removeProduct = async (id) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}products/removeproduct`,
                {
                    data: { id },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.status === "success") {
                toast.success(t('productRemovedSuccess'));
                await fetchList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Remove error:", error.response);
            if (error.response?.status === 404) {
                toast.error("API Route not found (Check server/routes)");
            } else if (error.response?.status === 401) {
                toast.error(t('sessionExpired'));
            } else {
                toast.error("Error removing product");
            }
        }
    };

    useEffect(() => {
        (async () => {
            await fetchList();
        })();
    }, []);

    return (
        <div className='p-2 sm:p-4 w-full'>
            <p className='mb-3 font-semibold text-base sm:text-lg'>{t('listItems')}</p>
            <div className='flex flex-col gap-2'>
                {/* Desktop header */}
                <div className='hidden lg:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 text-sm font-bold'>
                    <span>{t('image')}</span>
                    <span>{t('productName')}</span>
                    <span>{t('category')}</span>
                    <span>{t('price')}</span>
                    <span className='text-center'>{t('actions')}</span>
                </div>

                {list.length === 0 ? (
                    <div className='py-8 text-center text-gray-500'>
                        {t('noProducts')}
                    </div>
                ) : (
                    <>
                        {list.map((item) => (
                            /* Mobile card */
                            <div key={item._id} className='lg:hidden flex items-center gap-3 py-3 px-4 border rounded-lg bg-white shadow-sm'>
                                <img className='w-14 h-14 object-cover rounded flex-shrink-0' src={item.image?.[0]} alt="" />
                                <div className='flex-1 min-w-0'>
                                    <p className='font-medium text-sm truncate'>{item.name}</p>
                                    <p className='text-xs text-gray-500'>{item.category} · ${item.price}</p>
                                </div>
                                <button
                                    onClick={() => removeProduct(item._id)}
                                    className='px-3 py-1.5 rounded-md bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors flex-shrink-0'
                                >
                                    {t('delete')}
                                </button>
                            </div>
                        ))}

                        {list.map((item) => (
                            /* Desktop row */
                            <div key={`${item._id}-desktop`} className='hidden lg:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-2 px-4 border text-sm hover:bg-gray-50'>
                                <img className='w-12 h-12 object-cover rounded' src={item.image?.[0]} alt="" />
                                <p className='truncate'>{item.name}</p>
                                <p>{item.category}</p>
                                <p>${item.price}</p>
                                <p
                                    onClick={() => removeProduct(item._id)}
                                    className='text-center cursor-pointer text-red-600 font-bold hover:scale-110'
                                    title={t('delete')}
                                >
                                    X
                                </p>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default List;