import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {
  Button,
  Card,
  CircularProgress,
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getGroupById,
  getGroupMembersById,
  getGroupPoliciesById,
  resetUpdateGroupMember,
  txAddGroupPolicy,
  txUpdateGroupMember,
} from "../../features/group/groupSlice";

import MembersTable from "../../components/group/MembersTable";
import PolicyCard from "../../components/group/PolicyCard";
import UpdateGroupMemberForm from "../../components/group/UpdateGroupMemberForm";
import CreateGroupPolicy from "./CreateGroupPolicy";
import { groupStyles } from "./group-css";
import GroupTab, { TabPanel } from "../../components/group/GroupTab";
import GroupInfo from "./GroupInfo";
import ActiveProposals from "./ActiveProposals";
import { useForm } from "react-hook-form";
import { NoData } from "../../components/group/NoData";
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

const GroupPolicies = ({ id, wallet }) => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const groupDetails = useSelector((state) => state.group.groupInfo);
  const { data: groupInformation, status: groupInfoStatus } = groupDetails;

  const addPolicyRes = useSelector((state) => state.group.addGroupPolicyRes);

  const groupMembers = useSelector((state) => state.group.groupMembers);

  useEffect(() => {
    if (addPolicyRes?.status === "idle") {
      getPolicies(limit, "");
      setShowForm(false);
    }
  }, [addPolicyRes?.status]);

  const getPolicies = (limit, key = "") => {
    dispatch(
      getGroupPoliciesById({
        baseURL: wallet?.chainInfo?.config?.rest,
        id: id,
        pagination: { limit: limit, key },
      })
    );
  };
  useEffect(() => {
    getPolicies(limit, "");
  }, []);

  const getGroupmembers = () => {
    dispatch(
      getGroupMembersById({
        baseURL: wallet?.chainInfo?.config?.rest,
        id: id,
        pagination: { limit: limit, key: "" },
      })
    );
  };

  useEffect(() => {
    getGroupmembers();
  }, []);

  const handlePagination = (number, limit, key) => {
    setLimit(limit);
    setPageNumber(number);
    getPolicies(limit, key);
  };

  let group_policies = [];
  const groupInfo = useSelector((state) => state.group.groupPolicies);
  const { data, status } = groupInfo;

  if (data) {
    group_policies = data?.group_policies;
  }

  useEffect(() => {
    if (Number(data?.pagination?.total))
      setTotal(Number(data?.pagination?.total || 0));
  }, [data]);

  const handlePolicy = (policyObj) => {
    const chainInfo = wallet?.chainInfo;

    dispatch(
      txAddGroupPolicy({
        admin: groupInformation?.info?.admin,
        groupId: id,
        policyMetadata: policyObj?.policyMetadata,
        denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
        chainId: chainInfo.config.chainId,
        rpc: chainInfo.config.rpc,
        feeAmount: chainInfo.config.gasPriceStep.average,
      })
    );
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({});

  return (
    <Box sx={{ flexGrow: 1, textAlign: "center" }}>
      <Box
        sx={{
          textAlign: "right",
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            setShowForm(!showForm);
          }}
          disableElevation
          sx={{
            textTransform: "none",
          }}
        >
          Attach Decision Policy
        </Button>
      </Box>
      {showForm && (
        <Card sx={groupStyles.fw}>
          {groupMembers?.status === "pending" ? (
            <Typography>Wait fetching group members information ...</Typography>
          ) : null}

          {groupMembers?.status === "idle" &&
          Number(groupMembers?.data?.pagination?.total) > 0 ? (
            <form onSubmit={handleSubmit(handlePolicy)}>
              <CreateGroupPolicy
                control={control}
                register={register}
                watch={watch}
                errors={errors}
                fields={Number(groupMembers?.data?.pagination?.total || 0)}
                handleCancelPolicy={() => setShowForm(false)}
              />
              <Box sx={{ p: 2 }}>
                <Button
                  sx={{ mr: 2 }}
                  variant="outlined"
                  onClick={() => setShowForm(false)}
                  color="error"
                >
                  Cancel
                </Button>
                <Button
                  disabled={addPolicyRes?.status === "pending"}
                  type="submit"
                  variant="outlined"
                  color="primary"
                >
                  {addPolicyRes?.status === "pending" ? "Loading..." : "Add"}
                </Button>
              </Box>
            </form>
          ) : (
            <Typography textAlign={"center"} variant={"body1"}>
              No members found on this group.
            </Typography>
          )}
        </Card>
      )}

      <Box
        sx={{
          textAlign: "center",
          mt: 2,
        }}
      >
        {status === "pending" ? <CircularProgress /> : null}
        {status !== "pending" && !showForm && !group_policies?.length && (
          <NoData
            title="No policies found"
            showAction={true}
            onAction={() => {
              alert("todo");
            }}
            actionText="Attach policy"
          />
        )}

        {status !== "pending" && group_policies?.length > 0 ? (
          <Grid container spacing={2}>
            {group_policies.map((p, index) => (
              <Grid md={4} xs={12} sm={12} lg={4}>
                <PolicyCard obj={p} />
              </Grid>
            ))}
          </Grid>
        ) : null}
      </Box>
    </Box>
  );
};

