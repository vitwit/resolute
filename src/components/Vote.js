import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useSelector } from 'react-redux';

export default function VoteDialog(props) {
    const [option, setOption] = React.useState('')
    const govTx = useSelector((state) => state.gov.tx);

    const handleClose = () => {
        props.closeDialog(true);
    };

    const handleVote = () => {
        props.onVote(option);
    }

    const handleChange = (e) => {
        setOption(e.target.value);
    }

    return (
        <div>
            <Dialog open={props.open} onClose={handleClose}>
                <DialogTitle>Vote</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex' }}>
                        <FormControl
                            required
                            component="fieldset"
                            sx={{ m: 6 }}
                            variant="standard"
                        >
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={option === "yes"} value="yes" onChange={handleChange} name="yes" />
                                    }
                                    label="Yes"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={option === "no"} value="no" onChange={handleChange} name="no" />
                                    }
                                    label="No"
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox checked={option === "noWithVeto"} value="noWithVeto" onChange={handleChange} name="noWithVeto" />
                                    }
                                    label="NoWithVeto"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={option==="abstain"} value="abstain" onChange={handleChange} name="abstain" />
                                    }
                                    label="Abstain"
                                />
                            </FormGroup>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        disabled={govTx?.status === 'pending'}
                        onClick={handleVote} variant='contained' disableElevation>
                        {govTx?.status === 'pending'? 'Loading..' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}