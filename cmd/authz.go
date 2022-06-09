package cmd

import (
	"errors"
	"fmt"
	"strings"

	"time"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	sdk "github.com/cosmos/cosmos-sdk/types"
	authclient "github.com/cosmos/cosmos-sdk/x/auth/client"
	"github.com/cosmos/cosmos-sdk/x/authz"
	bank "github.com/cosmos/cosmos-sdk/x/bank/types"
	staking "github.com/cosmos/cosmos-sdk/x/staking/types"
	"github.com/spf13/cobra"
)

const (
	FlagSpendLimit        = "spend-limit"
	FlagMsgType           = "msg-type"
	FlagExpiration        = "expiration"
	FlagAllowedValidators = "allowed-validators"
	FlagDenyValidators    = "deny-validators"
	delegate              = "delegate"
	redelegate            = "redelegate"
	unbond                = "unbond"
)

// authzGrantAuthorizationCmd implements transaction to grant authorization to an address to execute transaction
func authzGrantAuthorizationCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "grant <grantee> <authorization_type=\"send\"|\"generic\"|\"delegate\"|\"unbond\"|\"redelegate\"> <granter>",
		Short: "Grant authorization to an address",
		Long: strings.TrimSpace(
			fmt.Sprintf(`grant authorization to an address to execute a transaction on your behalf:
Examples:
$ resolute tx authz grant cosmos1skjw.. send  --spend-limit=1000stake cosmos1skl..`),
		),
		Args: cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()
			granter, err := cl.AccountFromKeyOrAddress(args[2])
			if err != nil {
				return err
			}

			grantee, err := cl.DecodeBech32AccAddr(args[0])
			if err != nil {
				return err
			}
			exp, err := cmd.Flags().GetInt64(FlagExpiration)
			if err != nil {
				return err
			}

			var authorization authz.Authorization
			switch args[1] {
			case "send":
				limit, err := cmd.Flags().GetString(FlagSpendLimit)
				if err != nil {
					return err
				}

				spendLimit, err := sdk.ParseCoinsNormalized(limit)
				if err != nil {
					return err
				}

				if !spendLimit.IsAllPositive() {
					return fmt.Errorf("spend-limit should be greater than zero")
				}
				authorization = &bank.SendAuthorization{
					SpendLimit: spendLimit,
				}
			case "generic":
				msgType, err := cmd.Flags().GetString(FlagMsgType)
				if err != nil {
					return err
				}

				authorization = authz.NewGenericAuthorization(msgType)

			case delegate, unbond, redelegate:
				limit, err := cmd.Flags().GetString(FlagSpendLimit)
				if err != nil {
					return err
				}

				allowValidators, err := cmd.Flags().GetStringSlice(FlagAllowedValidators)
				if err != nil {
					return err
				}

				denyValidators, err := cmd.Flags().GetStringSlice(FlagDenyValidators)
				if err != nil {
					return err
				}

				var delegateLimit *sdk.Coin
				if limit != "" {
					spendLimit, err := sdk.ParseCoinsNormalized(limit)
					if err != nil {
						return err
					}

					if !spendLimit.IsAllPositive() {
						return fmt.Errorf("spend-limit should be greater than zero")
					}
					delegateLimit = &spendLimit[0]
				}

				allowed, err := bech32toValidatorAddresses(allowValidators)
				if err != nil {
					return err
				}

				denied, err := bech32toValidatorAddresses(denyValidators)
				if err != nil {
					return err
				}

				switch args[1] {
				case delegate:
					authorization, err = staking.NewStakeAuthorization(allowed, denied, staking.AuthorizationType_AUTHORIZATION_TYPE_DELEGATE, delegateLimit)
				case unbond:
					authorization, err = staking.NewStakeAuthorization(allowed, denied, staking.AuthorizationType_AUTHORIZATION_TYPE_UNDELEGATE, delegateLimit)
				default:
					authorization, err = staking.NewStakeAuthorization(allowed, denied, staking.AuthorizationType_AUTHORIZATION_TYPE_REDELEGATE, delegateLimit)
				}
				if err != nil {
					return err
				}

			default:
				return fmt.Errorf("invalid authorization type, %s", args[1])
			}
			req := &authz.MsgGrant{
				Granter: granter.String(),
				Grantee: grantee.String(),
				Grant: authz.Grant{
					Expiration: time.Unix(exp, 0),
				},
			}
			setErr := req.SetAuthorization(authorization)
			if setErr != nil {
				return setErr
			}
			res, err := cl.SendMsg(cmd.Context(), req)
			if err != nil {
				return err
			}

			return cl.PrintTxResponse(res)
		},
	}
	cmd.Flags().String(FlagMsgType, "", "The Msg method name for which we are creating a GenericAuthorization")
	cmd.Flags().String(FlagSpendLimit, "", "SpendLimit for Send Authorization, an array of Coins allowed spend")
	cmd.Flags().StringSlice(FlagAllowedValidators, []string{}, "Allowed validators addresses separated by ,")
	cmd.Flags().StringSlice(FlagDenyValidators, []string{}, "Deny validators addresses separated by ,")
	cmd.Flags().Int64(FlagExpiration, time.Now().AddDate(1, 0, 0).Unix(), "The Unix timestamp. Default is one year.")
	return cmd
}

