package cmd

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	sdkclient "github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	sdk "github.com/cosmos/cosmos-sdk/types"
	gcutils "github.com/cosmos/cosmos-sdk/x/gov/client/utils"
	govutils "github.com/cosmos/cosmos-sdk/x/gov/client/utils"
	"github.com/cosmos/cosmos-sdk/x/gov/types"
	"github.com/spf13/cobra"
	"github.com/vitwit/resolute/client/query"
)

// Proposal flags
const (
	FlagTitle        = "title"
	FlagDescription  = "description"
	FlagProposalType = "type"
	FlagDeposit      = "deposit"
	flagVoter        = "voter"
	flagDepositor    = "depositor"
	flagStatus       = "status"
	FlagProposal     = "proposal"
)

type proposal struct {
	Title       string
	Description string
	Type        string
	Deposit     string
}

// ProposalFlags defines the core required fields of a proposal. It is used to
// verify that these values are not provided in conjunction with a JSON proposal
// file.
var ProposalFlags = []string{
	FlagTitle,
	FlagDescription,
	FlagProposalType,
	FlagDeposit,
}

// govDepositCmd implements tx to deposit tokens for an active proposal
func govDepositCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "deposit [proposal-id] [deposit] [mykey]",
		Args:  cobra.ExactArgs(3),
		Short: "Deposit tokens for an active proposal",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Submit a deposit for an active proposal. You can
find the proposal-id by running "resolute query gov proposals".

Example:
$ resolute tx gov deposit 1 10stake mykey
`,
			),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()

			// validate that the proposal id is a uint
			proposalID, err := strconv.ParseUint(args[0], 10, 64)
			if err != nil {
				return fmt.Errorf("proposal-id %s not a valid uint, please input a valid proposal-id", args[0])
			}

			from, err := cl.AccountFromKeyOrAddress(args[2])
			if err != nil {
				return err
			}

			// Get amount of coins
			amount, err := sdk.ParseCoinsNormalized(args[1])
			if err != nil {
				return err
			}

			msg := &types.MsgDeposit{
				ProposalId: proposalID,
				Depositor:  from.String(),
				Amount:     amount,
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

// govVoteCmd to vote for an active proposal
func govVoteCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "vote [proposal-id] [option] [mykey]",
		Args:  cobra.ExactArgs(3),
		Short: "Vote for an active proposal, options: yes/no/no_with_veto/abstain",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Submit a vote for an active proposal. You can
find the proposal-id by running "resolute query gov proposals".

Example:
$ resolute tx gov vote 1 yes mykey
`,
			),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()

			from, err := cl.AccountFromKeyOrAddress(args[2])
			if err != nil {
				return err
			}

			// validate that the proposal id is a uint
			proposalID, err := strconv.ParseUint(args[0], 10, 64)
			if err != nil {
				return fmt.Errorf("proposal-id %s not a valid int, please input a valid proposal-id", args[0])
			}

			// Find out which vote option user chose
			byteVoteOption, err := types.VoteOptionFromString(govutils.NormalizeVoteOption(args[1]))
			if err != nil {
				return err
			}

			msg := &types.MsgVote{
				ProposalId: proposalID,
				Voter:      from.String(),
				Option:     byteVoteOption,
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

// govWeightedVoteCmd to vote for an active proposal
func govWeightedVoteCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "weighted-vote [proposal-id] [weighted-options] [mykey]",
		Args:  cobra.ExactArgs(3),
		Short: "Vote for an active proposal, options: yes/no/no_with_veto/abstain",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Submit a vote for an active proposal. You can
find the proposal-id by running "resolute query gov proposals".

Example:
$ resolute tx gov weighted-vote 1 yes=0.6,no=0.3,abstain=0.05,no_with_veto=0.05 mykey
`,
			),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()

			from, err := cl.AccountFromKeyOrAddress(args[2])
			if err != nil {
				return err
			}

			// validate that the proposal id is a uint
			proposalID, err := strconv.ParseUint(args[0], 10, 64)
			if err != nil {
				return fmt.Errorf("proposal-id %s not a valid int, please input a valid proposal-id", args[0])
			}

			// Figure out which vote options user chose
			options, err := types.WeightedVoteOptionsFromString(govutils.NormalizeWeightedVoteOptions(args[1]))
			if err != nil {
				return err
			}

			msg := &types.MsgVoteWeighted{
				ProposalId: proposalID,
				Voter:      from.String(),
				Options:    options,
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

// govSubmitProposalCmd implements tx to submit proposal
func govSubmitProposalCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "submit-proposal mykey",
		Args:  cobra.ExactArgs(1),
		Short: "Submit a proposal along with an initial deposit",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Submit a proposal along with an initial deposit.
Proposal title, description, type and deposit can be given directly or through a proposal JSON file.

Example:
$ resolute tx gov submit-proposal --proposal="path/to/proposal.json" mykey

Where proposal.json contains:

{
  "title": "Test Proposal",
  "description": "My awesome proposal",
  "type": "Text",
  "deposit": "10test"
}

Which is equivalent to:

$ dmeo tx gov submit-proposal --title="Test Proposal" --description="My awesome proposal" --type="Text" --deposit="10test" mykey
`),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()

			proposal, err := parseSubmitProposalFlags(cmd.Flags())
			if err != nil {
				return fmt.Errorf("failed to parse proposal: %w", err)
			}

			amount, err := sdk.ParseCoinsNormalized(proposal.Deposit)
			if err != nil {
				return err
			}

			content := types.ContentFromProposalType(proposal.Title, proposal.Description, proposal.Type)

			from, err := cl.AccountFromKeyOrAddress(args[0])
			if err != nil {
				return err
			}

			msg := &types.MsgSubmitProposal{
				InitialDeposit: amount,
				Proposer:       from.String(),
			}

			merr := msg.SetContent(content)
			if merr != nil {
				return err
			}

			res, err := cl.SendMsg(cmd.Context(), msg)
			if err != nil {
				return err
			}
			return cl.PrintTxResponse(res)
		},
	}

	cmd.Flags().String(FlagTitle, "", "The proposal title")
	cmd.Flags().String(FlagDescription, "", "The proposal description")
	cmd.Flags().String(FlagProposalType, "", "The proposal Type")
	cmd.Flags().String(FlagDeposit, "", "The proposal deposit")
	cmd.Flags().String(FlagProposal, "", "Proposal file path (if this path is given, other proposal flags are ignored)")
	return cmd
}

