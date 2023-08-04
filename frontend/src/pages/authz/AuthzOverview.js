import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGrantsByMe, getGrantsToMe } from "../../features/authz/authzSlice";
import { ChainAuthz } from "./ChainAuthz";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import SelectNetwork from "../../components/common/SelectNetwork";
import { useNavigate } from "react-router-dom";

export const AuthzOverview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const grantsByMeCount = useSelector((state) => state.authz.grantsByMeCount);
  const grantsToMeCount = useSelector((state) => state.authz.grantsToMeCount);

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
      {grantsByMeCount || grantsToMeCount ? (
        <>
          {Object.keys(nameToChainIDs).map((chainName) => (
            <ChainAuthz
              key={chainName}
              chainName={chainName}
              chainID={nameToChainIDs[chainName]}
            />
          ))}
        </>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <SelectNetwork
              onSelect={(name) => {
                navigate(`/${name}/authz`);
              }}
              networks={Object.keys(nameToChainIDs)}
            />
          </Box>
          <Typography
            variant="h6"
            color="text.primary"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 16,
            }}
          >
            No Authz found
          </Typography>
        </>
      )}
    </>
  );
};
