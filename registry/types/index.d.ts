import assets from './assets';
import chains from './chains';
import ibc from './ibc';
declare const _default: {
  assets: import('@registry/types').AssetList[];
  chains: import('@registry/types').Chain[];
  ibc: import('@registry/types').IBCInfo[];
};
export default _default;
export { assets, chains, ibc };