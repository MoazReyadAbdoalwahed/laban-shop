import { Link } from "react-router-dom";
import { FallbackImg } from "../common/ImageUtils";

interface Iproductitem {
    id: string | number;
    img: string;
    title: string;
}

function Productitem({ id, img, title }: Iproductitem) {
    return (
        <div className="border p-4 rounded-lg text-center shadow-sm">
            <Link to={`/product/${id}`}>
                <FallbackImg
                    src={img}
                    alt={title}
                    className="w-full h-48 object-cover mb-2"
                />
                <p className="font-bold">{title}</p>
            </Link>
        </div>
    );
}

export default Productitem;
