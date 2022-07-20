import { Box, Button, Dialog, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { getBalance } from '../features/bank/bankSlice';
import { getDelegations, getValidators } from '../features/staking/stakeSlice';
import Delegation_Form from './tx/Delegation_Form';
import ReDelegation_Form from './tx/ReDelegation_Form';
import SendForm from './tx/SendForm';
import UnDelegation_Form from './tx/UnDelegation_Form';

export const DialogCreateMultisigTx = (props) => {
    const [txType, setTxType] = React.useState('');
    const { handleClose, open } = props;
    const dispatch = useDispatch();

    const handleTypeChange = (event) => {
        setTxType(event.target.value);
    };

    const createTxnRes = useSelector(state => state.multisig.createTxnRes)

    useEffect(()=>{
        if (createTxnRes?.status === 'done')
            handleClose()
    }, [createTxnRes])

    const wallet = useSelector((state) => state.wallet);
    const { chainInfo, address, connected } = wallet;

    useEffect(() => {
        if (connected) {
            dispatch(getBalance({
                baseURL: chainInfo.config.rest,
                address: address,
                denom: chainInfo?.config?.currencies[0].coinMinimalDenom
            }))

            dispatch(getValidators({
                baseURL: chainInfo.config.rest,
                status: null,
            }))

            dispatch(getDelegations({
                baseURL: chainInfo.config.rest,
                address: address,
            }))
        }
    }, [chainInfo]);


    return (
        <Dialog fullWidth maxWidth={'md'} onClose={handleClose} open={open}>
            <DialogContent>

                <h3 className='text-center'>Create Transaction</h3>
                <br />
                <Box>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                                Select Tx Type
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={txType}
                                label="Select Tx Type"
                                onChange={handleTypeChange}
                            >
                                <MenuItem value={'send'}>Send</MenuItem>
                                <MenuItem value={'delegate'}>Delegate</MenuItem>
                                <MenuItem value={'redelegate'}>Re-Delegate</MenuItem>
                                <MenuItem value={'undelegate'}>Un-Delegate</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {
                        txType === 'send' ? <SendForm
                            chainInfo={chainInfo}
                        /> : null
                    }

                    {
                        txType === 'delegate' ? <Delegation_Form
                            chainInfo={chainInfo}
                        /> : null
                    }

                    {
                        txType === 'redelegate' ? <ReDelegation_Form
                            chainInfo={chainInfo}
                        /> : null
                    }

                    {
                        txType === 'undelegate' ? <UnDelegation_Form
                            chainInfo={chainInfo}
                        /> : null
                    }
                    <br/>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DialogCreateMultisigTx)