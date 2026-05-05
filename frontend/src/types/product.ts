export interface Product {
    id: number | string;
    title: string;
    price: number;
    category: string;
    description: string;
    img: string;
    images: string[];
    subcategory: string;
    bestseller: boolean;
    date: number;
}