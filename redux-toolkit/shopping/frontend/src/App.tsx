import Header from './components/Header';
import CartContainer from './features/cart/CartContainer';
import ProductList from './features/products/ProductList';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8 items-start">
        <main className="flex-1 min-w-0">
          <ProductList />
        </main>
        <CartContainer />
      </div>
    </div>
  );
};

export default App;
