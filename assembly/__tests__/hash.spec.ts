describe("hashing (SHA-512)", (): void => {
    it("should compute the hash of an empty string", (): void => {
        let h = hashFinal(hashInit());
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e"
        );
    });

    it("should compute the hash of a non-empty string (SHA-512)", (): void => {
        let msg = Uint8Array.wrap(String.UTF8.encode("*"));
        let h = hash(msg)
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "7846cdd4c2b9052768b8901640122e5282e0b833a6a58312a7763472d448ee23781c7f08d90793fdfe71ffe74238cf6e4aa778cc9bb8cec03ea7268d4893a502"
        );
    });

    it("hash512", (): void => {
        let msg = new Uint8Array(150);
        for (let i = 0; i < msg.length; i++) {
            let xmsg = msg.subarray(0, i);
            let h = hash(xmsg)
            let hex = bin2hex(h);
            log(hex);
        }
    });

    it("should compute the hash of a larger string (SHA-512)", (): void => {
        let msg = Uint8Array.wrap(String.UTF8.encode("This is a test vector for the hash function, with an input larger than the block size"));
        let h = hash(msg)
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "59dac56c13b43989000f645d7f0660500d043c9758d05f0afc104729279e6458a6a4b56bc7f3051342aa38663ae06b3895b65e0512d5c0037c56cc84746d36a3"
        );
    });
});


describe("hashing (SHA-256)", (): void => {
    it("should compute the hash of an empty string", (): void => {
        let h = sha256HashFinal(sha256HashInit());
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        );
    });

    it("should compute the hash of a non-empty string (SHA-256)", (): void => {
        let msg = Uint8Array.wrap(String.UTF8.encode("*"));
        let h = sha256Hash(msg)
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "684888c0ebb17f374298b65ee2807526c066094c701bcc7ebbe1c1095f494fc1"
        );
    });

    it("should compute the hash of a larger string (SHA-256)", (): void => {
        let msg = Uint8Array.wrap(String.UTF8.encode("This is a test vector for the hash function with an input largeThis is a test vector for the hash function with an input largerr"));
        let h = sha256Hash(msg)
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "9f2dcb9be5549cc1c18a01339a08dfb29adb6bcad0fad397993231f98d088c45"
        );
    });
});