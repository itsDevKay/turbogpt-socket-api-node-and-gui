
export default function InputField({ type, id, required, name, placeholder, extraClass, onChange }) {
    if (!extraClass) { extraClass = '' }
    return (
        <div className=" relative ">
            <input 
                type={`${type}`} 
                id={`${id}`} 
                required={required} 
                style={{ borderColor: 'rgb(156 163 175 / var(--tw-border-opacity)) !important;' }}
                className={`${extraClass} rounded-lg border-transparent flex-1 appearance-none border border-gray-400 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`} 
                name={`${name}`}
                placeholder={`${placeholder}`}
                onChange={onChange}
            />
        </div>
    )
}