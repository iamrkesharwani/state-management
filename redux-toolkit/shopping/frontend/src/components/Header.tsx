import CartSummary from '../features/cart/CartSummary';

const Header = () => {
  return (
    <div className="bg-teal-700 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-white text-xl font-semibold tracking-wide">
          My Store
        </h1>
        <CartSummary />
      </div>
    </div>
  );
};

export default Header;
