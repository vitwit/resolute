import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fee, signAndBroadcastGroupMsg, signAndBroadcastGroupProposal, signAndBroadcastGroupProposalExecute, signAndBroadcastGroupProposalVote, signAndBroadcastLeaveGroup, signAndBroadcastProto, signAndBroadcastUpdateGroupMembers } from "../../txns/execute";
import { CreateGroup, CreateGroupProposal, CreateGroupWithPolicy, CreateLeaveGroupMember, CreateProposalExecute, CreateProposalVote, UpdateGroupMembers } from "../../txns/group/group";
import { setError, setTxHash } from "../common/commonSlice";
import groupService from "./groupService";

const initialState = {
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
    data: []
  },
  groupInfo: {
  },
  groupMembers: {},
  groupPolicies: {},
  groupProposalRes: {},
  proposals: {},
  voteRes: {},
  executeRes: {},
  updateGroupRes: {},
  leaveGroupRes: {},
  proposalVotes: {
    data: []
  },
  groupProposal: {},
};

export const getGroupsByAdmin = createAsyncThunk(
  "group/group-by-admin",
  async (data) => {
    const response = await groupService.groupsByAdmin(
      data.baseURL,
      data.admin,
      data.pagination
    );
    return response.data;
  }
);

export const getGroupById = createAsyncThunk(
  "group/group-by-id",
  async (data) => {
    const response = await groupService.fetchGroupById(
      data.baseURL, data.id
    );
    return response.data;
  }
);

export const getGroupMembersById = createAsyncThunk(
  "group/group-members-by-id",
  async (data) => {
    const response = await groupService.fetchGroupMembersById(
      data.baseURL, data.id, data.pagination
    );
    return response.data;
  }
);

export const getVotesProposalById = createAsyncThunk(
  "group/group-proposal-votes",
  async (data) => {
    const response = await groupService.fetchVotesProposalById(
      data.baseURL, data.id, data.pagination
    );
    return response.data;
  }
);

export const getGroupProposalById = createAsyncThunk(
  "group/group-proposal-info",
  async (data) => {
    const response = await groupService.fetchGroupProposalById(
      data.baseURL, data.id
    );
    return response.data;
  }
);

export const getGroupPoliciesById = createAsyncThunk(
  "group/group-policies-by-id",
  async (data) => {
    const response = await groupService.fetchGroupPoliciesById(
      data.baseURL, data.id, data.pagination
    );
    return response.data;
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
    return response.data;
  }
);

export const getGroupMembers = createAsyncThunk(
  "group/get-group-members",
  async (data) => {
    const response = await groupService.groupMembers(data.baseURL, data.groupId);
    return response.data;
  }
)

export const getGroupPolicyProposals = createAsyncThunk(
  "group/get-group-policy-proposals",
  async (data) => {
    const response = await groupService.fetchGroupPolicyProposalsById(
      data.baseURL, data.address,
      data.pagination
    );
    return response.data;
  }
)

export const txGroupProposalVote = createAsyncThunk(
  'group/tx-group-proposal-vote',
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      let msg = CreateProposalVote(
        data.proposalId,
        data.voter,
        data.option,
        data?.metadata || '',
      )

      console.log('msg----', msg)

      const result = await signAndBroadcastGroupProposalVote(
        data.admin,
        [msg],
        fee(data.denom, data.feeAmount, 260000),
        data.chainId,
        data.rpc
      );
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        console.log('Error while creating propsoal', result?.rawLog)
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      console.log('Error while creating the group proposal', error.message)
      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
)

export const txGroupProposalExecute = createAsyncThunk(
  'group/tx-group-proposal-execute',
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      let msg = CreateProposalExecute(
        data.proposalId,
        data.executor
      )

      console.log('msg----', msg)

      const result = await signAndBroadcastGroupProposalExecute(
        data.admin,
        [msg],
        fee(data.denom, data.feeAmount, 260000),
        data.chainId,
        data.rpc
      );
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        console.log('Error while creating propsoal', result?.rawLog)
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      console.log('Error while creating the group proposal', error.message)
      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
)

