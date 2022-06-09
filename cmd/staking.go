package cmd

import (
	"fmt"
	"strings"

	sdkclient "github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/staking/types"
	"github.com/spf13/cobra"
	"github.com/vitwit/resolute/client/query"
)

// stakingDelegateCmd implements tx to delegate tokens to a validator
func stakingDelegateCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "delegate [validator-addr] [amount] [key]",
		Args:  cobra.ExactArgs(3),
		Short: "Delegate liquid tokens to a validator",
		Long: strings.TrimSpace(
			`Delegate an amount of liquid coins to a validator from your wallet.
Example:
$ resolute tx staking delegate cosmosvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9u2lcnj0 1000stake mykey`,
		),
		RunE: func(cmd *cobra.Command, args []string) error {

			var (
				delAddr sdk.AccAddress
				err     error
			)

			cl := config.GetDefaultClient()
			cl.SetConfig()

			if args[2] != cl.Config.Key {
				cl.Config.Key = args[2]
			}

			amount, err := sdk.ParseCoinNormalized(args[1])
			if err != nil {
				return err
			}

			key, _ := cmd.Flags().GetString(FlagFrom)
			if key != "" {
				if key != cl.Config.Key {
					cl.Config.Key = key
				}
			}

			if cl.KeyExists((cl.Config.Key)) {
				delAddr, err = cl.GetKeyAddress()
			} else {
				delAddr, err = cl.DecodeBech32AccAddr(key)
			}
			if err != nil {
				return err
			}

			valAddr, err := cl.DecodeBech32ValAddr(args[0])
			if err != nil {
				return err
			}

			msg := &types.MsgDelegate{
				DelegatorAddress: cl.MustEncodeAccAddr(delAddr),
				ValidatorAddress: cl.MustEncodeValAddr(valAddr),
				Amount:           amount,
			}
			return cl.HandleAndPrintMsgSend(cl.SendMsg(cmd.Context(), msg))
		},
	}
	return cmd
}

// stakingRedelegateCmd implements tx to redelegate tokens
func stakingRedelegateCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "redelegate [src-validator-addr] [dst-validator-addr] [amount] [key]",
		Short: "Redelegate illiquid tokens from one validator to another",
		Args:  cobra.ExactArgs(3),
		Long: strings.TrimSpace(
			`Redelegate an amount of illiquid staking tokens from one validator to another.
Example:
$ <appd>
 tx staking redelegate cosmosvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9u2lcnj0 cosmosvaloper1a3yjj7d3qnx4spgvjcwjq9cw9snrrrhu5h6jll 100stake mykey
`,
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()
			delAddr, err := cl.AccountFromKeyOrAddress(args[3])
			if err != nil {
				return err
			}

			valSrcAddr, err := cl.DecodeBech32ValAddr(args[0])
			if err != nil {
				return err
			}

			valDstAddr, err := cl.DecodeBech32ValAddr(args[1])
			if err != nil {
				return err
			}

			amount, err := sdk.ParseCoinNormalized(args[2])
			if err != nil {
				return err
			}

			msg := &types.MsgBeginRedelegate{
				DelegatorAddress:    cl.MustEncodeAccAddr(delAddr),
				ValidatorSrcAddress: cl.MustEncodeValAddr(sdk.ValAddress(valSrcAddr)),
				ValidatorDstAddress: cl.MustEncodeValAddr(sdk.ValAddress(valDstAddr)),
				Amount:              amount,
			}

			return cl.HandleAndPrintMsgSend(cl.SendMsg(cmd.Context(), msg))
		},
	}
	return cmd
}

// stakingUnbondCmd implements tx to unbond shares from a validator
func stakingUnbondCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "unbond [validator-addr] [amount] [key]",
		Short: "Unbond shares from a validator",
		Args:  cobra.ExactArgs(3),
		Long: strings.TrimSpace(
			fmt.Sprintf(`Unbond an amount of bonded shares from a validator.

Example:
$ <appd> tx staking unbond cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj 100stake mykey
`,
			),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()

			delAddr, err := cl.AccountFromKeyOrAddress(args[2])
			if err != nil {
				return err
			}
			valAddr, err := cl.DecodeBech32ValAddr(args[0])
			if err != nil {
				return err
			}

			amount, err := sdk.ParseCoinNormalized(args[1])
			if err != nil {
				return err
			}

			msg := &types.MsgUndelegate{
				DelegatorAddress: cl.MustEncodeAccAddr(delAddr),
				ValidatorAddress: cl.MustEncodeValAddr(sdk.ValAddress(valAddr)),
				Amount:           amount,
			}

			return cl.HandleAndPrintMsgSend(cl.SendMsg(cmd.Context(), msg))
		},
	}
	return cmd
}

/***************************************
           Query Commands
****************************************/

// stakingDelegationCmd to query delegations based on validator address
func stakingDelegationCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "delegation [delegator-addr] [validator-addr]",
		Short: "query a delegation based on a delegator address and validator address",
		Long: strings.TrimSpace(`query delegations for an individual delegator on an individual validator.

Example:
$ resolute query staking delegation cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj
`),
		Args: cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cq := query.Query{Client: cl, Options: query.DefaultOptions()}
			delegator := args[0]
			validator := args[1]
			response, err := cq.Delegation(delegator, validator)
			if err != nil {
				return err
			}
			return cl.PrintObject(response)
		},
	}
	return cmd
}

