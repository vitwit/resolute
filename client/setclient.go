package client

import "github.com/cosmos/cosmos-sdk/client"

func (cc *ChainClient) SetClient() client.Context {

	cliCtx := client.Context{}.WithClient(cc.RPCClient).
		WithInterfaceRegistry(cc.Codec.InterfaceRegistry).
		WithChainID(cc.Config.ChainID).
		WithCodec(cc.Codec.Marshaler)

	return cliCtx
}
