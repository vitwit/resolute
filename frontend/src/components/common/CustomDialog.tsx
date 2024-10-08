/**
 * CustomDialog component displays a dialog with a custom layout.
 * @module CustomDialog
 */

import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { Dialog, DialogContent } from '@mui/material';
import React from 'react';
import Image from 'next/image';

interface CustomDialogProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title: string;
  styles?: string;
  description?: string;
  img?: string;
  showDivider?: boolean;
}

/**
 * CustomDialog component displays a dialog with a custom layout.
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The content of the dialog.
 * @param {boolean} props.open - Whether the dialog is open or closed.
 * @param {function} props.onClose - Callback function to close the dialog.
 * @param {string} props.title - The title of the dialog.
 * @param {string} props.description - The description of the dialog.
 * @param {string} [props.styles] - (Optional) Additional tailwindcss styles for the dialog container.
 * @param {string} props.showDivider - (Optional) Whether to display a horizontal line after the title and description.
 * @returns {React.ReactNode} - React element representing the CustomDialog component.
 */

const CustomDialog = ({
  children,
  onClose,
  open,
  img,
  title,
  styles,
  description,
  showDivider,
}: CustomDialogProps) => {
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
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className={`px-4 pt-4 pb-6 space-y-10 ${styles}`}>
          <div className="flex justify-end px-6">
            <button onClick={onClose} className="text-btn !h-8">
              Close
            </button>
          </div>
          <div className="flex items-center flex-col gap-2">
            <div className="flex gap-2 items-center px-6">
              {img ? (
                <div className="">
                  <Image src={img} width={40} height={40} alt="Network-logo" />
                </div>
              ) : null}
              <div className="text-h1 w-full text-center ">{title}</div>
            </div>
            <div className="text-b1-light text-center w-full">
              {description}
            </div>
            {showDivider ? (
              <div className="px-6 w-full">
                <div className="divider-line"></div>
              </div>
            ) : null}
          </div>
          <div className="px-6">{children}</div>
          <div className="h-10"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
