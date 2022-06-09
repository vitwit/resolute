package client

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/cosmos/cosmos-sdk/client"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	"github.com/cosmos/cosmos-sdk/types/query"
	querytypes "github.com/cosmos/cosmos-sdk/types/query"
	bankTypes "github.com/cosmos/cosmos-sdk/x/bank/types"
	distTypes "github.com/cosmos/cosmos-sdk/x/distribution/types"
	"github.com/cosmos/cosmos-sdk/x/gov/types"
	transfertypes "github.com/cosmos/ibc-go/v2/modules/apps/transfer/types"
	rpcclient "github.com/tendermint/tendermint/rpc/client"
	coretypes "github.com/tendermint/tendermint/rpc/core/types"
)

const (
	defaultPage  = 1
	defaultLimit = 30 // should be consistent with tendermint/tendermint/rpc/core/pipe.go:19
)

// Proposer contains metadata of a governance proposal used for querying a
// proposer.
type Proposer struct {
	ProposalID uint64 `json:"proposal_id" yaml:"proposal_id"`
	Proposer   string `json:"proposer" yaml:"proposer"`
}

// QueryBalanceWithDenomTraces is a helper function for query balance
func (cc *ChainClient) QueryBalanceWithDenomTraces(ctx context.Context, address sdk.AccAddress, pageReq *query.PageRequest) (sdk.Coins, error) {
	coins, err := cc.QueryBalanceWithAddress(cc.MustEncodeAccAddr(address))
	if err != nil {
		return nil, err
	}

	h, err := cc.QueryLatestHeight()
	if err != nil {
		return nil, err
	}

	// TODO: figure out how to handle this
	// we don't want to expose user to this
	// so maybe we need a QueryAllDenomTraces function
	// that will paginate the responses automatically
	// TODO fix pagination here later
	dts, err := cc.QueryDenomTraces(0, 1000, h)
	if err != nil {
		return nil, err
	}

	if len(dts) == 0 {
		return coins, nil
	}

	var out sdk.Coins
	for _, c := range coins {
		if c.Amount.Equal(sdk.NewInt(0)) {
			continue
		}

		for i, d := range dts {
			if c.Denom == d.IBCDenom() {
				out = append(out, sdk.Coin{Denom: d.GetFullDenomPath(), Amount: c.Amount})
				break
			}

			if i == len(dts)-1 {
				out = append(out, c)
			}
		}
	}
	return out, nil
}

// QueryDenomTraces returns all the denom traces from a given chain
// TODO add pagination support
func (cc *ChainClient) QueryDenomTraces(offset, limit uint64, height int64) ([]transfertypes.DenomTrace, error) {
	transfers, err := transfertypes.NewQueryClient(cc).DenomTraces(context.Background(),
		&transfertypes.QueryDenomTracesRequest{
			Pagination: DefaultPageRequest(),
		})
	if err != nil {
		return nil, err
	}
	return transfers.DenomTraces, nil
}

func (cc *ChainClient) QueryLatestHeight() (int64, error) {
	stat, err := cc.RPCClient.Status(context.Background())
	if err != nil {
		return -1, err
	} else if stat.SyncInfo.CatchingUp {
		return -1, fmt.Errorf("node at %s running chain %s not caught up", cc.Config.RPCAddr, cc.Config.ChainID)
	}
	return stat.SyncInfo.LatestBlockHeight, nil
}

// QueryBalanceWithAddress returns the amount of coins in theaccount with address as input
// TODO add pagination support

func (cc *ChainClient) QueryBalanceWithAddress(address string) (sdk.Coins, error) {
	p := &bankTypes.QueryAllBalancesRequest{Address: address, Pagination: DefaultPageRequest()}

	queryClient := bankTypes.NewQueryClient(cc)

	res, err := queryClient.AllBalances(context.Background(), p)
	if err != nil {
		return nil, err
	}

	return res.Balances, nil
}

// QueryTotalSupply returns the total supply of coins on a chain
func (cc *ChainClient) QueryTotalSupply(ctx context.Context, pageReq *query.PageRequest) (*bankTypes.QueryTotalSupplyResponse, error) {
	return bankTypes.NewQueryClient(cc).TotalSupply(ctx, &bankTypes.QueryTotalSupplyRequest{Pagination: pageReq})
}

