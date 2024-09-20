'use client';

import React from 'react';
import MultisigInfoLoading from '../../components/loaders/MultisigInfoLoading';

const loading = () => (
  <div className="py-10 h-full flex flex-col min-h-[100vh]">
    <MultisigInfoLoading />
  </div>
);

export default loading;
