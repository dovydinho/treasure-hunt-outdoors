export default function InstallMetamask() {
  return (
    <>
      <div className="flex items-center h-screen bg-gray-900 text-gray-100">
        <div className="animate-pulse w-96 rounded-lg mx-auto p-4 bg-gradient-to-r from-purple-500/25 via-purple-500/80 to-purple-500/25 border border-gray-500 border-dashed text-gray-100 text-center">
          Cannot connect to network. Please install Metamask.
        </div>
      </div>
    </>
  );
}
