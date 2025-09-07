import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Products } from './components/Products';
import { Customers } from './components/Customers';
import { Suppliers } from './components/Suppliers';
import { Sales } from './components/Sales';
import { StockMovements } from './components/StockMovements';
import { SettingsComponent as Settings } from './components/Settings';
import { useShowroomData } from './hooks/useShowroomData';
import { useSettings } from './hooks/useSettings';
import { DashboardIcon, ProductIcon, CustomerIcon, SupplierIcon, SalesIcon, StockIcon, SettingsIcon } from './components/icons';

type View = 'dashboard' | 'products' | 'customers' | 'suppliers' | 'sales' | 'stock' | 'settings';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const data = useShowroomData();
  const { settings, updateSettings } = useSettings();

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard sales={data.sales} products={data.products} customers={data.customers} />;
      case 'products':
        return <Products 
                    products={data.products} 
                    suppliers={data.suppliers} 
                    addProduct={data.addProduct} 
                    updateProduct={data.updateProduct}
                    restockProduct={data.restockProduct} 
                    deleteProduct={data.deleteProduct}
                />;
      case 'customers':
        return <Customers 
                    customers={data.customers} 
                    addCustomer={data.addCustomer}
                    updateCustomer={data.updateCustomer}
                />;
      case 'suppliers':
        return <Suppliers 
                    suppliers={data.suppliers}
                    addSupplier={data.addSupplier}
                    updateSupplier={data.updateSupplier}
                    recordSupplierPayment={data.recordSupplierPayment}
                />;
      case 'sales':
        return <Sales 
                    sales={data.sales} 
                    customers={data.customers} 
                    products={data.products} 
                    addSale={data.addSale} 
                    settings={settings}
                    updateSalePaymentStatus={data.updateSalePaymentStatus}
                />;
      case 'stock':
        return <StockMovements movements={data.stockMovements} products={data.products} />;
      case 'settings':
        return <Settings settings={settings} updateSettings={updateSettings} />;
      default:
        return <Dashboard sales={data.sales} products={data.products} customers={data.customers}/>;
    }
  };

  const NavItem: React.FC<{ view: View; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
    <li>
      <button
        onClick={() => setActiveView(view)}
        className={`flex items-center w-full p-3 text-left rounded-lg transition-colors ${
          activeView === view
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-blue-800 hover:text-white'
        }`}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </button>
    </li>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4 no-print">
        <div className="text-2xl font-bold p-3 mb-8">Showroom OS</div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <NavItem view="dashboard" label="Dashboard" icon={<DashboardIcon />} />
            <NavItem view="products" label="Products" icon={<ProductIcon />} />
            <NavItem view="customers" label="Customers" icon={<CustomerIcon />} />
            <NavItem view="suppliers" label="Suppliers" icon={<SupplierIcon />} />
            <NavItem view="sales" label="Sales" icon={<SalesIcon />} />
            <NavItem view="stock" label="Stock Movements" icon={<StockIcon />} />
          </ul>
        </nav>
        <nav>
           <ul className="space-y-2 border-t border-gray-700 pt-2">
             <NavItem view="settings" label="Settings" icon={<SettingsIcon />} />
           </ul>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;