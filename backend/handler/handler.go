package handler

import (
	"database/sql"
)

type (
	Handler struct {
		DB *sql.DB
	}
)

const (
	// Key (Should come from somewhere else).
	Key = "secret"
)
