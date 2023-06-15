import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";
import Link from "@mui/material/Link";
import UpdateGroupInfoDialog from "./UpdateGroupInfoDialog";

import {
  getGroupById,
  txLeaveGroupMember,
  txUpdateGroupAdmin,
  txUpdateGroupMetadata,
} from "../../features/group/groupSlice";
import { getFormatDate, getLocalTime } from "../../utils/datetime";
import { shortenAddress } from "../../utils/util";
import { copyToClipboard } from "../../utils/clipboard";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";

const LabelValue = ({ text, toolTip }) => (
  <Tooltip arrow placement="top-start" followCursor title={toolTip}>
    <Typography fontSize={18} textAlign={"left"}>
      {text}
    </Typography>
  </Tooltip>
);

const GroupInfo = (props) => {
  const { id, chainInfo, address, chainID} = props;

  const dispatch = useDispatch();
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [admin, setAdmin] = useState("");
  const [metadata, setMetadata] = useState("");
  const [showMetadataInput, setShowMetadataInput] = useState(false);

  const[open, setDialogOpen] = useState(false);
  const dialogCloseHandle = () => {
    setDialogOpen(!open)
  }

  const groupInfo = useSelector((state) => state.group.groupInfo?.[chainID]);
  const membersInfo = useSelector((state) => state.group.groupMembers);
  const { data, status } = groupInfo;

  const canLeaveGroup = membersInfo?.members.some((element) => {
    if (element?.member?.address === address) return true;
    return false;
  });

  const leaveGroupRes = useSelector((state) => state.group.leaveGroupRes);
  const updateAdminRes = useSelector(
    (state) => state.group.updateGroupAdminRes
  );
  const updateMetadataRes = useSelector(
    (state) => state.group.updateGroupMetadataRes
  );

  const canUpdateGroup = () => data?.admin === address;

  const getGroup = () => {
    dispatch(
      getGroupById({
        baseURL: chainInfo?.config?.rest,
        id: id,
        chainID: chainID,
      })
    );
  };

  useEffect(() => {
    if (updateAdminRes?.status === "idle" && showAdminInput) {
      setShowAdminInput(false);
      getGroup();
    }
  }, [updateAdminRes?.status]);

  useEffect(() => {
    if (updateMetadataRes?.status === "idle" && showMetadataInput) {
      setShowMetadataInput(false);
      getGroup();
    }
  }, [updateMetadataRes?.status]);

  const handleLeaveGroup = () => {
    dispatch(
      txLeaveGroupMember({
        admin: address,
        groupId: id,
        denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
        chainId: chainInfo.config.chainId,
        feeAmount: chainInfo.config.gasPriceStep.average,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
      })
    );
  };

  const UpdateAdmin = () => {
    dispatch(
      txUpdateGroupAdmin({
        signer: address,
        admin: data?.admin,
        groupId: id,
        newAdmin: admin,
        denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
        chainId: chainInfo.config.chainId,
        feeAmount: chainInfo.config.gasPriceStep.average,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
      })
    );
  };

  const UpdateMetadata = () => {
    dispatch(
      txUpdateGroupMetadata({
        signer: address,
        admin: data?.admin,
        groupId: id,
        metadata,
        denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
        chainId: chainInfo.config.chainId,
        feeAmount: chainInfo.config.gasPriceStep.average,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
      })
    );
  };

  return (
    <Box>
      <Typography
        variant="h6"
        color="text.primary"
        fontWeight={600}
        gutterBottom
        sx={{
          textAlign: "left",
        }}
      >
        Group Information
      </Typography>
      <Paper elevation={0} sx={{ p: 2 }}>
        {status === "pending" ? <CircularProgress /> : null}

        {status === "idle" && data?.admin ? (
          <Box
            sx={{
              p: 2,
            }}
          >
            {canLeaveGroup ? (
              <Button
                color="error"
                size="small"
                onClick={() => handleLeaveGroup()}
                variant={"outlined"}
                sx={{
                  textTransform: "none",
                  float: "right",
                }}
              >
                {leaveGroupRes?.status === "pending"
                  ? "Loading..."
                  : "Leave Group"}
              </Button>
            ) : null}
              <>
                <Typography
                  textAlign={"left"}
                  variant="h6"
                  gutterBottom
                  fontWeight={600}
                  color={"primary"}
                >
                  {JSON.parse(data?.metadata)?.name}
                  &nbsp;
                  {canUpdateGroup() ? (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setMetadata(data?.metadata);
                        setShowMetadataInput(!showMetadataInput)
                        setDialogOpen(true);
                      }}
                      sx={{
                        float: "right",
                        textTransform: "none",
                      }}
                      size="small"
                      disableElevation
                    >
                      Update Group Info
                    </Button>
                  ) : null}
                </Typography>
              </>

            <Grid container sx={{my: "16px"}}>
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
                    gutterBottom
                  >
                    Description
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    fontWeight={500}
                  >
                  {JSON.parse(data?.metadata).description}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Grid container sx={{my: "16px"}}>
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
                    gutterBottom
                  >
                    Forum
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    fontWeight={500}
                  >
                  <Link href={JSON.parse(data?.metadata).forumUrl} target="_blank">{JSON.parse(data?.metadata).forumUrl}</Link>
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Grid spacing={2} container>
              <Grid item md={4} xs={12}>
                {showAdminInput ? (
                  <>
                    <TextField
                      fullWidth
                      value={admin}
                      onChange={(e) => {
                        setAdmin(e.target.value);
                      }}
                      size="small"
                      label={"Admin"}
                      sx={{
                        mb: 2,
                      }}
                    />

                    <Button
                      onClick={() => UpdateAdmin()}
                      disabled={updateAdminRes?.status === "pending"}
                      size="small"
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        float: "right",
                      }}
                    >
                      {updateAdminRes?.status === "pending"
                        ? "Loading..."
                        : "Update"}
                    </Button>
                    <Button
                      onClick={() => setShowAdminInput(false)}
                      sx={{ mr: 1, float: "right", textTransform: "none" }}
                      color="error"
                      size="small"
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Box
                    sx={{
                      textAlign: "left",
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      fontWeight={500}
                      gutterBottom
                    >
                      Admin
                    </Typography>
                    <Chip
                      label={shortenAddress(data?.admin, 24)}
                      size="small"
                      deleteIcon={<ContentCopyOutlined />}
                      onDelete={() => {
                        copyToClipboard(data?.admin, dispatch);
                      }}
                    />
                    &nbsp;
                    {canUpdateGroup() ? (
                      <IconButton
                        onClick={() => {
                          setAdmin(data?.admin);
                          setShowAdminInput(true);
                        }}
                        color="primary"
                        size="small"
                        aria-label="edit metadata"
                        component="label"
                      >
                        <EditIcon />
                      </IconButton>
                    ) : null}
                  </Box>
                )}
              </Grid>
              <Grid item md={2} xs={6}>
                <Box
                  sx={{
                    textAlign: "left",
                  }}
                >
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    fontWeight={500}
                    gutterBottom
                  >
                    Total weight
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    fontWeight={500}
                  >
                    &nbsp;{data?.total_weight}
                  </Typography>
                </Box>
              </Grid>
              <Grid item md={2} xs={6}>
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
                    Created At
                  </Typography>
                  <LabelValue
                    toolTip={getLocalTime(data?.created_at)}
                    text={getFormatDate(data?.created_at)}
                  />
                </Box>
              </Grid>
              <Grid item md={2} xs={6}>
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
                    Members
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    fontWeight={500}
                  >
                    {membersInfo?.members?.length || 0}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : null}
      </Paper>
      {data?.metadata?<UpdateGroupInfoDialog data={data} chainInfo={chainInfo} address={address} open={open} id={id} dialogCloseHandle={dialogCloseHandle} groupName={JSON.parse(data?.metadata).name} forumUrl={JSON.parse(data?.metadata).forumUrl} description={JSON.parse(data?.metadata).description} />:null}
    </Box>
  );
};

GroupInfo.propTypes = {
  id: PropTypes.string.isRequired,
  wallet: PropTypes.object.isRequired,
  chainInfo: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
};

export default GroupInfo;
