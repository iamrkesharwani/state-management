import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import type { IProduct } from '../../app/type';
import { updateProductData, addProductsToDb } from './productThunk';

interface ProductFormProps {
  initialData: IProduct | null;
  onSuccess: () => void;
}

const ProductForm = ({ initialData, onSuccess }: ProductFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({ name: '', price: 0, stock: 0 });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        stock: initialData.stock,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (initialData) {
      await dispatch(updateProductData({ _id: initialData._id, ...formData }));
    } else {
      await dispatch(addProductsToDb(formData));
    }
    onSuccess();
  };

  const inputClass =
    'w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition';
  const labelClass = 'text-slate-600 text-sm font-medium mb-1 block';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Product Name</label>
        <input
          required
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Price</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: Number(e.target.value) })
          }
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Stock</label>
        <input
          type="number"
          value={formData.stock}
          onChange={(e) =>
            setFormData({ ...formData, stock: Number(e.target.value) })
          }
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors"
      >
        {initialData ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
};

export default ProductForm;
