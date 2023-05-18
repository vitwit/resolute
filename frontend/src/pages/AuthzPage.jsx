import React from 'react';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { ContextData } from './Home';

export default function AuthzPage() {
    const networks = useSelector((state) => state.wallet.networks);
    const chainIDs = Object.keys(networks);
    const chainName = useSelector((state) => state.common.selectedNetwork.chainName)

    const data = React.useContext(ContextData)


    return (
        <div>
            Network - {data}
            <br/> Page - Authz
            <br/>selectedNetwork - {chainName}
        </div>
    )
}