func (cc *ChainClient) QueryDenomsMetadata(ctx context.Context, pageReq *query.PageRequest) (*bankTypes.QueryDenomsMetadataResponse, error) {
	return bankTypes.NewQueryClient(cc).DenomsMetadata(ctx, &bankTypes.QueryDenomsMetadataRequest{Pagination: pageReq})
}

func DefaultPageRequest() *querytypes.PageRequest {
	return &querytypes.PageRequest{
		Key:        []byte(""),
		Offset:     0,
		Limit:      1000,
		CountTotal: true,
	}
}

func (cc *ChainClient) QueryDelegatorValidators(ctx context.Context, address sdk.AccAddress) ([]string, error) {
	res, err := distTypes.NewQueryClient(cc).DelegatorValidators(ctx, &distTypes.QueryDelegatorValidatorsRequest{
		DelegatorAddress: cc.MustEncodeAccAddr(address),
	})
	if err != nil {
		return nil, err
	}
	return res.Validators, nil
}

func (cc *ChainClient) QueryDistributionParams(ctx context.Context) (*distTypes.Params, error) {
	res, err := distTypes.NewQueryClient(cc).Params(ctx, &distTypes.QueryParamsRequest{})
	if err != nil {
		return nil, err
	}
	return &res.Params, nil
}

func (cc *ChainClient) QueryDistributionCommission(ctx context.Context, address sdk.ValAddress) (sdk.DecCoins, error) {
	valAddr, err := cc.EncodeBech32ValAddr(address)
	if err != nil {
		return nil, err
	}
	request := distTypes.QueryValidatorCommissionRequest{
		ValidatorAddress: valAddr,
	}
	res, err := distTypes.NewQueryClient(cc).ValidatorCommission(ctx, &request)
	if err != nil {
		return nil, err
	}
	return res.Commission.Commission, nil
}

func (cc *ChainClient) QueryDistributionCommunityPool(ctx context.Context) (sdk.DecCoins, error) {
	res, err := distTypes.NewQueryClient(cc).CommunityPool(ctx, &distTypes.QueryCommunityPoolRequest{})
	if err != nil {
		return nil, err
	}
	return res.Pool, err
}

func (cc *ChainClient) QueryDistributionRewards(ctx context.Context, delegatorAddress sdk.AccAddress, validatorAddress sdk.ValAddress) (sdk.DecCoins, error) {
	delAddr, err := cc.EncodeBech32AccAddr(delegatorAddress)
	if err != nil {
		return nil, err
	}
	valAddr, err := cc.EncodeBech32ValAddr(validatorAddress)
	if err != nil {
		return nil, err
	}
	request := distTypes.QueryDelegationRewardsRequest{
		DelegatorAddress: delAddr,
		ValidatorAddress: valAddr,
	}
	res, err := distTypes.NewQueryClient(cc).DelegationRewards(ctx, &request)
	if err != nil {
		return nil, err
	}
	return res.Rewards, nil
}

func (cc *ChainClient) QueryAllDistributionRewards(ctx context.Context, delegatorAddr sdk.AccAddress) (sdk.DecCoins, error) {
	delAddr, err := cc.EncodeBech32AccAddr(delegatorAddr)
	if err != nil {
		return nil, err
	}
	request := distTypes.QueryDelegationTotalRewardsRequest{DelegatorAddress: delAddr}
	res, err := distTypes.NewQueryClient(cc).DelegationTotalRewards(ctx, &request)
	if err != nil {
		return nil, err
	}
	return res.Total, nil
}

// QueryDistributionSlashes returns all slashes of a validator, optionally pass the start and end height
func (cc *ChainClient) QueryDistributionSlashes(ctx context.Context, validatorAddress sdk.ValAddress, startHeight, endHeight uint64, pageReq *querytypes.PageRequest) (*distTypes.QueryValidatorSlashesResponse, error) {
	valAddr, err := cc.EncodeBech32ValAddr(validatorAddress)
	if err != nil {
		return nil, err
	}
	request := distTypes.QueryValidatorSlashesRequest{
		ValidatorAddress: valAddr,
		StartingHeight:   startHeight,
		EndingHeight:     endHeight,
		Pagination:       pageReq,
	}
	return distTypes.NewQueryClient(cc).ValidatorSlashes(ctx, &request)
}

