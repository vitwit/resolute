package query

import (
	cryptotypes "github.com/cosmos/cosmos-sdk/crypto/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	authTypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	feegrantTypes "github.com/cosmos/cosmos-sdk/x/feegrant"
	"github.com/cosmos/cosmos-sdk/x/gov/types"
	govTypes "github.com/cosmos/cosmos-sdk/x/gov/types"
	slashingTypes "github.com/cosmos/cosmos-sdk/x/slashing/types"
	stakingTypes "github.com/cosmos/cosmos-sdk/x/staking/types"
	"github.com/vitwit/resolute/client"
)

type Query struct {
	Client  *client.ChainClient
	Options *QueryOptions
}

// Staking queries

// Delegation returns the delegations to a particular validator
func (q *Query) Delegation(delegator, validator string) (*stakingTypes.DelegationResponse, error) {
	/// TODO: In the future have some logic to route the query to the appropriate client (gRPC or RPC)
	return DelegationRPC(q, delegator, validator)
}

// Delegations returns all the delegations
func (q *Query) Delegations(delegator string) (*stakingTypes.QueryDelegatorDelegationsResponse, error) {
	/// TODO: In the future have some logic to route the query to the appropriate client (gRPC or RPC)
	return DelegationsRPC(q, delegator)
}

// ValidatorDelegations returns all the delegations for a validator
func (q *Query) ValidatorDelegations(validator string) (*stakingTypes.QueryValidatorDelegationsResponse, error) {
	/// TODO: In the future have some logic to route the query to the appropriate client (gRPC or RPC)
	return ValidatorDelegationssRPC(q, validator)
}

func (q *Query) UnbondDelegation(delegator string, validator string) (*stakingTypes.QueryUnbondingDelegationResponse, error) {
	return UnbondDelegationRPC(q, delegator, validator)
}

func (q *Query) UnbondDelegations(delegator string) (*stakingTypes.QueryDelegatorUnbondingDelegationsResponse, error) {
	return UnbondingDelegationsRPC(q, delegator)
}

func (q *Query) Redelegation(delegator string, valSrcAddr string, valDstAddr string) (*stakingTypes.QueryRedelegationsResponse, error) {
	return RedelegationRPC(q, delegator, valSrcAddr, valDstAddr)
}

func (q *Query) Redelegations(delegator string) (*stakingTypes.QueryRedelegationsResponse, error) {
	return RedelegationsRPC(q, delegator)
}

func (q *Query) FeegrantGrant(granter string, grantee string) (*feegrantTypes.QueryAllowanceResponse, error) {
	return FeegrantGrantRPC(q, granter, grantee)
}

func (q *Query) FeeGrantsByGrantee(grantee string) (*feegrantTypes.QueryAllowancesResponse, error) {
	return FeeGrantsByGranteeRPC(q, grantee)
}

// func (q *Query) FeeGrantsByGranter(granter string) (*feegrantTypes.QueryAllowancesByGranterResponse, error) {

// }

func (q *Query) QueryAccount(key string) (*authTypes.QueryAccountResponse, error) {
	return QueryAccountRPC(q, key)
}

func (q *Query) QueryAccounts() (*authTypes.QueryAccountsResponse, error) {
	return QueryAccountsRPC(q)
}

func (q *Query) QueryAuthParams() (*authTypes.QueryParamsResponse, error) {
	return QueryParamsRPC(q)
}

func (q *Query) QueryGovProposal(proposalId uint64) (*govTypes.QueryProposalResponse, error) {
	return QueryGovProposalRPC(q, proposalId)
}

func (q *Query) QueryGovProposals(proposalStatus types.ProposalStatus, voter string, depositor string) (*govTypes.QueryProposalsResponse, error) {
	return QueryGovProposalsRPC(q, proposalStatus, voter, depositor)
}

func (q *Query) QueryGovVote(proposalID uint64, voter sdk.AccAddress) (*govTypes.QueryVoteResponse, error) {
	return QueryGovVoteRPC(q, proposalID, voter)
}

func (q *Query) QueryGovVotes(proposalId uint64, page int, limit int) (*govTypes.QueryVotesResponse, error) {
	return QueryGovVotesRPC(q, proposalId, page, limit)
}

func (q *Query) QueryGovParam(paramType string) (*govTypes.QueryParamsResponse, error) {
	return QueryGovParamRPC(q, paramType)
}

func (q *Query) QueryGovParams() (*types.Params, error) {
	return QueryGovParamsRPC(q)
}

func (q *Query) QueryGovDeposit(proposalId uint64, depositor string) (*govTypes.QueryDepositResponse, error) {
	return QueryGovDepositRPC(q, proposalId, depositor)
}

func (q *Query) QueryGovDesposits(proposalId uint64) (*govTypes.QueryDepositsResponse, error) {
	return QueryGovDepositsRPC(q, proposalId)
}

func (q *Query) QueryTallyResult(proposalID uint64) (*govTypes.QueryTallyResultResponse, error) {
	return QueryTallyResultRPC(q, proposalID)
}

func (q *Query) QuerySigningInfo(pk cryptotypes.PubKey) (*slashingTypes.QuerySigningInfoResponse, error) {
	return QuerySigningInfoRPC(q, pk)
}

func (q *Query) QueryValidator(addr string) (*stakingTypes.QueryValidatorResponse, error) {
	return QueryValidatorRPC(q, addr)
}

func (q *Query) QuerySigningInfos() (*slashingTypes.QuerySigningInfosResponse, error) {
	return QuerySigningInfosRPC(q)
}

func (q *Query) QuerySlashingParams() (*slashingTypes.QueryParamsResponse, error) {
	return QuerySlashParamsRPC(q)
}
