import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { LuUpload } from "react-icons/lu";
import { AiOutlinePlusCircle } from "react-icons/ai";

const Adding = ({ token }) => {
    const { t } = useTranslation();
    const [images, setImages] = useState([null, null, null, null]);

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            category: "Cheese",
            subCategory: "Fresh",
            bestseller: false
        }
    });

    const handleImageChange = (index, file) => {
        const newImages = [...images];
        newImages[index] = file;
        setImages(newImages);
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("category", data.category);
            formData.append("subcategory", data.subCategory);
            formData.append("bestseller", data.bestseller);
            formData.append("size", JSON.stringify(data.sizes));

            images.forEach((img, index) => {
                if (img) {
                    formData.append(`image${index + 1}`, img);
                }
            });

            const response = await axios.post(`${import.meta.env.VITE_API_URL}products/addproduct`, formData, {
                headers: { Authorization: `Bearer ${token}` },
                'Content-Type': 'multipart/form-data'
            });

            if (response.data.status === "success") {
                alert(t('productAddedSuccess'));
                reset();
                setImages([null, null, null, null]);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                alert(t('sessionExpired'));
            } else {
                alert(error.response?.data?.message || t('errorAddingProduct'));
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-full items-start gap-4 p-2 sm:p-4 text-gray-700'>

            {/* Image Upload Section */}
            <div className='w-full'>
                <p className='mb-2 font-medium'>{t('uploadImages')}</p>
                <div className='flex flex-wrap gap-3'>
                    {images.map((img, index) => (
                        <label key={index} htmlFor={`image${index}`} className='cursor-pointer'>
                            <div className='w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-black transition-all overflow-hidden'>
                                {img ? (
                                    <img src={URL.createObjectURL(img)} className='w-full h-full object-cover' alt="" />
                                ) : (
                                    <LuUpload size={20} className="sm:w-6 sm:h-6" />
                                )}
                            </div>
                            <input
                                onChange={(e) => handleImageChange(index, e.target.files[0])}
                                type="file" id={`image${index}`} hidden
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* Product Name and Description */}
            <div className='w-full max-w-[500px]'>
                <p className='mb-2 font-medium'>{t('productName')}</p>
                <input {...register("name", { required: true })} className='w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-black' type="text" placeholder={t('productName')} />
            </div>

            <div className='w-full max-w-[500px]'>
                <p className='mb-2 font-medium'>{t('description')}</p>
                <textarea {...register("description", { required: true })} className='w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-black' rows={3} placeholder={t('description')} />
            </div>

            {/* Categories and Price */}
            <div className='flex flex-wrap gap-4 w-full'>
                <div className='flex-1 min-w-[120px]'>
                    <p className='mb-2 font-medium'>{t('category')}</p>
                    <select {...register("category")} className='w-full px-3 py-2 border border-gray-300 rounded'>
                        <option value="Cheese">{t('cheese')}</option>
                        <option value="Yogurt">{t('yogurt')}</option>
                        <option value="Butter">{t('butter')}</option>
                        <option value="Cream">{t('cream')}</option>
                    </select>
                </div>
                <div className='flex-1 min-w-[120px]'>
                    <p className='mb-2 font-medium'>{t('subCategory')}</p>
                    <select {...register("subCategory")} className='w-full px-3 py-2 border border-gray-300 rounded'>
                        <option value="Fresh">{t('fresh')}</option>
                        <option value="Aged">{t('aged')}</option>
                        <option value="Smoked">{t('smoked')}</option>
                        <option value="Organic">{t('organic')}</option>
                        <option value="Pickled">{t('pickled')}</option>
                    </select>
                </div>
                <div className='min-w-[100px]'>
                    <p className='mb-2 font-medium'>{t('price')}</p>
                    <input {...register("price", { required: true })} className='w-full sm:w-28 px-3 py-2 border border-gray-300 rounded' type="number" placeholder='25' />
                </div>
            </div>

            {/* Bestseller */}
            <div className='flex gap-2 items-center mt-2'>
                <input {...register("bestseller")} type="checkbox" id='bestseller' className='w-4 h-4 cursor-pointer' />
                <label className='cursor-pointer text-sm' htmlFor="bestseller">{t('bestseller')}</label>
            </div>

            <button type="submit" className='flex items-center justify-center gap-2 w-full sm:w-32 py-3 mt-4 bg-black text-white rounded active:scale-95 transition-all'>
                <AiOutlinePlusCircle size={20} /> {t('addProductBtn')}
            </button>
        </form>
    );
};

export default Adding;