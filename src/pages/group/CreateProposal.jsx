import { Button, Paper, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";

import PagePolicyTx from './PagePolicyTx';
import { txCreateGroupProposal } from '../../features/group/groupSlice';

function CreateProposal() {
  const { policyAddress } = useParams();
  const dispatch = useDispatch();

  const wallet = useSelector(state => state.wallet);
  const chainInfo = wallet?.chainInfo;

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      msgs: [],
      gas: 200000,
      memo: "",
      fees:
        chainInfo?.config?.gasPriceStep?.average *
        10 ** chainInfo?.config?.currencies[0].coinDecimals,
    }
  });

  const onSubmit = (data) => {
    data.groupPolicyAddress = policyAddress;
    data.messages = data.msgs;
    data.proposers = [data.proposer];
    data.admin = wallet?.address;
    data.chainId = wallet?.chainInfo?.config?.chainId
    data.rpc = wallet?.chainInfo?.config?.rpc;
    data.denom = wallet?.chainInfo?.config?.currencies?.[0]?.coinMinimalDenom || ''
    data.feeAmount = wallet?.chainInfo?.config?.gasPriceStep?.average || 0;
    console.log('fee amount', data)
    dispatch(txCreateGroupProposal(data));
  }

  return (
    <Paper variant='outlined'>
      <Typography mt={4} ml={5}
        textAlign={'left'} gutterBottom variant='h6'>
        Create Policy Proposal </Typography>
      <Box p={5}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="proposer"
            control={control}
            render={({ field }) =>
              <TextField
                fullWidth
                {...field}
                placeholder={'Proposer'}
                name='proposer'
              />
            }
          />

          <PagePolicyTx setValue={setValue} control={control} />

          <Box>
            <Button sx={{ mr: 2 }} variant='outlined' color='error'>
              Cancel
            </Button>
            <Button type='submit' variant='outlined' color='primary'>
              Submit
            </Button>
          </Box>
        </form>

      </Box>
    </Paper>
  )
}

export default CreateProposal