// QueryDistributionValidatorRewards returns all the validator distribution rewards from a given height
func (cc *ChainClient) QueryDistributionValidatorRewards(ctx context.Context, validatorAddress sdk.ValAddress) (sdk.DecCoins, error) {
	valAddr, err := cc.EncodeBech32ValAddr(validatorAddress)
	if err != nil {
		return nil, err
	}
	request := distTypes.QueryValidatorOutstandingRewardsRequest{
		ValidatorAddress: valAddr,
	}
	res, err := distTypes.NewQueryClient(cc).ValidatorOutstandingRewards(ctx, &request)
	if err != nil {
		return nil, err
	}
	return res.Rewards.Rewards, nil
}

func (cc *ChainClient) QueryTx(ctx context.Context, hashHexStr string) (*sdk.TxResponse, error) {
	hash, err := hex.DecodeString(hashHexStr)
	if err != nil {
		return nil, err
	}

	node, err := cc.GetNode()
	if err != nil {
		return nil, err
	}

	resTx, err := node.Tx(context.Background(), hash, true)
	if err != nil {
		return nil, err
	}

	resBlocks, err := cc.getBlocksForTxResults([]*coretypes.ResultTx{resTx})
	if err != nil {
		return nil, err
	}

	out, err := cc.mkTxResults(resTx, resBlocks[resTx.Height])
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (cc *ChainClient) GetNode() (rpcclient.Client, error) {
	if cc.RPCClient == nil {
		return nil, errors.New("no RPC client is defined in offline mode")
	}

	return cc.RPCClient, nil
}

func (cc *ChainClient) getBlocksForTxResults(resTxs []*coretypes.ResultTx) (map[int64]*coretypes.ResultBlock, error) {
	node, err := cc.GetNode()
	if err != nil {
		return nil, err
	}

	resBlocks := make(map[int64]*coretypes.ResultBlock)

	for _, resTx := range resTxs {
		if _, ok := resBlocks[resTx.Height]; !ok {
			resBlock, err := node.Block(context.Background(), &resTx.Height)
			if err != nil {
				return nil, err
			}

			resBlocks[resTx.Height] = resBlock
		}
	}

	return resBlocks, nil
}

func (cc *ChainClient) mkTxResults(resTx *coretypes.ResultTx, resBlock *coretypes.ResultBlock) (*sdk.TxResponse, error) {
	txb, err := cc.Codec.TxConfig.TxDecoder()(resTx.Tx)
	if err != nil {
		return nil, err
	}
	p, ok := txb.(intoAny)
	if !ok {
		return nil, fmt.Errorf("expecting a type implementing intoAny, got: %T", txb)
	}
	any := p.AsAny()
	return sdk.NewResponseResultTx(resTx, any, resBlock.Block.Time.Format(time.RFC3339)), nil
}

// formatTxResults parses the indexed txs into a slice of TxResponse objects.
func (cc *ChainClient) formatTxResults(resTxs []*coretypes.ResultTx, resBlocks map[int64]*coretypes.ResultBlock) ([]*sdk.TxResponse, error) {
	var err error
	out := make([]*sdk.TxResponse, len(resTxs))
	for i := range resTxs {
		out[i], err = cc.mkTxResults(resTxs[i], resBlocks[resTxs[i].Height])
		if err != nil {
			return nil, err
		}
	}

	return out, nil
}

func (cc *ChainClient) QueryTxsByEvents(ctx context.Context, events []string, page, limit int, orderBy string) (*sdk.SearchTxsResult, error) {
	if len(events) == 0 {
		return nil, errors.New("must declare at least one event to search")
	}

	if page <= 0 {
		return nil, errors.New("page must greater than 0")
	}

	if limit <= 0 {
		return nil, errors.New("limit must greater than 0")
	}

	// XXX: implement ANY
	query := strings.Join(events, " AND ")

	node, err := cc.GetNode()
	if err != nil {
		return nil, err
	}

	resTxs, err := node.TxSearch(context.Background(), query, true, &page, &limit, orderBy)
	if err != nil {
		return nil, err
	}

	resBlocks, err := cc.getBlocksForTxResults(resTxs.Txs)
	if err != nil {
		return nil, err
	}

	txs, err := cc.formatTxResults(resTxs.Txs, resBlocks)
	if err != nil {
		return nil, err
	}

	result := sdk.NewSearchTxsResult(uint64(resTxs.TotalCount), uint64(len(txs)), uint64(page), uint64(limit), txs)

	return result, nil
}

// NewProposer returns a new Proposer given id and proposer
func NewProposer(proposalID uint64, proposer string) Proposer {
	return Proposer{proposalID, proposer}
}

func (cc *ChainClient) QueryProposerByTxQuery(ctx context.Context, proposalID uint64) (Proposer, error) {
	searchResult, err := cc.combineEvents(ctx,
		defaultPage,
		// Query legacy Msgs event action
		[]string{
			fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeyAction, types.TypeMsgSubmitProposal),
			fmt.Sprintf("%s.%s='%s'", types.EventTypeSubmitProposal, types.AttributeKeyProposalID, []byte(fmt.Sprintf("%d", proposalID))),
		},
		// Query proto Msgs event action
		[]string{
			fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeyAction, sdk.MsgTypeURL(&types.MsgSubmitProposal{})),
			fmt.Sprintf("%s.%s='%s'", types.EventTypeSubmitProposal, types.AttributeKeyProposalID, []byte(fmt.Sprintf("%d", proposalID))),
		},
	)
	if err != nil {
		return Proposer{}, err
	}
	for _, info := range searchResult.Txs {
		for _, msg := range info.GetTx().GetMsgs() {
			// there should only be a single proposal under the given conditions
			if subMsg, ok := msg.(*types.MsgSubmitProposal); ok {
				return NewProposer(proposalID, subMsg.Proposer), nil
			}
		}
	}
	return Proposer{}, fmt.Errorf("failed to find the proposer for proposalID %d", proposalID)
}

