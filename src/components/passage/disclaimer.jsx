import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs(props) {
  return (
    <div>
      <BootstrapDialog
        onClose={props.handleClose}
        aria-labelledby="customized-dialog-title"
        open={props.open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={props.handleClose}>
          Legal Disclaimer
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
          By claiming these tokens, you confirm that you are not a U.S. person or claiming the tokens for the account or benefit of a U.S. person.
          </Typography>
          <Typography gutterBottom>
          The Passage platform is a smart contract based suite of technologies that relies on blockchain technology. By using this product in any capacity, you recognize and assume all risks inherent in such technologies, including but not limited to the risk that the smart contracts underlying our product could fail, resulting in a total loss of user funds. Passage is not responsible for any such losses.
          </Typography>
          <Typography gutterBottom>
          Mentions of potential exchange listings are hypothetical and there is no guarantee that they will happen. All investments involve risk, and the forecasted performance of a security, utility token, financial product or individual investment does not guarantee actual results or returns. Investors are solely responsible for any investment decision that they make. Such decisions should be based solely on an evaluation of their financial circumstances, investment objectives, risk tolerance, and liquidity needs. We are not financial advisors or a registered broker dealer and bear no responsibility for any losses you may incur as a result of your decision to invest.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

CustomizedDialogs.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};