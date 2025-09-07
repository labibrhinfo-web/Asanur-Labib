
export enum ProductCategory {
  Shirt = 'Shirt',
  Pant = 'Pant',
  Saree = 'Saree',
  TShirt = 'T-Shirt',
  Jacket = 'Jacket',
}

export enum ProductSize {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
  FreeSize = 'Free Size',
}

export enum ProductColor {
  Red = 'Red',
  Blue = 'Blue',
  Green = 'Green',
  Black = 'Black',
  White = 'White',
  Yellow = 'Yellow',
  Pink = 'Pink',
}

export enum PaymentMethod {
  Cash = 'Cash',
  Bkash = 'Bkash',
  Card = 'Card',
  Due = 'Due',
}

export enum LoyaltyTier {
  Bronze = 'Bronze',
  Silver = 'Silver',
  Gold = 'Gold',
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  size: ProductSize;
  color: ProductColor;
  supplierId: string | null;
  purchasePrice: number;
  sellingPrice: number;
  openingStock: number;
  currentStock: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  loyaltyPoints: number;
  totalPurchases: number;
  loyaltyTier: LoyaltyTier;
}

export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  mobile: string;
  address: string;
  dueBalance: number;
  lastPaymentDate?: string;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  invoiceNo: string;
  date: string; // ISO string format
  customerId: string;
  items: SaleItem[];
  totalSale: number;
  totalProfit: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Due';
}

export interface StockMovement {
  id: string;
  date: string; // ISO string format
  type: 'Purchase' | 'Sale';
  productId: string;
  quantity: number;
  updatedStock: number;
}

export interface Settings {
  companyName: string;
  companyAddress: string;
  companyLogo: string; // base64 data URL
}