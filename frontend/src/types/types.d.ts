interface Msg {
  typeUrl: string;
  /*eslint-disable-next-line */
  value: any;
}


interface NewMsg {
  ['@type']: string;
  /*eslint-disable-next-line */
  [key:string]: any;
}

type KeyLimitPagination = {
  key?: string;
  limit?: number;
}

interface Pagination {
  next_key?: string;
  total: string;
}