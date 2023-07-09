import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import CreateGroupInfoForm from "./CreateGroupInfoForm";
import { txUpdateGroupMetadata } from "../../features/group/groupSlice";
import { useDispatch, useSelector } from "react-redux";

export default function UpdateGroupInfoDialog(props) {
  const {
    open,
    dialogCloseHandle,
    groupName,
    forumUrl,
    description,
    id,
    data,
    chainInfo,
    address,
  } = props;

  const dispatch = useDispatch();
  const updateMetadataRes = useSelector(
    (state) => state.group.updateGroupMetadataRes
  );

  const UpdateMetadata = () => {
    dispatch(
      txUpdateGroupMetadata({
        signer: address,
        admin: data?.admin,
        groupId: id,
        metadata: JSON.stringify({
          name: watchAllFields?.name,
          forumUrl: watchAllFields?.forumUrl,
          description: watchAllFields?.description,
        }),
        denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
        chainId: chainInfo.config.chainId,
        feeAmount: chainInfo.config.gasPriceStep.average,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
      })
    );
  };

  const {
    control,
    watch,
    formState: { errors },
  } = useForm({});

  const [groupNameError, setGroupNameError] = useState("");
  const [groupDescError, setGroupDescError] = useState("");
  const [groupForumError, setGroupForumError] = useState("");
  const groupInfoErrors = {
    nameErrors: [
      "name cannot be empty",
      "name cannot contain more than 25 characters",
    ],
    descErrors: [
      "description cannot be empty",
      "description cannot contain more than 100 characters",
    ],
    forumErrors: [
      "forum URL cannot be empty",
      "forum URL cannot contain more than 70 characters",
    ],
  };

  const watchAllFields = watch();

  const validateGroupInfo = () => {
    if (
      !watchAllFields.name?.trim().length ||
      !watchAllFields.description?.trim().length ||
      !watchAllFields.forumUrl?.trim().length
    ) {
      setGroupNameError(groupInfoErrors.nameErrors[0]);
      setGroupDescError(groupInfoErrors.descErrors[0]);
      setGroupForumError(groupInfoErrors.forumErrors[0]);
      return 0;
    }
    if (
      watchAllFields.name?.trim().length > 25 ||
      watchAllFields.description?.trim().length > 100 ||
      watchAllFields.forumUrl?.trim().length > 70
    ) {
      setGroupNameError(groupInfoErrors.nameErrors[1]);
      setGroupDescError(groupInfoErrors.descErrors[1]);
      setGroupForumError(groupInfoErrors.forumErrors[1]);
      return 0;
    }
    setGroupNameError("");
    setGroupDescError("");
    setGroupForumError("");
    return 1;
  };

  return (
    <div>
      <Dialog open={open} onClose={dialogCloseHandle}>
        <DialogTitle>Update Group Info</DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            pb: 1,
          }}
        >
          <CreateGroupInfoForm
            control={control}
            setGroupDescError={setGroupDescError}
            setGroupNameError={setGroupNameError}
            setGroupForumError={setGroupForumError}
            groupNameError={groupNameError}
            groupForumError={groupForumError}
            groupDescError={groupDescError}
            watchAllFields={watchAllFields}
            groupName={groupName}
            description={description}
            forumUrl={forumUrl}
          />
          <DialogActions>
            <Button
              onClick={dialogCloseHandle}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={updateMetadataRes?.status === "pending"}
              onClick={() => {
                if (validateGroupInfo()) {
                  UpdateMetadata();
                }
              }}
              disableElevation
            >
              {updateMetadataRes?.status === "pending"
                ? "Updating..."
                : "Update"}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
