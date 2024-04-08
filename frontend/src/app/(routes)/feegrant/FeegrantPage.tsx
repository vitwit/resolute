'use client';

import React, { useState } from 'react';
import TopNav from '@/components/TopNav';
import GrantedByMe from './components/GrantedByMe';
import GrantedToMe from './components/GrantedToMe';
import DialogCreateFeegrant from './components/DialogCreateFeegrant';
import FeegrantToast from '@/components/FeegrantToast';
import useInitFeegrant from '@/custom-hooks/useInitFeegrant';

const FeegrantPage = ({ chainIDs }: { chainIDs: string[] }) => {
  useInitFeegrant({ chainIDs });

  const [isGrantedToMe, setIsGrantedToMe] = useState(true);

  const [dialogGrantOpen, setDialogGrantOpen] = useState(false);
  const handleDialogGrantClose = () => {
    setDialogGrantOpen(false);
  };

  return (
    <div className="py-6 px-10 h-screen overflow-y-scroll">
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="page-title">FeeGrant</h2>
          <TopNav showFeegrantButton={true} showAuthzButton={false} />
        </div>
        <FeegrantToast chainIDs={chainIDs} margins="" />
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
              <button
                className="create-grant-btn"
                onClick={() => setDialogGrantOpen(true)}
              >
                Create Grant
              </button>
            </div>
          </div>
          <div>
            {isGrantedToMe ? (
              <GrantedToMe chainIDs={chainIDs} />
            ) : (
              <GrantedByMe
                chainIDs={chainIDs}
                handleGrantDialogOpen={() => setDialogGrantOpen(true)}
              />
            )}
          </div>
        </div>
      </div>
      <DialogCreateFeegrant
        onClose={handleDialogGrantClose}
        open={dialogGrantOpen}
      />
    </div>
  );
};

export default FeegrantPage;
