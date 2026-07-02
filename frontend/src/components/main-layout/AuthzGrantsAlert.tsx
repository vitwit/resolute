import { CANCEL_ICON_SOLID } from '@/constants/image-names';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useAuthzGrants from '@/custom-hooks/useAuthzGrants';
import { setAuthzAlert } from '@/store/features/authz/authzSlice';
import { getAuthzAlertData, setAuthzAlertData } from '@/utils/localStorage';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Dialog, DialogContent, Checkbox } from '@mui/material';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import CustomButton from '../common/CustomButton';

const AuthzGrantsAlert = () => {
  const { getSendAuthzGrants } = useAuthzGrants();
  const [dialogOpen, setDialogOpen] = useState(false);

  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );
  const sendGrantsData = getSendAuthzGrants(chainIDs);
  const dispatch = useAppDispatch();

  const showAuthzGrantsAlert = useAppSelector(
    (state) => state.authz.authzAlert.display
  );

  const handleCloseAlert = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = (closePermanently: boolean) => {
    setDialogOpen(false);
    dispatch(setAuthzAlert(false));
    if (closePermanently) setAuthzAlertData(false);
  };

  if (
    showAuthzGrantsAlert &&
    (sendGrantsData.ibcTransfer > 0 || sendGrantsData.send > 0) &&
    getAuthzAlertData() &&
    !isAuthzMode
  )
    return (
      <div className="w-full h-[54px] bg-[#ffc13c] gap-1 flex items-center justify-center z-10 text-[#1C1C1D]">
        <div className="max-w-[1512px] w-full flex items-center justify-between pl-[20px] pr-6">
          <div className="flex items-center gap-1">
            <Image
              src="/infoblack.svg"
              width={24}
              height={24}
              alt="info-icon"
              draggable={false}
            />
            <p className="text-sm font-semibold leading-[normal]">Important</p>{' '}
            <p className="text-sm font-normal leading-normal">
              You have granted
              <span className="font-bold">
                {sendGrantsData.send > 0 ? ' Send' : ''}
                {sendGrantsData.send > 0 && sendGrantsData.ibcTransfer > 0
                  ? ','
                  : ''}
                {sendGrantsData.ibcTransfer > 0 ? ' IBC Transfer' : ''}
              </span>{' '}
              access to{' '}
              <span className="font-bold">
                {' '}
                {sendGrantsData.send > sendGrantsData.ibcTransfer
                  ? sendGrantsData.send
                  : sendGrantsData.ibcTransfer}
              </span>{' '}
              {sendGrantsData.send > 1 || sendGrantsData.ibcTransfer > 1
                ? 'accounts.'
                : 'account.'}{' '}
              <Link
                className="font-bold underline"
                href={'/settings/authz'}
                prefetch={false}
              >
                Click here
              </Link>{' '}
              to review and Revoke the access if it&apos;s not required
            </p>
          </div>
          <button
            onClick={() => {
              handleCloseAlert();
            }}
          >
            <Image src={CANCEL_ICON_SOLID} width={32} height={32} alt="Close" />
          </button>
        </div>
        {dialogOpen && (
          <DialogCloseAlert
            open={dialogOpen}
            onClose={handleDialogClose}
            onCloseDialog={() => setDialogOpen(false)}
          />
        )}
      </div>
    );

  return null;
};

export default AuthzGrantsAlert;

const DialogCloseAlert = ({
  onClose,
  open,
  onCloseDialog,
}: {
  onClose: (closePermanently: boolean) => void;
  open: boolean;
  onCloseDialog: () => void;
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    onClose(dontShowAgain);
  };

  return (
    <Dialog
      open={open}
      onClose={onCloseDialog}
      maxWidth="lg"
      sx={{
        '& .MuiDialog-paper': {
          color: 'white',
        },
      }}
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="p-4 pb-6 w-[520px]">
          <div className="px-10 py-6 space-y-6">
            <label className="flex items-center cursor-pointer">
              <Checkbox
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                color="primary"
                sx={{
                  color: '#ffffff80',
                  '&.Mui-checked': {
                    color: '#ffffff80',
                  },
                }}
              />
              <span className="text-[#FFFFFF80]">
                This is intentional, don&apos;t show this message again
              </span>
            </label>
            <div className="flex justify-end">
              <CustomButton btnText="Close" btnOnClick={handleClose} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
