import CustomButton from '@/components/common/CustomButton';
import { DELETE_ILLUSTRATION } from '@/constants/image-names';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const DialogDeleteMultisig = ({
  open,
  onClose,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}) => {
  const loading = useAppSelector((state) => state.multisig.deleteMultisigRes);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      sx={{
        '& .MuiDialog-paper': {
          color: 'white',
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: '#1C1C20',
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[450px] p-4 relative">
          <button className="absolute top-6 right-6 hover:bg-[#ffffff10] w-8 h-8 rounded-full flex items-center justify-center" onClick={onClose}>
            <Image src="/close.svg" width={20} height={20} alt="close-icon" />
          </button>
          <div className="px-10 py-20 space-y-10">
            <div className="flex flex-col items-center gap-6">
              <Image
                src={DELETE_ILLUSTRATION}
                width={100}
                height={100}
                alt="Verify Ownership"
              />
              <div className="flex items-center flex-col gap-2">
                <div className="text-h1 !font-semibold">Delete Multisig</div>
                <div className="text-b1-light">
                  Are you sure you want to delete this multisig ?
                </div>
              </div>
            </div>
            <CustomButton
              btnOnClick={onDelete}
              btnLoading={loading.status === 'pending'}
              btnDisabled={loading.status === 'pending'}
              btnText="Verify Ownership"
              btnStyles="w-full !border-[#D92101] !bg-[#D921011A] delete-multisig-btn"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteMultisig;
