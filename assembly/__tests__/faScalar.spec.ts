describe("field arithmetic using scalars", (): void => {
  it("should add, sub and multiply", (): void => {
    let x = new Uint8Array(32);
    let y = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      x[i] = i;
      y[i] = i + 0x42;
    }
    let x_plus_y_times_10 = faScalarAdd(x, y);
    for (let i = 0; i < 9; i++) {
      x_plus_y_times_10 = faScalarAdd(x_plus_y_times_10, y);
    }

    let _10 = new Uint8Array(32);
    _10[0] = 10;
    let y10 = faScalarMult(y, _10);
    let x_plus_y10 = faScalarAdd(x, y10);

    expect<bool>(equals(x_plus_y_times_10, x_plus_y10)).toBeTruthy();
  });
});