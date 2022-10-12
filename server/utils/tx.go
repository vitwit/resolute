package utils

import "github.com/vitwit/resolute/server/model"

func GetStatus(s string) model.STATUS {
	status := model.Pending
	switch s {
	case "PENDING", "pending":
		status = model.Pending
	case "FAILED", "failed":
		status = model.Failed
	case "SUCCESS", "success", "history":
		status = model.Success
	default:
		status = model.Pending
	}

	return status
}
