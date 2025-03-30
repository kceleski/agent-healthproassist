
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import DIDScriptHead from '@/components/DIDScriptHead';
import { SubscriptionToggle } from '@/components/ui/subscription-toggle';
import { useAuth } from '@/context/AuthContext';

const MainLayout = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <DIDScriptHead />
      <Navbar />
      <main className="flex-grow animate-fade-in">
        <Outlet />
      </main>
      
      {/* Show subscription toggle for authenticated users */}
      {user && (
        <div className="fixed bottom-4 left-4 z-50">
          <SubscriptionToggle />
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default MainLayout;
