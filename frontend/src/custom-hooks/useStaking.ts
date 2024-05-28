import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./StateHooks";
import { RootState } from '@/store/store';
import useGetChainInfo from "./useGetChainInfo";
import { getDelegations, getUnbonding } from "@/store/features/staking/stakeSlice";
import { getDelegatorTotalRewards } from "@/store/features/distribution/distributionSlice";
import { getBalances } from "@/store/features/bank/bankSlice";
// import useGetAssets from "./useGetAssets";
// import { Interface } from "readline";
import useGetAssetsAmount from "./useGetAssetsAmount";
import {
    getAllTokensPrice,
    //  getTokenPrice
} from "@/store/features/common/commonSlice";

const useStaking = () => {
    const dispatch = useAppDispatch();
    // const networks = useAppSelector((state: RootState) => state.wallet.networks);
    const nameToChainIDs = useAppSelector((state: RootState) => state.wallet.nameToChainIDs);
    const chainIDs = Object.values(nameToChainIDs);

    const isWalletConnected = useAppSelector((state: RootState) => state.wallet.connected)

    const { getChainInfo, getDenomInfo,
        //  getValueFromToken, getTokenValueByChainId
    } = useGetChainInfo();

    const totalData = useAppSelector((state: RootState) => state.staking)

    console.log('total data===================', totalData)


    const [totalStakedAmount, , rewardsAmount, totalUnStakedAmount] = useGetAssetsAmount(chainIDs)

    // const { getTokensByChainID } = useGetAssets();

    // get total staking data data from the  state
    const stakeData = useAppSelector(
        (state: RootState) => state.staking.chains
    );


    console.log('stake data========', stakeData.chains)

    // const totalBalances = useAppSelector(
    //     (state: RootState) => state.bank.balances
    // )

    // const totalRewards = useAppSelector(
    //     (state: RootState) => state.distribution.chains
    // )

    console.log('total rewards, ')

    useEffect(() => {
        if (chainIDs.length > 0 && isWalletConnected) {
            chainIDs.forEach((chainID) => {
                const { address, baseURL, restURLs } = getChainInfo(chainID);
                const { minimalDenom } = getDenomInfo(chainID);

                // Fetch delegations
                dispatch(getDelegations({ baseURLs: restURLs, address, chainID }));

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


    const getStakingAssets = () => {
        return {
            totalStakedAmount,
            rewardsAmount,
            totalUnStakedAmount
        }
    }

    const getAllDelegations = () => {
        return stakeData
    }

    return {
        getStakingAssets,
        getAllDelegations
    }
};

export default useStaking;
