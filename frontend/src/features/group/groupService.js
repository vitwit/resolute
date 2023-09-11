import Axios from 'axios';
import { convertPaginationToParams, convertPaginationToParamsOffset, getValidURL } from '../utils';

const groupByAdminURL = (admin) => `/cosmos/group/v1/groups_by_admin/${admin}`
const groupByMemberURL = (address) => `/cosmos/group/v1/groups_by_member/${address}`
const groupMembersURL = groupId => `/cosmos/group/v1/group_members/${groupId}`
const groupByIdURL = groupId => `/cosmos/group/v1/group_info/${groupId}`
const groupMembersByIdURL = groupId => `/cosmos/group/v1/group_members/${groupId}`
const groupPoliciesByIdURL = groupId => `/cosmos/group/v1/group_policies_by_group/${groupId}`
const groupPolicyProposalsURL = address => `/cosmos/group/v1/proposals_by_group_policy/${address}`
const votesPropsalURL = proposal_id => `/cosmos/group/v1/votes_by_proposal/${proposal_id}`
const GroupProposalURL = proposal_id => `/cosmos/group/v1/proposal/${proposal_id}`


const fetchGroupsByAdmin = (baseURL, admin, pagination) => {
    let uri = `${getValidURL(baseURL)}${groupByAdminURL(admin)}`
    const pageParams = convertPaginationToParamsOffset(pagination)
    if (pageParams !== "") uri += `?${pageParams}&pagination.count_total=true`

    return Axios.get(uri, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
}

const fetchGroupsByMember = (baseURL, address, pagination) => {
    let uri = `${getValidURL(baseURL)}${groupByMemberURL(address)}`
    const pageParams = convertPaginationToParamsOffset(pagination)
    if (pageParams !== "") uri += `?${pageParams}&pagination.count_total=true`

    return Axios.get(uri, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
}

const fetchGroupMembers = (baseURL, groupId, pagination) => {
    let uri = `${getValidURL(baseURL)}${groupMembersURL(groupId)}`
    const pageParams = convertPaginationToParams(pagination)
    if (pageParams !== "") uri += `?${pageParams}`

    return Axios.get(uri, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
}

const fetchGroupById = (baseURL, groupId) => {
    let uri = `${getValidURL(baseURL)}${groupByIdURL(groupId)}`

    return Axios.get(uri, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
}

const fetchGroupMembersById = (baseURL, groupId, pagination) => {
    let uri = `${getValidURL(baseURL)}${groupMembersByIdURL(groupId)}`
    const pageParams = convertPaginationToParams(pagination)
    if (pageParams !== "") uri += `?${pageParams}&pagination.count_total=true`

    return Axios.get(uri, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
}

const fetchVotesProposalById = (baseURL, proposalId, pagination) => {
    let uri = `${getValidURL(baseURL)}${votesPropsalURL(proposalId)}`
    const pageParams = convertPaginationToParams(pagination)
    if (pageParams !== "") uri += `?${pageParams}&pagination.count_total=true`

    return Axios.get(uri, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
}

const fetchGroupPoliciesById = (baseURL, groupId, pagination) => {
    let uri = `${getValidURL(baseURL)}${groupPoliciesByIdURL(groupId)}`
    const pageParams = convertPaginationToParams(pagination)
    if (pageParams !== "") uri += `?${pageParams}&pagination.count_total=true`

    return Axios.get(uri, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
}


const fetchGroupPolicyProposalsById = (baseURL, address, pagination) => {
    let uri = `${getValidURL(baseURL)}${groupPolicyProposalsURL(address)}`
    const pageParams = convertPaginationToParams(pagination)
    if (pageParams !== "") uri += `?${pageParams}&pagination.count_total=true`

    return Axios.get(uri, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
}

const fetchGroupProposalById = (baseURL, id) => {
    let uri = `${getValidURL(baseURL)}${GroupProposalURL(id)}`

    return Axios.get(uri, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
}



const result = {
    groupsByAdmin: fetchGroupsByAdmin,
    groupsByMember: fetchGroupsByMember,
    groupMembers: fetchGroupMembers,
    fetchGroupById: fetchGroupById,
    fetchGroupMembersById: fetchGroupMembersById,
    fetchGroupPoliciesById: fetchGroupPoliciesById,
    fetchGroupPolicyProposalsById,
    fetchVotesProposalById,
    fetchGroupProposalById,
}

export default result;