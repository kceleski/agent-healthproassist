
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import { AvatarResponseProvider } from '@/context/AvatarResponseContext';
import { useEffect } from 'react';

const MainLayout = () => {
  const location = useLocation();

  // Don't show footer on map or search pages
  const isMapPage = location.pathname.includes('/map');
  const isSearchPage = location.pathname.includes('/search') &&
                      (location.pathname.includes('facility') || location.pathname.includes('map'));
  const isLandingPage = location.pathname === '/' || location.pathname === '/landing';
                      
  // Add a log to verify the layout is rendering
  useEffect(() => {
    console.log('MainLayout mounted', { 
      path: location.pathname, 
      isMapPage, 
      isSearchPage,
      isLandingPage
    });
  }, [location.pathname, isMapPage, isSearchPage, isLandingPage]);

  return (
    <div className="min-h-screen flex flex-col w-full">
      <AvatarResponseProvider>
        <Navbar />
        <main className="flex-grow w-full max-w-full overflow-x-hidden">
          <Outlet />
        </main>
        {!isMapPage && <Footer />}
      </AvatarResponseProvider>
    </div>
  );
};

export default MainLayout;
