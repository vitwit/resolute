package cmd

import (
	"fmt"
	"strconv"
	"strings"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/distribution/types"
	"github.com/spf13/cobra"
)

var (
	FlagCommission = "commission"
	FlagAll        = "all"
)

// distributionWithdrawRewardsCmd to Withdraw rewards from a given delegation address
func distributionWithdrawRewardsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "withdraw-rewards [validator-addr] [from]",
		Short: "Withdraw rewards from a given delegation address, and optionally withdraw validator commission if the delegation address given is a validator operator",
		Long: strings.TrimSpace(
			`Withdraw rewards from a given delegation address,
and optionally withdraw validator commission if the delegation address given is a validator operator.
Example:
$ resolute tx withdraw-rewards cosmosvaloper1uyccnks6gn6g62fqmahf8eafkedq6xq400rjxr default
$ resolute tx withdraw-rewards cosmosvaloper1uyccnks6gn6g62fqmahf8eafkedq6xq400rjxr default --commission
$ resolute tx withdraw-rewards --from mykey --all
`,
		),
		Args: cobra.RangeArgs(1, 2),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()

			deleAddr := ""
			if len(args) == 2 {
				deleAddr = args[1]
			} else {
				deleAddr = args[0]
			}
			delAddr, err := cl.AccountFromKeyOrAddress(deleAddr)
			if err != nil {
				return err
			}

			msgs := []sdk.Msg{}
			if all, _ := cmd.Flags().GetBool(FlagAll); all {
				cl.SetConfig()
				validators, err := cl.QueryDelegatorValidators(cmd.Context(), delAddr)
				if err != nil {
					return err
				}

				for _, valAddr := range validators {
					val, err := cl.DecodeBech32ValAddr(valAddr)
					if err != nil {
						return err
					}
					msg := types.NewMsgWithdrawDelegatorReward(delAddr, sdk.ValAddress(val))
					msgs = append(msgs, msg)
				}

			} else if len(args) == 2 {
				cl.SetConfig()
				valAddr, err := cl.DecodeBech32ValAddr(args[0])
				if err != nil {
					return err
				}
				msgs = append(msgs, types.NewMsgWithdrawDelegatorReward(delAddr, sdk.ValAddress(valAddr)))
			}

			if commission, _ := cmd.Flags().GetBool(FlagCommission); commission {
				cl.SetConfig()
				valAddr, err := cl.DecodeBech32ValAddr(args[0])
				if err != nil {
					return err
				}
				msgs = append(msgs, types.NewMsgWithdrawValidatorCommission(sdk.ValAddress(valAddr)))
			}
			return cl.HandleAndPrintMsgSend(cl.SendMsgs(cmd.Context(), msgs))
		},
	}
	cmd.Flags().BoolP(FlagCommission, "c", false, "withdraw commission from a validator")
	cmd.Flags().BoolP(FlagAll, "a", false, "withdraw all rewards of a delegator")
	return cmd
}

// fundCommunityPoolCmd implements tx to Funds the community pool with the specified amount
func fundCommunityPoolCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "fund-community-pool [amount] [depositerAddr]",
		Args:  cobra.ExactArgs(2),
		Short: "Funds the community pool with the specified amount",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Funds the community pool with the specified amount

Example:
$ resolute tx distribution fund-community-pool 100uatom mykey
`,
			),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()
			depositorAddr, err := cl.AccountFromKeyOrAddress(args[1])
			if err != nil {
				return err
			}

			amount, err := sdk.ParseCoinsNormalized(args[0])
			if err != nil {
				return fmt.Errorf("parsing coin string (i.e. 20000uatom): %s", err)
			}

			msg := &types.MsgFundCommunityPool{
				Amount:    amount,
				Depositor: depositorAddr.String(),
			}
			return cl.HandleAndPrintMsgSend(cl.SendMsg(cmd.Context(), msg))
		},
	}
	return cmd
}

/*******************************************
			Query Commands
********************************************/

// distributionParamsCmd to query things about a chain's distribution params
func distributionParamsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "params",
		Short: "query things about a chain's distribution params",
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()

			params, err := cl.QueryDistributionParams(cmd.Context())
			if err != nil {
				return err
			}
			return cl.PrintObject(params)
		},
	}
	return cmd
}

// distributionCommunityPoolCmd to query things about a chain's community pool
func distributionCommunityPoolCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "community-pool",
		Short: "query things about a chain's community pool",
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			pool, err := cl.QueryDistributionCommunityPool(cmd.Context())
			if err != nil {
				return err
			}
			return cl.PrintObject(pool)
		},
	}
	return cmd
}

// distributionCommissionCmd to query a specific validator's commission
func distributionCommissionCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "commission [validator-address]",
		Args:  cobra.ExactArgs(1),
		Short: "query a specific validator's commission",
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			address, err := cl.DecodeBech32ValAddr(args[0])
			if err != nil {
				return err
			}
			commission, err := cl.QueryDistributionCommission(cmd.Context(), address)
			if err != nil {
				return err
			}
			return cl.PrintObject(commission)
		},
	}
	return cmd
}

// distributionRewardsCmd to query things about a delegator's rewards
func distributionRewardsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "rewards [key-or-delegator-address] [validator-address]",
		Short: "query things about a delegator's rewards",
		Args:  cobra.RangeArgs(1, 2),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			delAddr, err := cl.AccountFromKeyOrAddress(args[0])
			if err != nil {
				return err
			}
			if len(args) == 2 {
				valAddr, err := cl.DecodeBech32ValAddr(args[1])
				if err != nil {
					return err
				}
				rewards, err := cl.QueryDistributionRewards(cmd.Context(), delAddr, valAddr)
				if err != nil {
					return err
				}
				return cl.PrintObject(rewards)
			}
			rewards, err := cl.QueryAllDistributionRewards(cmd.Context(), delAddr)
			if err != nil {
				return err
			}
			return cl.PrintObject(rewards)
		},
	}
	return cmd
}

// distributionSlashesCmd to query things about a validator's slashes on a chain
func distributionSlashesCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "slashes [validator-address] [start-height] [end-height]",
		Short: "query things about a validator's slashes on a chain",
		Args:  cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()
			pageReq, err := ReadPageRequest(cmd.Flags())
			if err != nil {
				return err
			}

			address, err := cl.DecodeBech32ValAddr(args[0])
			if err != nil {
				return err
			}

			startHeight, err := strconv.ParseUint(args[1], 10, 64)
			if err != nil {
				return err
			}

			endHeight, err := strconv.ParseUint(args[2], 10, 64)
			if err != nil {
				return err
			}

			slashes, err := cl.QueryDistributionSlashes(cmd.Context(), address, startHeight, endHeight, pageReq)
			if err != nil {
				return err
			}

			return cl.PrintObject(slashes)
		},
	}
	return paginationFlags(cmd)
}

// distributionValidatorRewardsCmd to query things about a validator's outstanding rewards on a chain
func distributionValidatorRewardsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "validator-outstanding-rewards [address]",
		Short: "query things about a validator's (and all their delegators) outstanding rewards on a chain",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()

			address, err := cl.DecodeBech32ValAddr(args[0])
			if err != nil {
				return err
			}

			fmt.Println("Address", address.String())

			rewards, err := cl.QueryDistributionValidatorRewards(cmd.Context(), address)
			if err != nil {
				return err
			}
			return cl.PrintObject(rewards)
		},
	}
	return cmd
}
