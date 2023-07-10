import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChainGrants } from "./ChainGrants";
import { getGrantsByMe, getGrantsToMe } from "../../features/feegrant/feegrantSlice";

export const FeegrantOverview = () => {
  const dispatch = useDispatch();
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  useEffect(() => {
    Object.values(nameToChainIDs).map((chainID) => {
      const address = networks[chainID]?.walletInfo?.bech32Address;
      const baseURL = networks?.[chainID]?.network?.config?.rest;
      dispatch(
        getGrantsByMe({
          chainID,
          granter: address,
          baseURL,
        })
      );

      dispatch(
        getGrantsToMe({
          chainID,
          grantee: address,
          baseURL,
        })
      );
    });
  }, [nameToChainIDs]);

  return (
    <>
      {Object.keys(nameToChainIDs).map((chainName) => (
        <ChainGrants
          key={chainName}
          chainName={chainName}
          chainID={nameToChainIDs[chainName]}
        />
      ))}
    </>
  );
};
