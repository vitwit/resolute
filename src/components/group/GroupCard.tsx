import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { shortenAddress } from '../../utils/util';
import { getLocalTime } from '../../utils/datetime';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { IconButton, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface GroupCardProps {
    group: any
}

interface BoxTextProps {
    label: any,
    text: any
}

const BoxText = ({ label, text }: BoxTextProps) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Typography width={'30%'} variant="body1">
                {label}
            </Typography>
            <Typography variant="body1">
                <strong> {text}</strong>
            </Typography>
        </Box>
    )
}

export default function GroupCard({ group }: GroupCardProps) {
    const navigate = useNavigate();
    const [showFullText, setShowFullText] = React.useState(false);

    return (
        <Paper sx={{ borderRadius: 2 }} elevation={1} variant="outlined" square>
            <CardContent>
                <IconButton
                    onClick={() => navigate(`/groups/${group?.id}`)}
                    color='primary'
                    sx={{ float: 'right' }}
                >
                    <ReadMoreIcon fontSize='large' />
                </IconButton>
                <Typography gutterBottom variant="h5" component="div">
                    # {group?.id}
                </Typography>
                <Typography gutterBottom variant="subtitle1" color="text.secondary">
                    ## &nbsp;
                    {!showFullText && group?.metadata?.substring(0, 30)}

                    {
                        showFullText && group?.metadata
                    }

                    {group?.metadata?.length > 40 ? <a
                        onClick={()=>setShowFullText(!showFullText)}
                        href='javascript:void(0);'
                    > {showFullText? ' ...show less': ' ...more'}</a> : null}

                </Typography>
                <BoxText label={'Admin'} text={shortenAddress(group?.admin, 19)} />
                <BoxText label={'Created At'} text={getLocalTime(group?.created_at)} />
                <BoxText label={'Total Weight'} text={group?.total_weight} />
                <BoxText label={'Version'} text={group?.version} />
            </CardContent>
        </Paper>
    );
}
