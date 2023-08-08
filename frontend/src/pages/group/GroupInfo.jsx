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
} from "../../features/group/groupSlice";
import { getYearAndMonth } from "../../utils/datetime";
import { shortenAddress } from "../../utils/util";
import { copyToClipboard } from "../../utils/clipboard";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";


const GroupInfo = (props) => {
  const { id, chainInfo, address, chainID } = props;

  const dispatch = useDispatch();
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [admin, setAdmin] = useState("");
  const [showMetadataInput, setShowMetadataInput] = useState(false);
  const currentNetwork = chainInfo?.config?.chainName.toLowerCase();

  const [open, setDialogOpen] = useState(false);
  const dialogCloseHandle = () => {
    setDialogOpen(!open)
  }

  const feegrant = useSelector(
    (state) => state.common.feegrant?.[currentNetwork] || {}
  );
  const groupInfo = useSelector((state) => state.group.groupInfo?.[chainID]);
  const membersInfo = useSelector((state) => state.group.groupMembers?.[chainID]);
  let { data, status } = groupInfo;

  const canLeaveGroup = membersInfo?.members?.some((element) => {
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
        feeAmount: chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep.average,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feegranter: feegrant?.granter,
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
        feeAmount: chainInfo.config?.feeCurrencies?.[0]?.gasPriceStep.average,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feegranter: feegrant?.granter,
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
                disabled={leaveGroupRes?.status === "pending"}
              >
                {leaveGroupRes?.status === "pending"
                  ? "Loading..."
                  : "Leave Group"}
              </Button>
            ) : null}
            {canUpdateGroup() ? (
              <Button
                variant="contained"
                onClick={() => {
                  setShowMetadataInput(!showMetadataInput)
                  setDialogOpen(true);
                }}
                sx={{
                  float: "right",
                  textTransform: "none",
                  mr: 1,
                }}
                size="small"
                disableElevation
              >
                Update Group Info
              </Button>
            ) : null}

            <>
              {
                JSON.parse(data?.metadata)?.name ?
                  <>
                    <Typography
                      variant="h5"
                      color="text.primary"
                      fontWeight={600}
                      sx={{
                        textAlign: "left"
                      }}
                      gutterBottom
                    >
                      {
                        JSON.parse(data?.metadata)?.name
                      }
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{
                        textAlign: "left"
                      }}
                    >
                      Est.&nbsp;{
                        getYearAndMonth(data?.created_at)
                      }
                    </Typography>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      gutterBottom
                      sx={{
                        textAlign: "left"
                      }}
                    >
                      {
                        JSON.parse(data?.metadata)?.description
                      }
                    </Typography>
                  </>
                  :
                  <>
                    <Typography
                      variant="h5"
                      color="text.primary"
                      fontWeight={600}
                      sx={{
                        textAlign: "left"
                      }}
                    >
                      {data?.metadata}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{
                        textAlign: "left"
                      }}
                    >
                      Est.&nbsp;{
                        getYearAndMonth(data?.created_at)
                      }
                    </Typography>
                  </>

              }

            </>

            <Grid container spacing={2}
              sx={{
                textAlign: "left",
                mt: 1,
              }}
            >
              <Grid
                item
                md={3}
                xs={6}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                >
                  Forum
                </Typography>
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={500}
                >
                  <Link
                    href={JSON.parse(data?.metadata).forumUrl || "#"}
                    target="_blank"
                  >
                    {JSON.parse(data?.metadata).forumUrl || "-"}
                  </Link>
                </Typography>
              </Grid>
              <Grid item md={3} xs={6}>
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
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Group's address
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
                  </>
                )}
              </Grid>
              <Grid item md={3} xs={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
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
              </Grid>
              <Grid item md={3} xs={6}>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
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
              </Grid>
            </Grid>
          </Box>
        ) : null}
      </Paper>
      {data?.metadata ?
        <UpdateGroupInfoDialog
          data={data}
          chainInfo={chainInfo}
          address={address}
          open={open}
          id={id}
          dialogCloseHandle={dialogCloseHandle}
          groupName={JSON.parse(data?.metadata).name}
          forumUrl={JSON.parse(data?.metadata).forumUrl}
          description={JSON.parse(data?.metadata).description}
        />
        :
        null
      }
    </Box>
  );
};

GroupInfo.propTypes = {
  id: PropTypes.string.isRequired,
  chainInfo: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
};

export default GroupInfo;