const GroupMembers = (props) => {
  const { id, wallet } = props;

  const dispatch = useDispatch();

  const getGroupmembers = () => {
    dispatch(
      getGroupMembersById({
        baseURL: wallet?.chainInfo?.config?.rest,
        id: id,
        pagination: { limit: 100, key: "" },
      })
    );
  };

  const updateGroupRes = useSelector((state) => state.group?.updateGroupRes);
  useEffect(() => {
    dispatch(resetUpdateGroupMember());
    getGroupmembers();
  }, [updateGroupRes?.status]);

  const membersInfo = useSelector((state) => state.group.groupMembers);
  const { members, pagination, status } = membersInfo;

  return (
    <Box sx={{ flexGrow: 1 }}>
      {status === "pending" ? <CircularProgress /> : null}
      {status === "idle" && members.length === 0 ? (
        <NoData
          title="No members found"
          showAction={true}
          onAction={() => {
            alert("todo");
          }}
          actionText="Add members"
        />
      ) : null}
      {status === "idle" && members.length > 0 ? (
        <MembersTable members={members} pagination={pagination} />
      ) : null}
    </Box>
  );
};

GroupMembers.propTypes = {
  id: PropTypes.string.isRequired,
  wallet: PropTypes.object.isRequired,
};

const UpdateGroupMember = (props) => {
  const { id, wallet, members } = props;
  const [updatedmembers, setUpdatedmembers] = useState(members);
  // const [showForm, setShowForm] = useState(false);
  // var [members2, setMembers] = useState([]);
  // const dispatch = useDispatch();
  // const updateRes = useSelector((state) => state.group.updateGroupRes);

  // useEffect(() => {
  //   if (updateRes?.status === "idle") {
  //     setShowForm(false);
  //   }
  // }, [updateRes]);

  // useEffect(() => {
  //   return () => {
  //     dispatch(resetUpdateGroupMember());
  //   };
  // }, []);

  // const groupMembers = useSelector((state) => state.group.groupMembers);
  // const members1 = [{ address: "", weight: "", metadata: "" }];
  // const { data: members, status: memberStatus } = groupMembers;

  // const getMembers = () => {
  //   let m =
  //     members &&
  //     members?.members?.map((m) => {
  //       let { added_at, ...newObj } = m?.member;
  //       return newObj;
  //     });
  //   if (m?.length) setMembers([...m]);
  //   else setMembers([...members1]);
  // };

  // const getGroupmembers = () => {
  //   dispatch(
  //     getGroupMembersById({
  //       baseURL: wallet?.chainInfo?.config?.rest,
  //       id: id,
  //       pagination: { limit: 200, key: "" },
  //     })
  //   );
  // };

  // useEffect(() => {
  //   getMembers();
  // }, [memberStatus]);

  // useEffect(() => {
  //   getGroupmembers();
  // }, []);

  // const handleUpdate = (allMembers) => {
  //   const chainInfo = wallet?.chainInfo;

  //   const dataObj = {
  //     admin: wallet?.address,
  //     groupId: id,
  //     members: allMembers?.members,
  //     denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
  //     chainId: chainInfo.config.chainId,
  //     rpc: chainInfo.config.rpc,
  //     feeAmount: chainInfo.config.gasPriceStep.average,
  //   };

  //   dispatch(txUpdateGroupMember(dataObj));
  // };

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          mt: 2,
        }}
      >
        <Table sx={{ minWidth: 500 }} aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>Address</StyledTableCell>
              <StyledTableCell>Weight</StyledTableCell>
              <StyledTableCell>Metadata</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          {updatedmembers.map((member, index) => (
            <TableRow index={index}>
              <StyledTableCell>
                <TextField
                  size="small"
                  variant="standard"
                  name="address"
                  value={member.member.address}
                ></TextField>
              </StyledTableCell>
              <StyledTableCell>
                <TextField
                  size="small"
                  variant="standard"
                  name="weight"
                  value={member.member.weight}
                ></TextField>
              </StyledTableCell>
              <StyledTableCell>
                <TextField
                  size="small"
                  variant="standard"
                  name="metadata"
                  value={member.member.metadata}
                ></TextField>
              </StyledTableCell>
              <StyledTableCell>
              <IconButton
                color="error"
                aria-label="remove member"
                onClick={() => props.toggleDrawer()}
                edge="start"
                sx={{
                  marginRight: 2,
                }}
        >
          <DeleteOutline />
        </IconButton>
        {
          index+1 === updatedmembers.length ?
          <IconButton
                color="primary"
                aria-label="add member"
                onClick={() => {
                  setUpdatedmembers([
                    ...updatedmembers,
                    {
                      member: {
                        address: "",
                        weight:0,
                        metadata: "",
                      }
                    }
                  ])
                }}
                edge="start"
                sx={{
                  marginRight: 2,
                }}
        >
          <AddOutlinedIcon />
        </IconButton>
        :
        null
        }
              </StyledTableCell>
            </TableRow>

          ))}
        </Table>
      </TableContainer>
    </Box>
    // <Box>
    //   <Box sx={{ textAlign: "right" }}>
    //     <Button
    //       disableElevation
    //       sx={{
    //         textTransform: "none",
    //       }}
    //       onClick={() => setShowForm(!showForm)}
    //       variant="contained"
    //     >
    //       Update Members
    //     </Button>
    //   </Box>
    //   <Box>
    //     {showForm ? (
    //       <Paper sx={{ p: 2 }} variant="outlined" elevation={0}>
    //         <Box sx={{ ml: 4 }}>
    //           {memberStatus?.status === "pending" ? (
    //             <CircularProgress />
    //           ) : (
    //             <UpdateGroupMemberForm
    //               handleCancel={() => {
    //                 setShowForm(false);
    //               }}
    //               handleUpdate={handleUpdate}
    //               members={members2}
    //             />
    //           )}
    //         </Box>
    //       </Paper>
    //     ) : null}
    //   </Box>
    // </Box>
  );
};

