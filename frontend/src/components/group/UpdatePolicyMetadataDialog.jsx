import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import CreateGroupPolicy from "../../pages/group/CreateGroupPolicy";

export default function UpdatePolicyMetadataDialog(props) {
  const { open, dialogCloseHandle, metadata, handlePolicyMetadata } = props;

  const updatePolicyMetadataRes = useSelector(
    (state) => state.group.updateGroupMetadataRes
  );

  const onSubmit = (data) => {
    handlePolicyMetadata(JSON.stringify(data.policyMetadata));
  };

  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    handleCancelPolicy,
    formState: { errors },
    getValues,
  } = useForm({});

  return (
    <div>
      <Dialog open={open} onClose={dialogCloseHandle}>
        <DialogTitle>Update Policy Metadata</DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            id="update-policy-metadata-form"
          >
            <fieldset style={{ border: "none" }}>
              <CreateGroupPolicy
                control={control}
                register={register}
                watch={watch}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
                handleCancelPolicy={handleCancelPolicy}
                members={[]}
                policyUpdate={false}
                policyMetadataUpdate={true}
                metadata={metadata}
              />
            </fieldset>
            <DialogActions>
              <Button onClick={dialogCloseHandle}>Cancel</Button>
              <Button
                variant="contained"
                disabled={updatePolicyMetadataRes?.status === "pending"}
                type="submit"
                disableElevation
              >
                {updatePolicyMetadataRes?.status === "pending"
                  ? "Updating..."
                  : "Update"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
