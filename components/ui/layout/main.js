import { Navbar } from '@components/ui/common';
import { Web3Provider } from '@components/providers';

export default function MainLayout({ children }) {
  return (
    <Web3Provider>
      <div className="bg-gray-900 min-h-screen">
        <Navbar />
        {children}
      </div>
    </Web3Provider>
  );
}
