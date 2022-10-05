export default function Button({ children, className, ...rest }) {
  return (
    <button
      {...rest}
      className={`border-2 py-2 px-8 gap-2 rounded-full flex font-bold transition-all hover:text-gray-900 hover:bg-gray-100 ${className}`}
    >
      {children}
    </button>
  );
}
