import React, { useState, useEffect, useMemo } from 'react';
import { Product, Supplier, ProductCategory, ProductSize, ProductColor } from '../types';
import { CATEGORIES, SIZES, COLORS } from '../constants';
import { EditIcon, TrashIcon } from './icons';

interface ProductsProps {
  products: Product[];
  suppliers: Supplier[];
  addProduct: (product: Omit<Product, 'id' | 'currentStock'>) => void;
  updateProduct: (product: Product) => void;
  restockProduct: (productId: string, quantity: number) => void;
  deleteProduct: (productId: string) => void;
}

const ProductModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    suppliers: Supplier[];
    onSave: (productData: Omit<Product, 'id' | 'currentStock'> | Product) => void;
    productToEdit?: Product | null;
}> = ({ isOpen, onClose, suppliers, onSave, productToEdit }) => {
    const isEditMode = !!productToEdit;

    const [formData, setFormData] = useState({
        name: '',
        category: CATEGORIES[0],
        size: SIZES[0],
        color: COLORS[0],
        supplierId: suppliers[0]?.id || '',
        purchasePrice: 0,
        sellingPrice: 0,
        openingStock: 0,
    });

    useEffect(() => {
        if (isEditMode && productToEdit) {
            setFormData({
                name: productToEdit.name,
                category: productToEdit.category,
                size: productToEdit.size,
                color: productToEdit.color,
                supplierId: productToEdit.supplierId || '',
                purchasePrice: productToEdit.purchasePrice,
                sellingPrice: productToEdit.sellingPrice,
                openingStock: productToEdit.openingStock,
            });
        } else {
             setFormData({
                name: '',
                category: CATEGORIES[0],
                size: SIZES[0],
                color: COLORS[0],
                supplierId: suppliers[0]?.id || '',
                purchasePrice: 0,
                sellingPrice: 0,
                openingStock: 0,
            });
        }
    }, [isOpen, isEditMode, productToEdit, suppliers]);


    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumber = ['purchasePrice', 'sellingPrice', 'openingStock'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            name: formData.name,
            category: formData.category as ProductCategory,
            size: formData.size as ProductSize,
            color: formData.color as ProductColor,
            supplierId: formData.supplierId,
            purchasePrice: formData.purchasePrice,
            sellingPrice: formData.sellingPrice,
        };

        if (isEditMode) {
            onSave({ ...productToEdit, ...productData });
        } else {
            onSave({ ...productData, openingStock: formData.openingStock });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input type="text" id="product-name" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="product-category" className="block text-sm font-medium text-gray-700">Category</label>
                            <select id="product-category" name="category" value={formData.category} onChange={handleChange} className="mt-1 w-full p-2 border rounded">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
                        </div>
                        <div>
                            <label htmlFor="product-size" className="block text-sm font-medium text-gray-700">Size</label>
                            <select id="product-size" name="size" value={formData.size} onChange={handleChange} className="mt-1 w-full p-2 border rounded">{SIZES.map(s => <option key={s} value={s}>{s}</option>)}</select>
                        </div>
                        <div>
                            <label htmlFor="product-color" className="block text-sm font-medium text-gray-700">Color</label>
                            <select id="product-color" name="color" value={formData.color} onChange={handleChange} className="mt-1 w-full p-2 border rounded">{COLORS.map(c => <option key={c} value={c}>{c}</option>)}</select>
                        </div>
                        <div>
                            <label htmlFor="product-supplier" className="block text-sm font-medium text-gray-700">Supplier</label>
                            <select id="product-supplier" name="supplierId" value={formData.supplierId} onChange={handleChange} className="mt-1 w-full p-2 border rounded">{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="product-purchasePrice" className="block text-sm font-medium text-gray-700">Purchase Price (৳)</label>
                            <input type="number" id="product-purchasePrice" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                        </div>
                        <div>
                             <label htmlFor="product-sellingPrice" className="block text-sm font-medium text-gray-700">Selling Price (৳)</label>
                            <input type="number" id="product-sellingPrice" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="product-openingStock" className="block text-sm font-medium text-gray-700">Opening Stock</label>
                        <input type="number" id="product-openingStock" name="openingStock" value={formData.openingStock} onChange={handleChange} className="mt-1 w-full p-2 border rounded" disabled={isEditMode} required={!isEditMode} />
                         {isEditMode && <p className="text-xs text-gray-500 mt-1">Stock is managed via the 'Restock' action.</p>}
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{isEditMode ? 'Save Changes' : 'Add Product'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const Products: React.FC<ProductsProps> = ({ products, suppliers, addProduct, updateProduct, restockProduct, deleteProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [supplierFilter, setSupplierFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (categoryFilter !== 'All' && product.category !== categoryFilter) {
        return false;
      }
      if (supplierFilter !== 'All' && product.supplierId !== supplierFilter) {
        return false;
      }
      if (stockFilter !== 'All') {
        if (stockFilter === 'Out of Stock' && product.currentStock > 0) return false;
        if (stockFilter === 'Low Stock' && (product.currentStock > 10 || product.currentStock === 0)) return false;
        if (stockFilter === 'In Stock' && product.currentStock <= 10) return false;
      }
      return true;
    });
  }, [products, searchTerm, categoryFilter, supplierFilter, stockFilter]);

  const handleOpenModal = (product?: Product) => {
    setEditingProduct(product || null);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  }

  const handleSaveProduct = (productData: Omit<Product, 'id' | 'currentStock'> | Product) => {
    if ('id' in productData) {
      updateProduct(productData as Product);
    } else {
      addProduct(productData as Omit<Product, 'id' | 'currentStock'>);
    }
  };
  
  const handleRestock = (productId: string) => {
      const quantityStr = prompt("Enter quantity to restock:");
      if(quantityStr) {
          const quantity = parseInt(quantityStr, 10);
          if(!isNaN(quantity) && quantity > 0) {
              restockProduct(productId, quantity);
          } else {
              alert("Please enter a valid number.");
          }
      }
  }

  const handleDelete = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
        deleteProduct(productId);
    }
  }

  const formatCurrency = (value: number) => `৳${value.toLocaleString('en-IN')}`;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow">Add New Product</button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input
                  type="text"
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full p-2 border rounded-md col-span-1 md:col-span-2"
              />
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full p-2 border rounded-md">
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)} className="w-full p-2 border rounded-md">
                  <option value="All">All Suppliers</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} className="w-full p-2 border rounded-md">
                  <option value="All">All Stock Levels</option>
                  <option value="In Stock">In Stock (&gt; 10)</option>
                  <option value="Low Stock">Low Stock (1-10)</option>
                  <option value="Out of Stock">Out of Stock (0)</option>
              </select>
          </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-3 font-semibold">ID</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Category</th>
              <th className="p-3 font-semibold text-right">Stock</th>
              <th className="p-3 font-semibold text-right">Purchase Price</th>
              <th className="p-3 font-semibold text-right">Selling Price</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{product.id}</td>
                <td className="p-3 font-medium">{product.name} <span className="text-gray-500 text-sm">({product.size}, {product.color})</span></td>
                <td className="p-3">{product.category}</td>
                <td className="p-3 font-medium text-right">{product.currentStock}</td>
                <td className="p-3 text-right">{formatCurrency(product.purchasePrice)}</td>
                <td className="p-3 text-right">{formatCurrency(product.sellingPrice)}</td>
                <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleRestock(product.id)} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">Restock</button>
                      <button onClick={() => handleOpenModal(product)} className="p-2 text-gray-500 rounded-md hover:bg-gray-200"><EditIcon /></button>
                      <button onClick={() => handleDelete(product.id, product.name)} className="p-2 text-red-500 rounded-md hover:bg-gray-200" title="Delete Product"><TrashIcon /></button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && <p className="text-center p-4 text-gray-500">No products match your criteria.</p>}
      </div>
      {isModalOpen && <ProductModal isOpen={isModalOpen} onClose={handleCloseModal} suppliers={suppliers} onSave={handleSaveProduct} productToEdit={editingProduct} />}
    </div>
  );
};