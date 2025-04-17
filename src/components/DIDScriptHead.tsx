
import { Helmet } from 'react-helmet';
import { useEffect } from 'react';

interface DIDScriptHeadProps {
  clientKey?: string;
  agentId?: string;
  mode?: string;
}

const DIDScriptHead = ({
  clientKey = 'Z29vZ2xlLW9hdXRoMnwxMDczMTY2OTQxNDk2MjA5NTE1NzI6VHRmVE13cXBSQWk4eU5qTHpLT1J4',
  agentId = 'agt_BvPZpW03',
  mode = 'fabio'
}: DIDScriptHeadProps) => {
  useEffect(() => {
    // Ensure D-ID script is loaded dynamically
    const didScript = document.createElement('script');
    didScript.type = 'module';
    didScript.src = 'https://agent.d-id.com/v1/index.js';
    didScript.setAttribute('data-name', 'did-agent');
    didScript.setAttribute('data-mode', mode);
    didScript.setAttribute('data-client-key', clientKey);
    didScript.setAttribute('data-agent-id', agentId);
    didScript.setAttribute('data-monitor', 'true');
    
    document.head.appendChild(didScript);
    
    return () => {
      document.head.removeChild(didScript);
    };
  }, [clientKey, agentId, mode]);

  return (
    <Helmet>
      {/* This is now just a placeholder as we're loading the script dynamically */}
    </Helmet>
  );
};

export default DIDScriptHead;
