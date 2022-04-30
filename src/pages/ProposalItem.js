import React, { useState } from 'react';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { computeVotePercentage, getProposalComponent } from '../utils/util';
import './common.css';
import { getLocalTime } from '../utils/datetime';
import VoteDialog from '../components/Vote';

export const ProposalItem = (props) => {
    const [open, setOpen] = useState(true);

    const {info, tally} = props;
    const tallyInfo = computeVotePercentage(tally);

    const onVoteClick = () => {
        setOpen(true);
    }

    const closeDialog = () => {
        setOpen(false);
    }

    const onVoteSubmit = (option) => {
        alert(option);
    }

    return (
        <React.Fragment>
            <VoteDialog open={open} closeDialog={closeDialog} onVote={onVoteSubmit}/>
            <CardContent>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                        #{info.proposal_id}
                    </Typography>
                    {getProposalComponent(info.status)}
                </div>
                <Typography variant="body1" component="div" color='text.primary' className='proposal-title'>
                    {info.content?.title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} variant='body2' color="text.secondary" className='proposal-description'>
                    {info.content?.description}
                </Typography>
                <ul style={{ listStyleType: 'none', display: "flex", flexDirection: 'column', justifyContent: 'left', paddingInlineStart: 0 }}>
                    <li>
                        <div style={{ display: "flex" }}>
                            <Typography variant="body1">Voting start &nbsp;&nbsp;&nbsp;</Typography>
                            <Typography variant="body2">{getLocalTime(info?.voting_start_time)}</Typography>
                        </div>
                    </li>
                    <li>
                        <div style={{ display: "flex" }}>
                            <Typography variant="body1">Voting end&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
                            <Typography variant="body2">{getLocalTime(info?.voting_end_time)}</Typography>
                        </div>
                    </li>

                </ul>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                        YES <br />
                        {tallyInfo.yes}%
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                        NO <br />
                        {tallyInfo.no}%
                    </Typography><Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                        NoWithVeto
                        <br />
                        {tallyInfo.no_with_veto}%
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                        Abstain
                        <br />
                        {tallyInfo.abstain}%
                    </Typography>
                </div>

            </CardContent>
            <CardActions style={{ justifyContent: 'end' }}>
                <Button size="small" variant='contained' disableElevation onClick={onVoteClick}>Vote</Button>
            </CardActions>
        </React.Fragment>
    );
}