func (cc *ChainClient) combineEvents(ctx context.Context, page int, eventGroups ...[]string) (*sdk.SearchTxsResult, error) {
	allTxs := []*sdk.TxResponse{}
	for _, events := range eventGroups {
		res, err := cc.QueryTxsByEvents(ctx, events, page, defaultLimit, "")
		if err != nil {
			return nil, err
		}
		allTxs = append(allTxs, res.Txs...)
	}
	return &sdk.SearchTxsResult{Txs: allTxs}, nil
}

func (cc *ChainClient) QueryVoteByTxQuery(ctx context.Context, params types.QueryVoteParams) ([]byte, error) {
	searchResult, err := cc.combineEvents(
		ctx, defaultPage,
		// Query legacy Vote Msgs
		[]string{
			fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeyAction, types.TypeMsgVote),
			fmt.Sprintf("%s.%s='%s'", types.EventTypeProposalVote, types.AttributeKeyProposalID, []byte(fmt.Sprintf("%d", params.ProposalID))),
			fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeySender, []byte(params.Voter.String())),
		},
		// Query Vote proto Msgs
		[]string{
			fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeyAction, sdk.MsgTypeURL(&types.MsgVote{})),
			fmt.Sprintf("%s.%s='%s'", types.EventTypeProposalVote, types.AttributeKeyProposalID, []byte(fmt.Sprintf("%d", params.ProposalID))),
			fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeySender, []byte(params.Voter.String())),
		},
		// Query legacy VoteWeighted Msgs
		[]string{
			fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeyAction, types.TypeMsgVoteWeighted),
			fmt.Sprintf("%s.%s='%s'", types.EventTypeProposalVote, types.AttributeKeyProposalID, []byte(fmt.Sprintf("%d", params.ProposalID))),
			fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeySender, []byte(params.Voter.String())),
		},
		// Query VoteWeighted proto Msgs
		[]string{
			fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeyAction, sdk.MsgTypeURL(&types.MsgVoteWeighted{})),
			fmt.Sprintf("%s.%s='%s'", types.EventTypeProposalVote, types.AttributeKeyProposalID, []byte(fmt.Sprintf("%d", params.ProposalID))),
			fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeySender, []byte(params.Voter.String())),
		},
	)
	if err != nil {
		return nil, err
	}

	for _, info := range searchResult.Txs {
		for _, msg := range info.GetTx().GetMsgs() {
			// there should only be a single vote under the given conditions
			var vote *types.Vote
			if voteMsg, ok := msg.(*types.MsgVote); ok {
				vote = &types.Vote{
					Voter:      voteMsg.Voter,
					ProposalId: params.ProposalID,
					Options:    types.NewNonSplitVoteOption(voteMsg.Option),
				}
			}

			if voteWeightedMsg, ok := msg.(*types.MsgVoteWeighted); ok {
				vote = &types.Vote{
					Voter:      voteWeightedMsg.Voter,
					ProposalId: params.ProposalID,
					Options:    voteWeightedMsg.Options,
				}
			}

			if vote != nil {
				bz, err := json.Marshal(vote)
				if err != nil {
					return nil, err
				}
				return bz, nil
			}
		}
	}

	return nil, fmt.Errorf("address '%s' did not vote on proposalID %d", params.Voter, params.ProposalID)
}

