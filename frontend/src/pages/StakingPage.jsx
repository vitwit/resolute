import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import SelectNetwork from '../components/common/SelectNetwork'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import Validators from './Validators';
import { resetDefaultState as stakingReserDefaultState} from '../features/staking/stakeSlice';
import { resetDefaultState as  distributionResetDefaultState} from '../features/distribution/distributionSlice';


export default function MultisigPage() {

    const wallet = useSelector((state) => state.wallet);
    const stakingChains = useSelector((state) => state.staking.chains);
    const networks = useSelector((state) => state.wallet.networks);
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const nameToChainIDs = wallet.nameToChainIDs;
    let currentNetwork = params.networkName;
  
    useEffect(()=>{
        dispatch(stakingReserDefaultState(Object.keys(networks)));
        dispatch(distributionResetDefaultState(Object.keys(networks)));
    },[wallet])

    const handleOnSelect = (chainName)=> {
        navigate(`/${chainName}/staking`);
    }
    
    return (
        <div>
            <Paper elevation={0} sx={{p: 4,}}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb:5}}>
                    <Typography color="text.primary" variant="h6" fontWeight={600}>
                        STAKING
                    </Typography>
                    <SelectNetwork 
                        onSelect={(name) => {handleOnSelect(name)}}
                        networks={Object.keys(nameToChainIDs)}
                        defaultNetwork={currentNetwork?.length > 0 ? currentNetwork.toLowerCase().replace(/ /g, "") : "cosmoshub"}
                    />
                </Box>
                <div sx={{justifyContent: "center",display: "flex",mr: 1,}}>
                    {Object.keys(stakingChains)?.length > 0 ? <Validators chainID={nameToChainIDs[currentNetwork]}/>:<></>}
                </div>
            </Paper>
        </div>
    )
}
