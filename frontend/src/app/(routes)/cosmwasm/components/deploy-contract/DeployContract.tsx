import PageHeader from '@/components/common/PageHeader';
import { DEPLOY_CONTRACT_DESCRIPTION } from '@/utils/constants';
import React from 'react';
import DeployContractTabs from './DeployContractTabs';
import UseExistingCode from './UseExistingCode';

const DeployContract = () => {
  return (
    <div className="py-10 h-full space-y-10 min-h-[100vh]">
      <PageHeader title="Deploy" description={DEPLOY_CONTRACT_DESCRIPTION} />
      <DeployContractTabs />
      <UseExistingCode />
    </div>
  );
};

export default DeployContract;
