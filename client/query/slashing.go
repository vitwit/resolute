package query

import (
	cryptotypes "github.com/cosmos/cosmos-sdk/crypto/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/slashing/types"
	slashingTypes "github.com/cosmos/cosmos-sdk/x/slashing/types"
)

func QuerySigningInfoRPC(q *Query, pk cryptotypes.PubKey) (*types.QuerySigningInfoResponse, error) {
	queryClient := slashingTypes.NewQueryClient(q.Client)
	ctx, cancel := q.GetQueryContext()
	defer cancel()

	consAddr := sdk.ConsAddress(pk.Address())
	params := &types.QuerySigningInfoRequest{ConsAddress: consAddr.String()}
	res, err := queryClient.SigningInfo(ctx, params)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func QuerySigningInfosRPC(q *Query) (*slashingTypes.QuerySigningInfosResponse, error) {
	queryClient := slashingTypes.NewQueryClient(q.Client)
	ctx, cancel := q.GetQueryContext()
	defer cancel()

	params := &types.QuerySigningInfosRequest{q.Options.Pagination}
	res, err := queryClient.SigningInfos(ctx, params)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func QuerySlashParamsRPC(q *Query) (*slashingTypes.QueryParamsResponse, error) {
	queryClient := slashingTypes.NewQueryClient(q.Client)
	ctx, cancel := q.GetQueryContext()
	defer cancel()

	params := &types.QueryParamsRequest{}
	res, err := queryClient.Params(ctx, params)
	if err != nil {
		return nil, err
	}
	return res, nil
}