/*
-----------------------------------------------------
                  Query Commands
-----------------------------------------------------*/

// govQueryProposalCmd to query details of a single proposal
func govQueryProposalCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "proposal [proposal-id]",
		Args:  cobra.ExactArgs(1),
		Short: "Query details of a single proposal",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query details for a proposal. You can find the
proposal-id by running "resolute query gov proposals".

Example:
$ resolute query gov proposal 1
`,
			),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()

			cq := query.Query{Client: cl, Options: query.DefaultOptions()}
			// validate that the proposal id is a uint
			proposalID, err := strconv.ParseUint(args[0], 10, 64)
			if err != nil {
				return fmt.Errorf("proposal-id %s not a valid uint, please input a valid proposal-id", args[0])
			}
			res, err := cq.QueryGovProposal(proposalID)
			if err != nil {
				return err
			}
			return cl.PrintObject(res)
		},
	}
	return cmd
}

// govQueryProposalsCmd to query proposals with optional filters
func govQueryProposalsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "proposals",
		Short: "Query proposals with optional filters",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query for a all paginated proposals that match optional filters:

Example:
$ resolute query gov proposals --depositor cosmos1skjwj5whet0lpe65qaq4rpq03hjxlwd9nf39lk
$ resolute query gov proposals --voter cosmos1skjwj5whet0lpe65qaq4rpq03hjxlwd9nf39lk
$ resolute query gov proposals --status (DepositPeriod|VotingPeriod|Passed|Rejected)
$ resolute query gov proposals --page=2 --limit=100
`,
			),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			bechDepositorAddr, _ := cmd.Flags().GetString(flagDepositor)
			bechVoterAddr, _ := cmd.Flags().GetString(flagVoter)
			strProposalStatus, _ := cmd.Flags().GetString(flagStatus)

			var proposalStatus types.ProposalStatus

			if len(bechDepositorAddr) != 0 {
				_, err := cl.DecodeBech32AccAddr(bechDepositorAddr)
				if err != nil {
					return err
				}
			}

			if len(bechVoterAddr) != 0 {
				_, err := cl.DecodeBech32AccAddr(bechVoterAddr)
				if err != nil {
					return err
				}
			}

			if len(strProposalStatus) != 0 {
				proposalStatus1, err := types.ProposalStatusFromString(gcutils.NormalizeProposalStatus(strProposalStatus))
				proposalStatus = proposalStatus1
				if err != nil {
					return err
				}
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

			res, err := query.QueryGovProposals(proposalStatus, bechVoterAddr, bechDepositorAddr)
			if err != nil {
				return err
			}
			return cl.PrintObject(res)
		},
	}

	cmd.Flags().String(flagDepositor, "", "(optional) filter by proposals deposited on by depositor")
	cmd.Flags().String(flagVoter, "", "(optional) filter by proposals voted on by voted")
	cmd.Flags().String(flagStatus, "", "(optional) filter proposals by proposal status, status: deposit_period/voting_period/passed/rejected")
	flags.AddPaginationFlagsToCmd(cmd, "proposals")
	return cmd
}

