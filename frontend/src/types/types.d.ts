export interface Msg {
  typeUrl: string;
  /*eslint-disable-next-line */
  value: any;
}

export type KeyLimitPagination = {
  key?: string;
  limit?: number;
}
