import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    getValidators, resetState, getDelegations, sortValidatorsByVotingPower, getParams,
    txDelegate, txUnDelegate, txReDelegate, resetTxType
} from '../features/staking/stakeSlice';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Paper from '@mui/material/Paper';
import { ActiveValidators } from '../components/ActiveValidators';
import { InActiveValidators } from '../components/InActiveValidators';
import { MyDelegations } from '../components/Delegations';
import { getDelegatorTotalRewards, txWithdrawAllRewards, resetTx } from '../features/distribution/distributionSlice';
import { totalBalance } from '../utils/denom';
import { DialogDelegate } from '../components/DialogDelegate';
import { getBalance } from '../features/bank/bankSlice';
import { DialogUndelegate } from '../components/DialogUndelegate';
import {
    resetError, resetTxHash, setError
} from './../features/common/commonSlice';
import { DialogRedelegate } from '../components/DialogRedelegate';
import { WitvalValidator } from '../components/WitvalValidator';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

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
    const currency = useSelector((state) => state.wallet.chainInfo?.config?.currencies[0]);
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
    const onMenuAction = (e, type, validator) => {
        setSelectedValidator(validator);
        switch (type) {
            case "delegate":
                setStakingOpen(true);
                break
            case "undelegate":
                if (delegations?.delegations.length > 0) {
                    setUndelegateOpen(true);
                } else {
                    dispatch(setError({
                        type: 'error',
                        message: "no delegations"
                    }))
                }
                break
            case "redelegate":
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
                break
            default:
                console.log("unsupported type")
        }
    }

    useEffect(() => {
        dispatch(resetState())
        if (connected) {
            dispatch(getBalance({
                baseURL: chainInfo.config.rest,
                address: address,
                denom: currency.coinMinimalDenom
            }))
            dispatch(getParams({ baseURL: chainInfo.config.rest }))
            dispatch(getValidators({
                baseURL: chainInfo.config.rest,
                status: null,
            }))

            dispatch(getDelegations({
                baseURL: chainInfo.config.rest,
                address: address,
            }))

            dispatch(getDelegatorTotalRewards({
                baseURL: chainInfo.config.rest,
                address: address
            }));

        }
    }, [chainInfo]);

    useEffect(() => {
        if (connected) {
            if (validators.pagination?.next_key !== null) {
                dispatch(getValidators({
                    baseURL: chainInfo.config.rest,
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
            dispatch(resetTx());
        }
    }, []);

    useEffect(() => {
        if (distTxStatus.txHash?.length > 0) {
            dispatch(getDelegatorTotalRewards({
                baseURL: chainInfo.config.rest,
                address: address
            }));

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
            chainId: chainInfo.config.chainId,
            rpc: chainInfo.config.rpc,
            feeAmount: chainInfo.config.gasPriceStep.average,
        }))
    }

    const onDelegateTx = (data) => {
        dispatch(txDelegate({
            baseURL: chainInfo.config.rest,
            delegator: address,
            validator: data.validator,
            amount: data.amount * (10 ** currency.coinDecimals),
            denom: currency.coinMinimalDenom,
            chainId: chainInfo.config.chainId,
            rpc: chainInfo.config.rpc,
            feeAmount: chainInfo.config.gasPriceStep.average,
        }))
    }

    const onUndelegateTx = (data) => {
        dispatch(txUnDelegate({
            delegator: address,
            validator: data.validator,
            amount: data.amount * (10 ** currency.coinDecimals),
            denom: currency.coinMinimalDenom,
            chainId: chainInfo.config.chainId,
            rpc: chainInfo.config.rpc,
            feeAmount: chainInfo.config.gasPriceStep.average,
        }))
    }

    useEffect(() => {
        if (txStatus.type.length > 0 && address.length > 0) {
            switch (txStatus.type) {
                case "delegate":
                    dispatch(getDelegations({
                        baseURL: chainInfo.config.rest,
                        address: address,
                    }))
                    dispatch(getBalance({
                        baseURL: chainInfo.config.rest,
                        address: address,
                        denom: currency.coinMinimalDenom
                    }))
                    break
                case "undelegate":
                    dispatch(getDelegations({
                        baseURL: chainInfo.config.rest,
                        address: address,
                    }))
                    break
                case "redelegate":
                    dispatch(getDelegations({
                        baseURL: chainInfo.config.rest,
                        address: address,
                    }))
                    break
                default:
                    console.log("invalid type")
            }
            dispatch(resetTxType())
            handleDialogClose()
        }
    }, [txStatus]);

    const onRedelegateTx = (data) => {
        dispatch(txReDelegate({
            baseURL: chainInfo.config.rest,
            delegator: address,
            srcVal: data.src,
            destVal: data.dest,
            amount: data.amount * (10 ** currency.coinDecimals),
            denom: currency.coinMinimalDenom,
            chainId: chainInfo.config.chainId,
            rpc: chainInfo.config.rpc,
            feeAmount: chainInfo.config.gasPriceStep.average,
        }))
    }

    const [availableBalance, setAvailableBalance] = useState(0);
    useEffect(() => {
        if (connected && chainInfo.config.currencies.length > 0) {
            if (balance !== undefined)
                setAvailableBalance(totalBalance(balance.balance, currency.coinDecimals))
        }
    }, [balance]);

    return (
        <>
            {
                connected ?
                    delegations?.status === 'pending' ?
                        delegations?.delegations.length === 0 ?
                            <CircularProgress />
                            :
                            <></>
                            :
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
                                <br />
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
                                                currency={chainInfo?.config?.currencies[0]}
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
                                                currency={chainInfo?.config?.currencies[0]}
                                                loading={txStatus.status}
                                                onRedelegate={onRedelegateTx}
                                            />

                                        </>
                                        :
                                        <></>
                                }

                            </>
                        :
                        <Typography
                            variant='h5'
                            color='text.primary'
                            fontWeight={700}
                            style={{ marginTop: 32 }}
                        >
                            Wallet is not connected
                        </Typography>
            }
        </>
    );
}
