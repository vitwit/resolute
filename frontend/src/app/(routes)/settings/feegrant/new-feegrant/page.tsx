'use client';

import React from 'react';
import '../../settings.css';
import NewFeegrantPage from './components/NewFeegrantPage';
import Link from 'next/link';
import PageHeader from '@/components/common/PageHeader';

const page = () => {
  return (
    <div className="feegrant-main">
      <div className="">
        <Link
          href="/settings/feegrant"
          className="text-btn h-8 flex items-center w-fit"
        >
          <span>Back</span>
        </Link>
        <PageHeader title="New Feegrant" description="New Feegrant" />
      </div>
      <NewFeegrantPage />
    </div>
  );
};

export default page;
