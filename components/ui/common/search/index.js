export default function Search({ search }) {
  return (
    <input
      className="w-full
              rounded-full bg-transparent 
              border border-dashed border-indigo-600 
              mb-5 px-8 py-2 focus:outline-none 
              placeholder:text-sm placeholder:text-indigo-600 text-gray-100"
      placeholder="Search by treasure title or address..."
      onKeyUp={(e) => search(e.target.value)}
    />
  );
}
