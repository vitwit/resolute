import React from 'react';
import StyledNetworkLogo from './StyledNetworkLogo';

const NetworkLogo = ({ logo, color }: { logo: string; color: string }) => {
  return (
    <div>
      <div>
        <StyledNetworkLogo color={color} logo={logo} />
      </div>
      <div></div>
    </div>
  );
};

export default NetworkLogo;
