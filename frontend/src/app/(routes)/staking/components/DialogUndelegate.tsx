import { Dialog, DialogContent } from '@mui/material';
import React from 'react';

const DialogUndelegate = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogContent>UnDelegate</DialogContent>
    </Dialog>
  );
};

export default DialogUndelegate;
