package chainregistry

import chaininfo "github.com/vitwit/resolute/internal/chainInfo"

type ChainRegistry interface {
	GetChain(name string) (chaininfo.ChainInfo, error)
	ListChains() ([]string, error)
	SourceLink() string
}

func DefaultChainRegistry() ChainRegistry {
	return CosmosGithubRegistry{}
}