UpdateGroupMember.propTypes = {
  id: PropTypes.string.isRequired,
  wallet: PropTypes.object.isRequired,
  members: PropTypes.array.isRequired,
};

function Group() {
  const params = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const groupInfo = useSelector((state) => state.group.groupInfo);

  const membersInfo = useSelector((state) => state.group.groupMembers);
  const wallet = useSelector((state) => state.wallet);
  const { connected } = wallet;

  const dispatch = useDispatch();
  const getGroup = () => {
    dispatch(
      getGroupById({
        baseURL: wallet.chainInfo.config.rest,
        id: params.id,
      })
    );
  };

  const getMembers = () => {
    dispatch(
      getGroupMembersById({
        baseURL: wallet.chainInfo?.config?.rest,
        id: params.id,
        pagination: { limit: 100, key: "" },
      })
    );
  };

  useEffect(() => {
    if (connected && params?.id) {
      getGroup();
      getMembers();
    }
  }, [connected]);

  const groupInfoTabs = [
    {
      title: "Members",
      disabled: false,
    },
    {
      title: "Decision Policies",
      disabled: membersInfo.members.length === 0,
    },
    {
      title: "Active Proposals",
      disabled: membersInfo.members.length === 0,
    },
  ];

  const isAdmin = (address) => groupInfo?.data?.admin === address;

  const [showUpdateMembers, setShowUpdateMembers] = useState(false);

  return (
    <>
      {groupInfo.status === "idle" && groupInfo.data ? (
        <Box>
          <GroupInfo id={params?.id} wallet={wallet} />
          <Paper sx={{ mt: 2 }} elevation={0}>
            <GroupTab
              tabs={groupInfoTabs}
              handleTabChange={(i) => setTabIndex(i)}
            />
            <TabPanel value={tabIndex} index={0}>
              {membersInfo.members.length > 0 && isAdmin(wallet?.address) ? (
                <>
                  <Box
                    component="div"
                    sx={{
                      textAlign: "right",
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        textTransform: "none",
                      }}
                      disableElevation
                      size="small"
                      onClick={() => setShowUpdateMembers(!showUpdateMembers)}
                    >
                      Update members
                    </Button>
                  </Box>
                  {showUpdateMembers ? (
                    <UpdateGroupMember
                      id={params?.id}
                      wallet={wallet}
                      members={membersInfo.members}
                    />
                  ) : null}
                </>
              ) : null}
              {!showUpdateMembers ? (
                <GroupMembers id={params?.id} wallet={wallet} />
              ) : null}
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <GroupPolicies id={params?.id} wallet={wallet} />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              <ActiveProposals id={params?.id} wallet={wallet} />
            </TabPanel>
          </Paper>
        </Box>
      ) : null}
    </>
  );
}

export default Group;
