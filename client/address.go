package client

import (
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// DecodeBech32AccAddr decodes a byte string from a Bech32 encoded string
func (cc *ChainClient) DecodeBech32AccAddr(addr string) (sdk.AccAddress, error) {
	return sdk.GetFromBech32(addr, cc.Config.AccountPrefix)
}

// EncodeBech32AccAddr returns a bech32 representation of address bytes
func (cc *ChainClient) EncodeBech32AccAddr(addr sdk.AccAddress) (string, error) {
	return sdk.Bech32ifyAddressBytes(cc.Config.AccountPrefix, addr)
}

// MustEncodeAccAddr returns a bech32 representation of address bytes
func (cc *ChainClient) MustEncodeAccAddr(addr sdk.AccAddress) string {
	enc, err := cc.EncodeBech32AccAddr(addr)
	if err != nil {
		panic(err)
	}
	return enc
}

// EncodeBech32ValAddr returns bech32 representation of address bytes.
func (cc *ChainClient) EncodeBech32ValAddr(addr sdk.ValAddress) (string, error) {
	return sdk.Bech32ifyAddressBytes(fmt.Sprintf("%s%s", cc.Config.AccountPrefix, "valoper"), addr)
}

// MustEncodeValAddr returns bech32 representation of address bytes
func (cc *ChainClient) MustEncodeValAddr(addr sdk.ValAddress) string {
	enc, err := cc.EncodeBech32ValAddr(addr)
	if err != nil {
		panic(err)
	}
	return enc
}

// DecodeBech32ValAddr decodes bytestring from Bech32 encoded string
func (cc *ChainClient) DecodeBech32ValAddr(addr string) (sdk.ValAddress, error) {
	return sdk.GetFromBech32(addr, fmt.Sprintf("%s%s", cc.Config.AccountPrefix, "valoper"))
}

// DecodeBech32ValPub decodes bytestring from Bech32 encoded string
func (cc *ChainClient) DecodeBech32ValPub(addr string) (sdk.AccAddress, error) {
	fmt.Println("prefix", cc.Config.AccountPrefix)
	return sdk.GetFromBech32(addr, fmt.Sprintf("%s%s", cc.Config.AccountPrefix, "valoperpub"))
}

// DecodeBech32ConsAddr decodes bytestring from Bech32 encoded string
func (cc *ChainClient) DecodeBech32ConsAddr(addr string) (sdk.AccAddress, error) {
	return sdk.GetFromBech32(addr, fmt.Sprintf("%s%s", cc.Config.AccountPrefix, "valcons"))
}

// DecodeBech32ConsPub decodes bytestring from Bech32 encoded string
func (cc *ChainClient) DecodeBech32ConsPub(addr string) (sdk.AccAddress, error) {
	return sdk.GetFromBech32(addr, fmt.Sprintf("%s%s", cc.Config.AccountPrefix, "valconspub"))
}
