
import { Helmet } from 'react-helmet';

interface DIDScriptHeadProps {
  clientKey?: string;
  agentId?: string;
  mode?: 'fabio' | 'dialog' | 'widget' | 'avatar';
  autoStart?: boolean;
  presenterId?: string;
}

const DIDScriptHead = ({
  clientKey = 'Z29vZ2xlLW9hdXRoMnwxMDczMTY2OTQxNDk2MjA5NTE1NzI6VHRmVE13cXBSQWk4eU5qTHpLT1J4',
  agentId = 'agt_xiZtjv1x',
  mode = 'fabio',
  autoStart = false,
  presenterId
}: DIDScriptHeadProps) => {
  return (
    <Helmet>
      <script
        type="module"
        src="https://agent.d-id.com/v1/index.js"
        data-name="did-agent"
        data-mode={mode}
        data-client-key={clientKey}
        data-agent-id={agentId}
        data-monitor="true"
        data-auto-start={autoStart ? "true" : "false"}
        data-presenter-id={presenterId}
      />
    </Helmet>
  );
};

export default DIDScriptHead;
