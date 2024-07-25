package model

type ErrorResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Log     string `json:"log"`
}

type SuccessResponse struct {
	Status  string      `json:"status"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
	Count   interface{} `json:"count"`
}