export const txCreateGroupProposal = createAsyncThunk(
  'group/tx-create-group-proposal',
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      let msg = CreateGroupProposal(
        data.groupPolicyAddress,
        data.proposers,
        data.metadata,
        data.messages,
      )

      console.log('msg----', msg)

      const result = await signAndBroadcastGroupProposal(
        data.admin,
        [msg],
        fee(data.denom, data.feeAmount, 260000),
        data.chainId,
        data.rpc
      );
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        console.log('Error while creating propsoal', result?.rawLog)
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      console.log('Error while creating the group proposal', error.message)
      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
)

export const txCreateGroup = createAsyncThunk(
  "group/tx-create-group",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    let msg;
    console.log({ data })
    try {
      if (data.members.length > 0) {
        if (data.policyData) {
          msg = CreateGroupWithPolicy(
            data.admin,
            data.groupMetaData,
            data.members,
            data.decisionPolicy,
            data.policyData,
            data.policyAsAdmin
          );
        }
        // msg = CreateGroup(data.admin, data.groupMetaData, data.members);
      } else {
        msg = CreateGroup(data.admin, data.groupMetaData, []);
      }

      const result = await signAndBroadcastGroupMsg(
        data.admin,
        [msg],
        fee(data.denom, data.feeAmount, 260000),
        data.chainId,
        data.rpc
      );
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
      console.log('Error while creating the group', error.message)
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
    console.log({ data })
    try {
      msg = UpdateGroupMembers(
        data.admin,
        data.members,
        data.groupId
      );

      const result = await signAndBroadcastUpdateGroupMembers(
        data.admin,
        [msg],
        fee(data.denom, data.feeAmount, 260000),
        data.chainId,
        data.rpc
      );
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        console.log('Error while creating the group', result?.rawLog)
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      console.log('Error while creating the group', error.message)
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
    let msg;
    console.log({ data })
    try {
      msg = CreateLeaveGroupMember(
        data.admin,
        data.groupId
      );

      const result = await signAndBroadcastLeaveGroup(
        data.admin,
        [msg],
        fee(data.denom, data.feeAmount, 260000),
        data.chainId,
        data.rpc
      );
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        console.log('Error while creating the group', result?.rawLog)
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      console.log('Error while creating the group', error.message)
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
      state.tx.status = '';
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getGroupsByAdmin.pending, (state) => {
        state.groups.admin.list = [];
        state.groups.admin.status = "pending";
      })
      .addCase(getGroupsByAdmin.fulfilled, (state, action) => {
        state.groups.admin.list = action.payload.groups;
        state.groups.admin.pagination = action.payload.pagination;
        state.groups.admin.status = "idle";
      })
      .addCase(getGroupsByAdmin.rejected, (state, action) => {
        state.groups.admin.status = "idle";
        console.log(action.error);
        // TODO: handle error
      });

    builder
      .addCase(getGroupsByMember.pending, (state) => {
        state.groups.member.status = "pending";
        state.groups.member.list = [];
      })
      .addCase(getGroupsByMember.fulfilled, (state, action) => {
        state.groups.member.list = action.payload.groups;
        state.groups.member.pagination = action.payload.pagination;
        state.groups.member.status = "idle";
      })
      .addCase(getGroupsByMember.rejected, (state, action) => {
        console.log(action.error);
        state.groups.member.status = "idle";
        // TODO: handle error
      });

    builder
      .addCase(txCreateGroup.pending, (state) => {
        state.tx.status = `pending`;
      })
      .addCase(txCreateGroup.fulfilled, (state, _) => {
        state.tx.status = `idle`;
      })
      .addCase(txCreateGroup.rejected, (state, _) => {
        state.tx.status = `rejected`;
      });

    builder
      .addCase(getGroupMembers.pending, (state) => {
        state.members.status = `pending`;
      })
      .addCase(getGroupMembers.fulfilled, (state, action) => {
        state.members.status = 'idle';
        console.log('action paydddddddd', action.payload)
        state.members.data = [...state.members.data, action.payload]
      })
      .addCase(getGroupMembers.rejected, (state, _) => {
        state.members.status = `rejected`;
      });

    builder
      .addCase(getGroupById.pending, (state) => {
        state.groupInfo.status = `pending`;
      })
      .addCase(getGroupById.fulfilled, (state, action) => {
        console.log('fffffffff', action.payload)
        state.groupInfo.status = 'idle';
        state.groupInfo.data = action.payload
      })
      .addCase(getGroupById.rejected, (state, _) => {
        state.groupInfo.status = `rejected`;
      });

    builder
      .addCase(getGroupMembersById.pending, (state) => {
        state.groupMembers.status = `pending`;
      })
      .addCase(getGroupMembersById.fulfilled, (state, action) => {
        state.groupMembers.status = 'idle';
        state.groupMembers.data = action.payload
      })
      .addCase(getGroupMembersById.rejected, (state, _) => {
        state.groupMembers.status = `rejected`;
      });

    builder
      .addCase(getGroupPoliciesById.pending, (state) => {
        state.groupPolicies.status = `pending`;
      })
      .addCase(getGroupPoliciesById.fulfilled, (state, action) => {
        state.groupPolicies.status = 'idle';
        state.groupPolicies.data = action.payload
      })
      .addCase(getGroupPoliciesById.rejected, (state, _) => {
        state.groupPolicies.status = `rejected`;
      });

    builder
      .addCase(getVotesProposalById.pending, (state) => {
        state.proposalVotes.status = `pending`;
      })
      .addCase(getVotesProposalById.fulfilled, (state, action) => {
        state.proposalVotes.status = 'idle';
        state.proposalVotes.data = action.payload
      })
      .addCase(getVotesProposalById.rejected, (state, _) => {
        state.proposalVotes.status = `rejected`;
      });

    builder
      .addCase(getGroupPolicyProposals.pending, (state) => {
        state.proposals.status = `pending`;
      })
      .addCase(getGroupPolicyProposals.fulfilled, (state, action) => {
        state.proposals.status = 'idle';
        state.proposals.data = action.payload
      })
      .addCase(getGroupPolicyProposals.rejected, (state, _) => {
        state.proposals.status = `rejected`;
      });

    builder
      .addCase(txCreateGroupProposal.pending, (state) => {
        state.groupProposalRes.status = `pending`;
      })
      .addCase(txCreateGroupProposal.fulfilled, (state, action) => {
        state.groupProposalRes.status = 'idle';
      })
      .addCase(txCreateGroupProposal.rejected, (state, _) => {
        state.groupProposalRes.status = `rejected`;
      });

    builder
      .addCase(txGroupProposalVote.pending, (state) => {
        state.voteRes.status = `pending`;
      })
      .addCase(txGroupProposalVote.fulfilled, (state, action) => {
        state.voteRes.status = 'idle';
      })
      .addCase(txGroupProposalVote.rejected, (state, _) => {
        state.voteRes.status = `rejected`;
      });

    builder
      .addCase(txGroupProposalExecute.pending, (state) => {
        state.executeRes.status = `pending`;
      })
      .addCase(txGroupProposalExecute.fulfilled, (state, action) => {
        state.executeRes.status = 'idle';
      })
      .addCase(txGroupProposalExecute.rejected, (state, _) => {
        state.executeRes.status = `rejected`;
      });

    builder
      .addCase(txUpdateGroupMember.pending, (state) => {
        state.updateGroupRes.status = `pending`;
      })
      .addCase(txUpdateGroupMember.fulfilled, (state, action) => {
        state.updateGroupRes.status = 'idle';
      })
      .addCase(txUpdateGroupMember.rejected, (state, _) => {
        state.updateGroupRes.status = `rejected`;
      });

    builder
      .addCase(txLeaveGroupMember.pending, (state) => {
        state.leaveGroupRes.status = `pending`;
      })
      .addCase(txLeaveGroupMember.fulfilled, (state, action) => {
        state.leaveGroupRes.status = 'idle';
      })
      .addCase(txLeaveGroupMember.rejected, (state, _) => {
        state.leaveGroupRes.status = `rejected`;
      });

    builder
      .addCase(getGroupProposalById.pending, (state) => {
        state.groupProposal.status = `pending`;
      })
      .addCase(getGroupProposalById.fulfilled, (state, action) => {
        state.groupProposal.status = 'idle';
        state.groupProposal.data = action.payload;
      })
      .addCase(getGroupProposalById.rejected, (state, _) => {
        state.groupProposal.status = `rejected`;
      });
  },
});

export const { resetGroupTx } = groupSlice.actions;

export default groupSlice.reducer;
