import React from 'react';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import GroupPage from './GroupPage';

export default function GroupPageV1() {
    const networks = useSelector((state) => state.wallet.networks);
    const chainIDs = Object.keys(networks);

    return (
        <div>
            <GroupPage />
        </div>
    )
}
