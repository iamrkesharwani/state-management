import type { RootState, AppDispatch } from '../../app/store';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart } from './cartThunk';
import { useEffect } from 'react';

const CartSummary = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCart());
    }
  }, [status, dispatch]);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  return (
    <div className="flex items-center gap-4">
      <div className="bg-teal-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
        {totalItems}
      </div>
      <p className="text-teal-100 text-sm font-medium">
        Total: ${totalPrice.toFixed(2)}
      </p>
    </div>
  );
};

export default CartSummary;
