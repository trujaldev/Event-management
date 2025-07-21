import { useState, useEffect } from "react";

const useLocalStorage = <T,>(key: string, initialValue: T) => {
    const [persistedValue, setPersistedValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log("Error reading localStorage key:", key, error);
            return initialValue;
        }
    });

    const saveToLocalStorage = (value: T | ((prev: T) => T)) => {
        try {
            const valueToStore =
                value instanceof Function ? value(persistedValue) : value;
            setPersistedValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log("Error setting localStorage key:", key, error);
        }
    };

    const clearPersistedValue = () => {
        try {
            localStorage.removeItem(key);
            setPersistedValue(initialValue);
        } catch (error) {
            console.log("Error removing localStorage key:", key, error);
        }
    };

    const clearAllLocalStorage = () => {
        try {
            localStorage.clear();
        } catch (error) {
            console.log("Error clearing full localStorage:", error);
        }
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const item = localStorage.getItem(key);
            setPersistedValue(item ? JSON.parse(item) : initialValue);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [key, initialValue]);

    return {
        persistedValue,
        saveToLocalStorage,
        clearPersistedValue,
        clearAllLocalStorage,
    };
};

export default useLocalStorage;