import {authzMsgTypes} from './authorizations';

test('test send type url exists', () => {
    expect(authzMsgTypes()).toContain({
        label: 'Send',
        typeURL: '/cosmos.bank.v1beta1.MsgSend'
    })
  });