export default function WrongNetwork({ network }) {
  return (
    <>
      <div className="flex items-center h-screen bg-gray-900 text-gray-100">
        <div className="animate-pulse w-96 rounded-lg mx-auto p-4 bg-gradient-to-r from-red-600/25 via-red-600/80 to-red-600/25 border border-dashed border-gray-500 text-gray-100 text-center">
          <div>Connected to wrong network</div>
          <div>
            Please connect to: {` `}
            <span className="font-bold">{network.target}</span>
          </div>
        </div>
      </div>
    </>
  );
}
