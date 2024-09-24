import React from 'react';
import '@/app/interchain-agent.css';
import InterchainAgentDialog from './InterchainAgentDialog';

const ARKA_BOT_THEME = {
  title: 'Interchain Agent',
  primaryColor: '#40404a',
  bubbleText: 'Ask',
  bubbleColor: '#40404a',
};
export const ARKA_BOT_CONFIG = {
  apiUrl: process.env.NEXT_PUBLIC_BOT_API_URL || '',
  accessToken: process.env.NEXT_PUBLIC_BOT_ACCESS_TOKEN || '',
  refreshToken: process.env.NEXT_PUBLIC_BOT_REFRESH_TOKEN || '',
  deploymentID: process.env.NEXT_PUBLIC_BOT_DEPLOYMENT_ID || '',
  planID: process.env.NEXT_PUBLIC_BOT_PLAN_ID || '',
  planOwner: process.env.NEXT_PUBLIC_BOT_PLAN_OWNER || '',
  subscriber: process.env.NEXT_PUBLIC_BOT_SUBSCRIBER || '',
  theme: ARKA_BOT_THEME || {},
};

const InterchainAgent = () => {
  return (
    <div>
      <InterchainAgentDialog
        accessToken={ARKA_BOT_CONFIG.accessToken}
        apiUrl={ARKA_BOT_CONFIG.apiUrl}
        deploymentID={Number(ARKA_BOT_CONFIG.deploymentID)}
        planID={Number(ARKA_BOT_CONFIG.planID)}
        planOwner={ARKA_BOT_CONFIG.planOwner}
        refreshToken={ARKA_BOT_CONFIG.refreshToken}
        subscriber={ARKA_BOT_CONFIG.subscriber}
      />
    </div>
  );
};

export default InterchainAgent;
