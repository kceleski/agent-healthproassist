
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
    console.log('[LAYOUT DEBUG] MainLayout mounted', { 
      path: location.pathname, 
      isMapPage, 
      isSearchPage,
      isLandingPage
    });
  }, [location.pathname, isMapPage, isSearchPage, isLandingPage]);

  return (
    <div className="min-h-screen flex flex-col w-full border-8 border-green-500 bg-pink-100 z-[9998]">
      <div style={{
        background: "#222",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
        padding: "4px",
        textAlign: "center",
        zIndex: 9999,
        marginBottom: 10
      }}>
        [DEBUG] MainLayout wrapper is rendering
      </div>
      <AvatarResponseProvider>
        <Navbar />
        <main
          className="flex-grow w-full max-w-full overflow-x-hidden border-4 border-purple-500 bg-blue-100"
          style={{ minHeight: '250px', position: 'relative', zIndex: 10 }}
        >
          <div
            className="border-4 border-red-800 bg-orange-100"
            style={{
              zIndex: 11,
              position: 'relative',
              padding: 8
            }}
          >
            [DEBUG] MainLayout Outlet container
            <Outlet />
          </div>
        </main>
        {!isMapPage && <Footer />}
      </AvatarResponseProvider>
    </div>
  );
};

export default MainLayout;

