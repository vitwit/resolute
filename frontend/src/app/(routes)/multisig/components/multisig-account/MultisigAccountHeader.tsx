import CustomButton from '@/components/common/CustomButton';
import LetterAvatar from '@/components/common/LetterAvatar';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';
import {
  deleteMultisig,
  setVerifyDialogOpen,
} from '@/store/features/multisig/multisigSlice';
import { COSMOS_CHAIN_ID } from '@/utils/constants';
import { getAuthToken } from '@/utils/localStorage';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setError } from '@/store/features/common/commonSlice';
import DialogConfirmDelete from './DialogConfirmDelete';
import Copy from '@/components/common/Copy';

const MultisigAccountHeader = ({
  isAdmin,
  multisigName,
  multisigAddress,
  walletAddress,
  chainName,
  threshold,
  membersCount,
}: {
  isAdmin: boolean;
  multisigName: string;
  multisigAddress: string;
  walletAddress: string;
  chainName: string;
  threshold: number;
  membersCount: number;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAccountVerified } = useVerifyAccount({
    address: walletAddress,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteMultisigRes = useAppSelector(
    (state) => state.multisig.deleteMultisigRes
  );
  const loading = useAppSelector((state) => state.multisig.deleteMultisigRes);

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

  useEffect(() => {
    if (deleteMultisigRes.status === 'idle') {
      dispatch(
        setError({ message: 'Account Deleted Successfully', type: 'success' })
      );
      setTimeout(() => {
        router.push(`/multisig/${chainName}`);
      }, 500);
    }
  }, [deleteMultisigRes]);

  return (
    <div className="flex items-center w-full">
      <div className="flex-1 space-y-6 border-b-[1px] border-[#ffffff1d] pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div>
              <LetterAvatar name={multisigName} height="32px" width="32px" />
            </div>
            <div className="text-[28px] font-bold text-[#fffffff0]">
              {multisigName}
            </div>
            <div className="px-4 py-1 rounded-full border-[1px] border-[#ffffff80] bg-[#ffffff14] h-6 flex font-extralight">
              <div className="text-[14px] text-[#fffffff0] h-[17px] flex items-end">
                {threshold}
              </div>
              <div className="text-[12px] text-[#ffffff80] h-[17px] flex items-end">{`/${membersCount} Threshold`}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8"></div>
            <div className="flex items-center gap-1">
              <div className="text-[#ffffff80] text-[12px]">
                {multisigAddress}
              </div>
              <Copy content={multisigAddress} height={16} width={16} />
            </div>
          </div>
        </div>
      </div>
      {isAdmin ? (
        <CustomButton
          btnOnClick={onDeleteMultisig}
          btnText="Delete Multisig"
          btnStyles="min-w-[157.6px] mt-6"
        />
      ) : null}
      <DialogConfirmDelete
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDeleteMultisig}
        title="Delete Multisig"
        description=" Are you sure you want to delete this multisig ?"
        loading={loading.status === 'pending'}
      />
    </div>
  );
};

export default MultisigAccountHeader;
