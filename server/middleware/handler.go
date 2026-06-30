package middleware

import "database/sql"

type (
	// wrapper for database instance
	Handler struct {
		DB *sql.DB
	}
)
