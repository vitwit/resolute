import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./StateHooks";
import { RootState } from '@/store/store';
import useGetChainInfo from "./useGetChainInfo";
import { getAllValidators, getDelegations, getUnbonding, getValidator } from "@/store/features/staking/stakeSlice";
import { getDelegatorTotalRewards } from "@/store/features/distribution/distributionSlice";
import { getBalances } from "@/store/features/bank/bankSlice";
// import useGetAssets from "./useGetAssets";
// import { Interface } from "readline";
import useGetAssetsAmount from "./useGetAssetsAmount";

const useSingleStaking = (chainID: string) => {
    const dispatch = useAppDispatch();
    const networks = useAppSelector((state: RootState) => state.wallet.networks);


    const isWalletConnected = useAppSelector((state: RootState) => state.wallet.connected)

    const { getChainInfo, getDenomInfo,
        //  getValueFromToken, getTokenValueByChainId
    } = useGetChainInfo();

    const rewardsChains = useAppSelector(
        (state: RootState) => state.distribution.chains
    );

    // const totalData = useAppSelector((state: RootState) => state.staking)


    const [totalStakedAmount, availableAmount, rewardsAmount, totalUnStakedAmount] = useGetAssetsAmount([chainID])

    // const { getTokensByChainID } = useGetAssets();

    // get total staking data data from the  state
    const stakeData = useAppSelector(
        (state: RootState) => state.staking.chains
    );

    useEffect(() => {
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
        dispatch(getAllValidators({ baseURLs: restURLs, chainID }));

    }, [isWalletConnected, chainID]);

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

        console.log({totalStakedAmount, totalUnStakedAmount, rewardsAmount, availableAmount})

        return {
            totalStakedAmount,
            rewardsAmount,
            totalUnStakedAmount,
            availableAmount
        }
    }

    const getAllDelegations = (chainID: string) => {
        return  {[chainID]: stakeData[chainID]}
    }

    // Get total staked amount of chain

    const getAmountWithDecimal = (amount: number, chainID: string) => {
        const { decimals, displayDenom } = getDenomInfo(chainID);
        return (amount / 10 ** decimals).toFixed(4) + ' ' + displayDenom;
    }

    const getDenomWithChainID = (chainID: string) => {
        const {  displayDenom } = getDenomInfo(chainID);

        return  displayDenom;
    }

    const chainTotalRewards = (chainID: string) => {
        let totalRewardsAmount = 0;
        let displayDenomName = ''
        const rewards =
            rewardsChains?.[chainID]?.delegatorRewards?.totalRewards || 0;

        const { decimals, displayDenom } = getDenomInfo(chainID);
        if (rewards > 0) {
            totalRewardsAmount += (rewards / 10 ** decimals);

        }

        displayDenomName = displayDenom

        return totalRewardsAmount.toFixed(4) + ' ' + displayDenomName;
    }

    
    const getValidators = () => {
        return stakeData[chainID]?.validators || {}
    }

    return {
        getStakingAssets,
        getAllDelegations,
        fetchValidatorDetails,
        getAmountWithDecimal,
        chainTotalRewards,
        chainLogo,
        getValidators,
        getDenomWithChainID
    }
};

export default useSingleStaking;
