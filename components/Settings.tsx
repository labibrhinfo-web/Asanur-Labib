import React, { useState } from 'react';
import { Settings } from '../types';

interface SettingsProps {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
}

export const SettingsComponent: React.FC<SettingsProps> = ({ settings, updateSettings }) => {
    const [formData, setFormData] = useState<Settings>(settings);
    const [message, setMessage] = useState('');
    const [logoMessage, setLogoMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLogoMessage('');
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Validate file type
        if (!file.type.startsWith('image/')) {
            setLogoMessage('Invalid file type. Please select an image.');
            return;
        }

        // 2. Validate file size
        const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
        if (file.size > MAX_FILE_SIZE_BYTES) {
            setLogoMessage('File is too large. Please select an image smaller than 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400;
                const MAX_HEIGHT = 200;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    setLogoMessage('Could not process the image.');
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.85); // JPEG with 85% quality
                setFormData(prev => ({ ...prev, companyLogo: dataUrl }));
            };
            img.onerror = () => {
                setLogoMessage('Could not load the selected image file.');
            };
        };
        reader.onerror = () => {
            setLogoMessage('Could not read the selected file.');
        };
        reader.readAsDataURL(file);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings(formData);
        setMessage('Settings saved successfully!');
        setLogoMessage('');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Company Settings</h1>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className="mt-1 w-full p-2 border rounded-md"
                        />
                    </div>
                     <div>
                        <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700">Company Address</label>
                        <textarea
                            id="companyAddress"
                            name="companyAddress"
                            rows={3}
                            value={formData.companyAddress}
                            onChange={handleChange}
                            className="mt-1 w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="companyLogo" className="block text-sm font-medium text-gray-700">Company Logo</label>
                        <div className="mt-1 flex items-center gap-4">
                            {formData.companyLogo && <img src={formData.companyLogo} alt="Company Logo" className="h-16 w-16 object-contain bg-gray-100 p-1 rounded" />}
                            <input
                                type="file"
                                id="companyLogo"
                                name="companyLogo"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                         {logoMessage && <p className="text-sm text-red-600 mt-2">{logoMessage}</p>}
                    </div>
                    <div className="flex justify-end items-center gap-4 pt-4">
                         {message && <p className="text-green-600">{message}</p>}
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Settings</button>
                    </div>
                </form>
            </div>
        </div>
    );
};