import CustomButton from '@/components/common/CustomButton';
import LetterAvatar from '@/components/common/LetterAvatar';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';
import {
  deleteMultisig,
  setVerifyDialogOpen,
} from '@/store/features/multisig/multisigSlice';
import { COSMOS_CHAIN_ID } from '@/utils/constants';
import { getTimeDifferenceToFutureDate } from '@/utils/dataTime';
import { getAuthToken } from '@/utils/localStorage';
import Link from 'next/link';
import React, { useState } from 'react';
import DialogDeleteMultisig from './DialogDeleteMultisig';

const MultisigAccountHeader = ({
  isAdmin,
  multisigName,
  createdTime,
  goBackURL,
  multisigAddress,
  walletAddress,
}: {
  isAdmin: boolean;
  multisigName: string;
  createdTime: string;
  goBackURL: string;
  multisigAddress: string;
  walletAddress: string;
}) => {
  const dispatch = useAppDispatch();
  const { isAccountVerified } = useVerifyAccount({
    address: walletAddress,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const handleDeleteMultisig = () => {
    const authToken = getAuthToken(COSMOS_CHAIN_ID);
    if (isAdmin) {
      dispatch(
        deleteMultisig({
          data: { address: multisigAddress },
          queryParams: {
            address: walletAddress,
            signature: authToken?.signature || '',
          },
        })
      );
    }
  };

  const onDeleteMultisig = () => {
    if (!isAccountVerified()) {
      dispatch(setVerifyDialogOpen(true));
      return;
    }
    setDeleteDialogOpen(true);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 space-y-6">
        <Link href={goBackURL} className="text-btn h-8 flex items-center">
          <span>Back to List</span>
        </Link>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div>
              <LetterAvatar name={multisigName} height="32px" width="32px" />
            </div>
            <div className="text-h1">{multisigName}</div>
            {createdTime ? (
              <div className="text-small-light">
                Create {getTimeDifferenceToFutureDate(createdTime, true)} ago
              </div>
            ) : null}
          </div>
          <div className="divider-line"></div>
        </div>
      </div>
      {isAdmin ? (
        <CustomButton
          btnOnClick={onDeleteMultisig}
          btnText="Delete Multisig"
          btnStyles="w-fit"
        />
      ) : null}
      <DialogDeleteMultisig
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDeleteMultisig}
      />
    </div>
  );
};

export default MultisigAccountHeader;
