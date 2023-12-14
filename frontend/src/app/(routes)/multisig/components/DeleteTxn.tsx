import { useAppDispatch } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { deleteTxn } from '@/store/features/multisig/multisigSlice';
import { getAuthToken } from '@/utils/localStorage';
import Image from 'next/image';
import React, { useState } from 'react';
import DialogDeleteTxn from './DialogDeleteTxn';

interface DeleteTxnProps {
  txId: number;
  address: string;
  chainID: string;
}

const DeleteTxn: React.FC<DeleteTxnProps> = (props) => {
  const { txId, address, chainID } = props;
  const dispatch = useAppDispatch();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const { getChainInfo } = useGetChainInfo();
  const { address: walletAddress } = getChainInfo(chainID);
  const authToken = getAuthToken(chainID);

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

  return (
    <>
      <div
        className="action-image justify-center flex"
        onClick={() => setDeleteDialogOpen(true)}
      >
        <Image
          src="/delete-icon.svg"
          width={14}
          height={14}
          alt="Delete-Icon"
          className="cursor-pointer"
        />
      </div>
      <DialogDeleteTxn
        open={deleteDialogOpen}
        onClose={() => handleDeleteDialogClose()}
        deleteTx={deleteTx}
      />
    </>
  );
};

export default DeleteTxn;
