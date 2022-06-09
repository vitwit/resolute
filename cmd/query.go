package cmd

import "github.com/spf13/cobra"

func queryCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "query",
		Aliases: []string{"q"},
		Short:   "query things about a chain",
	}

	cmd.AddCommand(
		bankQueryCmd(),
		distributionQueryCmd(),
		stakingQueryCmd(),
		authzQueryCmd(),
		feegrantQueryCmd(),
		queryTxCmd(),
		authQueryCmd(),
		governanceQueryCmd(),
		slashingQueryCmds(),
	)
	return cmd
}

// bankQueryCmd  returns the transaction commands for this module
func bankQueryCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "bank",
		Aliases: []string{"b"},
		Short:   "Querying commands for the auth module",
	}

	cmd.AddCommand(
		bankBalanceCmd(),
		bankTotalSupplyCmd(),
		bankDenomsMetadataCmd(),
	)
	cmd.PersistentFlags().String("chain", "", "get balance of the network")

	return cmd
}

// distributionQueryCmd returns the distribution query commands for this module
func distributionQueryCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "distribution",
		Aliases: []string{"dist", "distr", "d"},
		Short:   "Query things about a chain's distribution module",
	}

	cmd.AddCommand(
		distributionParamsCmd(),
		distributionValidatorRewardsCmd(),
		distributionCommissionCmd(),
		distributionCommunityPoolCmd(),
		distributionRewardsCmd(),
		distributionSlashesCmd(),
	)
	return cmd
}

// stakingQueryCmd returns the staking query commands for this module
func stakingQueryCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "staking",
		Aliases: []string{"stake", "s"},
		Short:   "Query things about a chain's staking module",
	}

	cmd.AddCommand(
		stakingDelegationCmd(),
		stakingDelegationsCmd(),
		stakingValidatorDelegationsCmd(),
		unbondingDelegationCmd(),
		unbondingDelegationsCmd(),
		stakingRedelegationCmd(),
		stakingRedelegationsCmd(),
		stakingQueryValidator(),
	)
	return cmd
}

func authzQueryCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "authz",
		Aliases: []string{"a"},
		Short:   "Query things about chain's authz module",
	}

	cmd.AddCommand(
		authzQueryGrants(),
	)
	return cmd
}

func feegrantQueryCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "feegrant",
		Aliases: []string{"fee", "f"},
		Short:   "Query things about chain's feegrant module",
	}

	cmd.AddCommand(
		feegrantQueryGrantCmd(),
		feeGrantsByGranteeQueryCmd(),
	)
	return cmd
}

func queryTxCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "tx",
		Aliases: []string{"t"},
		Short:   "Query tx hash",
	}

	cmd.AddCommand(
		authQueryTxCmd(),
	)
	return cmd
}
func authQueryCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "auth",
		Short: "Query things about chains auth module",
	}
	cmd.AddCommand(
		QUeryAccountCmd(),
		QueryAccountsCmd(),
		QueryAuthParamsCmd(),
	)
	return cmd
}

func governanceQueryCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "governance",
		Aliases: []string{"gov", "g"},
		Short:   "Query things about chains governance module",
	}
	cmd.AddCommand(
		govQueryProposalCmd(),
		govQueryProposalsCmd(),
		govQueryVoteCmd(),
		govQueryVotesCmd(),
		govQueryParam(),
		govQueryParamsCmd(),
		govQueryPrposerCmd(),
		govQueryDepositCmd(),
		govQueryDepositsCmd(),
		govQueryTallyCmd(),
	)
	return cmd
}

func slashingQueryCmds() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "slashing",
		Aliases: []string{"slash"},
		Short:   "Query things about chains slashing module",
	}
	cmd.AddCommand(
		slashingQuerySigningInfo(),
		slashingQuerySigningInfos(),
		slashingQueryParamsCmd(),
	)
	return cmd
}
