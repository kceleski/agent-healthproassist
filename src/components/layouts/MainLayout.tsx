
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import AvatarIntegration from '@/components/AvatarIntegration';
import { AvatarResponseProvider } from '@/context/AvatarResponseContext';
import { useEffect } from 'react';

const MainLayout = () => {
  // Add a log to verify the layout is rendering
  useEffect(() => {
    console.log('MainLayout mounted');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <AvatarResponseProvider>
        <Navbar />
        <main className="flex-grow">
          <Outlet />
          <AvatarIntegration />
        </main>
        <Footer />
      </AvatarResponseProvider>
    </div>
  );
};

export default MainLayout;
