import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetAuthzRevokeMsgs from '@/custom-hooks/useGetAuthzRevokeMsgs';

import { txAuthzRevoke } from '@/store/features/authz/authzSlice';
import { RootState } from '@/store/store';
import { TxStatus } from '@/types/enums';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';

import Image from 'next/image';
import React, { useEffect } from 'react';

interface DialogRevokeProps {
  open: boolean;
  onClose: () => void;
  chainID: string;
  grantee: string;
  granter: string;
  typeURL: string;
}

const DialogRevoke: React.FC<DialogRevokeProps> = (props) => {
  const { open, onClose, chainID, grantee, granter, typeURL } = props;
  const dispatch = useAppDispatch();
  const { txRevokeAuthzInputs } = useGetAuthzRevokeMsgs({
    granter,
    grantee,
    chainID,
    typeURLs: [typeURL],
  });
  const { basicChainInfo, denom, feeAmount, feegranter, msgs } =
    txRevokeAuthzInputs;
  const txRevoke = () => {
    dispatch(
      txAuthzRevoke({
        basicChainInfo,
        denom,
        feeAmount,
        feegranter,
        msgs,
      })
    );
  };
  const loading = useAppSelector(
    (state: RootState) => state.authz.chains?.[chainID].tx.status
  );

  useEffect(() => {
    if (loading === TxStatus.IDLE) {
      onClose();
    }
  }, [loading]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 pb-6 pt-10 flex justify-end">
            <div onClick={onClose}>
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
          <div>
            <div className="flex h-[298px]">
              <div>
                <Image
                  src="/revoke-image.png"
                  width={288}
                  height={238}
                  alt="Revoke"
                  draggable={false}
                />
              </div>
              <div className="flex flex-col gap-6  self-stretch px-10 py-0 mt-10">
                <div className="text-white text-xl not-italic font-bold leading-[normal]">
                  Revoke Permission?
                </div>
                <div className="text-white text-sm not-italic font-light leading-[normal]">
                  Are you sure you want to delete this transaction ? This action
                  cannot be undone
                </div>
                <div className="flex space-x-10 items-center">
                  <button
                    onClick={() => {
                      txRevoke();
                    }}
                    className="create-grant-btn h-10 w-[140px]"
                  >
                    {loading === TxStatus.PENDING ? (
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                    ) : (
                      'Revoke'
                    )}
                  </button>
                  <button
                onClick={onClose}
                className="font-medium tracking-[0.64px] underline underline-offset-[3px]"
              >
                Cancel
              </button>
                </div>
              </div>
            </div>
          </div>
          <div className="justify-end items-center gap-2.5 self-stretch pt-6 pb-0 px-6"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogRevoke;
