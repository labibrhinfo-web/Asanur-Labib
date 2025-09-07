import { useState } from 'react';
import { Product, Customer, Supplier, Sale, SaleItem, StockMovement, PaymentMethod } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_SUPPLIERS } from '../constants';

export const useShowroomData = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  // FIX: Added 'items' to Omit to correctly override the type of the `items` property.
  const addSale = (saleData: Omit<Sale, 'invoiceNo' | 'totalSale' | 'totalProfit' | 'paymentStatus' | 'items'> & { items: Omit<SaleItem, 'total'>[] }) => {
    setSales(prevSales => {
      const invoiceNo = `INV-${(prevSales.length + 1).toString().padStart(4, '0')}`;
      let totalSale = 0;
      let totalProfit = 0;

      const updatedItems: SaleItem[] = saleData.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new Error("Product not found");

        const itemTotal = item.quantity * item.unitPrice;
        totalSale += itemTotal;
        totalProfit += (item.unitPrice - product.purchasePrice) * item.quantity;
        return { ...item, total: itemTotal };
      });

      const newSale: Sale = {
        ...saleData,
        invoiceNo,
        items: updatedItems,
        totalSale,
        totalProfit,
        paymentStatus: saleData.paymentMethod === PaymentMethod.Due ? 'Due' : 'Paid',
        date: new Date().toISOString(),
      };

      // Update product stock
      setProducts(prevProducts =>
        prevProducts.map(p => {
          const soldItem = newSale.items.find(item => item.productId === p.id);
          if (soldItem) {
            return { ...p, currentStock: p.currentStock - soldItem.quantity };
          }
          return p;
        })
      );

      // Update customer info
      setCustomers(prevCustomers =>
        prevCustomers.map(c => {
          if (c.id === newSale.customerId) {
            return {
              ...c,
              totalPurchases: c.totalPurchases + newSale.totalSale,
              loyaltyPoints: c.loyaltyPoints + Math.floor(newSale.totalSale / 100),
            };
          }
          return c;
        })
      );
        
      // Add stock movements
      const newMovements: StockMovement[] = newSale.items.map(item => {
          const product = products.find(p => p.id === item.productId)!;
          return {
              id: `SM-${stockMovements.length + Math.random()}`,
              date: newSale.date,
              type: 'Sale',
              productId: item.productId,
              quantity: item.quantity,
              updatedStock: product.currentStock - item.quantity
          }
      });
      setStockMovements(prev => [...prev, ...newMovements]);

      return [...prevSales, newSale];
    });
  };

  const addProduct = (product: Omit<Product, 'id' | 'currentStock'>) => {
    setProducts(prev => {
        const newProduct: Product = {
            ...product,
            id: `PROD-${(prev.length + 1).toString().padStart(3, '0')}`,
            currentStock: product.openingStock,
        };
        // Add stock movement
        const newMovement: StockMovement = {
            id: `SM-${stockMovements.length + 1}`,
            date: new Date().toISOString(),
            type: 'Purchase',
            productId: newProduct.id,
            quantity: newProduct.openingStock,
            updatedStock: newProduct.openingStock
        };
        setStockMovements(prevMovements => [...prevMovements, newMovement]);

        return [...prev, newProduct];
    });
  }

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const restockProduct = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const updatedStock = product.currentStock + quantity;

    // 1. Update product stock
    setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, currentStock: updatedStock } : p
    ));

    // 2. Add stock movement
    const newMovement: StockMovement = {
        id: `SM-${stockMovements.length + Date.now()}`,
        date: new Date().toISOString(),
        type: 'Purchase',
        productId: productId,
        quantity: quantity,
        updatedStock: updatedStock
    };
    setStockMovements(prev => [...prev, newMovement]);

    // 3. Update supplier due balance ("add new dues")
    if (product.supplierId) {
        const restockCost = product.purchasePrice * quantity;
        setSuppliers(prev => prev.map(s => 
            s.id === product.supplierId ? { ...s, dueBalance: s.dueBalance + restockCost } : s
        ));
    }
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'loyaltyPoints' | 'totalPurchases'>) => {
    setCustomers(prev => {
      const newCustomer: Customer = {
        ...customer,
        id: `CUST-${(prev.length + 1).toString().padStart(3, '0')}`,
        loyaltyPoints: 0,
        totalPurchases: 0,
      };
      return [...prev, newCustomer];
    });
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };
  
  const addSupplier = (supplier: Omit<Supplier, 'id' | 'dueBalance'>) => {
      setSuppliers(prev => {
          const newSupplier: Supplier = {
              ...supplier,
              id: `SUP-${(prev.length + 1).toString().padStart(3, '0')}`,
              dueBalance: 0,
          };
          return [...prev, newSupplier];
      });
  };

  const updateSupplier = (updatedSupplier: Supplier) => {
      setSuppliers(prev => prev.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
  };

  const recordSupplierPayment = (supplierId: string, amount: number) => {
    setSuppliers(prev => prev.map(s => {
        if (s.id === supplierId) {
            return {
                ...s,
                dueBalance: s.dueBalance - amount,
                lastPaymentDate: new Date().toISOString(),
            };
        }
        return s;
    }));
  };

  const updateSalePaymentStatus = (invoiceNo: string, newStatus: 'Paid' | 'Due') => {
    setSales(prevSales =>
      prevSales.map(sale =>
        sale.invoiceNo === invoiceNo ? { ...sale, paymentStatus: newStatus } : sale
      )
    );
  };

  return { 
    products, customers, suppliers, sales, stockMovements, 
    addSale, addProduct, restockProduct, updateProduct, deleteProduct,
    addCustomer, updateCustomer,
    addSupplier, updateSupplier,
    recordSupplierPayment,
    updateSalePaymentStatus,
  };
};