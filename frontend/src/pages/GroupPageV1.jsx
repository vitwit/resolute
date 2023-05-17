import React from 'react';
import Box from '@mui/material/Box';
import SelectNetwork from '../components/common/SelectNetwork'
import { useSelector } from 'react-redux';

export default function GroupPageV1() {
    const networks = useSelector((state) => state.wallet.networks);
    const chainIDs = Object.keys(networks);

    return (
        <div>
            <Box
                sx={{
                    justifyContent: "end",
                    display: "flex",
                    mr: 1,
                }}
            >
                <SelectNetwork
                    defaultNetwork="cosmoshub"
                    networks={chainIDs.map(chain => networks[chain].network.config.chainName)}
                    onSelect={(e) => {
                        console.log(e);
                    }}
                />
            </Box>

            Group
        </div>
    )
}
