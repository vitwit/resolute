import { Dialog, DialogContent } from '@mui/material';
import React from 'react';

const DialogRedelegate = ({
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
        <DialogContent>ReDelegate</DialogContent>
      </Dialog>
    );
  };
  
export default DialogRedelegate;
