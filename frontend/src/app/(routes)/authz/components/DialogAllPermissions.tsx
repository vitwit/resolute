import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';

interface DialogAllPermissionProps {
  open: boolean;
  onClose: () => void;
}
interface Permission {
    name: string;
    value: string | number;
}
const DialogAllPermissions: React.FC<DialogAllPermissionProps> = (props) => {
  const { open, onClose } = props;
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
                alt="close"
                draggable={false}
              />
            </div>
          </div>
          <div className="gap-16 px-10  space-y-6">
            <div className="flex justify-between">
              <div>All Permissions</div>
              <button className="create-grant-btn">Revoke All</button>
            </div>
            <div className='authz-permission-card'>
            <div className="flex justify-between w-full">
              <div className='flex items-center'>{}</div>
              <button className="create-grant-btn">Revoke</button>
            </div>
            <div className='flex justify-between w-full'>
            <div className="flex space-y-4 flex-col">
              <div className='flex items-center'>Spend Limit</div>
             <div className=''>{}</div>
            </div>
            <div className="flex space-y-4 flex-col">
              <div className='flex items-center'>Expiry</div>
             <div className=''>{}</div>
            </div>
            </div>
            </div>
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAllPermissions;
