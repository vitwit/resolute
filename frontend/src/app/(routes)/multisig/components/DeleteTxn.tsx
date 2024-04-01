import { useAppDispatch } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  deleteTxn,
  setVerifyDialogOpen,
} from '@/store/features/multisig/multisigSlice';
import { getAuthToken } from '@/utils/localStorage';
import Image from 'next/image';
import React, { useState } from 'react';
import DialogDeleteTxn from './DialogDeleteTxn';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';

interface DeleteTxnProps {
  txId: number;
  address: string;
  chainID: string;
  isMember: boolean;
}

const DeleteTxn: React.FC<DeleteTxnProps> = (props) => {
  const { txId, address, chainID, isMember } = props;
  const dispatch = useAppDispatch();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const { getChainInfo } = useGetChainInfo();
  const { address: walletAddress } = getChainInfo(chainID);
  const authToken = getAuthToken(chainID);
  const { isAccountVerified } = useVerifyAccount({
    chainID,
    address: walletAddress,
  });

  const deleteTx = () => {
    dispatch(
      deleteTxn({
        queryParams: {
          address: walletAddress,
          signature: authToken?.signature || '',
        },
        data: {
          address: address,
          id: txId,
        },
      })
    );
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteTxn = () => {
    if (!isAccountVerified()) {
      dispatch(setVerifyDialogOpen(true));
      return;
    }
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <button
        className="action-image justify-center items-center flex"
        disabled={!isMember}
        onClick={() => handleDeleteTxn()}
      >
        <Image
          src="/delete-icon.svg"
          width={14}
          height={14}
          alt="Delete-Icon"
          className="cursor-pointer"
          draggable={false}
        />
      </button>
      <DialogDeleteTxn
        open={deleteDialogOpen}
        onClose={() => handleDeleteDialogClose()}
        deleteTx={deleteTx}
      />
    </>
  );
};

export default DeleteTxn;
