import { useAppSelector } from '../StateHooks';

const useStaking = () => {
  const stakingData = useAppSelector((state) => state.staking.chains);

  const getValidators = ({ chainID }: { chainID: string }) => {
    const validators = stakingData?.[chainID]?.validators;
    const validatorsList = [];
    for (let i = 0; i < validators?.activeSorted.length; i++) {
      const validator = validators?.active[validators?.activeSorted[i]];
      const temp = {
        label: validator?.description.moniker,
        address: validators?.activeSorted[i],
        identity: validator?.description.identity,
      };
      validatorsList.push(temp);
    }

    for (let i = 0; i < validators?.inactiveSorted.length; i++) {
      const validator = validators?.inactive[validators?.inactiveSorted[i]];
      if (!validator?.jailed) {
        const temp = {
          label: validator?.description.moniker,
          address: validators?.inactiveSorted[i],
          identity: validator?.description.identity,
        };
        validatorsList.push(temp);
      }
    }

    return { validatorsList };
  };

  const getValidatorsForUndelegation = ({ chainID }: { chainID: string }) => {
    const { validatorsList } = getValidators({ chainID });
    const totalDelegations =
      stakingData?.[chainID]?.delegations?.delegations?.delegation_responses ||
      [];
    const delegationsData = [];
    const delegatedValidators = [];

    for (const validator of validatorsList) {
      const delegation = totalDelegations.find(
        (item) => item.delegation.validator_address === validator.address
      );

      if (delegation) {
        delegationsData.push({
          validatorAddress: validator.address,
          amount: delegation.balance.amount,
          denom: delegation.balance.denom
        });
        delegatedValidators.push(validator);
      }
    }

    return { delegationsData, delegatedValidators };
  };

  return { getValidators, getValidatorsForUndelegation };
};

export default useStaking;