func (cc *ChainClient) QueryVotesByTxQuery(ctx context.Context, params types.QueryProposalVotesParams) ([]byte, error) {
	var (
		votes      []types.Vote
		nextTxPage = defaultPage
		totalLimit = params.Limit * params.Page
	)

	// query interrupted either if we collected enough votes or tx indexer run out of relevant txs
	for len(votes) < totalLimit {
		// Search for both (legacy) votes and weighted votes.
		searchResult, err := cc.combineEvents(
			ctx, nextTxPage,
			// Query legacy Vote Msgs
			[]string{
				fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeyAction, types.TypeMsgVote),
				fmt.Sprintf("%s.%s='%s'", types.EventTypeProposalVote, types.AttributeKeyProposalID, []byte(fmt.Sprintf("%d", params.ProposalID))),
			},
			// Query Vote proto Msgs
			[]string{
				fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeyAction, sdk.MsgTypeURL(&types.MsgVote{})),
				fmt.Sprintf("%s.%s='%s'", types.EventTypeProposalVote, types.AttributeKeyProposalID, []byte(fmt.Sprintf("%d", params.ProposalID))),
			},
			// Query legacy VoteWeighted Msgs
			[]string{
				fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeyAction, types.TypeMsgVoteWeighted),
				fmt.Sprintf("%s.%s='%s'", types.EventTypeProposalVote, types.AttributeKeyProposalID, []byte(fmt.Sprintf("%d", params.ProposalID))),
			},
			// Query VoteWeighted proto Msgs
			[]string{
				fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeyAction, sdk.MsgTypeURL(&types.MsgVoteWeighted{})),
				fmt.Sprintf("%s.%s='%s'", types.EventTypeProposalVote, types.AttributeKeyProposalID, []byte(fmt.Sprintf("%d", params.ProposalID))),
			},
		)
		if err != nil {
			return nil, err
		}

		for _, info := range searchResult.Txs {
			for _, msg := range info.GetTx().GetMsgs() {
				if voteMsg, ok := msg.(*types.MsgVote); ok {
					votes = append(votes, types.Vote{
						Voter:      voteMsg.Voter,
						ProposalId: params.ProposalID,
						Options:    types.NewNonSplitVoteOption(voteMsg.Option),
					})
				}

				if voteWeightedMsg, ok := msg.(*types.MsgVoteWeighted); ok {
					votes = append(votes, types.Vote{
						Voter:      voteWeightedMsg.Voter,
						ProposalId: params.ProposalID,
						Options:    voteWeightedMsg.Options,
					})
				}
			}
		}
		if len(searchResult.Txs) != defaultLimit {
			break
		}

		nextTxPage++
	}
	start, end := client.Paginate(len(votes), params.Page, params.Limit, 100)
	if start < 0 || end < 0 {
		votes = []types.Vote{}
	} else {
		votes = votes[start:end]
	}

	bz, err := json.Marshal(votes)
	if err != nil {
		return nil, err
	}

	return bz, nil
}

