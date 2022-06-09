package query

import (
	"github.com/cosmos/cosmos-sdk/x/auth/types"
	authTypes "github.com/cosmos/cosmos-sdk/x/auth/types"
)

func QueryAccountRPC(q *Query, key string) (*authTypes.QueryAccountResponse, error) {
	queryClient := authTypes.NewQueryClient(q.Client)
	params := &types.QueryAccountRequest{
		Address: key,
	}
	ctx, cancel := q.GetQueryContext()
	defer cancel()
	res, err := queryClient.Account(ctx, params)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func QueryAccountsRPC(q *Query) (*authTypes.QueryAccountsResponse, error) {
	queryClient := authTypes.NewQueryClient(q.Client)
	params := &types.QueryAccountsRequest{
		Pagination: q.Options.Pagination,
	}
	ctx, cancel := q.GetQueryContext()
	defer cancel()
	res, err := queryClient.Accounts(ctx, params)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func QueryParamsRPC(q *Query) (*authTypes.QueryParamsResponse, error) {
	queryClient := authTypes.NewQueryClient(q.Client)
	params := &types.QueryParamsRequest{}
	ctx, cancel := q.GetQueryContext()
	defer cancel()
	res, err := queryClient.Params(ctx, params)
	if err != nil {
		return nil, err
	}
	return res, nil
}
