import { authzMsgTypes } from "./authorizations";

test("test send type url exists", () => {
  expect(authzMsgTypes().length).toBeGreaterThan(1);
});
