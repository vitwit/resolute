import React from 'react';
import Box from '@mui/material/Box';
import SelectNetwork from '../components/common/SelectNetwork'
import { useSelector } from 'react-redux';
import { ContextData } from './Home';

export default function FeegrantPage() {
    const networks = useSelector((state) => state.wallet.networks);
    const chainIDs = Object.keys(networks);

    const data = React.useContext(ContextData)

    return (
        <div>

           Page -  Feegrant
        </div>
    )
}
