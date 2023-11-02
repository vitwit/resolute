export interface Msg {
  typeUrl: string;
  value: any;
}

export type KeyLimitPagination = {
  key?: string;
  limit?: number;
}
