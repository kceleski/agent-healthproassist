
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import { AvatarResponseProvider } from '@/context/AvatarResponseContext';
import { useEffect } from 'react';
import ElevenLabsAvatar from '@/components/ElevenLabsAvatar';

const MainLayout = () => {
  const location = useLocation();
  
  // Don't show on map or search pages
  const isMapPage = location.pathname.includes('/map');
  const isSearchPage = location.pathname.includes('/search') && 
                      (location.pathname.includes('facility') || location.pathname.includes('map'));
  
  const showAvatar = !isMapPage && !isSearchPage;
  
  // Add a log to verify the layout is rendering
  useEffect(() => {
    console.log('MainLayout mounted', { path: location.pathname, showAvatar });
  }, [location.pathname, showAvatar]);

  return (
    <div className="min-h-screen flex flex-col">
      <AvatarResponseProvider>
        <Navbar />
        <main className="flex-grow">
          <Outlet />
          {showAvatar && <ElevenLabsAvatar />}
        </main>
        <Footer />
      </AvatarResponseProvider>
    </div>
  );
};

export default MainLayout;
