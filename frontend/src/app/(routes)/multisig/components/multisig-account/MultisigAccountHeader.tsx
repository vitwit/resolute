import CustomButton from '@/components/common/CustomButton';
import LetterAvatar from '@/components/common/LetterAvatar';
import Link from 'next/link';
import React from 'react';

const MultisigAccountHeader = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 space-y-6">
        <Link href={''} className="text-btn h-8 flex items-center">
          <span>Back to List</span>
        </Link>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div>
              <LetterAvatar name="Multisig Name" height="32px" width="32px" />
            </div>
            <div className="text-h1">Multisig Name</div>
            <div className="text-small-light">
              Created on 23rd March 2023, 11:34 am
            </div>
          </div>
          <div className="divider-line"></div>
        </div>
      </div>
      {isAdmin ? (
        <CustomButton btnText="Delete Multisig" btnStyles="w-fit" />
      ) : null}
    </div>
  );
};

export default MultisigAccountHeader;
