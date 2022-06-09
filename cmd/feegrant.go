package cmd

import (
	"fmt"

	"strings"

	"time"

	sdkclient "github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	feegrant "github.com/cosmos/cosmos-sdk/x/feegrant"
	"github.com/gogo/protobuf/proto"
	"github.com/spf13/cobra"
	"github.com/vitwit/resolute/client/query"
)

// flag for feegrant module
const (
	FeeFlagExpiration = "expiration"
	FlagPeriod        = "period"
	FlagPeriodLimit   = "period-limit"
	FeeFlagSpendLimit = "spend-limit"
	FlagAllowedMsgs   = "allowed-messages"
)

// feeGrantCmd implements tx to grant Fee allowance to an address
func feeGrantCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "grant [granter_key_or_address] [grantee]",
		Short: "Grant Fee allowance to an address",
		Long: strings.TrimSpace(
			fmt.Sprintf(
				`Grant authorization to pay fees from your address. Note, the'--from' flag is
				ignored as it is implied from [granter].`,
			),
		),
		Args: cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()
			grantee, err := cl.DecodeBech32AccAddr(args[1])
			if err != nil {
				return err
			}
			granter, err := cl.AccountFromKeyOrAddress(args[0])
			if err != nil {
				return err
			}
			sl, err := cmd.Flags().GetString(FeeFlagSpendLimit)
			if err != nil {
				return err
			}

			limit, err := sdk.ParseCoinsNormalized(sl)
			if err != nil {
				return err
			}

			exp, err := cmd.Flags().GetString(FeeFlagExpiration)
			if err != nil {
				return err
			}

			basic := feegrant.BasicAllowance{
				SpendLimit: limit,
			}

			var expiresAtTime time.Time
			if exp != "" {
				expiresAtTime, err = time.Parse(time.RFC3339, exp)
				if err != nil {
					return err
				}
				basic.Expiration = &expiresAtTime
			}

			var grant feegrant.FeeAllowanceI
			grant = &basic

			periodClock, err := cmd.Flags().GetInt64(FlagPeriod)
			if err != nil {
				return err
			}

			periodLimitVal, err := cmd.Flags().GetString(FlagPeriodLimit)
			if err != nil {
				return err
			}

			if periodClock > 0 || periodLimitVal != "" {
				periodLimit, err := sdk.ParseCoinsNormalized(periodLimitVal)
				if err != nil {
					return err
				}

				if periodClock <= 0 {
					return fmt.Errorf("period clock was not set")
				}

				if periodLimit == nil {
					return fmt.Errorf("period limit was not set")
				}

				periodReset := getPeriodReset(periodClock)
				if exp != "" && periodReset.Sub(expiresAtTime) > 0 {
					return fmt.Errorf("period (%d) cannot reset after expiration (%v)", periodClock, exp)
				}

				periodic := feegrant.PeriodicAllowance{
					Basic:            basic,
					Period:           getPeriod(periodClock),
					PeriodReset:      getPeriodReset(periodClock),
					PeriodSpendLimit: periodLimit,
					PeriodCanSpend:   periodLimit,
				}

				grant = &periodic
			}

			allowedMsgs, err := cmd.Flags().GetStringSlice(FlagAllowedMsgs)
			if err != nil {
				return err
			}

			if len(allowedMsgs) > 0 {
				grant, err = feegrant.NewAllowedMsgAllowance(grant, allowedMsgs)
				if err != nil {
					return err
				}
			}

			msg, ok := grant.(proto.Message)
			if !ok {
				return sdkerrors.Wrapf(sdkerrors.ErrPackAny, "cannot proto marshal %T", msg)
			}
			any, err := types.NewAnyWithValue(msg)
			if err != nil {
				return err
			}

			req := &feegrant.MsgGrantAllowance{
				Granter:   granter.String(),
				Grantee:   grantee.String(),
				Allowance: any,
			}

			res, err := cl.SendMsg(cmd.Context(), req)

			return cl.PrintTxResponse(res)
		},
	}
	cmd.Flags().StringSlice(FlagAllowedMsgs, []string{}, "Set of allowed messages for fee allowance")
	cmd.Flags().String(FeeFlagExpiration, "", "The RFC 3339 timestamp after which the grant expires for the user")
	cmd.Flags().String(FeeFlagSpendLimit, "", "Spend limit specifies the max limit can be used, if not mentioned there is no limit")
	cmd.Flags().Int64(FlagPeriod, 0, "period specifies the time duration(in seconds) in which period_limit coins can be spent before that allowance is reset (ex: 3600)")
	cmd.Flags().String(FlagPeriodLimit, "", "period limit specifies the maximum number of coins that can be spent in the period")

	return cmd
}

