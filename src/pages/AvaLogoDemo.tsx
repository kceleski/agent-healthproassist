
import React from 'react';
import AvaHeartbeatLogo from '@/components/graphics/AvaHeartbeatLogo';
import { Helmet } from 'react-helmet';

const AvaLogoDemo = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 p-4">
      <Helmet>
        <title>HealthProAva Logo</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold text-white mb-8">HealthProAva Logo</h1>
      
      <div className="glass-card p-8 rounded-xl w-full max-w-2xl flex flex-col items-center">
        <AvaHeartbeatLogo width={300} height={100} className="mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Light Background</h2>
            <div className="bg-white p-4 rounded-lg">
              <AvaHeartbeatLogo width={200} height={80} />
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Different Size</h2>
            <AvaHeartbeatLogo width={250} height={120} />
          </div>
        </div>
        
        <div className="mt-8 text-white">
          <h2 className="text-xl font-semibold mb-4">Download Options</h2>
          <p className="text-gray-300 mb-4">
            For production use, you can export this as an SVG, PNG, or integrate the component directly
            into your application.
          </p>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-healthcare-600 rounded-lg hover:bg-healthcare-700 transition-colors">
              Download SVG
            </button>
            <button className="px-4 py-2 bg-healthcare-600 rounded-lg hover:bg-healthcare-700 transition-colors">
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvaLogoDemo;
