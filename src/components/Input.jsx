import React from 'react';

const Input = ({ label, type = "text", name, value, onChange, placeholder, required = false, error }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor={name}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`w-full px-4 py-3 bg-[#2b303b] border ${error ? 'border-red-500' : 'border-gray-600'} rounded text-white placeholder-gray-500 focus:outline-none focus:border-xynexis-green transition-colors duration-200`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default Input;
