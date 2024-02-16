import React from 'react';
import { useAppSelector } from './StateHooks';
import { RootState } from '@/store/store';
import { Validator, ValidatorProfileInfo } from '@/types/staking';
import { getValidatorRank } from '@/utils/util';
import useGetChainInfo from './useGetChainInfo';
import { parseBalance } from '@/utils/denom';

const useGetValidatorInfo = () => {
  const stakingData = useAppSelector(
    (state: RootState) => state.staking.chains
  );
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );
  const tokensPriceInfo = useAppSelector(
    (state) => state.common.allTokensInfoState.info
  );
  const { getDenomInfo } = useGetChainInfo();

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
        const { decimals, minimalDenom } = getDenomInfo(chainID);
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
          ? totalStaked * usdPriceInfo.usd
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
  }: {
    data: Record<string, ValidatorProfileInfo>;
  }) => {
    let totalStaked = 0;
    let totalDelegators = 0;
    let totalCommission = 0;

    const stakingData = useAppSelector((state) => state.staking.chains);

    Object.keys(data).forEach((chainID) => {
      const totalStakedInUSD = Number(data[chainID]?.totalStakedInUSD || 0);

      if (!isNaN(totalStakedInUSD)) {
        totalStaked += totalStakedInUSD;
      }
      const delegatorsCount =
        stakingData[data[chainID].chainID].validatorProfiles?.[
          data[chainID].operatorAddress
        ];
      totalDelegators += Number(delegatorsCount?.totalDelegators || 0);
      totalCommission += Number(data[chainID]?.commission) || 0;
    });
    const avgCommission = totalCommission / Object.keys(data).length;

    return {
      totalStaked,
      totalDelegators,
      avgCommission,
    };
  };

  return { getChainwiseValidatorInfo, getValidatorStats };
};

export default useGetValidatorInfo;
