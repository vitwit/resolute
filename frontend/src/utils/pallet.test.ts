import { getPalletByNetwork } from "./pallet";

test("expect valid pallet for existing network", () => {
  const pallet = getPalletByNetwork("Passage");
  expect(pallet.primary.light).toBe("#52c7b8");
});

test("expect default pallet for non existing network", () => {
    const pallet = getPalletByNetwork("abcdef");
    expect(pallet.primary).toEqual({
      main: '#009688',
      light: '#52c7b8',
      dark: '#00675b',
      contrastText: '#fff',
    });
  });
  