// resources/js/Components/FormField.jsx
import React from 'react';

const FormField = ({ label, value, onChange, error, type = 'text' }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default FormField;