'use client';

import React from 'react';
import MultisigAccountsLoading from '../components/loaders/MultisigAccountsLoading';
import TransactionsLoading from '../components/loaders/TransactionsLoading';

const loading = () => (
  <>
    <MultisigAccountsLoading />
    <TransactionsLoading />
  </>
);

export default loading;
