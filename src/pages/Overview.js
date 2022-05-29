
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBalance } from '../features/bank/bankSlice';
import BalanceInfo from "../components/BalanceInfo";
import { getDelegations, getUnbonding } from '../features/staking/stakeSlice';
import { getDelegatorTotalRewards } from '../features/distribution/distributionSlice';
import { totalBalance } from '../utils/denom';
import { totalDelegations, totalRewards, totalUnbonding } from '../utils/util';

export default function Overview() {

    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    const connected = useSelector((state) => state.wallet.connected);
    const address = useSelector((state) => state.wallet.address);
    const balance = useSelector((state) => state.bank.balance);
    const delegations = useSelector((state) => state.staking.delegations);
    const rewards = useSelector((state) => state.distribution.delegatorRewards);
    const unbonding = useSelector((state) => state.staking.unbonding);

    const [available, setTotalBalance] = useState(0);
    const [delegated, setTotalDelegations] = useState(0);
    const [pendingRewards, setTotalRewards] = useState(0);
    const [unbondingDel, setTotalUnbonding] = useState(0);

    const dispatch = useDispatch();

    useEffect(() => {
        if (connected && chainInfo.currencies.length > 0 ) {
            setTotalBalance(totalBalance(balance.balance, chainInfo.currencies[0].coinDecimals))
            setTotalDelegations(totalDelegations(delegations.delegations, chainInfo.currencies[0].coinDecimals))
            setTotalRewards(totalRewards(rewards?.list, chainInfo.currencies[0].coinDecimals))
            setTotalUnbonding(totalUnbonding(unbonding.delegations, chainInfo.currencies[0].coinDecimals))
        }
    }, [balance, delegations, rewards, unbonding]);

    useEffect(() => {
        if (chainInfo.currencies.length > 0 && connected && address !== "") {
            dispatch(getBalance({
                baseURL: chainInfo.lcd,
                address: address,
                denom: chainInfo?.currencies[0].coinMinimalDenom
            }))
       
            dispatch(getDelegations({
                baseURL: chainInfo.lcd,
                address: address,
            }))
        
            dispatch(getDelegatorTotalRewards({
                baseURL: chainInfo.lcd,
                address: address,
            }))
        
            dispatch(getUnbonding({
                baseURL: chainInfo.lcd,
                address: address,
            }))
        }
    }, [chainInfo]);

    return (
        <>
        { connected ?
            <BalanceInfo 
            chainInfo={chainInfo} 
            balance={available} 
            delegations={delegated}
            rewards = {pendingRewards}
            unbonding={unbondingDel}
            />
            :
            <></>
        }
        </>
    );
}