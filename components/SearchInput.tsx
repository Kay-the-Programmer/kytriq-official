import React, { memo, useCallback, useState, useEffect } from 'react';
import Icon from './Icon';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    debounceTime?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
    value, 
    onChange, 
    placeholder = 'Search...', 
    className = '',
    debounceTime = 300
}) => {
    // Local state to handle input value before debouncing
    const [inputValue, setInputValue] = useState(value);

    // Update local state when prop value changes
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Handle input change with debounce
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        
        // Debounce the onChange callback
        const handler = setTimeout(() => {
            onChange(newValue);
        }, debounceTime);
        
        return () => {
            clearTimeout(handler);
        };
    }, [onChange, debounceTime]);

    // Handle clearing the input
    const handleClear = useCallback(() => {
        setInputValue('');
        onChange('');
    }, [onChange]);

    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="search" className="h-5 w-5 text-brand-gray-400" />
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-2.5 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-techflex-blue focus:border-techflex-blue bg-white text-brand-gray-900 placeholder-brand-gray-400 transition-all duration-300"
                placeholder={placeholder}
                aria-label={placeholder}
            />
            {inputValue && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-gray-400 hover:text-brand-gray-600 transition-colors duration-200"
                    aria-label="Clear search"
                >
                    <Icon name="x-circle" className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(SearchInput);