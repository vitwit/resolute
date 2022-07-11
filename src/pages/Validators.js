import React, { useEffect, useState, useMemo } from 'react';
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
import { getDelegateAuthz, getReDelegateAuthz, getUnDelegateAuthz, getWithdrawRewardsAuthz } from '../utils/authorizations';
import { authzExecHelper } from '../features/authz/authzSlice';

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

    const selectedAuthz = useSelector((state) => state.authz.selected);
    const grantsToMe = useSelector((state) => state.authz.grantsToMe);
    const authzRewards = useMemo(() => getWithdrawRewardsAuthz(grantsToMe.grants, selectedAuthz.granter), [grantsToMe.grants]);
    const authzDelegate = useMemo(() => getDelegateAuthz(grantsToMe.grants, selectedAuthz.granter), [grantsToMe.grants]);
    const authzUnDelegate = useMemo(() => getUnDelegateAuthz(grantsToMe.grants, selectedAuthz.granter), [grantsToMe.grants]);
    const authzRedelegate = useMemo(() => getReDelegateAuthz(grantsToMe.grants, selectedAuthz.granter), [grantsToMe.grants]);
    const authzExecTx = useSelector((state) => state.authz.execTx);

    useEffect(() => {
        if (authzExecTx.status === 'idle' && selectedAuthz.granter.length > 0) {
            fetchUserInfo(selectedAuthz.granter);
        }
    }, [authzExecTx]);

    useEffect(() => {
        if (connected) {
            dispatch(resetState())
            dispatch(getParams({ baseURL: chainInfo.config.rest }))
            dispatch(getValidators({
                baseURL: chainInfo.config.rest,
                status: null,
            }))

            if (selectedAuthz.granter.length > 0) {
                fetchUserInfo(selectedAuthz.granter);
            } else {
                fetchUserInfo(address);
            }
        }
    }, [chainInfo, connected, selectedAuthz]);

    function fetchUserInfo(address) {
        dispatch(getBalance({
            baseURL: chainInfo.config.rest,
            address: address,
            denom: currency.coinMinimalDenom
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
        if (selectedAuthz.granter.length > 0 && authzRewards?.granter !== selectedAuthz.granter) {
            dispatch(setError({
                type: 'error',
                message: 'You don\'t have authz permission to withdraw rewards'
            }))
            return
        }
        let delegationPairs = []
        delegations.delegations.forEach((item) => {
            delegationPairs.push({
                validator: item.delegation.validator_address,
                delegator: item.delegation.delegator_address,
            })
        });

        if (selectedAuthz.granter.length > 0 && authzRewards?.granter === selectedAuthz.granter) {
            authzExecHelper(dispatch, {
                type: "withdraw",
                from: address,
                payload: delegationPairs,
                denom: currency.coinMinimalDenom,
                chainId: chainInfo.config.chainId,
                rpc: chainInfo.config.rpc,
                feeAmount: chainInfo.config.gasPriceStep.average,
            })
        } else {
            dispatch(txWithdrawAllRewards({
                msgs: delegationPairs,
                denom: currency.coinMinimalDenom,
                chainId: chainInfo.config.chainId,
                rpc: chainInfo.config.rpc,
                feeAmount: chainInfo.config.gasPriceStep.average,
            }))
        }
    }

    const onDelegateTx = (data) => {
        if (selectedAuthz.granter.length > 0 && authzDelegate?.granter !== selectedAuthz.granter) {
            dispatch(setError({
                type: 'error',
                message: 'You don\'t have authz permission to delegate'
            }))
            return
        }
        if (selectedAuthz.granter.length > 0 && authzDelegate?.granter === selectedAuthz.granter) {
            authzExecHelper(dispatch, {
                type: "delegate",
                address: address,
                baseURL: chainInfo.config.rest,
                delegator: selectedAuthz.granter,
                validator: data.validator,
                amount: data.amount * (10 ** currency.coinDecimals),
                denom: currency.coinMinimalDenom,
                chainId: chainInfo.config.chainId,
                rpc: chainInfo.config.rpc,
                feeAmount: chainInfo.config.gasPriceStep.average,
            })
        } else { 
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
    }

    const onUndelegateTx = (data) => {
        if (selectedAuthz.granter.length > 0 && authzUnDelegate?.granter !== selectedAuthz.granter) {
            dispatch(setError({
                type: 'error',
                message: 'You don\'t have authz permission to un-delegate'
            }))
            return
        }
        if (selectedAuthz.granter.length > 0 && authzUnDelegate?.granter === selectedAuthz.granter) {
            authzExecHelper(dispatch, {
                type: "undelegate",
                address: address,
                delegator: selectedAuthz.granter,
                validator: data.validator,
                amount: data.amount * (10 ** currency.coinDecimals),
                denom: currency.coinMinimalDenom,
                chainId: chainInfo.config.chainId,
                rpc: chainInfo.config.rpc,
                feeAmount: chainInfo.config.gasPriceStep.average,
            })
        } else {
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
        if (selectedAuthz.granter.length > 0 && authzRedelegate?.granter !== selectedAuthz.granter) {
            dispatch(setError({
                type: 'error',
                message: 'You don\'t have authz permission to redelegate'
            }))
            return
        }
        if (selectedAuthz.granter.length > 0 && authzRedelegate?.granter === selectedAuthz.granter) {
            authzExecHelper(dispatch, {
                type: "redelegate",
                address: address,
                baseURL: chainInfo.config.rest,
                delegator: selectedAuthz.granter,
                srcVal: data.src,
                destVal: data.dest,
                amount: data.amount * (10 ** currency.coinDecimals),
                denom: currency.coinMinimalDenom,
                chainId: chainInfo.config.chainId,
                rpc: chainInfo.config.rpc,
                feeAmount: chainInfo.config.gasPriceStep.average,
            })
        } else {
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
                                        displayDenom={currency.coinDenom}
                                        authzLoading={authzExecTx?.status}
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
                                            authzLoading={authzExecTx?.status}
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
                                            authzLoading={authzExecTx?.status}
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
