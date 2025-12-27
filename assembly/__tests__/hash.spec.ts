import {
    bin2hex,
    hash,
    hashInit,
    hashUpdate,
    hashFinal,
    hmac,
    sha256Hash,
    sha256HashInit,
    sha256HashUpdate,
    sha256HashFinal,
    sha256Hmac,
} from "../crypto";

describe("hashing (SHA-512)", (): void => {
    it("should compute the hash of an empty string", (): void => {
        let h = hashFinal(hashInit());
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e",
        );
    });

    it("should compute the hash of a non-empty string (SHA-512)", (): void => {
        let msg = Uint8Array.wrap(String.UTF8.encode("*"));
        let h = hash(msg);
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "7846cdd4c2b9052768b8901640122e5282e0b833a6a58312a7763472d448ee23781c7f08d90793fdfe71ffe74238cf6e4aa778cc9bb8cec03ea7268d4893a502",
        );
    });

    it("should compute the hash of a larger string (SHA-512)", (): void => {
        let msg = Uint8Array.wrap(
            String.UTF8.encode(
                "This is a test vector for the hash function, with an input larger than the block size",
            ),
        );
        let h = hash(msg);
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "59dac56c13b43989000f645d7f0660500d043c9758d05f0afc104729279e6458a6a4b56bc7f3051342aa38663ae06b3895b65e0512d5c0037c56cc84746d36a3",
        );
    });

    it("should compute the hash of a split string (SHA-512)", (): void => {
        let msg1 = Uint8Array.wrap(
            String.UTF8.encode("This is a test vector for the hash function, "),
        );
        let msg2 = Uint8Array.wrap(
            String.UTF8.encode("with an input larger than the block size"),
        );
        let st = hashInit();
        hashUpdate(st, msg1);
        hashUpdate(st, msg2);
        let h = hashFinal(st);
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "59dac56c13b43989000f645d7f0660500d043c9758d05f0afc104729279e6458a6a4b56bc7f3051342aa38663ae06b3895b65e0512d5c0037c56cc84746d36a3",
        );
    });

    it("should compute the hash of a block-aligned split string (SHA-512)", (): void => {
        let msg1 = Uint8Array.wrap(
            String.UTF8.encode(
                "This is a test vector for the hash function with a length of 64<",
            ),
        );
        let msg2 = Uint8Array.wrap(
            String.UTF8.encode(
                ">This is a test vector for the hash function with a length of 64",
            ),
        );
        let st = hashInit();
        hashUpdate(st, msg1);
        hashUpdate(st, msg2);
        let h = hashFinal(st);
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "1d0ad8f26d8df0a560d503d939062b267da4f8a309a3d5a2111609eb553c64d7f7582d10b18b4af31dd1a8ac90d3aaedeb035fb07423377fd6dcaf284ef63930",
        );
    });

    it("should compute a HMAC (SHA-512)", (): void => {
        let msg = Uint8Array.wrap(String.UTF8.encode("test"));
        let key = Uint8Array.wrap(String.UTF8.encode("test"));
        let h = hmac(msg, key);
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "9ba1f63365a6caf66e46348f43cdef956015bea997adeb06e69007ee3ff517df10fc5eb860da3d43b82c2a040c931119d2dfc6d08e253742293a868cc2d82015",
        );
    });
});

describe("hashing (SHA-256)", (): void => {
    it("should compute the hash of an empty string", (): void => {
        let h = sha256HashFinal(sha256HashInit());
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        );
    });

    it("should compute the hash of a non-empty string (SHA-256)", (): void => {
        let msg = Uint8Array.wrap(String.UTF8.encode("*"));
        let h = sha256Hash(msg);
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "684888c0ebb17f374298b65ee2807526c066094c701bcc7ebbe1c1095f494fc1",
        );
    });

    it("should compute the hash of a larger string (SHA-256)", (): void => {
        let msg = Uint8Array.wrap(
            String.UTF8.encode(
                "This is a test vector for the hash function, with an input larger than the block size",
            ),
        );
        let h = sha256Hash(msg);
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "e8f6644d4670f6c3d817af6dfcaec03ab6ab58042b03064f4915658e0bc4d443",
        );
    });

    it("should compute the hash of a 130-byte message (SHA-256)", (): void => {
        let msg = new Uint8Array(130);
        for (let i = 0; i < 130; i++) {
            msg[i] = 0x41; // 'A'
        }
        let h = sha256Hash(msg);
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "466a1916275bccba527763f930ca4a42a81f55e28559fb66108fc314cda386bd",
        );
    });

    it("should compute the hash of a subarray (SHA-256)", (): void => {
        let full = new Uint8Array(200);
        for (let i = 0; i < 200; i++) {
            full[i] = <u8>(i & 0xff);
        }
        let sub = full.subarray(64);
        let h = sha256Hash(sub);
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "416bb1cddb4057e57ed368d0536d4a23105d1ca39a5392f43ac26c237582c7be",
        );
    });

    it("should compute the hash of a split string (SHA-256)", (): void => {
        let msg1 = Uint8Array.wrap(
            String.UTF8.encode("This is a test vector for the hash function, "),
        );
        let msg2 = Uint8Array.wrap(
            String.UTF8.encode("with an input larger than the block size"),
        );
        let st = sha256HashInit();
        sha256HashUpdate(st, msg1);
        sha256HashUpdate(st, msg2);
        let h = sha256HashFinal(st);
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "e8f6644d4670f6c3d817af6dfcaec03ab6ab58042b03064f4915658e0bc4d443",
        );
    });

    it("should compute a HMAC (SHA-256)", (): void => {
        let msg = Uint8Array.wrap(String.UTF8.encode("test"));
        let key = Uint8Array.wrap(String.UTF8.encode("test"));
        let h = sha256Hmac(msg, key);
        let hex = bin2hex(h);
        expect<string>(hex).toBe(
            "88cd2108b5347d973cf39cdf9053d7dd42704876d8c9a9bd8e2d168259d3ddf7",
        );
    });
});
