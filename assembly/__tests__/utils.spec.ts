describe("equals", (): void => {
  it("should test for equality", (): void => {
    let x = new Uint8Array(42);
    let y = new Uint8Array(42);
    for (let i = 0; i < 42; i++) {
      x[i] = y[i] = i;
    }
    expect<bool>(equals(x, y)).toBeTruthy();
  });
});

describe("memzero", (): void => {
  it("should zero an array", (): void => {
    let x = new Uint8Array(42);
    let y = new Uint8Array(42);
    for (let i = 0; i < 42; i++) {
      x[i] = y[i] = i;
    }
    memzero(x);
    expect<bool>(equals(x, y)).toBeFalsy();
    memzero(y);
    expect<bool>(equals(x, y)).toBeTruthy();
  });
});
