import { useAppSelector } from './StateHooks';
import { RootState } from '@/store/store';
import { ValidatorProfileInfo } from '@/types/staking';
import { getValidatorRank } from '@/utils/util';
import { parseBalance } from '@/utils/denom';
import useGetAllChainsInfo from './useGetAllChainsInfo';
import { POLYGON_CONFIG, WITVAL } from '@/utils/constants';

const useGetValidatorInfo = () => {
  const stakingData = useAppSelector(
    (state: RootState) => state.staking.chains
  );
  const allNetworksInfo = useAppSelector(
    (state: RootState) => state.common.allNetworksInfo
  );
  const chainIDs = Object.keys(allNetworksInfo);
  const tokensPriceInfo = useAppSelector(
    (state) => state.common.allTokensInfoState.info
  );
  const nonCosmosData = useAppSelector(
    (state) => state.staking.witvalNonCosmosValidators
  );
  const { getAllDenomInfo } = useGetAllChainsInfo();

  const getValidatorInfo = ({
    chainID,
    moniker,
  }: {
    chainID: string;
    moniker: string;
  }) => {
    if (
      stakingData?.[chainID]?.validators.active &&
      Object.values(stakingData?.[chainID]?.validators.active).length > 0
    ) {
      const validator = Object.values(
        stakingData?.[chainID]?.validators.active
      ).find((v) => {
        return (
          v.description.moniker.trim().toLowerCase() ===
          moniker.trim().toLowerCase()
        );
      });

      if (validator) {
        return validator;
      }
    }

    if (
      stakingData?.[chainID]?.validators.inactive &&
      Object.values(stakingData?.[chainID]?.validators.inactive).length > 0
    ) {
      const validator = Object.values(
        stakingData?.[chainID]?.validators.inactive
      ).find((v) => v.description.moniker === moniker);

      if (validator) {
        return validator;
      }

      return null;
    }
  };

  const getChainwiseValidatorInfo = ({ moniker }: { moniker: string }) => {
    const chainWiseValidatorData: Record<string, ValidatorProfileInfo> = {};
    let validatorDescription: string = '';
    let validatorWebsite: string = '';
    let validatorIdentity: string = '';

    chainIDs.forEach((chainID) => {
      const validatorInfo = getValidatorInfo({ chainID, moniker });

      if (validatorInfo) {
        const { decimals, minimalDenom } = getAllDenomInfo(chainID);
        const activeSorted = stakingData?.[chainID]?.validators.activeSorted;
        const inactiveSorted =
          stakingData?.[chainID]?.validators.inactiveSorted;
        const operatorAddress = validatorInfo?.operator_address || '';
        const rank = getValidatorRank(operatorAddress, [
          ...activeSorted,
          ...inactiveSorted,
        ]);
        const description = validatorInfo?.description?.details;
        const website = validatorInfo?.description?.website;
        const identity = validatorInfo?.description?.identity;
        const commission =
          Number(validatorInfo?.commission?.commission_rates?.rate) * 100;
        const delegatorShares = validatorInfo?.delegator_shares;
        const validatorStatus = validatorInfo?.status;
        const totalStaked = parseBalance(
          [
            {
              amount: delegatorShares,
              denom: minimalDenom,
            },
          ],
          decimals,
          minimalDenom
        );
        const tokens = totalStaked;
        const usdPriceInfo: TokenInfo | undefined =
          tokensPriceInfo?.[minimalDenom]?.info;
        const totalStakedInUSD = usdPriceInfo
          ? (totalStaked * usdPriceInfo.usd).toString()
          : '-';

        if (!validatorDescription && description) {
          validatorDescription = description;
        }

        if (!validatorWebsite && website) {
          validatorWebsite = website;
        }

        if (!validatorIdentity && identity) {
          validatorIdentity = identity;
        }

        chainWiseValidatorData[chainID] = {
          commission,
          rank,
          totalStakedInUSD,
          chainID,
          tokens,
          operatorAddress,
          validatorStatus,
          validatorInfo,
        };
      }
    });
    return {
      chainWiseValidatorData,
      validatorDescription,
      validatorIdentity,
      validatorWebsite,
    };
  };

  const getValidatorStats = ({
    data,
    moniker,
  }: {
    data: Record<string, ValidatorProfileInfo>;
    moniker: string;
  }) => {
    let totalStaked = 0;
    let totalDelegators = 0;
    let totalCommission = 0;
    let activeNetworks = 0;
    let totalNetworks = 0;

    Object.keys(data).forEach((chainID) => {
      const validator = data?.[chainID];
      const totalStakedInUSD = Number(validator?.totalStakedInUSD || 0);

      if (!isNaN(totalStakedInUSD)) {
        totalStaked += totalStakedInUSD;
      }
      const delegatorsCount =
        stakingData[validator.chainID].validatorProfiles?.[
          validator.operatorAddress
        ];
      totalDelegators += Number(delegatorsCount?.totalDelegators || 0);
      totalCommission += Number(validator?.commission) || 0;
      if (validator.validatorStatus === 'BOND_STATUS_BONDED') {
        activeNetworks += 1;
      }
      totalNetworks += 1;
    });
    if (moniker.toLowerCase() === WITVAL) {
      const {
        commission,
        totalDelegators: delegators,
        totalStakedInUSD: totalStaked,
      } = getPolygonValidatorInfo();
      totalCommission += Number(commission || 0);
      totalDelegators += totalStaked;
      totalDelegators += delegators;
      activeNetworks += 1;
      totalNetworks += 1;
    }
    const avgCommission = totalCommission / Object.keys(data).length;

    return {
      totalStaked,
      totalDelegators,
      avgCommission,
      totalNetworks,
      activeNetworks,
    };
  };

  const getPolygonValidatorInfo = () => {
    const usdPriceInfo: TokenInfo | undefined =
      tokensPriceInfo?.[POLYGON_CONFIG.coinGeckoId]?.info;
    const polygonData = nonCosmosData.chains?.['polygon'];
    const polygonDelegators = Number(nonCosmosData.delegators['polygon']);
    let totalStakedInUSD = 0;
    let commission = '';
    let totalDelegators = 0;
    let totalStakedTokens = 0;
    let operatorAddress = '';

    if (polygonData) {
      totalStakedTokens =
        Number(polygonData?.result?.totalStaked) /
        10 ** POLYGON_CONFIG.decimals;
      totalStakedInUSD = usdPriceInfo
        ? totalStakedTokens * usdPriceInfo.usd
        : 0;
      commission = polygonData?.result?.commissionPercent;
      totalDelegators = polygonDelegators || 0;
      operatorAddress = polygonData?.result?.owner;
    }

    return {
      totalStakedInUSD,
      commission,
      totalDelegators,
      totalStakedTokens,
      operatorAddress,
    };
  };

  return {
    getChainwiseValidatorInfo,
    getValidatorStats,
    getPolygonValidatorInfo,
  };
};

export default useGetValidatorInfo;
