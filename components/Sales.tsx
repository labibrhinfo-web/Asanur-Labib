import React, { useState, useMemo } from 'react';
import { Sale, Customer, Product, SaleItem, PaymentMethod, Settings } from '../types';
import { PAYMENT_METHODS } from '../constants';
import { Receipt } from './Receipt';

interface SalesProps {
  sales: Sale[];
  customers: Customer[];
  products: Product[];
  addSale: (saleData: Omit<Sale, 'invoiceNo' | 'totalSale' | 'totalProfit' | 'paymentStatus' | 'items'> & { items: Omit<SaleItem, 'total'>[] }) => void;
  settings: Settings;
  updateSalePaymentStatus: (invoiceNo: string, newStatus: 'Paid' | 'Due') => void;
}

const NewSaleForm: React.FC<{
    customers: Customer[];
    products: Product[];
    addSale: SalesProps['addSale'];
    onClose: () => void;
}> = ({ customers, products, addSale, onClose }) => {
    const [customerId, setCustomerId] = useState(customers[0]?.id || '');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Cash);
    const [items, setItems] = useState<Array<Omit<SaleItem, 'total' | 'unitPrice'> & {unitPrice?: number}>>([{ productId: '', quantity: 1 }]);

    const availableProducts = useMemo(() => products.filter(p => p.currentStock > 0), [products]);
    const formatCurrency = (value: number) => `৳${value.toLocaleString('en-IN')}`;

    const totalAmount = useMemo(() => {
        return items.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            return sum + (product ? product.sellingPrice * item.quantity : 0);
        }, 0);
    }, [items, products]);

    const handleItemChange = <T,>(index: number, field: keyof SaleItem, value: T) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        
        if (field === 'productId') {
            const product = products.find(p => p.id === value);
            newItems[index].unitPrice = product?.sellingPrice;
        }
        
        setItems(newItems);
    };

    const addItem = () => setItems([...items, { productId: '', quantity: 1 }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const saleItems = items
            .filter(item => {
                const product = products.find(p => p.id === item.productId);
                return item.productId && item.quantity > 0 && product && item.quantity <= product.currentStock;
            })
            .map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: products.find(p => p.id === item.productId)!.sellingPrice,
            }));
        
        if(items.some(item => {
            const product = products.find(p => p.id === item.productId);
            return product && item.quantity > product.currentStock;
        })) {
            alert("One or more items has a quantity greater than available stock.");
            return;
        }

        if (saleItems.length > 0 && customerId) {
            addSale({ customerId, items: saleItems, paymentMethod, date: new Date().toISOString() });
            onClose();
        } else {
            alert("Please select a customer and add at least one valid product with sufficient stock.");
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-6">Create New Sale / Receipt</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                        <select value={customerId} onChange={e => setCustomerId(e.target.value)} className="w-full p-2 border rounded-md">
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)} className="w-full p-2 border rounded-md">
                            {PAYMENT_METHODS.map(pm => <option key={pm} value={pm}>{pm}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Products</h3>
                    {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-[1fr,auto,auto] items-center gap-4 p-2 border-b">
                            <select value={item.productId} onChange={e => handleItemChange(index, 'productId', e.target.value)} className="w-full p-2 border rounded-md">
                                <option value="">Select Product</option>
                                {availableProducts.map(p => <option key={p.id} value={p.id}>{p.name} ({p.size}, {p.color}) - Stock: {p.currentStock}</option>)}
                            </select>
                            <input type="number" value={item.quantity} min="1" onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value))} className="w-32 p-2 border rounded-md" />
                            <button type="button" onClick={() => removeItem(index)} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">-</button>
                        </div>
                    ))}
                    <button type="button" onClick={addItem} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Add Item</button>
                </div>

                <div className="text-right">
                    <p className="text-xl font-bold">Total: {formatCurrency(totalAmount)}</p>
                </div>
                
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Sale to Ledger</button>
                </div>
            </form>
        </div>
    );
};


export const Sales: React.FC<SalesProps> = ({ sales, customers, products, addSale, settings, updateSalePaymentStatus }) => {
  const [isCreatingSale, setIsCreatingSale] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<Sale | null>(null);

  const formatCurrency = (value: number) => `৳${value.toLocaleString('en-IN')}`;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Sales</h1>
        {!isCreatingSale && <button onClick={() => setIsCreatingSale(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow">New Sale</button>}
      </div>

      {isCreatingSale && <NewSaleForm customers={customers} products={products} addSale={addSale} onClose={() => setIsCreatingSale(false)} />}
      
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Sales History</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-3 font-semibold">Invoice #</th>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Customer</th>
              <th className="p-3 font-semibold text-right">Total Sale</th>
              <th className="p-3 font-semibold text-right">Profit</th>
              <th className="p-3 font-semibold">Payment Status</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.invoiceNo} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono">{sale.invoiceNo}</td>
                <td className="p-3">{new Date(sale.date).toLocaleDateString()}</td>
                <td className="p-3 font-medium">{customers.find(c => c.id === sale.customerId)?.name || 'N/A'}</td>
                <td className="p-3 text-right">{formatCurrency(sale.totalSale)}</td>
                <td className="p-3 text-right">{formatCurrency(sale.totalProfit)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${sale.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {sale.paymentStatus}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewingReceipt(sale)} className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300">View Receipt</button>
                    {sale.paymentStatus === 'Due' && (
                        <button 
                            onClick={() => updateSalePaymentStatus(sale.invoiceNo, 'Paid')} 
                            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                            Mark as Paid
                        </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {viewingReceipt && <Receipt sale={viewingReceipt} customer={customers.find(c => c.id === viewingReceipt.customerId)!} products={products} onClose={() => setViewingReceipt(null)} settings={settings} />}
    </div>
  );
};