package utils

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/require"
)

func TestParsePagination(t *testing.T) {
	type expectedResult struct {
		page       int
		limit      int
		countTotal bool
	}
	testCases := []struct {
		name           string
		setup          func() echo.Context
		expErr         bool
		errMessage     string
		expectedParams expectedResult
	}{
		{
			"no params",
			func() echo.Context {
				e := echo.New()
				req := httptest.NewRequest(http.MethodGet, "/", nil)

				req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
				rec := httptest.NewRecorder()
				return e.NewContext(req, rec)
			},
			false,
			"",
			expectedResult{
				page:       1,
				limit:      DEFAULT_PAGE_LIMIT,
				countTotal: false,
			},
		},
		{
			"expected valid page",
			func() echo.Context {
				e := echo.New()
				req := httptest.NewRequest(http.MethodGet, "/?page=10", nil)

				req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
				rec := httptest.NewRecorder()
				c := e.NewContext(req, rec)

				return c
			},
			false,
			"",
			expectedResult{
				page:       10,
				limit:      DEFAULT_PAGE_LIMIT,
				countTotal: false,
			},
		},
		{
			"expected valid page and limit",
			func() echo.Context {
				e := echo.New()
				req := httptest.NewRequest(http.MethodGet, "/?page=10&limit=20", nil)

				req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
				rec := httptest.NewRecorder()
				c := e.NewContext(req, rec)

				return c
			},
			false,
			"",
			expectedResult{
				page:       10,
				limit:      20,
				countTotal: false,
			},
		},
		{
			"expected valid params",
			func() echo.Context {
				e := echo.New()
				req := httptest.NewRequest(http.MethodGet, "/?page=10&limit=20&count_total=true", nil)

				req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
				rec := httptest.NewRecorder()
				c := e.NewContext(req, rec)

				return c
			},
			false,
			"",
			expectedResult{
				page:       10,
				limit:      20,
				countTotal: true,
			},
		},
		{
			"expected error for invalid values",
			func() echo.Context {
				e := echo.New()
				req := httptest.NewRequest(http.MethodGet, "/?page=abcd&limit=20&count_total=true", nil)

				req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
				rec := httptest.NewRecorder()
				c := e.NewContext(req, rec)

				return c
			},
			true,
			"strconv.Atoi: parsing \"abcd\": invalid syntax",
			expectedResult{},
		},
		{
			"negative values: expect default values",
			func() echo.Context {
				e := echo.New()
				req := httptest.NewRequest(http.MethodGet, "/?page=-10&limit=-20&count_total=true", nil)

				req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
				rec := httptest.NewRecorder()
				c := e.NewContext(req, rec)

				return c
			},
			false,
			"",
			expectedResult{
				page:       1,
				limit:      DEFAULT_PAGE_LIMIT,
				countTotal: true,
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			page, limit, countTotal, err := ParsePaginationParams(tc.setup())
			if tc.expErr {
				require.Error(t, err)
				require.EqualError(t, err, tc.errMessage)
			} else {
				require.NoError(t, err)
				require.Equal(t, page, tc.expectedParams.page)
				require.Equal(t, limit, tc.expectedParams.limit)
				require.Equal(t, countTotal, tc.expectedParams.countTotal)
			}
		})
	}
}
