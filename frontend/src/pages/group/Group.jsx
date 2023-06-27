import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
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
import CreateGroupPolicy from "./CreateGroupPolicy";
import GroupTab, { TabPanel } from "../../components/group/GroupTab";
import GroupInfo from "./GroupInfo";
import ActiveProposals from "./ActiveProposals";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { NoData } from "../../components/group/NoData";
import { StyledTableCell } from "../../components/CustomTable";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { DAYS, PERCENTAGE } from "./common";

const GroupPolicies = ({ id, chainInfo, chainID }) => {
  const LIMIT = 100;
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);

  const groupDetails = useSelector((state) => state.group.groupInfo?.[chainID]);
  const { data: groupInformation } = groupDetails;

  const addPolicyRes = useSelector((state) => state.group.addGroupPolicyRes);

  const groupMembers = useSelector((state) => state.group.groupMembers?.[chainID]);

  useEffect(() => {
    if (addPolicyRes?.status === "idle") {
      getPolicies();
      setShowForm(false);
    }
  }, [addPolicyRes?.status]);

  const getPolicies = () => {
    dispatch(
      getGroupPoliciesById({
        baseURL: chainInfo?.config?.rest,
        id: id,
        pagination: { limit: LIMIT, key: "" },
        chainID: chainID,
      })
    );
  };
  useEffect(() => {
    getPolicies();
  }, []);

  let groupPolicies = [];
  const groupInfo = useSelector((state) => state.group?.groupPolicies?.[chainID]);
  const data = groupInfo?.data;
  const status = groupInfo?.status;

  if (data) {
    groupPolicies = data?.group_policies;
  }

  const handlePolicy = (data) => {
    const dataObj = {
      admin: groupInformation?.admin,
      groupId: id,
      policyMetadata: data?.policyMetadata,
      denom: chainInfo?.config?.currencies?.[0]?.coinMinimalDenom,
      chainId: chainInfo.config.chainId,
      rpc: chainInfo.config.rpc,
      feeAmount: chainInfo.config.gasPriceStep.average,
    };

    if (
      data.policyMetadata.percentage !== 0 ||
      data.policyMetadata.threshold !== 0
    ) {
      const getPeriod = (duration, period) => {
        let time;
        if (duration === DAYS) time = 24 * 60 * 60;
        else if (duration === "Hours") time = 60 * 60;
        else if (duration === "Minutes") time = 60;
        else time = 1;

        time = time * Number(period);
        return time;
      };

      if (data?.policyMetadata) {
        dataObj["policyMetadata"] = {
          ...data.policyMetadata,
          minExecPeriod: getPeriod(
            data.policyMetadata?.minExecPeriodDuration,
            data.policyMetadata?.minExecPeriod
          ),
          votingPeriod: getPeriod(
            data.policyMetadata?.votingPeriodDuration,
            data.policyMetadata?.votingPeriod
          ),
        };
      }

      if (dataObj?.policyMetadata?.decisionPolicy === PERCENTAGE) {
        dataObj.policyMetadata.percentage =
          Number(dataObj.policyMetadata.percentage) / 100.0;
      }
    }
    dispatch(txAddGroupPolicy(dataObj));
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      policyMetadata: {
        name: "",
        description: "",
        decisionPolicy: PERCENTAGE,
        percentage: 1,
        threshold: 1,
        policyAsAdmin: false,
        minExecPeriodDuration: DAYS,
        votingPeriodDuration: DAYS,
      },
    },
  });

  useEffect(() => {
    setValue("policyMetadata.decisionPolicy", PERCENTAGE);
    setValue("policyMetadata.votingPeriodDuration", DAYS);
    setValue("policyMetadata.minExecPeriodDuration", DAYS);
  }, []);

  return (
    <Box sx={{ flexGrow: 1, textAlign: "center" }}>
      <Box
        sx={{
          textAlign: "right",
        }}
      >
        {showForm ? (
          <Button
            variant="outlined"
            onClick={() => {
              setShowForm(!showForm);
            }}
            disableElevation
            sx={{
              textTransform: "none",
            }}
            size="small"
            color="error"
          >
            Cancel
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => {
              setShowForm(!showForm);
            }}
            disableElevation
            sx={{
              textTransform: "none",
            }}
            size="small"
          >
            Attach Policy
          </Button>
        )}
      </Box>
      {showForm && (
        <Card
          sx={{
            p: 2,
            mt: 1,
          }}
          elevation={0}
        >
          <form onSubmit={handleSubmit(handlePolicy)}>
            <CreateGroupPolicy
              control={control}
              register={register}
              watch={watch}
              errors={errors}
              handleCancelPolicy={() => setShowForm(false)}
              members={groupMembers?.members?.map((m) => m?.member) || []}
              setValue={setValue}
              getValues={getValues}
            />
            <Box sx={{ p: 2 }}>
              <Button
                disabled={addPolicyRes?.status === "pending"}
                type="submit"
                variant="outlined"
                color="primary"
                disableElevation
              >
                {addPolicyRes?.status === "pending" ? "Loading..." : "Add"}
              </Button>
            </Box>
          </form>
        </Card>
      )}

      <Box
        sx={{
          textAlign: "center",
          mt: 2,
        }}
      >
        {status === "pending" ? <CircularProgress /> : null}
        {status !== "pending" && !showForm && !groupPolicies?.length && (
          <NoData
            title="No policies found"
            showAction={true}
            onAction={() => {
              setShowForm(!showForm);
            }}
            actionText="Attach policy"
          />
        )}
      </Box>

      {status !== "pending" && groupPolicies?.length > 0 && !showForm ? (
        <Grid
          container
          spacing={2}
          sx={{
            mt: 2,
          }}
        >
          {groupPolicies.map((p, index) => (
            <Grid item md={4} xs={12} sm={12} lg={4} xl={3} key={index}>
              <PolicyCard obj={p} />
            </Grid>
          ))}
        </Grid>
      ) : null}
    </Box>
  );
};

