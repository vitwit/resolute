package cmd

import (
	"strings"

	sdkclient "github.com/cosmos/cosmos-sdk/client"
	cryptotypes "github.com/cosmos/cosmos-sdk/crypto/types"
	"github.com/cosmos/cosmos-sdk/x/slashing/types"
	"github.com/spf13/cobra"
	"github.com/vitwit/resolute/client/query"
)

// slashingUnJail command implement tx to unjail validator
func slashingUnJail() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "unjail",
		Args:  cobra.NoArgs,
		Short: "unjail validator previously jailed for downtime",
		Long: `unjail a jailed validator:

$ resolute tx slashing unjail mykey
`,
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()

			valAddr := args[0]

			msg := &types.MsgUnjail{
				ValidatorAddr: valAddr,
			}
			res, err := cl.SendMsg(cmd.Context(), msg)
			if err != nil {
				return err
			}
			return cl.PrintTxResponse(res)
		},
	}
	return cmd
}

/********************************
        Query Commands
*********************************/

// slashingQuerySigningInfo to query signing info of validator
func slashingQuerySigningInfo() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "signing-info [validator-conspub]",
		Short: "Query a validator's signing information",
		Long: strings.TrimSpace(`Use a validators' consensus public key to find the signing-info for that validator:

$ resolute query slashing signing-info '{"@type":"/cosmos.crypto.ed25519.PubKey","key":"OauFcTKbN5Lx3fJL689cikXBqe+hcp6Y+x0rYUdR9Jk="}'
`),
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()
			ctx := cl.SetClient()

			var pk cryptotypes.PubKey
			if err := ctx.Codec.UnmarshalInterfaceJSON([]byte(args[0]), &pk); err != nil {
				return err
			}

			cq := query.Query{Client: cl, Options: query.DefaultOptions()}
			res, err := cq.QuerySigningInfo(pk)
			if err != nil {
				return err
			}
			return cl.PrintObject(res.ValSigningInfo)
		},
	}
	return cmd
}

// slashingQuerySigningInfos to query signing info of all validators
func slashingQuerySigningInfos() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "signing-infos",
		Short: "Query signing information of all validators",
		Long: strings.TrimSpace(`signing infos of validators:
$ resolute query slashing signing-infos
`),
		Args: cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()

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

			res, err := query.QuerySigningInfos()
			if err != nil {
				return err
			}
			return cl.PrintObject(res)
		},
	}
	return cmd
}

// slashingQueryParamsCmd to query params
func slashingQueryParamsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "params",
		Short: "Query the current slashing parameters",
		Args:  cobra.NoArgs,
		Long: strings.TrimSpace(`Query genesis parameters for the slashing module:

$ resolute query slashing params
`),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cq := query.Query{Client: cl, Options: query.DefaultOptions()}

			res, err := cq.QuerySlashingParams()
			if err != nil {
				return err
			}
			return cl.PrintObject(&res.Params)
		},
	}
	return cmd
}
