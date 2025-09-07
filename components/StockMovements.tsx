
import React from 'react';
import { StockMovement, Product } from '../types';

interface StockMovementsProps {
  movements: StockMovement[];
  products: Product[];
}

export const StockMovements: React.FC<StockMovementsProps> = ({ movements, products }) => {
  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Stock Movements Log</h1>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3">Date</th>
              <th className="p-3">Type</th>
              <th className="p-3">Product</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Updated Stock</th>
            </tr>
          </thead>
          <tbody>
            {[...movements].reverse().map(movement => (
              <tr key={movement.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{new Date(movement.date).toLocaleString()}</td>
                <td className="p-3">
                  <span className={`font-semibold ${movement.type === 'Purchase' ? 'text-green-600' : 'text-red-600'}`}>
                    {movement.type}
                  </span>
                </td>
                <td className="p-3 font-medium">{getProductName(movement.productId)}</td>
                <td className="p-3">{movement.quantity}</td>
                <td className="p-3">{movement.updatedStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