// feegrantRevokeTxCmd to revoke fee grant
func feegrantRevokeTxCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "revoke [granter] [grantee]",
		Short: "revoke free-grant",
		Long: strings.TrimSpace(
			fmt.Sprintf(`revoke fee grant from a granter to a grantee. Note, the'--from' flag is 
ignored as it is implied from [granter].`,
			),
		),
		Args: cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()

			granter, err := cl.AccountFromKeyOrAddress(args[0])
			if err != nil {
				return err
			}

			grantee, err := cl.DecodeBech32AccAddr(args[1])
			if err != nil {
				return err
			}
			req := &feegrant.MsgRevokeAllowance{
				Granter: granter.String(),
				Grantee: grantee.String(),
			}
			res, err := cl.SendMsg(cmd.Context(), req)
			if err != nil {
				return err
			}
			return cl.PrintTxResponse(res)
		},
	}
	return cmd
}

func getPeriodReset(duration int64) time.Time {
	return time.Now().Add(getPeriod(duration))
}

func getPeriod(duration int64) time.Duration {
	return time.Duration(duration) * time.Second
}

/* -----------------------------------------------------------
                    Query Commands
--------------------------------------------------------------*/

// feegrantQueryGrantCmd to query details of a single grant
func feegrantQueryGrantCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "grant [granter] [grantee]",
		Args:  cobra.ExactArgs(2),
		Short: "Query details of a single grant",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query details for a grant. 
You can find the fee-grant of a granter and grantee.`),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()
			cq := query.Query{Client: cl, Options: query.DefaultOptions()}

			granterAddr, err := cl.AccountFromKeyOrAddress(args[0])
			if err != nil {
				return err
			}
			granteeAdrr, err := cl.DecodeBech32AccAddr(args[1])
			if err != nil {
				return err
			}

			res, err := cq.FeegrantGrant(granterAddr.String(), granteeAdrr.String())
			if err != nil {
				return err
			}
			return cl.PrintObject(res)
		},
	}
	return cmd
}

// feeGrantsByGranteeQueryCmd to query all grants of a grantee
func feeGrantsByGranteeQueryCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "grants [grantee]",
		Args:  cobra.ExactArgs(1),
		Short: "Query all grants of a grantee",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Queries all the grants for a grantee address.`),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()
			granteeAddr, err := cl.AccountFromKeyOrAddress(args[0])
			if err != nil {
				return err
			}

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
			res, err := query.FeeGrantsByGrantee(granteeAddr.String())
			if err != nil {
				return err
			}
			return cl.PrintObject(res)
		},
	}
	flags.AddPaginationFlagsToCmd(cmd, "grants")
	return cmd
}

// func feeGrantsByGranter() *cobra.Command {
// 	cmd := &cobra.Command{
// 		Use:   "grants [granter]",
// 		Args:  cobra.ExactArgs(1),
// 		Short: "Query all grants by a granter",
// 		Long: strings.TrimSpace(
// 			fmt.Sprintf(`Queries all the grants issued for a granter address.`),
// 		),
// 		RunE: func(cmd *cobra.Command, args []string) error {
// 			cl := config.GetDefaultClient()

// 			granterAddr := args[0]
// 			pr, err := sdkclient.ReadPageRequest(cmd.Flags())
// 			if err != nil {
// 				return err
// 			}
// 			height, err := ReadHeight(cmd.Flags())
// 			if err != nil {
// 				return err
// 			}
// 			options := query.QueryOptions{Pagination: pr, Height: height}
// 			query := query.Query{cl, &options}
// 			res, err := query.FeeGrantsByGranter(granterAddr)

// 		},
// 	}
// }
