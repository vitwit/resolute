package model

import (
	"errors"
)

type CreateUserSignature struct {
	Address      string   `pg:"address" json:"address"`
	Signature    string   `pg:"signature" json:"signature"`
	Salt         float64  `pg:"salt" json:"salt"`
	PubKey       []Pubkey `pg:"pub_key" json:"pubKey"`
	Message      string   `pg:"message" json:"message"`
	PubKeyBase64 string   `pg:"pub_key_base64" json:"pubKeyBase64"`
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

	if len(cu.PubKey) == 0 {
		return errors.New("pubkey cannot be empty")
	}

	if cu.PubKeyBase64 == "" {
		return errors.New("pub key base 64 cannot be empty")
	}

	// message := []byte(cu.Message)
	// signatureBase64 := cu.Signature
	// publicKeyBase64 := cu.PubKeyBase64

	// // Decode the base64-encoded public key
	// publicKeyBytes, err := crypto.(publicKeyBase64)
	// if err != nil {
	// 	fmt.Println("Error decoding public key:", err)
	// 	return errors.New("pub key base 64 not able decode")
	// }

	// // Decode the base64-encoded signature
	// signatureBytes, err := crypto.DecodeSignature(signatureBase64)
	// if err != nil {
	// 	fmt.Println("Error decoding signature:", err)
	// 	return errors.New("Error decoding signature")
	// }

	// // Verify the signature using the public key
	// if publicKey, err := crypto.PubKeyFromBytes(publicKeyBytes); err == nil {
	// 	if publicKey.VerifySignature(crypto.SignMode_SIGN_MODE_DIRECT, message, signatureBytes) {
	// 		return nil
	// 	} else {
	// 		return errors.New("Signature is invalid.")
	// 	}
	// } else {
	// 	fmt.Println("Error creating public key:", err)
	// 	return errors.New("Error creating public key.")
	// }

	return nil
}
