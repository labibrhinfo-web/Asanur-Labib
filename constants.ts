
import { Product, Customer, Supplier, ProductCategory, ProductSize, ProductColor, LoyaltyTier } from './types';

export const CATEGORIES = Object.values(ProductCategory);
export const SIZES = Object.values(ProductSize);
export const COLORS = Object.values(ProductColor);
export const PAYMENT_METHODS = ['Cash', 'Bkash', 'Card', 'Due'];
export const LOYALTY_TIERS = Object.values(LoyaltyTier);

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'SUP001', name: 'Mr. Rahim', companyName: 'Fashion Hub Ltd.', mobile: '01711-xxxxxx', address: 'Dhaka, Bangladesh', dueBalance: 15000 },
  { id: 'SUP002', name: 'Ms. Karima', companyName: 'Garments World', mobile: '01812-xxxxxx', address: 'Chittagong, Bangladesh', dueBalance: 0 },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'PROD001', name: 'Classic Blue Jeans', category: ProductCategory.Pant, size: ProductSize.L, color: ProductColor.Blue, supplierId: 'SUP001', purchasePrice: 800, sellingPrice: 1500, openingStock: 50, currentStock: 35 },
  { id: 'PROD002', name: 'Silk Saree', category: ProductCategory.Saree, size: ProductSize.FreeSize, color: ProductColor.Red, supplierId: 'SUP002', purchasePrice: 2500, sellingPrice: 4000, openingStock: 20, currentStock: 12 },
  { id: 'PROD003', name: 'Cotton Polo Shirt', category: ProductCategory.Shirt, size: ProductSize.M, color: ProductColor.White, supplierId: 'SUP001', purchasePrice: 500, sellingPrice: 950, openingStock: 100, currentStock: 80 },
  { id: 'PROD004', name: 'Graphic T-Shirt', category: ProductCategory.TShirt, size: ProductSize.XL, color: ProductColor.Black, supplierId: 'SUP002', purchasePrice: 300, sellingPrice: 600, openingStock: 120, currentStock: 105 },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'CUST001', name: 'Anisul Islam', phone: '01911-xxxxxx', email: 'anisul@email.com', address: 'Banani, Dhaka', loyaltyPoints: 120, totalPurchases: 12000, loyaltyTier: LoyaltyTier.Bronze },
  { id: 'CUST002', name: 'Fatima Begum', phone: '01512-xxxxxx', email: 'fatima@email.com', address: 'Gulshan, Dhaka', loyaltyPoints: 250, totalPurchases: 25000, loyaltyTier: LoyaltyTier.Silver },
];