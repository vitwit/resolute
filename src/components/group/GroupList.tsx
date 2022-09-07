import * as React from "react";
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from "@mui/material/Paper";
import { Box, CircularProgress, Grid, Link, Typography } from "@mui/material";
import { shortenAddress } from "../../utils/util";
import { getLocalTime } from "../../utils/datetime";
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { useNavigate } from "react-router-dom";

export interface GroupsByAdminProps {
    groups: any;
    status: string;
    onAction: (group: any) => void;
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    // boxShadow: 'none',
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


export default function GroupList(props: GroupsByAdminProps) {
    const { groups, onAction, status } = props;
    const navigate = useNavigate();

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 4, sm: 12, md: 12 }}>
                    {
                        status === 'pending' ?
                            <Box sx={{
                                mt: 3,
                                ml: 50,
                                textAlign: 'center'
                            }}><CircularProgress /></Box>
                            : null
                    }
                    {
                        status !== 'pending' && !groups.length ?
                            <Box><h5>Sorry, No groups found.</h5></Box> : null
                    }

                    {groups?.map((group: any, index: any,) => (
                        <Grid item xs={2} sm={4} md={4} key={index}>
                            <Item>
                                <Box onClick={() => {
                                    navigate(`/groups/${group?.id}`)
                                }}>
                                    <Box style={{
                                        textAlign: 'left'
                                    }}>
                                        <Box sx={{ display: 'flex' }}>
                                            <Box sx={{ width: '50%', fontSize: 18 }}>
                                                <h4>#{group?.id || '-'}</h4> </Box>
                                            <Box sx={{ width: '50%' }}>
                                                <ReadMoreIcon
                                                    color={'primary'}
                                                    sx={{ float: 'right', fontSize: 34 }}
                                                />
                                            </Box>
                                        </Box>
                                        <Typography sx={{
                                            mb: 1,
                                            fontSize: 18,
                                            fontWeight: 'bold'
                                        }}>
                                            ## {group?.metadata || '-'}
                                        </Typography>
                                        <Grid container columns={{ xs: 2, sm: 2, md: 12 }}>
                                            <Grid item xs={6} sm={6} md={4} key={index}>
                                                Admin
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={8} key={index}>
                                                <strong> {shortenAddress(group.admin, 24)}</strong>
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={4} key={index}>
                                                CreatedAt
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={8} key={index}>
                                                <strong> {getLocalTime(group.created_at)}</strong>
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={4} key={index}>
                                                Total Weight
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={8} key={index}>
                                                <strong>{group?.total_weight || 0}</strong>
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={4} key={index}>
                                                Version
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={8} key={index}>
                                                <strong>{group?.version || 0}</strong>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Item>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    )
}
