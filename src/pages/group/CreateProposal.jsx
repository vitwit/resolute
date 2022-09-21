import { Button, Paper, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm, Controller, FormProvider } from "react-hook-form";

import PagePolicyTx from './PagePolicyTx';
import { txCreateGroupProposal } from '../../features/group/groupSlice';
import TxTypeComponent from '../../components/group/TxTypeComponent';
import AddManualTx from './AddManualTx';
import AddFileTx from './AddFileTx';

function CreateProposal() {
  const [type, setType] = React.useState(null);
  const { policyAddress } = useParams();
  const dispatch = useDispatch();

  const wallet = useSelector(state => state.wallet);
  const chainInfo = wallet?.chainInfo;

  const onSubmit = (data) => {
    data.groupPolicyAddress = policyAddress;
    data.messages = data.msgs;
    data.proposers = [wallet?.address];
    data.admin = wallet?.address;
    data.chainId = wallet?.chainInfo?.config?.chainId
    data.rpc = wallet?.chainInfo?.config?.rpc;
    data.denom = wallet?.chainInfo?.config?.currencies?.[0]?.coinMinimalDenom || ''
    data.feeAmount = wallet?.chainInfo?.config?.gasPriceStep?.average || 0;
    console.log('fee amount', data)
    // dispatch(txCreateGroupProposal(data));
  }

  return (
    <>
      <Typography gutterBottom mt={4} p={1}
        textAlign={'left'} variant='h6'>
        Create Policy Proposal </Typography>

      <Paper variant='outlined'>
        <Box sx={{ ml: 5, mt: 3 }}>
          <Typography textAlign={'left'}>Proposer
            <br />
            <strong>{wallet?.address}</strong></Typography>
        </Box>

        <Box>
          <TxTypeComponent handleType={(type) => {
            setType(type)
          }} />
        </Box>

        <Box ml={5} mt={2}>
          {type === 'single' && <AddManualTx
            address={policyAddress}
            chainInfo={chainInfo}
            handleCancel={()=>setType(null)}
          /> || null}
          {type === 'multiple' && <AddFileTx /> || null}
        </Box>
      </Paper>
    </>

  )
}

export default CreateProposal