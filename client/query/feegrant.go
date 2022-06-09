package query

import feegrantTypes "github.com/cosmos/cosmos-sdk/x/feegrant"

func FeegrantGrantRPC(q *Query, granter string, grantee string) (*feegrantTypes.QueryAllowanceResponse, error) {
	queryClient := feegrantTypes.NewQueryClient(q.Client)
	params := &feegrantTypes.QueryAllowanceRequest{
		Granter: granter,
		Grantee: grantee,
	}
	ctx, cancel := q.GetQueryContext()
	defer cancel()
	res, err := queryClient.Allowance(ctx, params)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func FeeGrantsByGranteeRPC(q *Query, grantee string) (*feegrantTypes.QueryAllowancesResponse, error) {
	queryClient := feegrantTypes.NewQueryClient(q.Client)
	params := &feegrantTypes.QueryAllowancesRequest{
		Grantee:    grantee,
		Pagination: q.Options.Pagination,
	}
	ctx, cancel := q.GetQueryContext()
	defer cancel()
	res, err := queryClient.Allowances(ctx, params)
	if err != nil {
		return nil, err
	}
	return res, nil

}
