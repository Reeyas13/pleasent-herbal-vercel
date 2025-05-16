import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  let images = [];
  try {
    images = JSON.parse(product.imageUrls);
  } catch (e) {
    // If parsing fails, assume it's already an array or handle the error
    images = Array.isArray(product.imageUrls) ? product.imageUrls : ['/placeholder.jpg'];
  }

  return (
    <Link 
      to={`/products/${product.slug}`} 
      className="w-full bg-white shadow-md rounded-xl duration-300 hover:scale-105 hover:shadow-xl"
    >
      <img 
        src={process.env.REACT_APP_API_BASE_URL + images[0]} 
        alt={product.name} 
        className="h-64 w-full object-cover rounded-t-xl"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-black truncate block capitalize">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-semibold text-black">Rs {product.price}</p>
          {product.featured && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              Featured
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
export default ProductCard