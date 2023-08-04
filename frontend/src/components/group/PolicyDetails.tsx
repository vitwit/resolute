import React, { useEffect, useState } from "react";
import { Grid, IconButton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import { getFormatDate, getJustDay, getLocalTime } from "../../utils/datetime";
import CheckIcon from "@mui/icons-material/Check";
import { useSelector } from "react-redux";
import { shortenAddress, ThresholdDecisionPolicy } from "../../utils/util";
import moment from "moment";
import { getDaysCount } from "./PolicyCard";

interface GridItemProps {
  label: string;
  text: string;
  isEditMode?: boolean;
  handleUpdate: any;
  disabledSubmit?: any;
  canEdit?: boolean;
}

interface TextProps {
  text?: string;
  toolTip?: string;
}

const LabelText = ({ text }: TextProps) => (
  <Typography
    textAlign={"left"}
    variant="body2"
    color="text.secondary"
    fontWeight={600}
  >
    {text}
  </Typography>
);

const LabelValue = ({ text }: TextProps) => (
  <Typography
    variant="body1"
    color="text.primary"
    fontWeight={500}
    gutterBottom
  >
    {text}
  </Typography>
);

const GridItemEdit = ({
  label,
  text,
  isEditMode,
  handleUpdate,
  disabledSubmit,
  canEdit,
}: GridItemProps) => {
  const [isEdit, setIsEdit] = useState(isEditMode);

  return (
    <>
      <Typography
        variant="body2"
        color={"text.secondary"}
        fontWeight={600}
        textAlign={"left"}
      >
        {label}
      </Typography>
      {isEdit ? (
        <EditTextField
          placeholder="Admin Address"
          value={text}
          disableSubmit={disabledSubmit}
          handleUpdate={handleUpdate}
          hideShowEdit={() => setIsEdit(false)}
        />
      ) : (
        <Box display={"flex"}>
          <Typography
            variant="body1"
            textAlign={"left"}
            fontWeight={600}
            gutterBottom
          >
            {shortenAddress(text, 24)}
          </Typography>
          &nbsp;&nbsp;
          {canEdit ? (
            <EditIcon onClick={() => setIsEdit(true)} color="primary" />
          ) : null}
        </Box>
      )}
    </>
  );
};

interface EditTextFieldProps {
  name?: string;
  value: string;
  hideShowEdit?: any;
  placeholder?: string;
  handleUpdate?: any;
  disableSubmit?: any;
}

const EditTextField = ({
  placeholder,
  handleUpdate,
  disableSubmit,
  name,
  value,
  hideShowEdit,
}: EditTextFieldProps) => {
  const [field, setField] = useState(value);

  return (
    <Box sx={{ display: "flex" }}>
      <TextField
        placeholder={placeholder}
        multiline
        fullWidth
        onChange={(e) => setField(e.target.value)}
        value={field}
      />

      <IconButton
        disabled={disableSubmit}
        onClick={() => handleUpdate(field)}
        color="primary"
        sx={{ ml: 1 }}
      >
        <CheckIcon color="primary" />
      </IconButton>
      <IconButton
        color="error"
        onClick={() => hideShowEdit()}
        sx={{ ml: 1, mr: 1 }}
      >
        <CancelIcon color="error" />
      </IconButton>
    </Box>
  );
};

interface PolicyDetailsProps {
  policyObj: any;
  handleUpdateAdmin: any;
  handleUpdateMetadata: any;
  canUpdateGroup: boolean;
  totalWeight: number;
}

function PolicyDetails({
  policyObj,
  handleUpdateAdmin,
  canUpdateGroup,
  totalWeight,
}: PolicyDetailsProps) {
  const [isAdminEdit, setIsAdminEdit] = useState(false);

  const policyMetadata = JSON.parse(policyObj?.metadata);

  const updatePolicyAdminRes = useSelector(
    (state: any) => state?.group?.updatePolicyAdminRes
  );

  useEffect(() => {
    if (updatePolicyAdminRes?.status === "idle") {
      setIsAdminEdit(false);
    }
  }, [updatePolicyAdminRes?.status]);

  return (
    <Box
      sx={{
        mt: 2,
      }}
    >
      <Box>
        <Typography
          gutterBottom
          textAlign="left"
          variant="h6"
          color="text.primary"
          fontWeight={600}
        >
          {policyMetadata?.name || policyMetadata}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={600}
          gutterBottom
        >
          {policyMetadata?.description || ""}
        </Typography>
      </Box>

      <Grid
        container
        sx={{
          mt: 2,
        }}
        spacing={2}
      >
        <Grid item md={4} xs={12}>
          <GridItemEdit
            handleUpdate={handleUpdateAdmin}
            disabledSubmit={updatePolicyAdminRes?.status === "pending"}
            label="Policy Address"
            isEditMode={isAdminEdit}
            text={policyObj?.admin}
            canEdit={canUpdateGroup}
          />
        </Grid>
        <Grid item md={4} xs={6}>
          <LabelText text="Quorum" />
          {policyObj?.decision_policy["@type"] === ThresholdDecisionPolicy ? (
            <LabelValue
              text={
                `${(
                  (parseFloat(policyObj?.decision_policy?.threshold) /
                    totalWeight) *
                  100.0
                ).toFixed(0)}%` || "0%"
              }
            />
          ) : (
            <LabelValue
              text={
                `${(
                  parseFloat(policyObj?.decision_policy?.percentage) * 100.0
                ).toFixed(0)}%` || "0%"
              }
            />
          )}
        </Grid>
        <Grid item md={4} xs={6}>
          <LabelText text="Created At" />
          <LabelValue
            text={getFormatDate(policyObj?.created_at)}
            toolTip={getLocalTime(policyObj?.created_at)}
          />
        </Grid>
        <Grid item md={4} xs={6}>
          <LabelText text="Voting Period" />
          <LabelValue
            text={
              getDaysCount(policyObj?.decision_policy?.windows?.voting_period) + " Days"
            }
          />
        </Grid>
        <Grid item md={4} xs={6}>
          <LabelText text="Execution Delay" />
          <LabelValue
            text={
              getDaysCount(policyObj?.decision_policy?.windows?.min_execution_period) + " Days"
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default PolicyDetails;
