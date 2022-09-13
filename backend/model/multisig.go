package model

import "errors"

type CreateAccount struct {
	Address   string       `json:"address"`
	Name      string       `json:"name"`
	Threshold int32        `json:"threshold"`
	Pubkeys   []PubkeysReq `json:"pubkeys"`
	ChainId   string       `json:"chainId"`
}

type PubkeysReq struct {
	Address string `json:"address"`
	Pubkey  Pubkey `json:"pubkey"`
}

func (a CreateAccount) Validate() error {
	if len(a.Address) == 0 {
		return errors.New("empty address is not allowed")
	}

	if len(a.Name) == 0 {
		return errors.New("name cannot be empty")
	}

	if len(a.ChainId) == 0 {
		return errors.New("chainId cannot be empty")
	}

	if a.Threshold <= 1 {
		return errors.New("threshold must be greater than 1")
	}

	if len(a.Pubkeys) <= 1 {
		return errors.New("more than one pubkey is required")
	}

	for _, pk := range a.Pubkeys {
		if err := pk.Validate(); err != nil {
			return err
		}
	}

	return nil
}

func (p PubkeysReq) Validate() error {
	if len(p.Address) == 0 {
		return errors.New("address cannot be empty")
	}

	return p.Pubkey.Validate()
}

type Pubkey struct {
	TypeUrl string `json:"typeUrl"`
	Value   string `json:"value"`
}

func (p Pubkey) Validate() error {
	if len(p.TypeUrl) == 0 {
		return errors.New("type_url cannot be empty")
	}

	if len(p.Value) == 0 {
		return errors.New("value cannot be empty")
	}

	return nil
}

type MultisigAccount struct {
	Address    string `json:"address"`
	Name       string `json:"name"`
	PubkeyType string `json:"pubkey_type"`
	Threshold  int32  `json:"threshold"`
}

type Pubkeys struct {
	MultisigAddress string `json:"multisig_address"`
	Pubkey          string `json:"pubkey"`
	Address         string `json:"address"`
}

type GetAccountsResponse struct {
	Address   string
	Name      string
	Threshold int
	PubKeys   []Pubkeys
}
