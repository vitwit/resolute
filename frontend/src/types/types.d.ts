interface Msg {
  typeUrl: string;
  /*eslint-disable-next-line */
  value: any;
}

type KeyLimitPagination = {
  key?: string;
  limit?: number;
}

interface Pagination {
  next_key?: string;
  total: string;
}