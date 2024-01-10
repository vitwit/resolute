import { fromBech32, toBech32 } from '@cosmjs/encoding';

export const getAddressByPrefix = (address: string, prefix: string) => {
  try {
    const rawAddress = fromBech32(address);
    return toBech32(prefix, rawAddress.data);
    /* eslint-disable-next-line */
  } catch (err: any) {
    return '';
  }
};