// bech32toValidatorAddresses creates a valAddress from string
func bech32toValidatorAddresses(validators []string) ([]sdk.ValAddress, error) {
	cl := config.GetDefaultClient()
	cl.SetConfig()
	vals := make([]sdk.ValAddress, len(validators))
	for i, validator := range validators {
		addr, err := sdk.ValAddressFromBech32(validator)
		if err != nil {
			return nil, err
		}
		vals[i] = addr
	}
	return vals, nil
}

// authzRevokeAuthorizationCmd implements transaction to revoke authorization from grantee
func authzRevokeAuthorizationCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "revoke [grantee] [msg-type-url] [granter]",
		Short: "revoke authorization",
		Long: strings.TrimSpace(
			fmt.Sprintf(`revoke authorization from a granter to a grantee:`),
		),
		Args: cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()

			grantee, err := cl.DecodeBech32AccAddr(args[0])
			if err != nil {
				return err
			}
			granter, err := cl.AccountFromKeyOrAddress(args[2])
			if err != nil {
				return err
			}

			msgAuthorized := args[1]
			msg := &authz.MsgRevoke{
				Granter:    granter.String(),
				Grantee:    grantee.String(),
				MsgTypeUrl: msgAuthorized,
			}
			return cl.HandleAndPrintMsgSend(cl.SendMsg(cmd.Context(), msg))
		},
	}
	return cmd
}

// authzExecAuthorizationCmd implements transaction to execute tx on behalf of granter account
func authzExecAuthorizationCmd() *cobra.Command {
	var ctx client.Context
	cmd := &cobra.Command{
		Use:   "exec [tx-json-file] [grantee]",
		Short: "execute tx on behalf of granter account",
		Long: strings.TrimSpace(
			fmt.Sprintf(`execute tx on behalf of granter account:`),
		),
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()

			grantee, err := cl.AccountFromKeyOrAddress(args[1])
			if err != nil {
				return err
			}

			if offline, _ := cmd.Flags().GetBool(flags.FlagOffline); offline {
				return errors.New("cannot broadcast tx during offline mode")
			}

			theTx, err := authclient.ReadTxFromFile(ctx, args[0])
			if err != nil {
				return err
			}

			msg := authz.NewMsgExec(grantee, theTx.GetMsgs())
			return cl.HandleAndPrintMsgSend(cl.SendMsg(cmd.Context(), &msg))
		},
	}
	return cmd
}

/******************************************
		     Query Commands
*******************************************/

// authzQueryGrants to query grants for granter-grantee pair
func authzQueryGrants() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "grants [granter-addr] [grantee-addr] [msg-type-url]?",
		Args:  cobra.RangeArgs(2, 3),
		Short: "query grants for a granter-grantee pair and optionally a msg-type-url",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query authorization grants for a granter-grantee pair. If msg-type-url
	is set, it will select grants only for that msg type.`),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			pageReq, err := ReadPageRequest(cmd.Flags())
			if err != nil {
				return err
			}

			grantorAddr, err := cl.AccountFromKeyOrAddress(args[0])
			if err != nil {
				return err
			}

			granteeAddr, err := cl.AccountFromKeyOrAddress(args[1])
			if err != nil {
				return err
			}

			var MsgTypeUrl string
			if len(args) >= 3 {
				MsgTypeUrl = args[2]
			}
			req := &authz.QueryGrantsRequest{
				Granter:    cl.MustEncodeAccAddr(grantorAddr),
				Grantee:    cl.MustEncodeAccAddr(granteeAddr),
				MsgTypeUrl: MsgTypeUrl,
				Pagination: pageReq,
			}

			res, err := authz.NewQueryClient(cl).Grants(cmd.Context(), req)
			if err != nil {
				return err
			}
			return cl.PrintObject(res)
		},
	}
	flags.AddPaginationFlagsToCmd(cmd, "grants")
	return cmd
}

// func authzQueryGranterGrants() *cobra.Command {
// 	cmd := &cobra.Command{
// 		Use:   "granter-grants [granter-addr]",
// 		Args:  cobra.ExactArgs(1),
// 		Short: "query authorization grants granted by granter",
// 		Long: strings.TrimSpace(
// 			fmt.Sprintf(`Query authorization grants granted by granter.
// Examples:
// $ %s q %s granter-grants cosmos1skj..
// `,
// 				version.AppName, authz.ModuleName),
// 		),
// 		RunE: func(cmd *cobra.Command, args []string) error {
// 			cl := config.GetDefaultClient()

// 			granter, err := sdk.AccAddressFromBech32(args[0])
// 			if err != nil {
// 				return err
// 			}
// 			pageReq, err := ReadPageRequest(cmd.Flags())
// 			if err != nil {
// 				return err
// 			}

// 			req := &authz.QueryGranter

// 			}
// 		},
// 	}
// }
