import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fee,
  signAndBroadcastAddGroupPolicy,
  signAndBroadcastGroupProposal,
  signAndBroadcastGroupProposalExecute,
  signAndBroadcastGroupProposalVote,
  signAndBroadcastLeaveGroup,
  signAndBroadcastUpdateGroupAdmin,
  signAndBroadcastUpdateGroupMembers,
  signAndBroadcastUpdateGroupPolicy,
  signAndBroadcastUpdateGroupPolicyAdmin,
  signAndBroadcastUpdateGroupPolicyMetadata,
} from "../../txns/execute";
import {
  CreateGroupPolicy,
  CreateGroupProposal,
  NewMsgLeaveGroup,
  CreateProposalExecute,
  CreateProposalVote,
  NewMsgCreateGroup,
  NewMsgCreateGroupWithPolicy,
  NewMsgUpdateGroupAdmin,
  UpdateGroupMembers,
  UpdateGroupMetadata,
  UpdateGroupPolicy,
  UpdatePolicyAdmin,
  UpdatePolicyMetadata,
} from "../../txns/group/group";
import { signAndBroadcast } from "../../utils/signing";
import {
  resetTxLoad,
  setError,
  setTxHash,
  setTxLoad,
} from "../common/commonSlice";
import groupService from "./groupService";
import cloneDeep from 'lodash/cloneDeep';

const initialState = {
  groupsData: {},
  defaultState: {
    txCreateGroupRes: {},
    tx: {
      status: "idle",
      type: "",
    },
    groups: {
      admin: {
        list: [],
        pagination: {},
        status: "idle",
      },
      member: {
        list: [],
        pagination: {},
        status: "idle",
      },
    },
    members: {
      data: [],
    },
    groupInfo: {
      status: "idle",
      data: {},
    },
    groupMembers: {
      status: "idle",
      members: [],
      pagination: {},
    },
    groupPolicies: {},
    groupProposalRes: {
      status: "",
      error: "",
    },
    proposals: {},
    voteRes: {},
    executeRes: {},
    updateGroupRes: {
      status: "idle",
    },
    leaveGroupRes: {},
    proposalVotes: {
      data: [],
    },
    groupProposal: {},
    updateGroupPolicyRes: {},
    updateGroupAdminRes: {},
    updateGroupMetadataRes: {},
    addGroupPolicyRes: {},
    addPolicyMetadataRes: {},
    updatePolicyAdminRes: {},
    policyProposals: {},
  }
};

export const getGroupsByAdmin = createAsyncThunk(
  "group/group-by-admin",
  async (data) => {
    const response = await groupService.groupsByAdmin(
      data.baseURL,
      data.admin,
      data.pagination
    );
    return {
      chainID: data.chainID,
      data: response.data
    };
  }
);

export const getGroupById = createAsyncThunk(
  "group/group-by-id",
  async (data) => {
    const response = await groupService.fetchGroupById(data.baseURL, data.id);
    return {
      chainID: data.chainID,
      data: response.data
    };
  }
);

export const getGroupMembersById = createAsyncThunk(
  "group/group-members-by-id",
  async (data) => {
    const response = await groupService.fetchGroupMembersById(
      data.baseURL,
      data.id,
      data.pagination
    );
    return {
      chainID: data.chainID,
      data: response.data
    };
  }
);

export const getVotesProposalById = createAsyncThunk(
  "group/group-proposal-votes",
  async (data) => {
    const response = await groupService.fetchVotesProposalById(
      data.baseURL,
      data.id,
      data.pagination
    );
    return {
      chainID: data.chainID,
      data: response.data
    };
  }
);

export const getGroupProposalById = createAsyncThunk(
  "group/group-proposal-info",
  async (data) => {
    const response = await groupService.fetchGroupProposalById(
      data.baseURL,
      data.id
    );
    return {
      chainID: data.chainID,
      data: response.data
    };
  }
);

