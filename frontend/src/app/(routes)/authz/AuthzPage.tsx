import TopNav from '@/components/TopNav';
import React, { useState } from 'react';
import DialogCreateAuthzGrant from './components/DialogCreateAuthzGrant';
import GrantsToMe from './components/GrantsToMe';
import GrantsByMe from './components/GrantsByMe';

const AuthzPage = ({ chainIDs }: { chainIDs: string[] }) => {
  const [isGrantsToMe, setIsGrantsToMe] = useState(true);

  const [dialogGrantOpen, setDialogGrantOpen] = useState(false);
  const handleDialogGrantClose = () => {
    setDialogGrantOpen(false);
  };

  return (
    <div className="py-6 px-10">
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="page-title">Authz</h2>
          <TopNav />
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <button
                className={
                  isGrantsToMe ? 'grants-type-btn-selected' : 'grants-type-btn'
                }
                onClick={() => setIsGrantsToMe(true)}
              >
                Grants to me
              </button>
              <button
                className={
                  isGrantsToMe ? 'grants-type-btn' : 'grants-type-btn-selected'
                }
                onClick={() => setIsGrantsToMe(false)}
              >
                Grants by me
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
            {isGrantsToMe ? (
              <GrantsToMe chainIDs={chainIDs} />
            ) : (
              <GrantsByMe
                chainIDs={chainIDs}
                handleGrantDialogOpen={() => setDialogGrantOpen(true)}
              />
            )}
          </div>
        </div>
      </div>
      <DialogCreateAuthzGrant
        open={dialogGrantOpen}
        onClose={handleDialogGrantClose}
      />
    </div>
  );
};

export default AuthzPage;
