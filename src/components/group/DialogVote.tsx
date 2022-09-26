import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { ListItemButton } from '@mui/material';

const options = [{
  label: 'Yes',
  value: 1,
  active: '#6d70fe'
}, {
  label: 'No',
  value: 3,
  active: '#e87d91'
}, {
  label: 'No with Veto',
  value: 4,
  active: 'red'
}, {
  label: 'Abstain',
  value: 2,
  active: '#6e81cb'
}]

interface voteprops {
  vote: number, proposalId: string
}
export interface SimpleDialogProps {
  open: boolean;
  proposalId: string;
  selectedValue: string;
  voteRes: any;
  onConfirm: (obj: voteprops) => void;
  onClose: (value: string) => void;
}

export default function DailogVote(props: SimpleDialogProps) {
  const { onClose, voteRes, proposalId, onConfirm, selectedValue, open } = props;
  const [vote, setVote] = React.useState(0);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: number) => {
    setVote(value);
  };

  return (
    <Dialog
      fullWidth
      sx={{ background: 'transparent', p: 3 }}
      onClose={handleClose} open={open}>
      <DialogTitle>Vote for Proposal # {proposalId}</DialogTitle>
      <List sx={{ pt: 3, p: 6 }}>
        {options.map((option) => (
          <ListItem sx={{
            p: 2,
            m: 1,
            borderRadius: '5px',
            ':hover': { background: option?.value === vote ? option?.active : null },
            background: option?.value === vote ? option?.active : '#f3f3f3'
          }} button
            onClick={() => handleListItemClick(option?.value)} key={option?.label}>
            <ListItemText primary={option?.label} />
          </ListItem>
        ))}
        <ListItem>
          <ListItemButton sx={{ justifyContent: 'right' }}>
            <Button onClick={() => {
              onConfirm({
                vote: vote,
                proposalId: proposalId
              })
            }} variant='outlined'>{
              voteRes?.status === 'pending'? 'Loading...': 'Confirm'
            }</Button>
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

