export {};

declare global {
  interface Window {
    keplr: interface; // whatever type you want to give. (any,number,float etc)
  }
}