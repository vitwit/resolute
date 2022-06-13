import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import React, { useState, useMemo, useEffect } from 'react';
import { filterSendFromAuthz } from '../utils/authorizations';
import { useDispatch, useSelector } from 'react-redux';
import { authzExecHelper, getGrantsToMe } from '../features/authz/authzSlice';
import {
    resetError, resetTxHash, setError
} from './../features/common/commonSlice';
import { getBalance, txBankSend } from '../features/bank/bankSlice';
import Send from '../components/Send';
import { totalBalance } from '../utils/denom';
import AuthzSend from '../components/AuthzSend';

export default function SendPage() {
    const [activeTab, setActiveTab] = useState('send');
    const [available, setBalance] = useState(0);

    const from = useSelector((state) => state.wallet.address);
    const currency = useSelector((state) => state.wallet.chainInfo.currencies[0]);
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    const address = useSelector((state) => state.wallet.address);
    const sendTx = useSelector((state) => state.bank.tx);
    const balance = useSelector((state) => state.bank.balance);
    const authzExecTx = useSelector((state) => state.authz.execTx);
    const grantsToMe = useSelector((state) => state.authz.grantsToMe);

    const authzSends = useMemo(() => filterSendFromAuthz(grantsToMe.grants), [grantsToMe.grants]);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(resetError())
        dispatch(resetTxHash())
    }, []);

    useEffect(() => {
        if (chainInfo.currencies.length > 0 && address.length > 0) {
            dispatch(getBalance({
                baseURL: chainInfo.lcd,
                address: address,
                denom: currency.coinMinimalDenom
            }))

            dispatch(getGrantsToMe({
                baseURL: chainInfo.lcd,
                grantee: address
            }))
        }
    }, [chainInfo]);

    useEffect(() => {
        setBalance(totalBalance(balance.balance, chainInfo.currencies[0]?.coinDecimals));
    }, [balance]);

    const onSendTx = (data) => {
        const amount = Number(data.amount);
        if (Number(balance) < (amount + Number(25000 / (10 ** currency.coinDecimals)))) {
            dispatch(setError({
                type: 'error',
                message: 'Not enough balance'
            }))
        } else {
            dispatch(txBankSend({
                from: from,
                to: data.to,
                amount: amount,
                denom: currency.coinMinimalDenom,
                chainId: chainInfo.chainId,
                rpc: chainInfo.rpc,
                feeAmount: chainInfo?.config.gasPriceStep.average,
            }))
        }
    }

    const onSendExec = (data) => {
        const amount = Number(data.amount);
        authzExecHelper(dispatch, {
            type: "send",
            from: address,
            granter: data.granter,
            recipient: data.to,
            amount: amount,
            denom: currency.coinMinimalDenom,
            chainId: chainInfo.chainId,
            rpc: chainInfo.rpc,
            feeAmount: chainInfo?.config.gasPriceStep.average,
        })

    }


    return (
        <>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <Button
                    onClick={() => setActiveTab("send")}
                    variant={activeTab === "send" ? "contained" : "outlined"}
                >Send</Button>
                <Button onClick={() => setActiveTab("authz-send")}
                    disabled={authzSends.length === 0}
                    variant={activeTab === "authz-send" ? "contained" : "outlined"}

                >Authz Send</Button>
            </ButtonGroup>
            <Grid container style={{ marginTop: 24 }}>
                <Grid item xs={2} md={3}></Grid>
                <Grid item xs={10} md={6}>
                    {
                        activeTab === "send" ?
                            <>
                                <Send
                                    chainInfo={chainInfo}
                                    available={available}
                                    onSend={onSendTx}
                                    sendTx={sendTx}
                                />
                            </>
                            :
                            <>
                                <AuthzSend
                                    chainInfo={chainInfo}
                                    onAuthzSend={onSendExec}
                                    grants={authzSends}
                                    authzTx={authzExecTx}
                                />
                            </>
                    }
                </Grid>
                <Grid item xs={2} md={3}></Grid>

            </Grid>
        </>
    );
}