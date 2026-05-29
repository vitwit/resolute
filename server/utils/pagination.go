package utils

import (
	"strconv"

	"github.com/labstack/echo/v4"
)

func ParsePaginationParams(c echo.Context) (int, int, bool, error) {
	p := c.QueryParam("page")
	l := c.QueryParam("limit")
	ct := c.QueryParam("count_total")

	page := 1
	var err error
	if p != "" {
		page, err = strconv.Atoi(p)
		if err != nil {
			return 0, 0, false, err
		}

		if page <= 0 {
			page = 1
		}
	}

	limit := DEFAULT_PAGE_LIMIT
	if l != "" {
		limit, err = strconv.Atoi(l)
		if err != nil {
			return 0, 0, false, err
		}

		if limit <= 0 {
			limit = DEFAULT_PAGE_LIMIT
		}
	}

	countTotal := false
	if ct != "" {
		countTotal, err = strconv.ParseBool(ct)
		if err != nil {
			return 0, 0, false, err
		}
	}

	return page, limit, countTotal, nil
}
