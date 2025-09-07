import { useState, useEffect } from 'react';
import { Settings } from '../types';

const SETTINGS_STORAGE_KEY = 'showroom-settings';

const defaultSettings: Settings = {
    companyName: 'Your Brand Name',
    companyAddress: '123 Fashion Street, Dhaka, Bangladesh',
    companyLogo: '',
};

export const useSettings = () => {
    const [settings, setSettings] = useState<Settings>(() => {
        try {
            const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
            return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
        } catch (error) {
            console.error("Error loading settings from localStorage", error);
            return defaultSettings;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error("Error saving settings to localStorage", error);
        }
    }, [settings]);

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };
    
    return { settings, updateSettings };
};
