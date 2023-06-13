import { Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import SelectNetwork from '../components/common/SelectNetwork'

export default function OverviewPage() {

  const wallet = useSelector((state) => state.wallet);
  const stakingChains = useSelector((state) => state.staking.chains);
  const networks = useSelector((state) => state.wallet.networks);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const nameToChainIDs = wallet.nameToChainIDs;
  let currentNetwork = params.networkName;

  const handleOnSelect = (chainName)=> {
    navigate(`/${chainName}/overview`);
  }

  return (
    <div>
      <Paper elevation={0} sx={{p: 4,}}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb:5}}>
              <Typography color="text.primary" variant="h6" fontWeight={600}>
                  OVERVIEW
              </Typography>
              <SelectNetwork 
                  onSelect={(name) => {handleOnSelect(name)}}
                  networks={Object.keys(nameToChainIDs)}
                  defaultNetwork={currentNetwork?.length > 0 ? currentNetwork.toLowerCase().replace(/ /g, "") : "cosmoshub"}
              />
          </Box>
          <>{currentNetwork}</>
      </Paper>
    </div>
  )
}
