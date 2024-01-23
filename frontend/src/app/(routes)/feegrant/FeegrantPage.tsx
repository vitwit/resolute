'use client';

import React, { useState } from 'react';
import TopNav from '@/components/TopNav';

const FeegrantPage = ({ chainIDs }: { chainIDs: string[] }) => {
  const [isGrantedToMe, setIsGrantedToMe] = useState(true);

  return (
    <div className="py-6 px-10">
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="page-title">FeeGrant</h2>
          <TopNav />
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <button
                className={
                  isGrantedToMe
                    ? 'feegrants-type-btn-selected'
                    : 'feegrants-type-btn'
                }
                onClick={() => setIsGrantedToMe(true)}
              >
                FeeGrants to me
              </button>

              <button
                className={
                  isGrantedToMe
                    ? 'feegrants-type-btn'
                    : 'feegrants-type-btn-selected'
                }
                onClick={() => setIsGrantedToMe(false)}
              >
                FeeGrants by me
              </button>
            </div>
            <div>
              <button className="create-grant-btn">Create Grant</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeegrantPage;
