import React from 'react';
import Box from '@mui/material/Box';
import SelectNetwork from '../components/common/SelectNetwork'
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { ContextData } from './Home';

export default function AuthzPage() {
    const networks = useSelector((state) => state.wallet.networks);
    const chainIDs = Object.keys(networks);

    const data = React.useContext(ContextData)


    return (
        <div>
            Network - {data}
            {/* <Box
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
            </Box> */}

            <br/> Page - Authz
        </div>
    )
}
