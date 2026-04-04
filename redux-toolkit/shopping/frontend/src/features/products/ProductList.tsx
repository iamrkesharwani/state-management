import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchProducts } from './productThunk';
import ProductCard from './ProductCard';
import Modal from '../../components/Modal';
import ProductForm from './ProductForm';
import type { IProduct } from '../../app/type';

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status, error } = useSelector(
    (state: RootState) => state.products
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleOpenEdit = (product: IProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  if (status === 'loading') {
    return (
      <div className="text-teal-600 font-medium py-4">Loading products...</div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
        Error: {error}
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Inventory</h2>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all"
        >
          + Add New Product
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={handleOpenEdit}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm
          initialData={selectedProduct}
          onSuccess={() => setIsModalOpen(false)}
        />
      </Modal>
    </section>
  );
};

export default ProductList;
