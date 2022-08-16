export default function Button({ children, className = '', ...rest }) {
  return (
    <button {...rest} className={`border py-2 px-8 rounded-full ${className}`}>
      {children}
    </button>
  );
}
