
import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sale, Product, Customer } from '../types';
import { ChartBarIcon, CustomerIcon, MoneyIcon, ProductIcon } from './icons';

interface DashboardProps {
  sales: Sale[];
  products: Product[];
  customers: Customer[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const RecentSales: React.FC<{ sales: Sale[], customers: Customer[] }> = ({ sales, customers }) => {
    const recentSales = sales.slice(-5).reverse();
    const formatCurrency = (value: number) => `৳${value.toLocaleString('en-IN')}`;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Sales</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-3 text-sm font-semibold">Invoice #</th>
                            <th className="p-3 text-sm font-semibold">Customer</th>
                            <th className="p-3 text-sm font-semibold">Date</th>
                            <th className="p-3 text-sm font-semibold text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentSales.map(sale => (
                            <tr key={sale.invoiceNo} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-mono text-sm">{sale.invoiceNo}</td>
                                <td className="p-3">{customers.find(c => c.id === sale.customerId)?.name || 'N/A'}</td>
                                <td className="p-3 text-sm">{new Date(sale.date).toLocaleDateString()}</td>
                                <td className="p-3 text-right font-medium">{formatCurrency(sale.totalSale)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ sales, products, customers }) => {
  const todaySales = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return sales
      .filter(sale => sale.date.startsWith(today))
      .reduce((sum, sale) => sum + sale.totalSale, 0);
  }, [sales]);

  const totalCustomers = customers.length;
  
  const currentStockValue = useMemo(() => {
    return products.reduce((sum, product) => sum + product.currentStock * product.purchasePrice, 0);
  }, [products]);

  const totalProfit = useMemo(() => {
    return sales.reduce((sum, sale) => sum + sale.totalProfit, 0);
  }, [sales]);

  const salesTrendData = useMemo(() => {
    const dataByDate: { [key: string]: { sales: number; profit: number } } = {};
    sales.forEach(sale => {
      const date = new Date(sale.date).toLocaleDateString('en-CA'); // YYYY-MM-DD
      if (!dataByDate[date]) {
        dataByDate[date] = { sales: 0, profit: 0 };
      }
      dataByDate[date].sales += sale.totalSale;
      dataByDate[date].profit += sale.totalProfit;
    });
    return Object.entries(dataByDate)
      .map(([date, values]) => ({ date, ...values }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [sales]);

  const topProductsData = useMemo(() => {
    const productSales: { [key: string]: number } = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = 0;
        }
        productSales[item.productId] += item.total;
      });
    });

    return Object.entries(productSales)
      .map(([productId, totalSales]) => ({
        name: products.find(p => p.id === productId)?.name || 'Unknown',
        sales: totalSales,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [sales, products]);

  const formatCurrency = (value: number) => `৳${value.toLocaleString('en-IN')}`;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Today's Sales" value={formatCurrency(todaySales)} icon={<MoneyIcon />} color="bg-blue-100 text-blue-600" />
        <StatCard title="Total Customers" value={totalCustomers} icon={<CustomerIcon />} color="bg-green-100 text-green-600" />
        <StatCard title="Current Stock Value" value={formatCurrency(currentStockValue)} icon={<ProductIcon />} color="bg-yellow-100 text-yellow-600" />
        <StatCard title="Total Profit" value={formatCurrency(totalProfit)} icon={<ChartBarIcon />} color="bg-purple-100 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} name="Sales" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Top 5 Products by Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={formatCurrency} />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="sales" fill="#10b981" name="Total Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-8">
        <RecentSales sales={sales} customers={customers} />
      </div>
    </div>
  );
};