import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./StateHooks";
import { RootState } from '@/store/store';
import useGetChainInfo from "./useGetChainInfo";
import { getDelegations, getUnbonding, getValidator, txCancelUnbonding, txDelegate, txReDelegate, txUnDelegate } from "@/store/features/staking/stakeSlice";
import { getDelegatorTotalRewards, txWithdrawAllRewards } from "@/store/features/distribution/distributionSlice";
import { getBalances } from "@/store/features/bank/bankSlice";
// import useGetAssets from "./useGetAssets";
// import { Interface } from "readline";
import useGetAssetsAmount from "./useGetAssetsAmount";
import {
    getAllTokensPrice,
    //  getTokenPrice
} from "@/store/features/common/commonSlice";
import useGetTxInputs from "./useGetTxInputs";

const useStaking = () => {
    const dispatch = useAppDispatch();
    const networks = useAppSelector((state: RootState) => state.wallet.networks);
    const nameToChainIDs = useAppSelector((state: RootState) => state.wallet.nameToChainIDs);
    const chainIDs = Object.values(nameToChainIDs);

    const isWalletConnected = useAppSelector((state: RootState) => state.wallet.connected)

    const { getChainInfo, getDenomInfo,
        //  getValueFromToken, getTokenValueByChainId
    } = useGetChainInfo();

    const rewardsChains = useAppSelector(
        (state: RootState) => state.distribution.chains
    );

    // const totalData = useAppSelector((state: RootState) => state.staking)


    const [totalStakedAmount, availableAmount, rewardsAmount, totalUnStakedAmount] = useGetAssetsAmount(chainIDs)

    // const { getTokensByChainID } = useGetAssets();

    // get total staking data data from the  state
    const stakeData = useAppSelector(
        (state: RootState) => state.staking.chains
    );

    const delegationsLoading = useAppSelector(
        (state: RootState) => state.staking.delegationsLoading
    )

    const { txWithdrawAllRewardsInputs, txWithdrawValidatorRewardsInputs } = useGetTxInputs();

    useEffect(() => {
        if (chainIDs.length > 0 && isWalletConnected) {
            chainIDs.forEach((chainID) => {
                const { address, baseURL, restURLs } = getChainInfo(chainID);
                const { minimalDenom } = getDenomInfo(chainID);

                // Fetch delegations
                dispatch(getDelegations({ baseURLs: restURLs, address, chainID })).then();

                // Fetch available balances
                dispatch(getBalances({ baseURLs: restURLs, baseURL, address, chainID }));

                // Fetch rewards
                dispatch(getDelegatorTotalRewards({
                    baseURLs: restURLs,
                    baseURL,
                    address,
                    chainID,
                    denom: minimalDenom,
                }));

                // Fetch unbonding delegations
                dispatch(getUnbonding({ baseURLs: restURLs, address, chainID }));

                // Fetch all validators
                // dispatch(getAllValidators({ baseURLs: restURLs, chainID }));
            });
            dispatch(getAllTokensPrice())
        }

    }, [isWalletConnected]);

    const fetchValidatorDetails = (valoperAddress: string, chainID: string) => {
        const { restURLs } = getChainInfo(chainID);
        dispatch(
            getValidator({
                baseURLs: restURLs,
                chainID,
                valoperAddress: valoperAddress,
            })
        );
    }

    const chainLogo = (chainID: string) => networks[chainID]?.network?.logos?.menu || '';


    const getStakingAssets = () => {
        return {
            totalStakedAmount,
            rewardsAmount,
            totalUnStakedAmount,
            availableAmount
        }
    }

    const getAllDelegations = () => {
        return stakeData
    }

    // Get total staked amount of chain

    const getAmountWithDecimal = (amount: number, chainID: string) => {
        const { decimals, displayDenom } = getDenomInfo(chainID);
        return (amount / 10 ** decimals).toFixed(4) + ' ' + displayDenom;
    }

    const chainTotalRewards = (chainID: string) => {
        let totalRewardsAmount = 0;
        let displayDenomName = ''
        chainIDs.forEach((cId) => {
            if (cId === chainID) {
                const rewards =
                    rewardsChains?.[chainID]?.delegatorRewards?.totalRewards || 0;

                const { decimals, displayDenom } = getDenomInfo(chainID);
                if (rewards > 0) {
                    totalRewardsAmount += (rewards / 10 ** decimals);

                }

                displayDenomName = displayDenom

                return false
            }

        });

        return totalRewardsAmount.toFixed(4) + ' ' + displayDenomName;
    }

    const chainTotalValRewards = (validator: string, chainID: string) => {
        let totalRewardsAmount = 0;
        let displayDenomName = ''

        chainIDs.forEach((cId) => {
            if (cId === chainID) {
                const rewards =
                    rewardsChains?.[chainID]?.delegatorRewards

                rewards.list.forEach(r => {
                    if (r.validator_address === validator) {

                        const { decimals, displayDenom } = getDenomInfo(chainID);

                        totalRewardsAmount = Number(r?.reward[0]?.amount || 0) / 10 ** decimals
                        displayDenomName = displayDenom
                    }

                    return false
                })

                return false
            }

        });

        return totalRewardsAmount.toFixed(4) + ' ' + displayDenomName;
    }

    // tx: withdraw claim rewards without authz and fee grant

    const txWithdrawCliamRewards = (chainID: string) => {
        const txInputs = txWithdrawAllRewardsInputs(chainID);
        txInputs.isTxAll = true;
        if (txInputs.msgs.length) dispatch(txWithdrawAllRewards(txInputs));
    }


    const txWithdrawValRewards = (validator: string, chainID: string) => {
        const delegatorAddress = networks[chainID]?.walletInfo?.bech32Address
        const txInputs = txWithdrawValidatorRewardsInputs(chainID, validator, delegatorAddress)
        txInputs.isTxAll = false;
        if (txInputs.msgs.length) dispatch(txWithdrawAllRewards(txInputs));
    }


    const txAllChainTxStatus = useAppSelector(
        (state: RootState) => state.distribution.chains
    );

    const txAllChainStakeTxStatus = useAppSelector(
        (state: RootState) => state.staking.chains
    );

    console.log('txAllchainTxstatus', txAllChainTxStatus)

    const getClaimTxStatus = () => {
        return txAllChainTxStatus
    }

    const txCancelUnbond = (chainID: string, delegator: string,
        validator: string,
        amount: number, creationHeight: string) => {
        const basicChainInfo = getChainInfo(chainID);
        const { currencies } =
            networks[chainID]?.network?.config;

        const currency = currencies[0]

        const { feeAmount: avgFeeAmount } = getChainInfo(chainID);
        const feeAmount = avgFeeAmount * 10 ** currency?.coinDecimals;

        alert(JSON.stringify({
            isAuthzMode: false,
            // basicChainInfo: basicChainInfo,
            delegator: delegator,
            validator: validator,
            amount: amount * 10 ** currency?.coinDecimals,
            denom: currency?.coinMinimalDenom,
            feeAmount: feeAmount,
            feegranter: '',
            creationHeight: creationHeight,
        }))

        dispatch(
            txCancelUnbonding({
                isAuthzMode: false,
                basicChainInfo: basicChainInfo,
                delegator: delegator,
                validator: validator,
                amount: amount * 10 ** currency?.coinDecimals,
                denom: currency?.coinMinimalDenom,
                feeAmount: feeAmount,
                feegranter: '',
                creationHeight: creationHeight,
            })
        );
    }

    const txDelegateTx = (validator: string, amount: number, chainID: string) => {
        const basicChainInfo = getChainInfo(chainID);
        const { currencies } =
            networks[chainID]?.network?.config;

        const currency = currencies[0]

        const { feeAmount: avgFeeAmount } = getChainInfo(chainID);
        const feeAmount = avgFeeAmount * 10 ** currency?.coinDecimals;

        dispatch(
            txDelegate({
                isAuthzMode: false,
                basicChainInfo: basicChainInfo,
                delegator: basicChainInfo.address,
                validator: validator,
                amount: amount * 10 ** currency?.coinDecimals,
                denom: currency?.coinMinimalDenom,
                feeAmount: feeAmount,
                feegranter: '',
            })
        );
    }

    const txUnDelegateTx = (validator: string, amount: number, chainID: string) => {
        const basicChainInfo = getChainInfo(chainID);
        const { currencies } =
            networks[chainID]?.network?.config;

        const currency = currencies[0]

        const { feeAmount: avgFeeAmount } = getChainInfo(chainID);
        const feeAmount = avgFeeAmount * 10 ** currency?.coinDecimals;

        dispatch(
            txUnDelegate({
                isAuthzMode: false,
                basicChainInfo: basicChainInfo,
                delegator: basicChainInfo.address,
                validator: validator,
                amount: amount * 10 ** currency?.coinDecimals,
                denom: currency?.coinMinimalDenom,
                feeAmount: feeAmount,
                feegranter: '',
            })
        );
    }

    const txReDelegateTx = (srcVal: string, destVal: string, amount: number, chainID: string) => {
        const basicChainInfo = getChainInfo(chainID);
        const { currencies } =
            networks[chainID]?.network?.config;

        const currency = currencies[0]

        const { feeAmount: avgFeeAmount } = getChainInfo(chainID);
        const feeAmount = avgFeeAmount * 10 ** currency?.coinDecimals;

        dispatch(
            txReDelegate({
                isAuthzMode: false,
                basicChainInfo: basicChainInfo,
                delegator: basicChainInfo.address,
                destVal: destVal,
                srcVal: srcVal,
                amount: amount * 10 ** currency?.coinDecimals,
                denom: currency?.coinMinimalDenom,
                feeAmount: feeAmount,
                feegranter: '',
            })
        );
    }

    return {
        getStakingAssets,
        getAllDelegations,
        fetchValidatorDetails,
        getAmountWithDecimal,
        chainTotalRewards,
        chainLogo,
        txWithdrawCliamRewards,
        getClaimTxStatus,
        txCancelUnbond,
        txDelegateTx,
        txAllChainStakeTxStatus,
        txUnDelegateTx,
        txReDelegateTx,
        txWithdrawValRewards,
        chainTotalValRewards,
        delegationsLoading,
    }
};

export default useStaking;