const GroupMembers = (props) => {
  const { id, isAdmin, onAddMembers, chainInfo, chainID } = props;

  const dispatch = useDispatch();

  const getGroupmembers = () => {
    dispatch(
      getGroupMembersById({
        baseURL: chainInfo?.config?.rest,
        id: id,
        pagination: { limit: 100, key: "" },
        chainID: chainID,
      })
    );
  };

  const updateGroupRes = useSelector((state) => state.group?.updateGroupRes);
  useEffect(() => {
    dispatch(resetUpdateGroupMember());
    getGroupmembers();
  }, [updateGroupRes?.status]);

  const membersInfo = useSelector((state) => state.group.groupMembers?.[chainID]);
  const { members, pagination, status } = membersInfo;

  return (
    <Box sx={{ flexGrow: 1 }}>
      {status === "pending" ? <CircularProgress /> : null}
      {status === "idle" && members.length === 0 ? (
        <NoData
          title="No members found"
          showAction={isAdmin}
          onAction={() => {
            onAddMembers();
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
  isAdmin: PropTypes.bool.isRequired,
  onAddMembers: PropTypes.func.isRequired,
};

const UpdateGroupMember = (props) => {
  const { id, members, onCancel, chainInfo, address } = props;
  const updateRes = useSelector((state) => state.group.updateGroupRes);

  useEffect(() => {
    if (updateRes?.status === "idle") {
      onCancel();
    }
  }, [updateRes]);

  useEffect(() => {
    return () => {
      dispatch(resetUpdateGroupMember());
    };
  }, []);

  const [removedMembers, setRemovedMembers] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    trigger,
    setError,
  } = useForm({
    defaultValues: {
      members:
        members.length > 0
          ? members.map((m) => ({
              ...m.member,
              disabled: true,
            }))
          : [
              {
                address: "",
                weight: "0",
                metadata: "",
              },
            ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const dispatch = useDispatch();
  const handleUpdate = (allMembers) => {
    let membersMap = {};
    for (let i = 0; i < members.length; i++) {
      membersMap[members[i].member.address] = {
        ...members[i].member,
      };
    }

    let result = [];
    for (let i = 0; i < allMembers.members.length; i++) {
      let m = allMembers.members[i];
      if (membersMap[m.address]) {
        let temp = membersMap[m.address];
        if (temp.weight === m.weight && temp.metadata === m.metadata) {
          continue;
        } else {
          result.push(allMembers.members[i]);
        }
      } else {
        result.push(allMembers.members[i]);
      }
    }

    for (let i = 0; i < removedMembers.length; i++) {
      let member = {
        ...removedMembers[i],
      };
      member.weight = "0";
      result.push(member);
    }

    const dataObj = {
      admin: address,
      groupId: id,
      members: result,
      denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
      chainId: chainInfo.config.chainId,
      rpc: chainInfo.config.rpc,
      feeAmount: chainInfo.config.gasPriceStep.average,
    };

    dispatch(txUpdateGroupMember(dataObj));
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(handleUpdate)}>
        <Box
          sx={{
            textAlign: "right",
          }}
        >
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              mr: 1,
            }}
            size="small"
            disableElevation
            type="submit"
          >
            Update
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{
              textTransform: "none",
            }}
            disableElevation
            onClick={() => onCancel()}
          >
            Cancel
          </Button>
        </Box>
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

            {fields.map((item, index) => {
              return (
                <TableRow component="div" key={item.id}>
                  <StyledTableCell component="div" key={item.id}>
                    <Controller
                      name={`members[${index}].address`}
                      control={control}
                      rules={{ required: "Address is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          variant="standard"
                          name="address"
                          disabled={item.disabled}
                          fullWidth
                        />
                      )}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Controller
                      name={`members[${index}].weight`}
                      control={control}
                      rules={{
                        min: 1,
                        required: "Weight is required",
                      }}
                      render={({ field }) => (
                        <TextField
                          type={"number"}
                          {...field}
                          required
                          variant="standard"
                          name="weight"
                          fullWidth
                        />
                      )}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Controller
                      name={`members[${index}].metadata`}
                      control={control}
                      rules={{ required: "Metadata is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          multiline
                          name="metadata"
                          variant="standard"
                          fullWidth
                        />
                      )}
                    />
                  </StyledTableCell>

                  <StyledTableCell>
                    {fields.length > 1 ? (
                      <IconButton
                        onClick={() => {
                          setRemovedMembers([...removedMembers, item]);
                          remove(index);
                        }}
                        color="error"
                      >
                        <DeleteOutline />
                      </IconButton>
                    ) : null}
                    {index === fields.length - 1 ? (
                      <IconButton
                        onClick={() => {
                          append({ address: "", metadata: "", weight: 0 });
                        }}
                        color="primary"
                      >
                        <AddIcon />
                      </IconButton>
                    ) : null}
                  </StyledTableCell>
                </TableRow>
              );
            })}
          </Table>
        </TableContainer>
      </form>
    </Box>
  );
};

UpdateGroupMember.propTypes = {
  id: PropTypes.string.isRequired,
  wallet: PropTypes.object.isRequired,
  members: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
};

function Group() {
  const params = useParams();
  const [tabIndex, setTabIndex] = useState(0);

  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const [currentNetwork, setCurrentNetwork] = useState(
    params?.networkName || selectedNetwork.toLowerCase()
  );
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const chainID = nameToChainIDs[currentNetwork];
  const address =
    networks[chainID]?.walletInfo.bech32Address;

  const chainInfo = networks[chainID]?.network;

  const membersInfo = useSelector((state) => state.group.groupMembers?.[chainID]);
  const groupInfo = useSelector((state) => state.group.groupInfo?.[chainID]);
  const wallet = useSelector((state) => state.wallet);
  const { connected } = wallet;

  const dispatch = useDispatch();
  const getGroup = () => {
    dispatch(
      getGroupById({
        baseURL: chainInfo?.config?.rest,
        id: params.id,
        chainID: chainID,
      })
    );
  };

  const getMembers = () => {
    dispatch(
      getGroupMembersById({
        baseURL: chainInfo?.config?.rest,
        id: params.id,
        pagination: { limit: 100, key: "" },
        chainID: chainID,
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
      disabled: membersInfo?.members?.length === 0,
    },
    {
      title: "Active Proposals",
      disabled: membersInfo?.members?.length === 0,
    },
  ];

  const isAdmin = (address) => groupInfo?.data?.admin === address;

  const [showUpdateMembers, setShowUpdateMembers] = useState(false);

  return (
    <>
      {groupInfo?.status === "idle" && groupInfo?.data ? (
        <Box>
          <GroupInfo
            id={params?.id}
            chainInfo={chainInfo}
            address={address}
            chainID={chainID}
          />
          <Paper sx={{ mt: 2 }} elevation={0}>
            <GroupTab
              tabs={groupInfoTabs}
              handleTabChange={(i) => setTabIndex(i)}
            />
            <TabPanel value={tabIndex} index={0}>
              {isAdmin(address) ? (
                <>
                  <Box
                    component="div"
                    sx={{
                      textAlign: "right",
                    }}
                  >
                    {!showUpdateMembers && membersInfo?.members?.length > 0 ? (
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
                    ) : null}
                  </Box>
                  {showUpdateMembers ? (
                    <UpdateGroupMember
                      id={params?.id}
                      members={membersInfo.members}
                      chainInfo={chainInfo}
                      address={address}
                      onCancel={() => setShowUpdateMembers(!showUpdateMembers)}
                    />
                  ) : null}
                </>
              ) : null}
              {!showUpdateMembers ? (
                <GroupMembers
                  id={params?.id}
                  wallet={wallet}
                  chainInfo={chainInfo}
                  isAdmin={isAdmin(address)}
                  onAddMembers={() => setShowUpdateMembers(true)}
                  chainID={chainID}
                />
              ) : null}
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <GroupPolicies id={params?.id} chainInfo={chainInfo} chainID={chainID} />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              <ActiveProposals id={params?.id} wallet={wallet} chainInfo={chainInfo} chainID={chainID} />
            </TabPanel>
          </Paper>
        </Box>
      ) : null}
    </>
  );
}

export default Group;
