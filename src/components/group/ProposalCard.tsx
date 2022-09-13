import ReadMore from '@mui/icons-material/ReadMore'
import { Avatar, Chip, Grid, Paper, Stack, Typography } from '@mui/material'
import { deepOrange, deepPurple } from '@mui/material/colors'
import { Box } from '@mui/system'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getLocalTime } from '../../utils/datetime'
import { proposalStatus, shortenAddress } from '../../utils/util'

function stringAvatar(name: string) {
    return {
        sx: {
            color: '#000000',
            bgcolor: deepOrange[50],
            
        },
        children: `${name}`,
    };
}


interface ProposalCardProps {
    proposal: any
}

function ProposalCard({ proposal }: ProposalCardProps) {
    const proposalStatuses: any = proposalStatus;
    const yes = parseFloat(proposal?.final_tally_result?.yes_count);
    const no = parseFloat(proposal?.final_tally_result?.no_count);
    const abstain = parseFloat(proposal?.final_tally_result?.abstain_count);
    const veto = parseFloat(proposal?.final_tally_result?.no_with_veto_count);

    const sum = yes + no + abstain + veto;
    const yesP = (yes / sum).toFixed(2);
    const noP = (no / sum).toFixed(2);
    const abP = (abstain / sum).toFixed(2)
    const vetoP = (veto / sum).toFixed(2);


    const navigate = useNavigate();

    return (
        <Paper
            onClick={() => {
                navigate(`/groups/proposals/${proposal?.id}`)
            }}
            sx={{ padding: 3 }} variant='outlined' elevation={1}>
            <ReadMore sx={{
                float: 'right',
                fontSize: 32
            }} color='primary' />

            <Stack direction="row" mb={2} spacing={2}>
                <Avatar  {...stringAvatar(proposal?.id)} />
                <Typography gutterBottom variant='h5' textAlign={'left'}>
                    # {proposal?.metadata || '-'}
                </Typography>
            </Stack>

            <Chip sx={{ float: 'left' }}
                variant='outlined'
                color={proposalStatuses[proposal?.status]?.color}
                label={proposal?.status?.split('_').join(' ')} />

            <br />
            <Grid mt={4} container>
                <Grid md={6}>
                    <Typography
                        variant='subtitle2'
                        textAlign={'left'}>Voting End Time</Typography>

                    <Typography
                        fontWeight={'bold'}
                        variant='subtitle1'
                        textAlign={'left'}>
                        {getLocalTime(proposal?.voting_period_end)}
                    </Typography>
                </Grid>
                <Grid md={6}>
                    <Typography
                        variant='subtitle2'
                        textAlign={'left'}>Submit Time</Typography>

                    <Typography
                        fontWeight={'bold'}
                        variant='subtitle1'
                        textAlign={'left'}>
                        {getLocalTime(proposal?.submit_time)}
                    </Typography>
                </Grid>
            </Grid>
            <Grid mt={2} container>
                <Grid md={6}>
                    <Typography
                        variant='subtitle2'
                        textAlign={'left'}>Proposers</Typography>

                    {
                        proposal?.proposers?.map((p: string) => (
                            <Typography
                                fontWeight={'bold'}
                                variant='subtitle1'
                                textAlign={'left'}>
                                {p && shortenAddress(p, 21)}
                            </Typography>
                        ))
                    }
                </Grid>
                <Grid md={6}>
                    <Typography
                        variant='subtitle2'
                        textAlign={'left'}>Policy Address</Typography>
                    <Typography
                        fontWeight={'bold'}
                        variant='subtitle1'
                        textAlign={'left'}>
                        {proposal?.group_policy_address && shortenAddress(proposal?.group_policy_address, 21)}
                    </Typography>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', mt: 3 }}>
                <Box sx={{ background: 'blue', height: 3, width: sum ? `${yesP}%` : '100%' }}></Box>
                <Box sx={{ background: 'red', height: 3, width: `${noP}%` }}></Box>
                <Box sx={{ background: 'organe', height: 3, width: `${abP}%` }}></Box>
                <Box sx={{ background: 'yellow', height: 3, width: `${vetoP}` }}></Box>
            </Box>
        </Paper>
    )
}

export default ProposalCard