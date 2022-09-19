package models

type Account struct {
    Name            string                 `json:"name,omitempty" validate:"required"`
    ChainID         string                 `json:"chainId,omitempty" validate:"required"`
    Address         string                 `json:"address,omitempty" validate:"required"`
    PubkeyJSON      PubkeyJSON             `json:"pubkeyJSON,omitempty" validate:"required"`
}

type PubkeyJSON struct {
    Type        string              `json:"type,omitempty"`
    Value       ValuePubKeys        `json:"value,omitempty"`
}

type ValuePubKeys struct {
    Threshold        string                        `json:"threshold,omitempty"`
    PubKeys         []PubKeysStruct             `json:"pubkeys,omitemtpy"`
}

type PubKeysStruct struct {
    Type            string                  `json:"type,omitempty"`
    Value           string                  `json:"value,omitempty"`
    Address         string                  `json:"address,omitempty"`
}