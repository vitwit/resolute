import { useAppSelector } from './StateHooks';
import useAuthzGrants from './useAuthzGrants';
import { getAuthzAlertData } from '@/utils/localStorage';

const useGetShowAuthzAlert = () => {
  const showAuthzGrantsAlert = useAppSelector(
    (state) => state.authz.authzAlert.display
  );
  const { getSendAuthzGrants } = useAuthzGrants();
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

  const sendGrantsData = getSendAuthzGrants(chainIDs);
  const showAuthzAlert =
    showAuthzGrantsAlert &&
    (sendGrantsData.ibcTransfer > 0 || sendGrantsData.send > 0) &&
    getAuthzAlertData() &&
    !isAuthzMode;

  return showAuthzAlert;
};

export default useGetShowAuthzAlert;