export const getGroupPoliciesById = createAsyncThunk(
  "group/group-policies-by-id",
  async (data, { dispatch }) => {
    const response = await groupService.fetchGroupPoliciesById(
      data.baseURL,
      data.id,
      data.pagination
    );
    return {
      chainID: data.chainID,
      data: response.data
    };
  }
);

export const getGroupsByMember = createAsyncThunk(
  "group/group-by-member",
  async (data) => {
    const response = await groupService.groupsByMember(
      data.baseURL,
      data.address,
      data.pagination
    );
    return {
      chainID: data.chainID,
      data: response.data
    };
  }
);

export const getGroupMembers = createAsyncThunk(
  "group/get-group-members",
  async (data) => {
    const response = await groupService.groupMembers(
      data.baseURL,
      data.groupId
    );
    return {
      chainID: data.chainID,
      data: response.data
    };
  }
);

export const getGroupPolicyProposalsByPage = createAsyncThunk(
  "group/get-group-policy-proposals-by-page",
  async (data, { dispatch }) => {
    var totalData = [];
    var allPolicies = [];

    try {
      allPolicies = await groupService.fetchGroupPoliciesById(
        data.baseURL,
        data.groupId,
        data?.pagination
      );
    } catch (error) {
      throw error;
    }

    const getProposalsPagination = async (address, pagination) => {
      const response = await groupService.fetchGroupPolicyProposalsById(
        data.baseURL,
        address,
        pagination
      );

      let filteredProposals = response?.data?.proposals?.filter(
        (p) => p?.status === "PROPOSAL_STATUS_SUBMITTED"
      );

      totalData = [...totalData, ...filteredProposals];

      if (response?.data?.pagination?.next_key)
        return {
          chainID: data.chainID,
          data: getProposalsPagination(address, {
            limit: 1,
            key: response?.data?.pagination?.next_key,
          })
        }
      else return {
        chainID: data.chainID,
        data: totalData,
      };
    };

    if (allPolicies?.data?.group_policies?.length) {
      let data = allPolicies?.data?.group_policies || [];
      for (let i = 0; i < data.length; i++) {
        try {
          await getProposalsPagination(data[i]?.address, {
            limit: 1,
            key: "",
          });
        } catch (error) {
          throw error;
        }
      }

      return {
        chainID: data.chainID,
        data: totalData,
      };
    } else return {
      chainID: data.chainID,
      data: "",
    };
  }
);

export const getGroupPolicyProposals = createAsyncThunk(
  "group/get-group-policy-proposals",
  async (data, { dispatch }) => {
    const response = await groupService.fetchGroupPolicyProposalsById(
      data.baseURL,
      data.address,
      data.pagination
    );

    return {
      chainID: data.chainID,
      data: response.data
    };
  }
);

