import React from 'react';

const SelectInput = ({ 
    id, 
    name, 
    value, 
    className = '', 
    onChange, 
    required = false, 
    children 
}) => {
    return (
        <select
            id={id}
            name={name}
            value={value}
            className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${className}`}
            onChange={onChange}
            required={required}
        >
            {children}
        </select>
    );
};

export default SelectInput;