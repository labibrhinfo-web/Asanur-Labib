
import React, { useState, useEffect } from 'react';
import { Customer, LoyaltyTier } from '../types';
import { EditIcon } from './icons';
import { LOYALTY_TIERS } from '../constants';

interface CustomersProps {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'loyaltyPoints' | 'totalPurchases'>) => void;
  updateCustomer: (customer: Customer) => void;
}

const CustomerModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (customer: Omit<Customer, 'id' | 'loyaltyPoints' | 'totalPurchases'> | Customer) => void;
    customerToEdit?: Customer | null;
}> = ({ isOpen, onClose, onSave, customerToEdit }) => {
    const isEditMode = !!customerToEdit;

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        loyaltyTier: LoyaltyTier.Bronze,
    });

    useEffect(() => {
        if(isEditMode && customerToEdit) {
            setFormData({
                name: customerToEdit.name,
                phone: customerToEdit.phone,
                email: customerToEdit.email,
                address: customerToEdit.address,
                loyaltyTier: customerToEdit.loyaltyTier,
            });
        } else {
             setFormData({ name: '', phone: '', email: '', address: '', loyaltyTier: LoyaltyTier.Bronze });
        }
    }, [isOpen, isEditMode, customerToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const customerData = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          loyaltyTier: formData.loyaltyTier as LoyaltyTier,
        };

        if (isEditMode) {
            onSave({ ...customerToEdit, ...customerData });
        } else {
            onSave(customerData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Customer' : 'Add New Customer'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input id="customer-name" type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label htmlFor="customer-phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input id="customer-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label htmlFor="customer-email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input id="customer-email" type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label htmlFor="customer-address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input id="customer-address" type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label htmlFor="customer-loyaltyTier" className="block text-sm font-medium text-gray-700">Loyalty Tier</label>
                        <select id="customer-loyaltyTier" name="loyaltyTier" value={formData.loyaltyTier} onChange={handleChange} className="mt-1 w-full p-2 border rounded">
                            {LOYALTY_TIERS.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{isEditMode ? 'Save Changes' : 'Add Customer'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const Customers: React.FC<CustomersProps> = ({ customers, addCustomer, updateCustomer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const formatCurrency = (value: number) => `৳${value.toLocaleString('en-IN')}`;

  const handleOpenModal = (customer?: Customer) => {
    setEditingCustomer(customer || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingCustomer(null);
    setIsModalOpen(false);
  };

  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'loyaltyPoints' | 'totalPurchases'> | Customer) => {
    if ('id' in customerData) {
      updateCustomer(customerData as Customer);
    } else {
      addCustomer(customerData as Omit<Customer, 'id' | 'loyaltyPoints' | 'totalPurchases'>);
    }
  };
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow">Add New Customer</button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-3 font-semibold">ID</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Phone</th>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Loyalty Tier</th>
              <th className="p-3 font-semibold text-right">Loyalty Points</th>
              <th className="p-3 font-semibold text-right">Total Purchases</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{customer.id}</td>
                <td className="p-3 font-medium">{customer.name}</td>
                <td className="p-3">{customer.phone}</td>
                <td className="p-3">{customer.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    customer.loyaltyTier === LoyaltyTier.Gold ? 'bg-yellow-100 text-yellow-800' :
                    customer.loyaltyTier === LoyaltyTier.Silver ? 'bg-gray-200 text-gray-800' :
                    'bg-orange-200 text-orange-800'
                  }`}>
                    {customer.loyaltyTier}
                  </span>
                </td>
                <td className="p-3 text-right">{customer.loyaltyPoints}</td>
                <td className="p-3 text-right">{formatCurrency(customer.totalPurchases)}</td>
                <td className="p-3">
                  <button onClick={() => handleOpenModal(customer)} className="p-2 text-gray-500 rounded-md hover:bg-gray-200"><EditIcon /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <CustomerModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveCustomer} customerToEdit={editingCustomer} />}
    </div>
  );
};