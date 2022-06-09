package query

import (
	"github.com/cosmos/cosmos-sdk/x/staking/types"
	stakingTypes "github.com/cosmos/cosmos-sdk/x/staking/types"
)

// DelegationRPC returns the delegations to a particular validator
func DelegationRPC(q *Query, delegator, validator string) (*stakingTypes.DelegationResponse, error) {
	queryClient := stakingTypes.NewQueryClient(q.Client)
	params := &stakingTypes.QueryDelegationRequest{
		DelegatorAddr: delegator,
		ValidatorAddr: validator,
	}
	ctx, cancel := q.GetQueryContext()
	defer cancel()
	res, err := queryClient.Delegation(ctx, params)
	if err != nil {
		return nil, err
	}

	return res.DelegationResponse, nil
}

// DelegationsRPC returns all the delegations
func DelegationsRPC(q *Query, delegator string) (*stakingTypes.QueryDelegatorDelegationsResponse, error) {
	queryClient := stakingTypes.NewQueryClient(q.Client)
	params := &stakingTypes.QueryDelegatorDelegationsRequest{
		DelegatorAddr: delegator,
		Pagination:    q.Options.Pagination,
	}
	ctx, cancel := q.GetQueryContext()
	defer cancel()
	res, err := queryClient.DelegatorDelegations(ctx, params)
	if err != nil {
		return nil, err
	}

	return res, nil
}

// ValidatorDelegationssRPC returns all the delegations for a validator
func ValidatorDelegationssRPC(q *Query, validator string) (*stakingTypes.QueryValidatorDelegationsResponse, error) {
	// ensure the validator parameter is a valid validator address
	_, err := q.Client.DecodeBech32ValAddr(validator)
	if err != nil {
		return nil, err
	}
	queryClient := stakingTypes.NewQueryClient(q.Client)
	params := &stakingTypes.QueryValidatorDelegationsRequest{
		ValidatorAddr: validator,
		Pagination:    q.Options.Pagination,
	}
	ctx, cancel := q.GetQueryContext()
	defer cancel()
	res, err := queryClient.ValidatorDelegations(ctx, params)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func UnbondDelegationRPC(q *Query, delegator, validator string) (*stakingTypes.QueryUnbondingDelegationResponse, error) {
	queryClient := stakingTypes.NewQueryClient(q.Client)
	params := &stakingTypes.QueryUnbondingDelegationRequest{
		DelegatorAddr: delegator,
		ValidatorAddr: validator,
	}
	ctx, cancel := q.GetQueryContext()
	defer cancel()
	res, err := queryClient.UnbondingDelegation(ctx, params)
	if err != nil {
		return nil, err
	}
	return res, nil

}

func UnbondingDelegationsRPC(q *Query, delegator string) (*stakingTypes.QueryDelegatorUnbondingDelegationsResponse, error) {
	queryClient := stakingTypes.NewQueryClient(q.Client)
	params := &stakingTypes.QueryDelegatorUnbondingDelegationsRequest{
		DelegatorAddr: delegator,
		Pagination:    q.Options.Pagination,
	}
	ctx, cancel := q.GetQueryContext()
	defer cancel()
	res, err := queryClient.DelegatorUnbondingDelegations(ctx, params)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func RedelegationRPC(q *Query, delegator string, valSrcAddr string, valDstAddr string) (*stakingTypes.QueryRedelegationsResponse, error) {
	queryClient := stakingTypes.NewQueryClient(q.Client)
	params := &stakingTypes.QueryRedelegationsRequest{
		DelegatorAddr:    delegator,
		DstValidatorAddr: valDstAddr,
		SrcValidatorAddr: valSrcAddr,
	}
	ctx, cancel := q.GetQueryContext()
	defer cancel()
	res, err := queryClient.Redelegations(ctx, params)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func RedelegationsRPC(q *Query, delegator string) (*stakingTypes.QueryRedelegationsResponse, error) {
	queryClient := stakingTypes.NewQueryClient(q.Client)
	params := &stakingTypes.QueryRedelegationsRequest{
		DelegatorAddr: delegator,
		Pagination:    q.Options.Pagination,
	}
	ctx, cancel := q.GetQueryContext()
	defer cancel()
	res, err := queryClient.Redelegations(ctx, params)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func QueryValidatorRPC(q *Query, addr string) (*stakingTypes.QueryValidatorResponse, error) {
	queryClient := stakingTypes.NewQueryClient(q.Client)
	params := &types.QueryValidatorRequest{
		ValidatorAddr: addr,
	}
	ctx, cancel := q.GetQueryContext()
	defer cancel()

	res, err := queryClient.Validator(ctx, params)
	if err != nil {
		return nil, err
	}

	return res, nil
}
