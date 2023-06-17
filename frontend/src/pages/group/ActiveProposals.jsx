import { Box, CircularProgress, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { NoData } from "../../components/group/NoData";
import ProposalCard from "../../components/group/ProposalCard";
import { resetActiveProposals } from "../../features/common/commonSlice";
import { getGroupPolicyProposalsByPage } from "../../features/group/groupSlice";

function ActiveProposals({ id, wallet, chainInfo, chainID }) {
  const dispatch = useDispatch();

  const params = useParams();

  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const [currentNetwork, setCurrentNetwork] = useState(
    params?.networkName || selectedNetwork.toLowerCase()
  );

  var [proposals, setProposals] = useState([]);
  const proposalsRes = useSelector((state) => state.group?.policyProposals?.[chainID]);

  const getProposalByAddress = () => {
    dispatch(
      getGroupPolicyProposalsByPage({
        baseURL: chainInfo?.config?.rest,
        groupId: id,
        chainID: chainID,
      })
    );
  };

  useEffect(() => {
    getProposalByAddress();
  }, [chainInfo]);

  useEffect(() => {
    setProposals([]);
    if (proposalsRes?.status === "idle") {
      setProposals([...proposalsRes?.data]);
    }
  }, [proposalsRes?.status]);

  useEffect(() => {
    return () => {
      dispatch(resetActiveProposals());
    };
  });

  return (
    <Box
      component="div"
      sx={{
        p: 2,
      }}
    >
      {proposals?.length === 0 ? (
        <NoData showAction={false} title="No Active Proposals" />
      ) : null}
      {proposalsRes?.status === "pending" ? <CircularProgress /> : null}
      {proposalsRes?.status === "idle" && proposals.length > 0 ? (
        <Grid container spacing={2}>
          {proposals?.map((p, index) => (
            <Grid item key={index} md={6} xs={12}>
              <ProposalCard proposal={p} networkName={currentNetwork} />
            </Grid>
          ))}
        </Grid>
      ) : null}
    </Box>
  );
}

export default ActiveProposals;
