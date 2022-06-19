import React, { useEffect, useState } from 'react';
import Box from '@mui/system/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';
import GroupsByAdmin from '../components/GroupsByAdmin';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupsByAdmin, getGroupsByMember } from '../features/group/groupSlice';
import { useNavigate } from 'react-router-dom';
import GroupsByMember from '../components/group/GroupsByMember';


export default function GroupPage() {
    const [selectedTab, setSelectedTab] = useState("admin");


    const address = useSelector((state) => state.wallet.address);
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    const groups = useSelector((state) => state.group.groups);
    const dispatch = useDispatch();
    useEffect(() => {
        if (address.length > 0)
        dispatch(getGroupsByAdmin({
            baseURL: chainInfo.config.rest,
            admin: address
        }))
    }, [address]);

    useEffect(() => {
        if (address.length > 0 && selectedTab === "member")
        dispatch(getGroupsByMember({
            baseURL: chainInfo.config.rest,
            address: address
        }))
    }, [selectedTab]);

    const navigate = useNavigate();
    function navigateTo(path) {
        navigate(path);
    }    


    return (
        <Box sx={{ p: 2 }}>
            <div
                style={{ display: 'flex', justifyContent: 'right', flexDirection: 'row' }}
            >
                <Button
                    variant='contained' disableElevation
                    onClick={()=> {
                        navigateTo("/group/create-group")
                    }}
                    >
                    Create group
                </Button>
            </div>
            <Box sx={{ mt: 2 }}>
                <ButtonGroup disableElevation>
                    <Button
                        onClick={() => setSelectedTab("admin")}
                        variant={selectedTab === "admin" ? "contained" : "outlined"}
                    >Created by me</Button>
                    <Button
                        onClick={() => setSelectedTab("member")}
                        variant={selectedTab === "member" ? "contained" : "outlined"}
                    >Part of</Button>
                </ButtonGroup>
                <Paper elevation={0} sx={{mt: 1}}>
                    {
                        selectedTab === "admin" 
                        ?
                            <GroupsByAdmin 
                            groups={groups.admin.list}
                            onAction={(group) => {console.log(group)}}
                            />
                        :
                        <GroupsByMember 
                            groups={groups.member.list}
                            onAction={(group) => {console.log(group)}}
                            />
                    }
                </Paper>
            </Box>
        </Box>
    );
}