func (cc *ChainClient) QueryDepositByTxQuery(ctx context.Context, params types.QueryDepositParams) ([]byte, error) {
	var deposits []types.Deposit
	// initial deposit was submitted with proposal, so must be queried separately
	initialDeposit, err := cc.queryInitialDepositByTxQuery(ctx, params.ProposalID)
	if err != nil {
		return nil, err
	}

	if !initialDeposit.Amount.IsZero() {
		deposits = append(deposits, initialDeposit)
	}

	searchResult, err := cc.combineEvents(
		ctx, defaultPage,
		// Query legacy Msgs event action
		[]string{
			fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeyAction, types.TypeMsgDeposit),
			fmt.Sprintf("%s.%s='%s'", types.EventTypeProposalDeposit, types.AttributeKeyProposalID, []byte(fmt.Sprintf("%d", params.ProposalID))),
		},
		// Query proto Msgs event action
		[]string{
			fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeyAction, sdk.MsgTypeURL(&types.MsgDeposit{})),
			fmt.Sprintf("%s.%s='%s'", types.EventTypeProposalDeposit, types.AttributeKeyProposalID, []byte(fmt.Sprintf("%d", params.ProposalID))),
		},
	)
	if err != nil {
		return nil, err
	}

	for _, info := range searchResult.Txs {
		for _, msg := range info.GetTx().GetMsgs() {
			if depMsg, ok := msg.(*types.MsgDeposit); ok {
				deposits = append(deposits, types.Deposit{
					Depositor:  depMsg.Depositor,
					ProposalId: params.ProposalID,
					Amount:     depMsg.Amount,
				})
			}
		}
	}

	bz, err := json.Marshal(deposits)
	if err != nil {
		return nil, err
	}
	return bz, nil
}

// queryInitialDepositByTxQuery will query for a initial deposit of a governance proposal by
// ID.
func (cc *ChainClient) queryInitialDepositByTxQuery(ctx context.Context, proposalID uint64) (types.Deposit, error) {
	searchResult, err := cc.combineEvents(
		ctx, defaultPage,
		// Query legacy Msgs event action
		[]string{
			fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeyAction, types.TypeMsgSubmitProposal),
			fmt.Sprintf("%s.%s='%s'", types.EventTypeSubmitProposal, types.AttributeKeyProposalID, []byte(fmt.Sprintf("%d", proposalID))),
		},
		// Query proto Msgs event action
		[]string{
			fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeyAction, sdk.MsgTypeURL(&types.MsgSubmitProposal{})),
			fmt.Sprintf("%s.%s='%s'", types.EventTypeSubmitProposal, types.AttributeKeyProposalID, []byte(fmt.Sprintf("%d", proposalID))),
		},
	)
	if err != nil {
		return types.Deposit{}, err
	}

	for _, info := range searchResult.Txs {
		for _, msg := range info.GetTx().GetMsgs() {
			// there should only be a single proposal under the given conditions
			if subMsg, ok := msg.(*types.MsgSubmitProposal); ok {
				return types.Deposit{
					ProposalId: proposalID,
					Depositor:  subMsg.Proposer,
					Amount:     subMsg.InitialDeposit,
				}, nil
			}
		}
	}
	return types.Deposit{}, sdkerrors.ErrNotFound.Wrapf("failed to find the initial deposit for proposalID %d", proposalID)
}

func (cc *ChainClient) QueryDepositsByTxQuery(ctx context.Context, params types.QueryProposalParams) ([]byte, error) {
	var deposits []types.Deposit

	// initial deposit was submitted with proposal, so must be queried separately
	initialDeposit, err := cc.queryInitialDepositByTxQuery(ctx, params.ProposalID)
	if err != nil {
		return nil, err
	}

	if !initialDeposit.Amount.IsZero() {
		deposits = append(deposits, initialDeposit)
	}

	searchResult, err := cc.combineEvents(
		ctx, defaultPage,
		// Query legacy Msgs event action
		[]string{
			fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeyAction, types.TypeMsgDeposit),
			fmt.Sprintf("%s.%s='%s'", types.EventTypeProposalDeposit, types.AttributeKeyProposalID, []byte(fmt.Sprintf("%d", params.ProposalID))),
		},
		// Query proto Msgs event action
		[]string{
			fmt.Sprintf("%s.%s='%s'", sdk.EventTypeMessage, sdk.AttributeKeyAction, sdk.MsgTypeURL(&types.MsgDeposit{})),
			fmt.Sprintf("%s.%s='%s'", types.EventTypeProposalDeposit, types.AttributeKeyProposalID, []byte(fmt.Sprintf("%d", params.ProposalID))),
		},
	)
	if err != nil {
		return nil, err
	}

	for _, info := range searchResult.Txs {
		for _, msg := range info.GetTx().GetMsgs() {
			if depMsg, ok := msg.(*types.MsgDeposit); ok {
				deposits = append(deposits, types.Deposit{
					Depositor:  depMsg.Depositor,
					ProposalId: params.ProposalID,
					Amount:     depMsg.Amount,
				})
			}
		}
	}
	bz, err := json.Marshal(deposits)
	if err != nil {
		return nil, err
	}
	return bz, nil
}
