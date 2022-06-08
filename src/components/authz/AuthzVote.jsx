import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { formatVoteOption, nameToOption } from '../utils/votes';

export function AuthzVoteDialog(props) {
    const { onClose, grant, open, execTx, onExecVote, proposals } = props;
    const [option, setOption] = useState('');


    const handleVote = () => {
        if (option === '') {
            alert("Invalid vote option")
        }
        onExecVote({
            voteOption: nameToOption(option),
            voter: grant?.granter
        })
    }

    const handleProposalChange = (proposal) => {
        console.log(proposal)
    }

    const handleChange = (e) => {
        setOption(e.target.value);
    }

    return (
        <Dialog
            onClose={onClose}
            open={open}
            maxWidth='sm'
            fullWidth={true}
        >
            <DialogTitle
                style={{ textAlign: 'center' }}
                fontWeight={600}
                variant='h5'
                color='text.primary'
            >
                Vote
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex' }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Proposals</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedProposal.proposal_id}
                            label={selectedProposal.proposal_id}
                            onChange={handleProposalChange}
                        >
                            {
                                proposals.map((proposal, index) => {
                                    <MenuItem value={proposal?.proposal_id}>{proposal?.title}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
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
                                    <Checkbox checked={option === "abstain"} value="abstain" onChange={handleChange} name="abstain" />
                                }
                                label="Abstain"
                            />
                        </FormGroup>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    type='submit'
                    disabled={execTx === 'pending'}
                    onClick={handleVote} variant='contained' disableElevation>
                    {execTx === 'pending' ? <CircularProgress size={25} /> : 'Vote'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

AuthzVoteDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    grant: PropTypes.object.isRequired,
    execTx: PropTypes.string.isRequired,
    onExecVote: PropTypes.func.isRequired,
    proposals: PropTypes.object.isRequired,
};