// govQueryVoteCmd to query details of a single vote
func govQueryVoteCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "vote [proposal-id] [voter-addr]",
		Args:  cobra.ExactArgs(2),
		Short: "Query details of a single vote",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query details for a single vote on a proposal given its identifier.

Example:
$ resolute query gov vote 1 cosmos1skjwj5whet0lpe65qaq4rpq03hjxlwd9nf39lk
`,
			),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()
			cq := query.Query{Client: cl, Options: query.DefaultOptions()}

			// validate that the proposal id is a uint
			proposalID, err := strconv.ParseUint(args[0], 10, 64)
			if err != nil {
				return fmt.Errorf("proposal-id %s not a valid int, please input a valid proposal-id", args[0])
			}
			voterAddr, err := cl.DecodeBech32AccAddr(args[1])
			if err != nil {
				return err
			}
			res, err := cq.QueryGovVote(proposalID, voterAddr)

			vote := res.GetVote()
			if vote.Empty() {
				ctx := cmd.Context()
				params := types.NewQueryVoteParams(proposalID, voterAddr)
				resByTxQuery, err := cl.QueryVoteByTxQuery(ctx, params)
				if err != nil {
					return err
				}
				if err := json.Unmarshal(resByTxQuery, &vote); err != nil {
					return err
				}
			}
			return cl.PrintObject(&res.Vote)
		},
	}
	return cmd
}

// govQueryVotesCmd to query votes on a proposal
func govQueryVotesCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "votes [proposal-id]",
		Args:  cobra.ExactArgs(1),
		Short: "Query votes on a proposal",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query vote details for a single proposal by its identifier.

Example:
$ resolute query gov votes 1
$ resolute query gov votes 1 --page=2 --limit=100
`,
			),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cl.SetConfig()

			// validate that the proposal id is a uint
			proposalID, err := strconv.ParseUint(args[0], 10, 64)
			if err != nil {
				return fmt.Errorf("proposal-id %s not a valid int, please input a valid proposal-id", args[0])
			}

			page, _ := cmd.Flags().GetUint64(flags.FlagPage)
			limit, _ := cmd.Flags().GetUint64(flags.FlagLimit)

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

			proposalStat, err := query.QueryGovProposal(proposalID)
			if err != nil {
				return err
			}
			ctx := cmd.Context()
			propStatus := proposalStat.GetProposal().Status
			if !(propStatus == types.StatusVotingPeriod || propStatus == types.StatusDepositPeriod) {
				params := types.NewQueryProposalVotesParams(proposalID, int(page), int(limit))
				resByTxQuery, err := cl.QueryVotesByTxQuery(ctx, params)
				if err != nil {
					return err
				}

				var votes types.Votes

				json.Unmarshal(resByTxQuery, &votes)

				return cl.PrintObject(votes)
			}

			res, err := query.QueryGovVotes(proposalID, int(page), int(limit))
			if err != nil {
				return err
			}
			return cl.PrintObject(res)
		},
	}
	flags.AddPaginationFlagsToCmd(cmd, "votes")
	flags.AddQueryFlagsToCmd(cmd)
	return cmd
}

// govQueryParam to query the parameters
func govQueryParam() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "param [param-type]",
		Args:  cobra.ExactArgs(1),
		Short: "Query the parameters (voting|tallying|deposit) of the governance process",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query the all the parameters for the governance process.

Example:
$ resolute query gov param voting
$ resolute query gov param tallying
$ resolute query gov param deposit
`,
			),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cq := query.Query{Client: cl, Options: query.DefaultOptions()}

			params := args[0]
			res, err := cq.QueryGovParam(params)
			if err != nil {
				return err
			}

			var out fmt.Stringer
			switch args[0] {
			case "voting":
				out = res.GetVotingParams()
			case "tallying":
				out = res.GetTallyParams()
			case "deposit":
				out = res.GetDepositParams()
			default:
				return fmt.Errorf("argument must be one of (voting|tallying|deposit), was %s", args[0])
			}

			return cl.PrintObject(out)
		},
	}
	return cmd
}

// govQueryParamsCmd to query the parameters of the governance process
func govQueryParamsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "params",
		Short: "Query the parameters of the governance process",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query the all the parameters for the governance process.

Example:
$ resolute query gov params
`,
			),
		),
		Args: cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cq := query.Query{Client: cl, Options: query.DefaultOptions()}

			res, err := cq.QueryGovParams()
			if err != nil {
				return err
			}
			return cl.PrintObject(res)
		},
	}
	return cmd
}

// govQueryPrposerCmd to query the proposer of a governance proposal
func govQueryPrposerCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "proposer [proposal-id]",
		Args:  cobra.ExactArgs(1),
		Short: "Query the proposer of a governance proposal",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query which address proposed a proposal with a given ID.

