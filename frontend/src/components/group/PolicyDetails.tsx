import {
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import { getFormatDate, getLocalTime } from "../../utils/datetime";
import CheckIcon from "@mui/icons-material/Check";
import { useSelector } from "react-redux";
import {
  getTypeURLName,
  shortenAddress,
  ThresholdDecisionPolicy,
} from "../../utils/util";

interface GridItemProps {
  label: string;
  text: string;
  isEditMode?: boolean;
  handleUpdate: any;
  disabledSubmit?: any;
  canEdit?: boolean;
}

interface TextProps {
  text: string;
  toolTip?: string;
}

const LabelText = ({ text }: TextProps) => (
  <Typography
    textAlign={"left"}
    variant="body1"
    color="text.secondary"
    fontWeight={500}
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

const LabelWithTooltip = ({ text, toolTip }: TextProps) => (
  <Tooltip arrow placement="top-start" followCursor title={toolTip || ""}>
    <Typography fontSize={18} textAlign={"left"}>
      {text}{" "}
    </Typography>
  </Tooltip>
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
        variant="body1"
        color={"text.secondary"}
        fontWeight={500}
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
}

function PolicyDetails({
  policyObj,
  handleUpdateMetadata,
  handleUpdateAdmin,
  canUpdateGroup,
}: PolicyDetailsProps) {
  const [isMetaEditMode, setIsMetaEditMode] = useState(false);
  const [isAdminEdit, setIsAdminEdit] = useState(false);

  const policyMetadata = JSON.parse(policyObj?.metadata);

  const updateMetadataRes = useSelector(
    (state: any) => state?.group?.updateGroupMetadataRes
  );

  useEffect(() => {
    if (updateMetadataRes?.status === "idle") {
      setIsMetaEditMode(false);
    }
  }, [updateMetadataRes?.status]);

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
        >
          {policyMetadata?.name || "-"} &nbsp;&nbsp;
        </Typography>
      </Box>

      <Grid container>
        <Grid item>
          <Box
            sx={{
              textAlign: "left",
            }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              fontWeight={500}
            >
              Description
            </Typography>
            <Typography variant="body1" color="text.primary" fontWeight={500}>
              {policyMetadata?.description || "-"}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid container>
        <Grid
          item
          md={4}
          xs={12}
          sx={{
            mt: 1,
          }}
        >
          <Box> 
            <GridItemEdit
              handleUpdate={handleUpdateAdmin}
              disabledSubmit={updatePolicyAdminRes?.status === "pending"}
              label="Admin"
              isEditMode={isAdminEdit}
              text={policyObj?.admin}
              canEdit={canUpdateGroup}
            />
          </Box>
        </Grid>
        <Grid
          item
          md={4}
          xs={6}
          sx={{
            mt: 1,
          }}
        >
          <LabelText text="Type" />
          <LabelValue
            text={getTypeURLName(policyObj?.decision_policy["@type"])}
          />
        </Grid>
        <Grid
          item
          md={4}
          xs={6}
          sx={{
            mt: 1,
          }}
        >
          {policyObj?.decision_policy["@type"] === ThresholdDecisionPolicy ? (
            <>
              <LabelText text="Threshold" />
              <LabelValue text={policyObj?.decision_policy?.threshold || "0"} />
            </>
          ) : (
            <>
              <LabelText text="Percentage" />
              <LabelValue
                text={policyObj?.decision_policy?.percentage || "0"}
              />
            </>
          )}
        </Grid>
        <Grid
          item
          md={4}
          xs={6}
          sx={{
            mt: 1,
          }}
        >
          <LabelText text="Created At" />
          <LabelValue
            text={getFormatDate(policyObj?.created_at)}
            toolTip={getLocalTime(policyObj?.created_at)}
          />
        </Grid>
        <Grid
          item
          md={4}
          xs={6}
          sx={{
            mt: 1,
          }}
        >
          <LabelText text="Group ID" />
          <LabelValue
            text={policyObj?.group_id}
            toolTip={policyObj?.group_id}
          />
        </Grid>
        <Grid
          item
          md={4}
          xs={6}
          sx={{
            mt: 1,
          }}
        >
          <LabelText text="Version" />
          <LabelValue text={policyObj?.version} toolTip={policyObj?.version} />
        </Grid>
        <Grid
          item
          md={4}
          xs={6}
          sx={{
            mt: 1,
          }}
        >
          <LabelText text="Voting Period" />
          <LabelValue
            text={
              parseFloat(
                policyObj?.decision_policy?.windows?.voting_period || 0
              ).toFixed(2) + " Sec"
            }
            toolTip={parseFloat(
              policyObj?.decision_policy?.windows?.voting_period || 0
            ).toFixed(2)}
          />
        </Grid>
        <Grid
          item
          md={4}
          xs={6}
          sx={{
            mt: 1,
          }}
        >
          <LabelText text="Min Execution Period" />
          <LabelValue
            text={
              parseFloat(
                policyObj?.decision_policy?.windows?.min_execution_period
              ).toFixed(2) + " Sec"
            }
            toolTip={parseFloat(
              policyObj?.decision_policy?.windows?.min_execution_period
            ).toFixed(2)}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default PolicyDetails;
