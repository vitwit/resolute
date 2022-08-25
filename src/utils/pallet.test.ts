import { getPalletByNetwork } from "./pallet";

test("expect valid pallet for existing network", () => {
  const pallet = getPalletByNetwork("Passage");
  expect(pallet.primary.light).toBe("#b7abcf");
});

test("expect default pallet for non existing network", () => {
    const pallet = getPalletByNetwork("abcdef");
    expect(pallet.primary).toEqual({
        light: "#6573c3",
        main: "#3f51b5",
        dark: "#2c387e",
        contrastText: "#fff",
      });
  });
  