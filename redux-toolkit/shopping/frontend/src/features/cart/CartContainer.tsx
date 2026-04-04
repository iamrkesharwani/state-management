import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../app/store';
import { clearCart } from './cartThunk';
import CartItem from './CartItem';

const CartContainer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.cart);

  if (items.length <= 0) {
    return (
      <aside className="w-80 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <p className="text-slate-400 text-sm text-center">
          Your cart is empty.
        </p>
      </aside>
    );
  }

  return (
    <aside className="w-80 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-slate-800 font-bold text-lg">Shopping Cart</h2>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <CartItem key={item._id} item={item} />
        ))}
      </div>

      <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
        <p className="text-slate-500 text-sm font-medium">Estimated Total:</p>
        <span className="text-teal-600 font-bold text-lg">
          $
          {items
            .reduce((total, item) => total + item.quantity * item.price, 0)
            .toFixed(2)}
        </span>
      </div>
    </aside>
  );
};

export default CartContainer;
