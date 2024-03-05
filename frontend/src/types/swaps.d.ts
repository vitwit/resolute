import { Chain as SkipChain } from '@skip-router/core';

export type Chain = SkipChain & {
  prettyName: string;
};
