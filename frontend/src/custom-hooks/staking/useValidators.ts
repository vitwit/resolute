import { get } from 'lodash';
import { useAppSelector } from '../StateHooks';

const useValidators = () => {
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
        description: validator?.description?.details || '',
        commission:
          Number(get(validator, 'commission.commission_rates.rate', 0)) * 100,
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
          description: validator?.description?.details || '',
          commission:
            Number(get(validator, 'commission.commission_rates.rate', 0)) * 100,
        };
        validatorsList.push(temp);
      }
    }

    return { validatorsList };
  };
  return { getValidators };
};

export default useValidators;
