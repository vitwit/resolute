import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    getValidators, resetState, getDelegations, sortValidatorsByVotingPower, getParams,
    txDelegate, txUnDelegate, txReDelegate
} from '../features/staking/stakeSlice';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Paper from '@mui/material/Paper';
import { ActiveValidators } from '../components/ActiveValidators';
import { InActiveValidators } from '../components/InActiveValidators';
import { MyDelegations } from '../components/Delegations';
import { getDelegatorTotalRewards, txWithdrawAllRewards } from '../features/distribution/distributionSlice';
import { totalBalance } from '../utils/denom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DialogDelegate } from '../components/DialogDelegate';
import { getBalance } from '../features/bank/bankSlice';
import { DialogUndelegate } from '../components/DialogUndelegate';
import {
    resetError, setTxHash, resetTxHash, setError
} from './../features/common/commonSlice';
import { DialogRedelegate } from '../components/DialogRedelegate';
import { WitvalValidator } from '../components/WitvalValidator';

export function Validators() {
    const [type, setType] = useState('delegations');

    const validators = useSelector((state) => state.staking.validators);
    const stakingParams = useSelector((state) => state.staking.params);
    const delegations = useSelector((state) => state.staking.delegations);
    const txStatus = useSelector((state) => state.staking.tx);
    const distTxStatus = useSelector((state) => state.distribution.tx);
    const rewards = useSelector((state) => state.distribution.delegatorRewards);
    const wallet = useSelector((state) => state.wallet);
    const balance = useSelector((state) => state.bank.balance);
    const { chainInfo, address, connected } = wallet;
    const currency = useSelector((state) => state.wallet.chainInfo.currencies[0]);
    const dispatch = useDispatch();

    const [selected, setSelected] = React.useState('active');

    const [stakingOpen, setStakingOpen] = React.useState(false);
    const [undelegateOpen, setUndelegateOpen] = React.useState(false);
    const [redelegateOpen, setRedelegateOpen] = React.useState(false);

    const handleDialogClose = () => {
        setStakingOpen(false);
        setUndelegateOpen(false);
        setRedelegateOpen(false);
    };


    const [selectedValidator, setSelectedValidator] = useState({});
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClose = (e) => {
        setAnchorEl(null);
    };

    const onMenuAction = (e, validator) => {
        setAnchorEl(e.currentTarget);
        setSelectedValidator(validator);
    }

    const handleStakingAction = (e) => {
        setAnchorEl(null);
        switch (e.target.title) {
            case 'delegate':
                setStakingOpen(true);
                break;
            case 'undelegate':
                if (delegations?.delegations.length > 0) {
                    setUndelegateOpen(true);
                } else {
                    dispatch(setError({
                        type: 'error',
                        message: "no delegations"
                    }))
                }
                break;
            case 'redelegate':
                let isValidRedelegation = false;
                if (delegations?.delegations.length > 0) {
                    for (let i = 0; i < delegations?.delegations.length; i++) {
                        let item = delegations?.delegations[i]
                        if (item.delegation.validator_address === selectedValidator.operator_address) {
                            isValidRedelegation = true
                            break
                        }
                    }
                    if (isValidRedelegation) {
                        setRedelegateOpen(true);
                    } else {
                        dispatch(setError({
                            type: 'error',
                            message: "invalid redelegation"
                        }))
                    }
                } else {
                    dispatch(setError({
                        type: 'error',
                        message: "no delegations present"
                    }))
                }
                break;
            default:
                throw new Error("unknown option")
        }
    }

    useEffect(() => {
        dispatch(resetState())
        if (connected) {
            dispatch(getBalance({
                baseURL: chainInfo.lcd,
                address: address,
                denom: chainInfo?.currencies[0].coinMinimalDenom
            }))
            dispatch(getParams({ baseURL: chainInfo.lcd }))
            dispatch(getValidators({
                baseURL: chainInfo.lcd,
                status: null,
            }))

            dispatch(getDelegations({
                baseURL: chainInfo.lcd,
                address: address,
            }))

            dispatch(getDelegatorTotalRewards({
                baseURL: chainInfo.lcd,
                address: address
            }));

        }
    }, [chainInfo]);

    useEffect(() => {
        if (connected) {
            if (validators.pagination?.next_key !== null) {
                dispatch(getValidators({
                    baseURL: chainInfo.lcd,
                    status: null,
                    pagination: {
                        key: validators.pagination.next_key,
                        limit: null
                    }
                }))
            } else {
                if (Object.keys(validators?.active).length > 0 && validators.pagination?.next_key === null)
                    dispatch(sortValidatorsByVotingPower())
            }
        }
    }, [validators.pagination]);

    useEffect(() => {
        return () => {
            dispatch(resetError());
            dispatch(resetTxHash());
        }
    }, []);

    useEffect(() => {
        if (distTxStatus.txHash?.length > 0) {
            dispatch(setTxHash({
                hash: distTxStatus?.txHash,
            }))

            dispatch(getDelegatorTotalRewards({
                baseURL: chainInfo.lcd,
                address: address
            }));

        } else if (distTxStatus.status === 'rejected' && distTxStatus.errMsg.length > 0) {
            dispatch(setError({
                type: 'error',
                message: distTxStatus.errMsg
            }))
        }
    }, [distTxStatus]);

    const onWithdrawAllRewards = () => {
        let delegationPairs = []
        delegations.delegations.forEach((item) => {
            delegationPairs.push({
                validator: item.delegation.validator_address,
                delegator: item.delegation.delegator_address,
            })
        });

        dispatch(txWithdrawAllRewards({
            msgs: delegationPairs,
            denom: currency.coinMinimalDenom,
            memo: "",
            chainId: chainInfo.chainId,
            rpc: chainInfo.rpc,
            feeAmount: chainInfo?.config.gasPriceStep.average,
        }))
    }

    const onDelegateTx = (data) => {
        dispatch(txDelegate({
            delegator: address,
            validator: data.validator,
            amount: data.amount * (10 ** currency.coinDecimals),
            denom: currency.coinMinimalDenom,
            memo: "",
            chainId: chainInfo.chainId,
            rpc: chainInfo.rpc,
            feeAmount: chainInfo.gasPriceStep.average,
        }))
    }

    const onUndelegateTx = (data) => {
        dispatch(txUnDelegate({
            delegator: address,
            validator: data.validator,
            amount: data.amount * (10 ** currency.coinDecimals),
            denom: currency.coinMinimalDenom,
            memo: "",
            chainId: chainInfo.chainId,
            rpc: chainInfo.rpc,
            feeAmount: chainInfo.gasPriceStep.average,
        }))
    }

    const onRedelegateTx = (data) => {
        dispatch(txReDelegate({
            baseURL: chainInfo?.lcd,
            delegator: address,
            srcVal: data.src,
            destVal: data.dest,
            amount: data.amount * (10 ** currency.coinDecimals),
            denom: currency.coinMinimalDenom,
            memo: "",
            chainId: chainInfo.chainId,
            rpc: chainInfo.rpc,
            feeAmount: chainInfo.gasPriceStep.average,
        }))
    }

    const [availableBalance, setAvailableBalance] = useState(0);
    useEffect(() => {
        if (connected && chainInfo?.currencies.length > 0) {
            if (balance !== undefined)
                setAvailableBalance(totalBalance(balance.balance, chainInfo.currencies[0].coinDecimals))
        }
    }, [balance]);

    return (
        <>
            <ButtonGroup variant="outlined" aria-label="outlined button staking">
                <Button
                    variant={type === 'delegations' ? 'contained' : 'outlined'}
                    onClick={() => setType('delegations')}
                >
                    Delegations
                </Button>
                <Button
                    variant={type === 'validators' ? 'contained' : 'outlined'}
                    onClick={() => setType('validators')}
                >
                    Validators
                </Button>
            </ButtonGroup>
            <WitvalValidator
                validators={validators}
                onMenuAction={onMenuAction}
            />
            <br/>
            {
                type === 'delegations' ?
                    <MyDelegations
                        validators={validators}
                        delegations={delegations}
                        currency={currency}
                        rewards={rewards.list}
                        onDelegationAction={onMenuAction}
                        onWithdrawAllRewards={onWithdrawAllRewards}
                    />
                    :
                    (
                        <Paper elevation={0} style={{ padding: 12 }}>
                            <ButtonGroup
                                variant="outlined"
                                aria-label="validators"
                                style={{ display: 'flex', marginBottom: 12 }}
                            >
                                <Button
                                    variant={selected === 'active' ? 'contained' : 'outlined'}
                                    onClick={() => setSelected('active')}
                                >
                                    Active
                                </Button>
                                <Button
                                    variant={selected === 'inactive' ? 'contained' : 'outlined'}
                                    onClick={() => setSelected('inactive')}
                                >
                                    Inactive
                                </Button>
                            </ButtonGroup>
                            {
                                selected === 'active' ?
                                    <ActiveValidators onMenuAction={onMenuAction} validators={validators} />
                                    :
                                    <InActiveValidators onMenuAction={onMenuAction} validators={validators} />
                            }
                        </Paper>
                    )
            }


            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem title='delegate' onClick={handleStakingAction}>Delegate</MenuItem>
                <MenuItem title='undelegate' onClick={handleStakingAction}>Undelegate</MenuItem>
                <MenuItem title='redelegate' onClick={handleStakingAction}>Redelegate</MenuItem>
            </Menu>
            {
                availableBalance > 0 ?
                <DialogDelegate
                            open={stakingOpen}
                            onClose={handleDialogClose}
                            validator={selectedValidator}
                            params={stakingParams}
                            balance={availableBalance}
                            onDelegate={onDelegateTx}
                            loading={txStatus.status}
                        />
                        :
                        <></>
            }
            {
                delegations?.delegations.length > 0 ?
                    <>
                        

                        <DialogUndelegate
                            open={undelegateOpen}
                            onClose={handleDialogClose}
                            validator={selectedValidator}
                            params={stakingParams}
                            balance={availableBalance}
                            delegations={delegations?.delegations}
                            currency={chainInfo?.currencies[0]}
                            loading={txStatus.status}
                            onUnDelegate={onUndelegateTx}
                        />

                        <DialogRedelegate
                            open={redelegateOpen}
                            onClose={handleDialogClose}
                            validator={selectedValidator}
                            params={stakingParams}
                            balance={availableBalance}
                            active={validators?.active}
                            inactive={validators?.inactive}
                            delegations={delegations?.delegations}
                            currency={chainInfo?.currencies[0]}
                            loading={txStatus.status}
                            onRedelegate={onRedelegateTx}
                        />

                    </>
                    :
                    <></>
            }
        </>
    );
}
