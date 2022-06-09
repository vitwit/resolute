package cmd

import "github.com/spf13/cobra"

func txCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "tx",
		Short: "broadcast transactions to a chain",
	}

	cmd.AddCommand(
		bankTxCmd(),
		stakingTxCmd(),
		distributionTxCmd(),
		feegrantTxCmd(),
		governanceTxCmd(),
		slashingTxCmd(),
	)

	return cmd
}

func bankTxCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "bank",
		Aliases: []string{"b", "bnk"},
		Short:   "bank transaction commands",
	}

	cmd.AddCommand(bankSendCmd())
	return cmd
}

func stakingTxCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "staking",
		Aliases: []string{"stake", "stk"},
		Short:   "staking transaction commands",
	}

	cmd.AddCommand(
		stakingDelegateCmd(),
		stakingRedelegateCmd(),
		stakingUnbondCmd(),
	)

	return cmd
}

// feegrantTxCmd returns feegrant tx commands for this module
func feegrantTxCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "feegrant",
		Short: "feegrant transaction commands",
	}

	cmd.AddCommand(
		feeGrantCmd(),
		feegrantRevokeTxCmd(),
	)

	return cmd
}

func distributionTxCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "distribution",
		Aliases: []string{"dist", "distr", "d"},
		Short:   "distribution transaction commands",
	}

	cmd.AddCommand(
		distributionWithdrawRewardsCmd(),
		fundCommunityPoolCmd(),
	)

	return cmd
}

// authzTxCmd returns the authz tx commands for this module
// func authzTxCmd() *cobra.Command {
// 	cmd := &cobra.Command{
// 		Use:     "authz",
// 		Aliases: []string{"az"},
// 		Short:   "authz transaction commands",
// 	}

// 	cmd.AddCommand(
// 		authzGrantAuthorizationCmd(),
// 		authzRevokeAuthorizationCmd(),
// 		authzExecAuthorizationCmd(),
// 	)

// 	return cmd
// }

func governanceTxCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "governance",
		Aliases: []string{"gov", "g"},
		Short:   "governance transaction commands",
	}
	cmd.AddCommand(
		govDepositCmd(),
		govVoteCmd(),
		govWeightedVoteCmd(),
		govSubmitProposalCmd(),
	)
	return cmd
}

func slashingTxCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "slashing",
		Aliases: []string{"slash"},
		Short:   "Slashing transaction commands",
	}
	cmd.AddCommand(
		slashingUnJail(),
	)
	return cmd
}
