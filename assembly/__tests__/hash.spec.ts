describe("hashing", (): void => {
  it("should compute the hash of an empty string", (): void => {
    let h = hashFinal(hashInit());
    let hex = bin2hex(h);
    expect<string>(hex).toBe(
      "0801c2383dcdde82db374ff8f205e5dfdc6ead563ce402a4bd60b6dabb8cb7cac088aefa0716792cb7f50425392b7aed5118c0f103f336d137b6aec411c3abcf"
    );
  });
});
