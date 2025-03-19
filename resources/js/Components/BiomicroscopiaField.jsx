// components/BiomicroscopiaField.jsx
const BiomicroscopiaField = ({ label, value, onChange, campo }) => {
    return (
        <>
            <label className='border-gray-300 shadow-sm border flex items-center px-4'>{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(campo, e.target.value)}
                className="block w-full border-gray-300 shadow-sm"
            />
        </>
    );
};

export default BiomicroscopiaField;