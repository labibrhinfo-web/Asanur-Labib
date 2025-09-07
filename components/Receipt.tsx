import React from 'react';
import { Sale, Customer, Product, Settings } from '../types';

interface ReceiptProps {
  sale: Sale;
  customer: Customer;
  products: Product[];
  onClose: () => void;
  settings: Settings;
}

export const Receipt: React.FC<ReceiptProps> = ({ sale, customer, products, onClose, settings }) => {
  const formatCurrency = (value: number) => `৳${value.toLocaleString('en-IN')}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl my-8">
        <div className="p-8 md:p-12">
          {/* A4-styled container */}
          <div className="bg-white" style={{ fontFamily: 'sans-serif' }}>
            <header className="flex justify-between items-start pb-6 border-b-2 border-gray-200">
              <div>
                {settings.companyLogo ? (
                    <img src={settings.companyLogo} alt="Company Logo" className="w-32 h-auto max-h-16 object-contain mb-2" />
                ) : (
                    <div className="w-32 h-16 bg-gray-200 flex items-center justify-center text-gray-500 mb-2">
                      Your Logo
                    </div>
                )}
                <h1 className="text-2xl font-bold mt-2">{settings.companyName}</h1>
                <p className="text-gray-500 whitespace-pre-line">{settings.companyAddress}</p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold uppercase text-gray-800">Invoice</h2>
                <p className="text-gray-600 mt-1">Invoice #: <span className="font-semibold">{sale.invoiceNo}</span></p>
                <p className="text-gray-600">Date: <span className="font-semibold">{new Date(sale.date).toLocaleDateString()}</span></p>
              </div>
            </header>

            <section className="my-8">
              <h3 className="text-lg font-semibold text-gray-700">Bill To:</h3>
              <p className="font-bold">{customer.name}</p>
              <p>{customer.address}</p>
              <p>{customer.phone}</p>
              <p>{customer.email}</p>
            </section>

            <section>
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-sm font-semibold">Product Name</th>
                    <th className="p-3 text-sm font-semibold text-right">Quantity</th>
                    <th className="p-3 text-sm font-semibold text-right">Unit Price</th>
                    <th className="p-3 text-sm font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map((item, index) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <tr key={index} className="border-b">
                        <td className="p-3">{product ? `${product.name} (${product.size}, ${product.color})` : 'N/A'}</td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="p-3 text-right">{formatCurrency(item.total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>

            <section className="flex justify-end mt-8">
              <div className="w-full max-w-xs">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(sale.totalSale)}</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-gray-200">
                  <span className="font-bold text-xl">Total:</span>
                  <span className="font-bold text-xl">{formatCurrency(sale.totalSale)}</span>
                </div>
              </div>
            </section>

            <footer className="mt-12 pt-6 border-t-2 text-center text-gray-500">
              <p>Payment Method: {sale.paymentMethod}</p>
              <p className="font-semibold mt-2">Thank You for Shopping with Us!</p>
            </footer>
          </div>
        </div>
        <div className="bg-gray-100 p-4 flex justify-end gap-4 rounded-b-lg no-print">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Close</button>
          <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Print Current Receipt</button>
        </div>
      </div>
    </div>
  );
};
