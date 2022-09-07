import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RowItem from './RowItem';
import { Grid } from '@mui/material';
import { setLocalStorage, shortenAddress } from '../../utils/util';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { useNavigate } from 'react-router-dom';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const policyType = {
    '/cosmos.group.v1.ThresholdDecisionPolicy': 'Threshold Decision Policy',
    '/cosmos.group.v1.PercentageDecisionPolicy': 'Percentage Decision Policy',
}

export default function PolicyCard({ obj }) {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const navigate = useNavigate();

    return (
        <Card onClick={() => {
            setLocalStorage('policy', obj, 'object');
            navigate(`/groups/${obj?.group_id}/policies/${obj?.address}`)
        }} sx={{ maxWidth: 345, m: 1 }}>
            <CardHeader
                sx={{ bg: '#f7f7f9' }}
                action={
                    <IconButton aria-label="settings">
                        <ReadMoreIcon
                            color={'primary'}
                            sx={{ float: 'right', fontSize: 34 }} />
                    </IconButton>
                }
                title={policyType[obj?.decision_policy['@type']]}
                subheader={shortenAddress(obj?.address, 19)}
            />
            <CardContent>
                <Grid container>
                    <Typography sx={{
                        fontSize: 18,
                        ml: 1
                    }}>
                        ## {obj?.metadata || '-'}
                    </Typography>
                    {
                        obj?.decision_policy['@type'] === '/cosmos.group.v1.ThresholdDecisionPolicy' ?
                            <RowItem equal={true} lable={'Thresold'}
                                value={obj?.decision_policy?.threshold || '-'} /> :
                            <RowItem equal={true} lable={'Percentage'}
                                value={`${obj?.decision_policy?.percentage} %` || '-'} />
                    }
                    <RowItem equal={true} lable={'Min Exection Period'}
                        value={parseFloat(obj?.decision_policy?.windows?.min_execution_period || 0).toFixed(2) || '-'} />
                    <RowItem equal={true} lable={'Voting Period'}
                        value={parseFloat(obj?.decision_policy?.windows?.voting_period || 0).toFixed(2) || '-'} />

                </Grid>
            </CardContent>
        </Card >
    );
}
