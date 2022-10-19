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

export const LoadingButton = ({ children, className, ...rest }) => {
  return (
    <button
      {...rest}
      className={`border-2 py-2 px-8 gap-2 group rounded-full flex font-bold transition-all hover:text-gray-900 hover:bg-gray-100 ${className}`}
    >
      <div className="animate-spin w-6 h-6 border-4 group-hover:border-gray-900 border-gray-100 border-b-transparent group-hover:border-b-white rounded-full mr-2" />{' '}
      {children}
    </button>
  );
};
