
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import DIDScriptHead from '@/components/DIDScriptHead';
import AvatarIntegration from '@/components/AvatarIntegration';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <DIDScriptHead />
      <Navbar />
      <main className="flex-grow animate-fade-in">
        <Outlet />
        <AvatarIntegration />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
