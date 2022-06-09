package cmd

import (
	"fmt"
	"strings"

	sdkclient "github.com/cosmos/cosmos-sdk/client"
	"github.com/spf13/cobra"
	"github.com/vitwit/resolute/client/query"
)

// authQueryTxCmd command to query the transaction by hash
func authQueryTxCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "hash [hash]",
		Short: "Query for a transaction by hash",
		Long: strings.TrimSpace(fmt.Sprintf(`
	Example:
	$ resolute query tx hash <hash>`),
		),
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()
			if args[0] == "" {
				return fmt.Errorf("argument should be a tx hash")
			}
			res, err := cl.QueryTx(cmd.Context(), args[0])
			if err != nil {
				return err
			}
			if res.Empty() {
				return fmt.Errorf("no transaction found with hash %s", args[0])
			}
			return cl.PrintObject(res)

		},
	}
	return cmd
}

// QUeryAccountCmd to query an account by address
func QUeryAccountCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "account [address]",
		Short: "QUery for account by address",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()
			key, err := cl.DecodeBech32AccAddr(args[0])
			if err != nil {
				return err
			}
			cq := query.Query{Client: cl, Options: query.DefaultOptions()}

			res, err := cq.QueryAccount(key.String())
			if err != nil {
				return err
			}
			return cl.PrintObject(res)
		},
	}
	return cmd
}

// QueryAccountsCmd to query all accounts
func QueryAccountsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "accounts",
		Short: "Query all the accounts",
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

			res, err := query.QueryAccounts()
			if err != nil {
				return err
			}
			return cl.PrintObject(res)
		},
	}
	return cmd
}

// QueryAuthParamsCmd to query the current auth params
func QueryAuthParamsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "params",
		Short: "Query the current auth parameters",
		Args:  cobra.NoArgs,
		Long: strings.TrimSpace(`Query the current auth parameters:

$ resolute query auth params
`),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cq := query.Query{Client: cl, Options: query.DefaultOptions()}

			res, err := cq.QueryAuthParams()
			if err != nil {
				return err
			}
			return cl.PrintObject(res)
		},
	}
	return cmd
}
