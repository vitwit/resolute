import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const DialogConfirm = (props) => {
  const { open, deleteMultisigAccount, onClose } = props;

  return (
    <div>
      <Dialog onClose={onClose} open={open}>
        <DialogContent
          sx={{ textAlign: "center", fontWeight: 600 }}
          variant="h6"
        >
          Deleting a multisig account removes all its transactions.
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
            }}
            disableElevation
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{
              textTransform: "none",
            }}
            disableElevation
            onClick={() => {
              deleteMultisigAccount();
              onClose();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DialogConfirm;
