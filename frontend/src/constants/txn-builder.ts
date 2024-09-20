export const TXN_BUILDER_MSGS: TxnMsgType[] = [
  'Send',
  'Delegate',
  'Undelegate',
  'Redelegate',
  'Vote',
  'Custom',
];

export const CUSTOM_MSG_VALUE_PLACEHOLDER = `Eg:
{\n  "fromAddress": "cosmos1e9yazjmsmjsqftsvkqv3hhfkqd45sk53uy7c3c",\n  "toAddress": "cosmos1480rvurtf360fugxt76ny8hrydzrlxm9gcvtgl",\n  "amount": [\n    {\n      "amount": "1",\n      "denom": "uatom"\n    }\n  ]\n}
`;

export const DEFAULT_MESSAGES_COUNT = {
  Send: 0,
  Delegate: 0,
  Redelegate: 0,
  Undelegate: 0,
  Vote: 0,
  Custom: 0,
};
