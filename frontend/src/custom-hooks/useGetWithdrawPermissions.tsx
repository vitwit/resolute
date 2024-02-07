import useAddressConverter from './useAddressConverter';
import { useAppSelector } from './StateHooks';
import { haveAuthorization } from './useAuthzStakingExecHelper';
import { msgWithdrawRewards } from '@/txns/distribution/withDrawRewards';
import { msgWithdrawValidatorCommission } from '@/txns/distribution/withDrawValidatorCommission';

const useGetWithdrawPermissions = () => {
  const { convertAddress } = useAddressConverter();
  const authzChains = useAppSelector((state) => state.authz.chains);

  const getWithdrawPermissions = ({
    chainID,
    granter,
  }: {
    chainID: string;
    granter: string;
  }) => {
    const address = convertAddress(chainID, granter);
    const grants: Authorization[] =
      authzChains?.[chainID]?.GrantsToMeAddressMapping?.[address] || [];

    const { haveGrant: withdrawRewardsAllowed } = haveAuthorization(grants, {
      generic: {
        msg: msgWithdrawRewards,
      },
    });

    const { haveGrant: withdrawCommissionAllowed } = haveAuthorization(grants, {
      generic: {
        msg: msgWithdrawValidatorCommission,
      },
    });

    console.log(withdrawRewardsAllowed, withdrawCommissionAllowed);

    return { withdrawRewardsAllowed, withdrawCommissionAllowed };
  };
  return {
    getWithdrawPermissions,
  };
};

export default useGetWithdrawPermissions;
