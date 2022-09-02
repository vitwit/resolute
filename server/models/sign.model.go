package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Signature struct {
	MultiSigAddress string 				   `json:"multisigAddress,omitempty" validate:"required"`
	Address 		string 				   `json:"address,omitempty" validate:"required"`
	TxId 			primitive.ObjectID 	   `json:"txId,omitempty" validate:"required"`
	BodyBytes 		string 				   `json:"bodyBytes,omitempty" validate:"required"`
	Signature 		string 				   `json:"signature,omitempty" validate:"required"`
}