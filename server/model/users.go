package model

import (
	"errors"
)

type CreateUserSignature struct {
	Address      string `pg:"address" json:"address"`
	Signature    string `pg:"signature" json:"signature"`
	Salt         int64  `pg:"salt" json:"salt"`
	PubKey       string `pg:"pub_key" json:"pubKey"`
	Message      string `pg:"message" json:"message"`
	PubKeyBase64 string `pg:"pub_key_base64" json:"pubKeyBase64"`
}

func (cu CreateUserSignature) Validate() error {
	if len(cu.Address) == 0 {
		return errors.New("address is required")
	}

	if len(cu.Signature) == 0 {
		return errors.New("signature cannot be empty")
	}

	if cu.Salt == 0 {
		return errors.New("salt cannot be zero")
	}

	if cu.PubKey == "" {
		return errors.New("pubkey cannot be empty")
	}

	// TODO: need to verify the signature with message and pubkey

	return nil
}
