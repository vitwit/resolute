import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { TxStatus } from '@/types/enums';
import { MultisigAddressPubkey, Txn } from '@/types/multisig';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React, { useEffect } from 'react';
import TransactionItem from './TransactionItem';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';

interface DialogViewTxnMessagesProps {
  open: boolean;
  txn: Txn;
  multisigAddress: string;
  threshold: number;
  pubKeys: MultisigAddressPubkey[];
  membersCount: number;
  chainID: string;
  toggleMsgDialogOpen: () => void;
  onViewRawAction: (txn: Txn) => void;
  isHistory: boolean;
  currency: Currency;
  explorerTxHashEndpoint: string;
  onViewError: (errMsg: string) => void;
  handleMsgDialogClose: () => void;
}

const DialogViewTxnMessages: React.FC<DialogViewTxnMessagesProps> = (props) => {
  const {
    open,
    txn,
    multisigAddress,
    threshold,
    membersCount,
    chainID,
    pubKeys,
    toggleMsgDialogOpen,
    isHistory,
    currency,
    onViewRawAction,
    explorerTxHashEndpoint,
    onViewError,
    handleMsgDialogClose,
  } = props;
  const deleteTxnRes = useAppSelector(
    (state: RootState) => state.multisig.deleteTxnRes
  );
  useEffect(() => {
    if (deleteTxnRes.status === TxStatus.IDLE) {
      handleMsgDialogClose();
    }
  }, [deleteTxnRes]);
  return (
    <Dialog
      open={open}
      onClose={() => toggleMsgDialogOpen()}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white px-10">
          <div className="py-6 pt-10 flex justify-end">
            <div
              onClick={() => {
                toggleMsgDialogOpen();
              }}
            >
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
                draggable={false}
              />
            </div>
          </div>
          <div className="mb-[72px] space-y-6">
            <div>
              <div className="flex justify-between gap-6">
                <div className="flex-1">Messages</div>
                <div className="w-[50px]">Signed</div>
                {isHistory ? <div className="w-[80px]">Status</div> : null}
                <div className={isHistory ? `w-[100px]` : `w-[180px]`}>
                  Actions
                </div>
              </div>
              <div className="line"></div>
            </div>
            <TransactionItem
              txn={txn}
              multisigAddress={multisigAddress}
              threshold={threshold}
              pubKeys={pubKeys}
              membersCount={membersCount}
              chainID={chainID}
              isHistory={isHistory}
              currency={currency}
              onViewRawAction={onViewRawAction}
              explorerTxHashEndpoint={explorerTxHashEndpoint}
              onViewError={onViewError}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogViewTxnMessages;
