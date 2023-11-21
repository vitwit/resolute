import React from 'react';
import StakingPage from '../components/StakingPage';
import '../staking.css'

const page = ({ params }: { params: { network: string } }) => {
  const { network: chainName } = params;
  return <div>
    <StakingPage chainName={chainName} />
  </div>;
};

export default page;