// stakingDelegationsCmd to query delegations of a delegator address
func stakingDelegationsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "delegations [delegator-addr]",
		Short: "query all delegations for a delegator address",
		Long: strings.TrimSpace(`query delegations for an individual delegator on all validators.

Example:
$ resolute query staking delegations cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p
`),

		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			pr, err := sdkclient.ReadPageRequest(cmd.Flags())
			if err != nil {
				return err
			}
			height, err := ReadHeight(cmd.Flags())
			if err != nil {
				return err
			}
			options := query.QueryOptions{Pagination: pr, Height: height}
			query := query.Query{cl, &options}
			response, err := query.Delegations(args[0])
			if err != nil {
				return err
			}
			return cl.PrintObject(response)
		},
	}
	flags.AddPaginationFlagsToCmd(cmd, "delegations")
	return cmd
}

// stakingValidatorDelegationsCmd to query all delegations for a validator address
func stakingValidatorDelegationsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "validator-delegations [validator-addr]",
		Aliases: []string{"valdel", "vd"},
		Short:   "query all delegations for a validator address",
		Long: strings.TrimSpace(`query delegations for an individual validator.

Example:
$ resolute query staking validator-delegations [validator address (valoper)]
`),
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			pr, err := sdkclient.ReadPageRequest(cmd.Flags())
			if err != nil {
				return err
			}
			height, err := ReadHeight(cmd.Flags())
			if err != nil {
				return err
			}
			validator := args[0]
			options := query.QueryOptions{Pagination: pr, Height: height}
			query := query.Query{cl, &options}
			response, err := query.ValidatorDelegations(validator)
			if err != nil {
				return err
			}
			return cl.PrintObject(response)
		},
	}
	flags.AddPaginationFlagsToCmd(cmd, "validator-delegations")
	return cmd
}

// unbondingDelegationCmd to query an unbonding-delegation record based on delegator and validator address
func unbondingDelegationCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "unbonding-delegation [delegator-addr] [validator-addr]",
		Short: "Query an unbonding-delegation record based on delegator and validator address",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query unbonding delegations for an individual delegator on an individual validator.

Example:
$ resolute query staking unbonding-delegation cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p comos1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj
`,
			),
		),
		Args: cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cq := query.Query{Client: cl, Options: query.DefaultOptions()}
			delegator := args[0]
			validator := args[1]
			response, err := cq.UnbondDelegation(delegator, validator)
			if err != nil {
				return err
			}
			return cl.PrintObject(response)

		},
	}
	return cmd
}

// unbondingDelegationsCmd to query all unbonding-delegations records for one delegator
func unbondingDelegationsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "unbonding-delegations [delegator-addr]",
		Short: "Query all unbonding-delegations records for one delegator",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query unbonding delegations for an individual delegator.

Example:
$ resolute query staking unbonding-delegations cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p
`,
			),
		),
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			pr, err := sdkclient.ReadPageRequest(cmd.Flags())
			if err != nil {
				return err
			}
			height, err := ReadHeight(cmd.Flags())
			if err != nil {
				return err
			}
			delegator := args[0]
			options := query.QueryOptions{Pagination: pr, Height: height}
			query := query.Query{cl, &options}
			res, err := query.UnbondDelegations(delegator)
			if err != nil {
				return err
			}
			return cl.PrintObject(res)
		},
	}
	return cmd
}

// stakingRedelegationCmd to query a redelegation
func stakingRedelegationCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "redelegation [delegator-addr] [src-validator-addr] [dst-validator-addr]",
		Short: "Query a redelegation record based on delegator and a source and destination validator address",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query a redelegation record for an individual delegator between a source and destination validator.

Example:
$ resolute query staking redelegation cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p cosmosvaloper1l2rsakp388kuv9k8qzq6lrm9taddae7fpx59wm cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj
`,
			),
		),
		Args: cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cq := query.Query{Client: cl, Options: query.DefaultOptions()}
			delAddr := args[0]
			valSrcAddr := args[1]
			valDstAddr := args[2]
			response, err := cq.Redelegation(delAddr, valSrcAddr, valDstAddr)
			if err != nil {
				return nil
			}
			return cl.PrintObject(response)
		},
	}
	return cmd
}

// stakingRedelegationsCmd to query all redelegations of a delegator address
func stakingRedelegationsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "redelegations [delegator-addr]",
		Args:  cobra.ExactArgs(1),
		Short: "Query all redelegations records for one delegator",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query all redelegation records for an individual delegator.

Example:
$ dmeo query staking redelegation cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p
`,
			),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			pr, err := sdkclient.ReadPageRequest(cmd.Flags())
			if err != nil {
				return err
			}
			height, err := ReadHeight(cmd.Flags())
			if err != nil {
				return err
			}
			delegatorAddr := args[0]
			options := query.QueryOptions{Pagination: pr, Height: height}
			query := query.Query{cl, &options}
			res, err := query.Redelegations(delegatorAddr)
			if err != nil {
				return err
			}
			return cl.PrintObject(res)
		},
	}
	flags.AddPaginationFlagsToCmd(cmd, "delegator redelegations")
	return cmd
}

// stakingQueryValidator to query details about a validator
func stakingQueryValidator() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "validator [validator-addr]",
		Short: "Query a validator",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query details about an individual validator.

Example:
$ resolute query staking validator cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj
`,
			),
		),
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cq := query.Query{Client: cl, Options: query.DefaultOptions()}
			res, err := cq.QueryValidator(args[0])
			if err != nil {
				return err
			}
			return cl.PrintObject(&res.Validator)
		},
	}
	return cmd
}
