import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { computeVotePercentage, getProposalComponent } from '../utils/util';
import './common.css';
import { getLocalTime } from '../utils/datetime';
import {
    getProposalTally
} from './../features/proposals/proposalsSlice';

export const ProposalItem = (info, voteStatus, onVoteClick) => {
    const dispatch = useDispatch();
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    const proposalTally = useSelector((state) => state.gov.tally.proposalTally[info.info.proposal_id]);

    useEffect(() => {
        dispatch(getProposalTally({
            baseURL: chainInfo.lcd,
            proposalId: info?.info?.proposal_id
        })

        )
    }, [chainInfo]);

    return (
        <React.Fragment>
            <CardContent>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                        #{info.info.proposal_id}
                    </Typography>
                    {getProposalComponent(info.info.status)}
                </div>
                <Typography variant="body1" component="div" color='text.primary' className='proposal-title'>
                    {info.info.content?.title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} variant='body2' color="text.secondary" className='proposal-description'>
                    {info.info.content?.description}
                </Typography>
                <ul style={{ listStyleType: 'none', display: "flex", flexDirection: 'column', justifyContent: 'left', paddingInlineStart: 0 }}>
                    <li>
                        <div style={{ display: "flex" }}>
                            <Typography variant="body1">Voting start &nbsp;&nbsp;&nbsp;</Typography>
                            <Typography variant="body2">{getLocalTime(info.info?.voting_start_time)}</Typography>
                        </div>
                    </li>
                    <li>
                        <div style={{ display: "flex" }}>
                            <Typography variant="body1">Voting end&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
                            <Typography variant="body2">{getLocalTime(info.info?.voting_end_time)}</Typography>
                        </div>
                    </li>

                </ul>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                        YES <br />
                        {computeVotePercentage(proposalTally).yes}%
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                        NO <br />
                        {computeVotePercentage(proposalTally).no}%
                    </Typography><Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                        NoWithVeto
                        <br />
                        {computeVotePercentage(proposalTally).no_with_veto}%
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                        Abstain
                        <br />
                        {computeVotePercentage(proposalTally).abstain}%
                    </Typography>
                </div>

            </CardContent>
            <CardActions style={{ justifyContent: 'end' }}>
                <Button size="small" variant='contained' disableElevation>Vote</Button>
            </CardActions>
        </React.Fragment>
    );
}