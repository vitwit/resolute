package handler

import "database/sql"

type (
	// wrapper for database instance
	Handler struct {
		DB *sql.DB
	}
)