Example:
$ resolute query gov proposer 1
`,
			),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()
			cl := config.GetDefaultClient()
			proposalID, err := strconv.ParseUint(args[0], 10, 64)
			if err != nil {
				return fmt.Errorf("proposal-id %s is not a valid uint", args[0])
			}
			prop, err := cl.QueryProposerByTxQuery(ctx, proposalID)
			if err != nil {
				return err
			}
			return cl.PrintObject(prop)
		},
	}
	return cmd
}

// govQueryDepositCmd to query details of a deposit
func govQueryDepositCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "deposit [proposal-id] [depositer-addr]",
		Args:  cobra.ExactArgs(2),
		Short: "Query details of a deposit",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query details for a single proposal deposit on a proposal by its identifier.

Example:
$ resolute query gov deposit 1 cosmos1skjwj5whet0lpe65qaq4rpq03hjxlwd9nf39lk
`,
			),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cq := query.Query{Client: cl, Options: query.DefaultOptions()}

			// validate that the proposal id is a uint
			proposalID, err := strconv.ParseUint(args[0], 10, 64)
			if err != nil {
				return fmt.Errorf("proposal-id %s not a valid uint, please input a valid proposal-id", args[0])
			}
			proposalRes, err := cq.QueryGovProposal(proposalID)
			if err != nil {
				return err
			}

			depositorAddr, err := cl.DecodeBech32AccAddr(args[1])
			if err != nil {
				return err
			}

			ctx := cmd.Context()
			var deposit types.Deposit
			propStatus := proposalRes.Proposal.Status
			if !(propStatus == types.StatusVotingPeriod || propStatus == types.StatusDepositPeriod) {
				params := types.NewQueryDepositParams(proposalID, depositorAddr)
				resByTxQuery, err := cl.QueryDepositByTxQuery(ctx, params)
				if err != nil {
					return err
				}
				json.Unmarshal(resByTxQuery, &deposit)
				return cl.PrintObject(&deposit)
			}

			res, err := cq.QueryGovDeposit(proposalID, args[1])
			if err != nil {
				return err
			}
			return cl.PrintObject(&res.Deposit)
		},
	}
	return cmd
}

// govQueryDepositsCmd to query deposits on a proposal
func govQueryDepositsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "deposits [proposal-id]",
		Args:  cobra.ExactArgs(1),
		Short: "Query deposits on a proposal",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query details for all deposits on a proposal.
You can find the proposal-id by running "resolute query gov proposals".

Example:
$ resolute query gov deposits 1
`,
			),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()

			// validate that the proposal id is a uint
			proposalID, err := strconv.ParseUint(args[0], 10, 64)
			if err != nil {
				return fmt.Errorf("proposal-id %s not a valid uint, please input a valid proposal-id", args[0])
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
			proposalRes, err := query.QueryGovProposal(proposalID)
			if err != nil {
				return err
			}
			propStatus := proposalRes.GetProposal().Status
			ctx := cmd.Context()
			if !(propStatus == types.StatusVotingPeriod || propStatus == types.StatusDepositPeriod) {
				params := types.NewQueryProposalParams(proposalID)
				resByTxQuery, err := cl.QueryDepositsByTxQuery(ctx, params)
				if err != nil {
					return err
				}

				var dep types.Deposits
				// TODO migrate to use JSONCodec (implement MarshalJSONArray
				// or wrap lists of proto.Message in some other message)
				json.Unmarshal(resByTxQuery, &dep)

				return cl.PrintObject(dep)
			}

			res, err := query.QueryGovDesposits(proposalID)
			if err != nil {
				return err
			}
			return cl.PrintObject(res)

		},
	}
	return cmd
}

// govQueryTallyCmd to query the tally of a proposal vote
func govQueryTallyCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "tally [proposal-id]",
		Args:  cobra.ExactArgs(1),
		Short: "Get the tally of a proposal vote",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Query tally of votes on a proposal. You can find
the proposal-id by running "resolute query gov proposals".

Example:
$ resolute query gov tally 1
`,
			),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			cl := config.GetDefaultClient()
			cq := query.Query{Client: cl, Options: query.DefaultOptions()}

			// validate that the proposal id is a uint
			proposalID, err := strconv.ParseUint(args[0], 10, 64)
			if err != nil {
				return fmt.Errorf("proposal-id %s not a valid int, please input a valid proposal-id", args[0])
			}

			_, err = cq.QueryGovProposal(proposalID)
			if err != nil {
				return err
			}

			res, err := cq.QueryTallyResult(proposalID)
			if err != nil {
				return err
			}
			return cl.PrintObject(&res.Tally)
		},
	}
	return cmd
}
