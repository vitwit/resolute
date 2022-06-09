package query

import (
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/gov/types"
	govTypes "github.com/cosmos/cosmos-sdk/x/gov/types"
)

func QueryGovProposalRPC(q *Query, proposalId uint64) (*govTypes.QueryProposalResponse, error) {
	queryClient := govTypes.NewQueryClient(q.Client)
	params := &types.QueryProposalRequest{
		ProposalId: proposalId,
	}
	ctx, cancel := q.GetQueryContext()
	defer cancel()
	res, err := queryClient.Proposal(ctx, params)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func QueryGovProposalsRPC(q *Query, proposalStatus types.ProposalStatus, voter string, depositer string) (*govTypes.QueryProposalsResponse, error) {
	queryClient := govTypes.NewQueryClient(q.Client)
	params := &types.QueryProposalsRequest{
		ProposalStatus: proposalStatus,
		Voter:          voter,
		Depositor:      depositer,
		Pagination:     q.Options.Pagination,
	}
	ctx, cancel := q.GetQueryContext()
	defer cancel()
	res, err := queryClient.Proposals(ctx, params)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func QueryGovVoteRPC(q *Query, proposalID uint64, voter sdk.AccAddress) (*govTypes.QueryVoteResponse, error) {
	queryClient := govTypes.NewQueryClient(q.Client)
	ctx, cancel := q.GetQueryContext()
	defer cancel()
	params := &types.QueryProposalRequest{
		ProposalId: proposalID,
	}
	_, err := queryClient.Proposal(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch proposal-id %d: %s", proposalID, err)
	}
	vParams := &types.QueryVoteRequest{
		ProposalId: proposalID,
		Voter:      voter.String(),
	}
	res, err := queryClient.Vote(ctx, vParams)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func QueryGovVotesRPC(q *Query, proposalID uint64, page int, limit int) (*govTypes.QueryVotesResponse, error) {
	queryClient := govTypes.NewQueryClient(q.Client)
	ctx, cancel := q.GetQueryContext()
	defer cancel()
	res, err := queryClient.Votes(
		ctx,
		&types.QueryVotesRequest{
			ProposalId: proposalID,
		},
	)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func QueryGovParamRPC(q *Query, paramType string) (*govTypes.QueryParamsResponse, error) {
	queryClient := govTypes.NewQueryClient(q.Client)
	ctx, cancel := q.GetQueryContext()
	defer cancel()

	res, err := queryClient.Params(
		ctx,
		&types.QueryParamsRequest{
			ParamsType: paramType,
		},
	)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func QueryGovParamsRPC(q *Query) (*types.Params, error) {
	queryClient := govTypes.NewQueryClient(q.Client)
	ctx, cancel := q.GetQueryContext()
	defer cancel()

	votingRes, err := queryClient.Params(
		ctx,
		&types.QueryParamsRequest{ParamsType: "voting"},
	)
	if err != nil {
		return nil, err
	}
	tallyRes, err := queryClient.Params(
		ctx,
		&types.QueryParamsRequest{ParamsType: "tallying"},
	)
	if err != nil {
		return nil, err
	}
	depositRes, err := queryClient.Params(
		ctx,
		&types.QueryParamsRequest{ParamsType: "deposit"},
	)
	if err != nil {
		return nil, err
	}
	params := types.NewParams(
		votingRes.GetVotingParams(),
		tallyRes.GetTallyParams(),
		depositRes.GetDepositParams(),
	)
	return &params, nil
}

func QueryGovDepositRPC(q *Query, proposalId uint64, depositer string) (*govTypes.QueryDepositResponse, error) {
	queryClient := govTypes.NewQueryClient(q.Client)
	ctx, cancel := q.GetQueryContext()
	defer cancel()

	res, err := queryClient.Deposit(
		ctx,
		&types.QueryDepositRequest{ProposalId: proposalId, Depositor: depositer},
	)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func QueryGovDepositsRPC(q *Query, proposalID uint64) (*govTypes.QueryDepositsResponse, error) {
	queryClient := govTypes.NewQueryClient(q.Client)
	ctx, cancel := q.GetQueryContext()
	defer cancel()

	res, err := queryClient.Deposits(
		ctx,
		&types.QueryDepositsRequest{
			ProposalId: proposalID,
		},
	)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func QueryTallyResultRPC(q *Query, proposalID uint64) (*govTypes.QueryTallyResultResponse, error) {
	queryClient := govTypes.NewQueryClient(q.Client)
	ctx, cancel := q.GetQueryContext()
	defer cancel()

	res, err := queryClient.TallyResult(
		ctx,
		&types.QueryTallyResultRequest{
			ProposalId: proposalID,
		},
	)
	if err != nil {
		return nil, err
	}
	return res, nil
}
