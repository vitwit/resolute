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