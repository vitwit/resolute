import { getPalletByNetwork } from "./pallet";

test("expect valid pallet for existing network", () => {
  const pallet = getPalletByNetwork("Passage");
  expect(pallet.primary.light).toBe("#b7abcf");
});

test("expect default pallet for non existing network", () => {
    const pallet = getPalletByNetwork("abcdef");
    expect(pallet.primary).toEqual({
        light: "#b7abcf",
        main: "#400d40",
        dark: "#312941",
        contrastText: "#fff",
      });
  });
  