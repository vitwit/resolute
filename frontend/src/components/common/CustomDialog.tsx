/**
 * CustomDialog component displays a dialog with a custom layout.
 * @module CustomDialog
 */

import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { Dialog, DialogContent } from '@mui/material';
import React from 'react';

interface CustomDialogProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title: string;
  styles?: string;
}

/**
 * CustomDialog component displays a dialog with a custom layout.
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The content of the dialog.
 * @param {boolean} props.open - Whether the dialog is open or closed.
 * @param {function} props.onClose - Callback function to close the dialog.
 * @param {string} props.title - The title of the dialog.
 * @param {string} [props.styles] - (Optional) Additional tailwindcss styles for the dialog container.
 * @returns {React.ReactNode} - React element representing the CustomDialog component.
 */

const CustomDialog = ({
  children,
  onClose,
  open,
  title,
  styles,
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
            <button onClick={onClose} className="text-btn h-10">
              Close
            </button>
          </div>
          <div className="text-h1 w-full text-center px-6">{title}</div>
          <div className="px-6">{children}</div>
          <div className="h-10"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