export const txGroupProposalVote = createAsyncThunk(
  "group/tx-group-proposal-vote",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    dispatch(setTxLoad());

    try {
      let msg = CreateProposalVote(
        data.proposalId,
        data.voter,
        data.option,
        data?.metadata || ""
      );


      const result = await signAndBroadcastGroupProposalVote(
        data.admin,
        [msg],
        fee(data.denom, data.feeAmount, 260000),
        data.chainId,
        data.rpc
      );

      dispatch(resetTxLoad());
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(resetTxLoad());

      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const txGroupProposalExecute = createAsyncThunk(
  "group/tx-group-proposal-execute",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    dispatch(setTxLoad());
    try {
      let msg = CreateProposalExecute(data.proposalId, data.executor);


      const result = await signAndBroadcastGroupProposalExecute(
        data.admin,
        [msg],
        fee(data.denom, data.feeAmount, 260000),
        data.chainId,
        data.rpc
      );

      dispatch(resetTxLoad());

      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(resetTxLoad());

      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const txUpdateGroupAdmin = createAsyncThunk(
  "group/tx-update-group-admin",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    dispatch(setTxLoad());

    try {
      const msg = NewMsgUpdateGroupAdmin(data.admin, data.groupId, data.newAdmin);

      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        [msg],
        260000,
        "",
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      dispatch(resetTxLoad());
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(resetTxLoad());

      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const txUpdateGroupMetadata = createAsyncThunk(
  "group/tx-update-group-metadata",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    dispatch(setTxLoad());

    try {
      const msg = UpdateGroupMetadata(data.admin, data.groupId, data.metadata);

      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        [msg],
        260000,
        "",
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      dispatch(resetTxLoad());
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(resetTxLoad());

      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const txCreateGroupProposal = createAsyncThunk(
  "group/tx-create-group-proposal",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    dispatch(setTxLoad());
    try {
      let msg = CreateGroupProposal(
        data.groupPolicyAddress,
        data.proposers,
        data.metadata,
        data.messages
      );

      const result = await signAndBroadcastGroupProposal(
        data.admin,
        [msg],
        fee(data.denom, data.feeAmount, 260000),
        data.chainId,
        data.rpc
      );
      dispatch(resetTxLoad());
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(resetTxLoad());

      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const txCreateGroup = createAsyncThunk(
  "group/tx-create-group",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    dispatch(setTxLoad());
    let msg;
    try {
      if (data?.members?.length > 0) {
          msg = NewMsgCreateGroupWithPolicy(
            data.admin,
            data.groupMetaData,
            data.members,
            data.policyData,
            {
              name: data.policyData?.name,
              description:  data.policyData?.description,
            },
            data?.policyData?.policyAsAdmin
          );
      } else {
        msg = NewMsgCreateGroup(data.admin, data.groupMetaData, []);
      }

      const result = await signAndBroadcast(
        data.chainId, 
        data.aminoConfig,
        data.prefix,
        [msg],
        260000,
        "",
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );

      dispatch(resetTxLoad());

      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(resetTxLoad());

      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const txUpdateGroupMember = createAsyncThunk(
  "group/tx-update-group-member",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    let msg;
    dispatch(setTxLoad());
    try {
      msg = UpdateGroupMembers(data.admin, data.members, data.groupId);


      const result = await signAndBroadcastUpdateGroupMembers(
        data.admin,
        [msg],
        fee(data.denom, data.feeAmount, 260000),
        data.chainId,
        data.rpc
      );

      dispatch(resetTxLoad());

      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(resetTxLoad());

      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const txAddGroupPolicy = createAsyncThunk(
  "group/tx-add-group-policy",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    let msg;
    dispatch(setTxLoad());
    try {
      msg = CreateGroupPolicy(data.admin, data.groupId, data.policyMetadata);

      const result = await signAndBroadcastAddGroupPolicy(
        data.admin,
        [msg],
        fee(data.denom, data.feeAmount, 260000),
        data.chainId,
        data.rpc
      );

      dispatch(resetTxLoad());

      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(resetTxLoad());

      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const txUpdateGroupPolicy = createAsyncThunk(
  "group/tx-update-group-policy",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    let msg;
    dispatch(setTxLoad());
    try {
      msg = UpdateGroupPolicy(
        data.admin,
        data.groupPolicyAddress,
        data.policyMetadata
      );


      const result = await signAndBroadcastUpdateGroupPolicy(
        data.admin,
        [msg],
        fee(data.denom, data.feeAmount, 260000),
        data.chainId,
        data.rpc
      );

      dispatch(resetTxLoad());

      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(resetTxLoad());

      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const txUpdateGroupPolicyMetdata = createAsyncThunk(
  "group/tx-update-group-policy-metadata",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    let msg;
    dispatch(setTxLoad());
    try {
      msg = UpdatePolicyMetadata(
        data.admin,
        data.groupPolicyAddress,
        data.metadata
      );


      const result = await signAndBroadcastUpdateGroupPolicyMetadata(
        data.admin,
        [msg],
        fee(data.denom, data.feeAmount, 260000),
        data.chainId,
        data.rpc
      );

      dispatch(resetTxLoad());

      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(resetTxLoad());

      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const txUpdateGroupPolicyAdmin = createAsyncThunk(
  "group/tx-update-group-policy-admin",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    let msg;
    dispatch(setTxLoad());
    try {
      msg = UpdatePolicyAdmin(
        data.admin,
        data.groupPolicyAddress,
        data.newAdmin
      );


      const result = await signAndBroadcastUpdateGroupPolicyAdmin(
        data.admin,
        [msg],
        fee(data.denom, data.feeAmount, 260000),
        data.chainId,
        data.rpc
      );

      dispatch(resetTxLoad());

      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(resetTxLoad());

      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const txLeaveGroupMember = createAsyncThunk(
  "group/tx-leave-group-member",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    dispatch(setTxLoad());
    try {
      const msg = NewMsgLeaveGroup(data.admin, data.groupId);

      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        [msg],
        260000,
        "",
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );

      dispatch(resetTxLoad());

      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(resetTxLoad());

      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    resetTxType: (state, _) => {
      state.tx.type = "";
    },
    resetGroupTx: (state, _) => {
      state.tx.status = "";
      state.txCreateGroupRes = {};
    },
    resetUpdateGroupMember: (state) => {
      state.updateGroupRes.status = "";
    },
    resetCreateGroupProposalRes: (state) => {
      state.groupProposalRes.status = "";
      state.groupProposalRes.error = "";
    },
    resetDefaultGroupsState: (state, action) => {
      const chainsMap = {};
      const chains = action?.payload;
      chains.map((chainId) => {
        chainsMap[chainId] = cloneDeep(initialState.defaultState)
      });
      state.groupsData = chainsMap;
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getGroupsByAdmin.pending, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].groups.admin.list = [];
        state.groupsData[chainID].groups.admin.status = "pending";
      })
      .addCase(getGroupsByAdmin.fulfilled, (state, action) => {
        const chainID = action?.payload?.chainID;
        state.groupsData[chainID].groups.admin.list = action?.payload?.data?.groups;
        state.groupsData[chainID].groups.admin.pagination = action?.payload?.data?.pagination;
        state.groupsData[chainID].groups.admin.status = "idle";
      })
      .addCase(getGroupsByAdmin.rejected, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].groups.admin.status = "idle";
        // TODO: handle error
      });

    builder
      .addCase(getGroupsByMember.pending, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].groups.member.status = "pending";
        state.groupsData[chainID].groups.member.list = [];
      })
      .addCase(getGroupsByMember.fulfilled, (state, action) => {
        const chainID = action?.payload?.chainID;
        state.groupsData[chainID].groups.member.list = action?.payload?.data?.groups;
        state.groupsData[chainID].groups.member.pagination = action?.payload?.data?.pagination;
        state.groupsData[chainID].groups.member.status = "idle";
      })
      .addCase(getGroupsByMember.rejected, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].groups.member.status = "idle";
        // TODO: handle error
      });

    builder
      .addCase(txCreateGroup.pending, (state) => {
        state.tx.status = `pending`;
        state.txCreateGroupRes.status = "pending";
      })
      .addCase(txCreateGroup.fulfilled, (state, _) => {
        state.tx.status = `idle`;
        state.txCreateGroupRes.status = "idle";
      })
      .addCase(txCreateGroup.rejected, (state, _) => {
        state.tx.status = `rejected`;
        state.txCreateGroupRes.status = "rejected";
      });

    builder
      .addCase(getGroupMembers.pending, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].members.status = `pending`;
      })
      .addCase(getGroupMembers.fulfilled, (state, action) => {
        const chainID = action?.payload?.chainID;
        state.groupsData[chainID].members.status = "idle";
        state.groupsData[chainID].members.data = [...state.members.data, action?.payload?.data];
      })
      .addCase(getGroupMembers.rejected, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].members.status = `rejected`;
      });

    builder
      .addCase(getGroupById.pending, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].groupInfo.status = `pending`;
      })
      .addCase(getGroupById.fulfilled, (state, action) => {
        const chainID = action?.payload?.chainID;
        state.groupsData[chainID].groupInfo.status = "idle";
        state.groupsData[chainID].groupInfo.data = action?.payload?.data?.info || {};
      })
      .addCase(getGroupById.rejected, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].groupInfo.status = `rejected`;
      });

    builder
      .addCase(getGroupMembersById.pending, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].groupMembers.status = `pending`;
      })
      .addCase(getGroupMembersById.fulfilled, (state, action) => {
        const chainID = action?.payload?.chainID;
        state.groupsData[chainID].groupMembers.status = "idle";
        state.groupsData[chainID].groupMembers.members = action?.payload?.data?.members || [];
        state.groupsData[chainID].groupMembers.pagination = action?.payload?.data?.pagination || {};
      })
      .addCase(getGroupMembersById.rejected, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].groupMembers.status = `rejected`;
      });

    builder
      .addCase(getGroupPoliciesById.pending, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].groupPolicies.status = `pending`;
      })
      .addCase(getGroupPoliciesById.fulfilled, (state, action) => {
        const chainID = action?.payload?.chainID;
        state.groupsData[chainID].groupPolicies.status = "idle";
        state.groupsData[chainID].groupPolicies.data = action?.payload?.data;
      })
      .addCase(getGroupPoliciesById.rejected, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].groupPolicies.status = `rejected`;
      });

    builder
      .addCase(getVotesProposalById.pending, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].proposalVotes.status = `pending`;
      })
      .addCase(getVotesProposalById.fulfilled, (state, action) => {
        const chainID = action?.payload?.chainID;
        state.groupsData[chainID].proposalVotes.status = "idle";
        state.groupsData[chainID].proposalVotes.data = action?.payload?.data;
      })
      .addCase(getVotesProposalById.rejected, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].proposalVotes.status = `rejected`;
      });

    builder
      .addCase(getGroupPolicyProposals.pending, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].proposals.status = `pending`;
      })
      .addCase(getGroupPolicyProposals.fulfilled, (state, action) => {
        const chainID = action?.payload?.chainID;
        state.groupsData[chainID].proposals.status = "idle";
        state.groupsData[chainID].proposals.data = action?.payload?.data;
      })
      .addCase(getGroupPolicyProposals.rejected, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].proposals.status = `rejected`;
      });

    builder
      .addCase(txCreateGroupProposal.pending, (state) => {
        state.groupProposalRes.status = `pending`;
      })
      .addCase(txCreateGroupProposal.fulfilled, (state, action) => {
        state.groupProposalRes.status = "idle";
      })
      .addCase(txCreateGroupProposal.rejected, (state, _) => {
        state.groupProposalRes.status = `rejected`;
        state.groupProposalRes.error = `rejected`;
      });

    builder
      .addCase(txGroupProposalVote.pending, (state) => {
        state.voteRes.status = `pending`;
      })
      .addCase(txGroupProposalVote.fulfilled, (state, action) => {
        state.voteRes.status = "idle";
      })
      .addCase(txGroupProposalVote.rejected, (state, _) => {
        state.voteRes.status = `rejected`;
      });

    builder
      .addCase(txGroupProposalExecute.pending, (state) => {
        state.executeRes.status = `pending`;
      })
      .addCase(txGroupProposalExecute.fulfilled, (state, action) => {
        state.executeRes.status = "idle";
      })
      .addCase(txGroupProposalExecute.rejected, (state, _) => {
        state.executeRes.status = `rejected`;
      });

    builder
      .addCase(txUpdateGroupMember.pending, (state) => {
        state.updateGroupRes.status = `pending`;
      })
      .addCase(txUpdateGroupMember.fulfilled, (state, action) => {
        state.updateGroupRes.status = "idle";
      })
      .addCase(txUpdateGroupMember.rejected, (state, _) => {
        state.updateGroupRes.status = `rejected`;
      });

    builder
      .addCase(txLeaveGroupMember.pending, (state) => {
        state.leaveGroupRes.status = `pending`;
      })
      .addCase(txLeaveGroupMember.fulfilled, (state, action) => {
        state.leaveGroupRes.status = "idle";
      })
      .addCase(txLeaveGroupMember.rejected, (state, _) => {
        state.leaveGroupRes.status = `rejected`;
      });

    builder
      .addCase(getGroupProposalById.pending, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].groupProposal.status = `pending`;
      })
      .addCase(getGroupProposalById.fulfilled, (state, action) => {
        const chainID = action?.payload?.chainID;
        state.groupsData[chainID].groupProposal.status = "idle";
        state.groupsData[chainID].groupProposal.data = action?.payload?.data;
      })
      .addCase(getGroupProposalById.rejected, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].groupProposal.status = `rejected`;
      });

    builder
      .addCase(txUpdateGroupPolicy.pending, (state) => {
        state.updateGroupPolicyRes.status = `pending`;
      })
      .addCase(txUpdateGroupPolicy.fulfilled, (state, action) => {
        state.updateGroupPolicyRes.status = "idle";
      })
      .addCase(txUpdateGroupPolicy.rejected, (state, _) => {
        state.updateGroupPolicyRes.status = `rejected`;
      });

    builder
      .addCase(txUpdateGroupAdmin.pending, (state) => {
        state.updateGroupAdminRes.status = `pending`;
      })
      .addCase(txUpdateGroupAdmin.fulfilled, (state, action) => {
        state.updateGroupAdminRes.status = "idle";
      })
      .addCase(txUpdateGroupAdmin.rejected, (state, _) => {
        state.updateGroupAdminRes.status = `rejected`;
      });

    builder
      .addCase(txUpdateGroupMetadata.pending, (state) => {
        state.updateGroupMetadataRes.status = `pending`;
      })
      .addCase(txUpdateGroupMetadata.fulfilled, (state, action) => {
        state.updateGroupMetadataRes.status = "idle";
      })
      .addCase(txUpdateGroupMetadata.rejected, (state, _) => {
        state.updateGroupMetadataRes.status = `rejected`;
      });

    builder
      .addCase(txAddGroupPolicy.pending, (state) => {
        state.addGroupPolicyRes.status = `pending`;
      })
      .addCase(txAddGroupPolicy.fulfilled, (state, action) => {
        state.addGroupPolicyRes.status = "idle";
      })
      .addCase(txAddGroupPolicy.rejected, (state, _) => {
        state.addGroupPolicyRes.status = `rejected`;
      });

    builder
      .addCase(txUpdateGroupPolicyMetdata.pending, (state) => {
        state.updateGroupMetadataRes.status = `pending`;
      })
      .addCase(txUpdateGroupPolicyMetdata.fulfilled, (state, action) => {
        state.updateGroupMetadataRes.status = "idle";
      })
      .addCase(txUpdateGroupPolicyMetdata.rejected, (state, _) => {
        state.updateGroupMetadataRes.status = `rejected`;
      });

    builder
      .addCase(txUpdateGroupPolicyAdmin.pending, (state) => {
        state.updatePolicyAdminRes.status = `pending`;
      })
      .addCase(txUpdateGroupPolicyAdmin.fulfilled, (state, action) => {
        state.updatePolicyAdminRes.status = "idle";
      })
      .addCase(txUpdateGroupPolicyAdmin.rejected, (state, _) => {
        state.updatePolicyAdminRes.status = `rejected`;
      });

    builder
      .addCase(getGroupPolicyProposalsByPage.pending, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].policyProposals.status = `pending`;
      })
      .addCase(getGroupPolicyProposalsByPage.fulfilled, (state, action) => {
        const chainID = action?.payload?.chainID;
        state.groupsData[chainID].policyProposals.status = "idle";
        state.groupsData[chainID].policyProposals.data = action?.payload;
      })
      .addCase(getGroupPolicyProposalsByPage.rejected, (state, action) => {
        const chainID = action?.meta?.arg?.chainID;
        state.groupsData[chainID].policyProposals.status = `rejected`;
      });
  },
});

export const {
  resetGroupTx,
  resetCreateGroupProposalRes,
  resetUpdateGroupMember,
  resetDefaultGroupsState,
} = groupSlice.actions;

export default groupSlice.reducer;
