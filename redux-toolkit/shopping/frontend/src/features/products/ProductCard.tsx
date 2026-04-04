import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import type { IProduct } from '../../app/type';
import { addToCart } from '../cart/cartThunk';
import { deleteProductFromDb } from './productThunk';

interface ProductCardProp {
  product: IProduct;
  onEdit: (product: IProduct) => void;
}

const ProductCard = ({ product, onEdit }: ProductCardProp) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product._id }));
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      dispatch(deleteProductFromDb(product._id));
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <h3 className="text-slate-800 font-semibold text-base">{product.name}</h3>
      <p className="text-teal-600 font-bold text-lg">${product.price}</p>
      <p
        className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${isOutOfStock ? 'bg-red-50 text-red-500' : 'bg-teal-50 text-teal-600'}`}
      >
        {isOutOfStock ? 'Out of Stock' : `In Stock: ${product.stock}`}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
        >
          Delete
        </button>
      </div>

      <button
        disabled={isOutOfStock}
        onClick={handleAddToCart}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 ${
          isOutOfStock
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-teal-600 hover:bg-teal-700 text-white'
        }`}
      >
        Add to Cart
      </button>
    </article>
  );
};

export default ProductCard;
