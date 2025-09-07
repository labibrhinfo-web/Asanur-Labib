import React, { useState, useEffect } from 'react';
import { Supplier } from '../types';
import { EditIcon, MoneyIcon } from './icons';

interface SuppliersProps {
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'dueBalance'>) => void;
  updateSupplier: (supplier: Supplier) => void;
  recordSupplierPayment: (supplierId: string, amount: number) => void;
}

const SupplierModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (supplier: Omit<Supplier, 'id' | 'dueBalance'> | Supplier) => void;
    supplierToEdit?: Supplier | null;
}> = ({ isOpen, onClose, onSave, supplierToEdit }) => {
    const isEditMode = !!supplierToEdit;

    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        mobile: '',
        address: '',
    });

    useEffect(() => {
        if (isEditMode && supplierToEdit) {
            setFormData({
                name: supplierToEdit.name,
                companyName: supplierToEdit.companyName,
                mobile: supplierToEdit.mobile,
                address: supplierToEdit.address,
            });
        } else {
             setFormData({ name: '', companyName: '', mobile: '', address: '' });
        }
    }, [isOpen, isEditMode, supplierToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            onSave({ ...supplierToEdit, ...formData });
        } else {
            onSave(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Supplier' : 'Add New Supplier'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="supplier-name" className="block text-sm font-medium text-gray-700">Contact Name</label>
                        <input id="supplier-name" type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label htmlFor="supplier-companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input id="supplier-companyName" type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label htmlFor="supplier-mobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <input id="supplier-mobile" type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label htmlFor="supplier-address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input id="supplier-address" type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{isEditMode ? 'Save Changes' : 'Add Supplier'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PaymentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (amount: number) => void;
    supplier: Supplier;
}> = ({ isOpen, onClose, onSave, supplier }) => {
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setAmount(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount > 0) {
            onSave(amount);
            onClose();
        } else {
            alert("Please enter a valid payment amount.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-2">Record Payment</h2>
                <p className="mb-6 text-gray-600">For: <span className="font-semibold">{supplier.name}</span></p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="payment-amount" className="block text-sm font-medium text-gray-700">Payment Amount (৳)</label>
                        <input
                            id="payment-amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                            className="mt-1 w-full p-2 border rounded"
                            required
                            min="0.01"
                            step="0.01"
                        />
                         <p className="text-xs text-gray-500 mt-1">Current due: ৳{supplier.dueBalance.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Payment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const Suppliers: React.FC<SuppliersProps> = ({ suppliers, addSupplier, updateSupplier, recordSupplierPayment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [payingSupplier, setPayingSupplier] = useState<Supplier | null>(null);

  const formatCurrency = (value: number) => `৳${value.toLocaleString('en-IN')}`;

  const handleOpenModal = (supplier?: Supplier) => {
    setEditingSupplier(supplier || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingSupplier(null);
    setIsModalOpen(false);
  };

  const handleSaveSupplier = (supplierData: Omit<Supplier, 'id' | 'dueBalance'> | Supplier) => {
    if ('id' in supplierData) {
      updateSupplier(supplierData as Supplier);
    } else {
      addSupplier(supplierData as Omit<Supplier, 'id' | 'dueBalance'>);
    }
  };

  const handleOpenPaymentModal = (supplier: Supplier) => {
      setPayingSupplier(supplier);
  };

  const handleClosePaymentModal = () => {
      setPayingSupplier(null);
  };

  const handleSavePayment = (amount: number) => {
      if (payingSupplier) {
          recordSupplierPayment(payingSupplier.id, amount);
      }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Suppliers</h1>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow">Add New Supplier</button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-3 font-semibold">ID</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Company</th>
              <th className="p-3 font-semibold">Mobile</th>
              <th className="p-3 font-semibold text-right">Due Balance</th>
              <th className="p-3 font-semibold">Last Payment Date</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{supplier.id}</td>
                <td className="p-3 font-medium">{supplier.name}</td>
                <td className="p-3">{supplier.companyName}</td>
                <td className="p-3">{supplier.mobile}</td>
                <td className="p-3 text-right">{formatCurrency(supplier.dueBalance)}</td>
                <td className="p-3">{supplier.lastPaymentDate ? new Date(supplier.lastPaymentDate).toLocaleDateString() : 'N/A'}</td>
                <td className="p-3">
                    <div className="flex items-center gap-1">
                        <button onClick={() => handleOpenPaymentModal(supplier)} className="p-2 text-green-600 rounded-md hover:bg-gray-200" title="Record Payment">
                            <MoneyIcon />
                        </button>
                        <button onClick={() => handleOpenModal(supplier)} className="p-2 text-gray-500 rounded-md hover:bg-gray-200"><EditIcon /></button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <SupplierModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveSupplier} supplierToEdit={editingSupplier} />}
      {payingSupplier && <PaymentModal isOpen={!!payingSupplier} onClose={handleClosePaymentModal} onSave={handleSavePayment} supplier={payingSupplier} />}
    </div>
  );
};