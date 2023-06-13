import {
  Button,
  Paper,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGroupById,
  getGroupPoliciesById,
  txUpdateGroupPolicy,
  txUpdateGroupPolicyAdmin,
  txUpdateGroupPolicyMetdata,
} from "../../features/group/groupSlice";
import PolicyForm from "../../components/group/PolicyForm";
import { useParams } from "react-router-dom";
import AlertMsg from "../../components/group/AlertMsg";
import PolicyDetails from "../../components/group/PolicyDetails";
import UpdatePolicyMetadataDialog from "../../components/group/UpdatePolicyMetadataDialog";
import { DAYS, PERCENTAGE } from "./common";

function PolicyInfo({ chainInfo, address }) {
  const [policyObj, setPolicyObj] = useState({});
  const [isEditPolicyForm, setEditPolicyForm] = useState(false);
  const [policyMetadataDialog, setPolicyMetadataDialog] = useState(false);
  const dialogCloseHandle = () => {
    setPolicyMetadataDialog(!policyMetadataDialog);
  };

  const dispatch = useDispatch();
  const { id, policyId } = useParams();

  const wallet = useSelector((state) => state.wallet);
  const updateMetadataRes = useSelector(
    (state) => state.group.updateGroupMetadataRes
  );
  const updatePolicyAdminRes = useSelector(
    (state) => state.group.updatePolicyAdminRes
  );
  const updateGroupPolicyRes = useSelector(
    (state) => state.group.updateGroupPolicyRes
  );

  const updateGroupMetadataRes = useSelector(
    (state) => state.group.updateGroupMetadataRes
  );

  const groupPoliceis = useSelector((state) => state?.group?.groupPolicies);

  const getPolicies = () => {
    dispatch(
      getGroupPoliciesById({
        baseURL: chainInfo?.config?.rest,
        id: id,
        pagination: {
          key: "",
          limit: 100,
        },
      })
    );
  };

  useEffect(() => {
    getGroup();
    getPolicies();
  }, []);

  useEffect(() => {
    const data = groupPoliceis?.data?.group_policies || [];
    if (data?.length) {
      const pArr = data.filter((d) => d.address === policyId);
      if (pArr?.length) {
        setPolicyObj(pArr[0]);
      }
    }
  }, [groupPoliceis?.status]);

  useEffect(() => {
    if (updateMetadataRes?.status === "idle") getPolicies();
  }, [updateMetadataRes?.status]);

  useEffect(() => {
    if (updatePolicyAdminRes?.status === "idle") getPolicies();
  }, [updatePolicyAdminRes?.status]);

  useEffect(() => {
    if (updateGroupPolicyRes?.status === "idle") {
      setEditPolicyForm(false);
      getPolicies();
    }
  }, [updateGroupPolicyRes?.status]);

  useEffect(() => {
    if (updateGroupMetadataRes?.status === "idle") {
      setPolicyMetadataDialog(false);
    }
  }, [updateGroupMetadataRes?.status]);

  const handlePolicyMetadata = (newMetadata) => {

    dispatch(
      txUpdateGroupPolicyMetdata({
        admin: policyObj?.admin,
        groupPolicyAddress: policyObj?.address,
        metadata: newMetadata,
        denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
        chainId: chainInfo.config.chainId,
        rpc: chainInfo.config.rpc,
        feeAmount: chainInfo.config.gasPriceStep.average,
      })
    );
  };

  const handleUpdateAdmin = (newAdmin) => {

    dispatch(
      txUpdateGroupPolicyAdmin({
        admin: policyObj?.admin,
        groupPolicyAddress: policyObj?.address,
        newAdmin: newAdmin,
        denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
        chainId: chainInfo.config.chainId,
        rpc: chainInfo.config.rpc,
        feeAmount: chainInfo.config.gasPriceStep.average,
      })
    );
  };

  const getGroup = () => {
    dispatch(
      getGroupById({
        baseURL: chainInfo?.config?.rest,
        id: id,
      })
    );
  };

  const groupInfo = useSelector((state) => state.group.groupInfo);
  const canUpdateGroup = () => groupInfo?.data?.admin === address;

  const handleSubmitPolicy = (data) => {

    const dataObj = {
        admin: policyObj?.admin,
        groupPolicyAddress: policyObj?.address,
        denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
        chainId: chainInfo.config.chainId,
        rpc: chainInfo.config.rpc,
        feeAmount: chainInfo.config.gasPriceStep.average,
      }
    if (
      data.policyMetadata.percentage !== 0 ||
      data.policyMetadata.threshold !== 0
    ) {
      const getPeriod = (duration, period) => {
        let time;
        if(duration === DAYS) time = 24 * 60 * 60;
        else if (duration === "Hours") time = 60 * 60;
        else if (duration === "Minutes") time = 60;
        else time = 1;

        time = time * Number(period);
        return time;
      }

      if (data?.policyMetadata) {
        dataObj["policyMetadata"] = {
          ...data.policyMetadata,
          minExecPeriod: getPeriod(data.policyMetadata?.minExecPeriodDuration, data.policyMetadata?.minExecPeriod),
          votingPeriod: getPeriod(data.policyMetadata?.votingPeriodDuration, data.policyMetadata?.votingPeriod),
        };
      }

      if (dataObj?.policyMetadata?.decisionPolicy === PERCENTAGE) {
        dataObj.policyMetadata.percentage =
          Number(dataObj.policyMetadata.percentage) / 100.0;
      }
    }

    dispatch(
      txUpdateGroupPolicy(dataObj)
    );
  };

  return (
    <Box
      sx={{
        textAlign: "left",
      }}
    >
      <Typography
        gutterBottom
        variant="h6"
        color="text.primary"
        fontWeight={600}
      >
        Policy Information
      </Typography>
      {groupPoliceis?.status === "pending" ? (
        <Paper variant="outlined">
          <CircularProgress variant="h2" />{" "}
        </Paper>
      ) : null}
      {groupPoliceis?.status === "idle" && !policyObj?.address && (
        <AlertMsg type="error" text="Policy not found" />
      )}

      {groupPoliceis?.status === "idle" && policyObj?.address ? (
        <Paper variant="outlined" sx={{ p: 4 }} elevation={0}>
          {(canUpdateGroup() && !isEditPolicyForm) ? (
            <Button
              variant="contained"
              onClick={() => setPolicyMetadataDialog(true)}
              sx={{
                float: "right",
                textTransform: "none",
                mx: "2px",
              }}
              size="small"
              disableElevation
            >
              Update policy metadata
            </Button>
          ) : null}
          {(canUpdateGroup() && !isEditPolicyForm) ? (
            <Button
              variant="contained"
              onClick={() => setEditPolicyForm(true)}
              sx={{
                float: "right",
                textTransform: "none",
                mx: "2px",
              }}
              size="small"
              disableElevation
            >
              Update policy
            </Button>
          ) : null}

          {isEditPolicyForm && canUpdateGroup() ? (
            <PolicyForm
              policyObj={policyObj}
              handlePolicy={handleSubmitPolicy}
              handlePolicyClose={() => setEditPolicyForm(false)}
            />
          ) : (
            <PolicyDetails
              handleUpdateMetadata={handlePolicyMetadata}
              handleUpdateAdmin={handleUpdateAdmin}
              policyObj={policyObj}
              canUpdateGroup={canUpdateGroup()}
            />
          )}
        </Paper>
      ) : null}
      {policyObj?.metadata ? (
        <UpdatePolicyMetadataDialog
          open={policyMetadataDialog}
          metadata={JSON.parse(policyObj.metadata)}
          handlePolicyMetadata={handlePolicyMetadata}
          dialogCloseHandle={dialogCloseHandle}
        />
      ) : null}
    </Box>
  );
}

export default PolicyInfo;
