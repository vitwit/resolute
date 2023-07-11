import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChainGrants } from "./ChainGrants";
import {
  getGrantsByMe,
  getGrantsToMe,
} from "../../features/feegrant/feegrantSlice";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import SelectNetwork from "../../components/common/SelectNetwork";
import { useNavigate } from "react-router-dom";

export const FeegrantOverview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const allGrantsByMe = useSelector((state) => state.feegrant.allGrantsByMe);
  const allGrantsToMe = useSelector((state) => state.feegrant.allGrantsToMe);

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
      {Object.keys(allGrantsByMe).length ||
      Object.keys(allGrantsToMe).length ? (
        <>
          {Object.keys(nameToChainIDs).map((chainName) => (
            <ChainGrants
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
                navigate(`/${name}/feegrant`);
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
            No Feegrant found
          </Typography>
        </>
      )}
    </>
  );
};
