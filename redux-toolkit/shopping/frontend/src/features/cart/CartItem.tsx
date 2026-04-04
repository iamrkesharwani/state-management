import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import type { ICartItem } from '../../app/type';
import { addToCart, decrementFromCart, removeCartItem } from './cartThunk';

interface CartItemProps {
  item: ICartItem;
}

const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-slate-800 text-sm font-medium truncate">
          {item.name}
        </div>
        <div className="text-teal-600 text-sm font-semibold">${item.price}</div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => dispatch(decrementFromCart(item.productId))}
          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center transition-colors"
        >
          -
        </button>
        <span className="w-6 text-center text-sm font-semibold text-slate-700">
          {item.quantity}
        </span>
        <button
          onClick={() => dispatch(addToCart({ productId: item.productId }))}
          className="w-6 h-6 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-700 font-bold text-sm flex items-center justify-center transition-colors"
        >
          +
        </button>
      </div>

      <button
        onClick={() => dispatch(removeCartItem(item.productId))}
        className="text-xs text-slate-300 hover:text-red-400 font-medium transition-colors"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
