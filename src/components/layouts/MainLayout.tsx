
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import DIDScriptHead from '@/components/DIDScriptHead';
import AvatarIntegration from '@/components/AvatarIntegration';
import { AvatarResponseProvider } from '@/context/AvatarResponseContext';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <DIDScriptHead />
      <AvatarResponseProvider>
        <Navbar />
        <main className="flex-grow animate-fade-in">
          <Outlet />
          <AvatarIntegration />
        </main>
        <Footer />
      </AvatarResponseProvider>
    </div>
  );
};

export default MainLayout;
