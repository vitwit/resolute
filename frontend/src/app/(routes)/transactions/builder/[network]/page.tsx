import React from 'react';
import '@/app/(routes)/multiops/multiops.css';
import PageMultiops from './PageMultiops';

const page = ({ params: { network } }: { params: { network: string } }) => {
  return <PageMultiops paramChain={network} />;
};

export default page;
