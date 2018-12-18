# eddsa-wasm-as

A WebAssembly (via AssemblyScript) implementation of the EdDSA signature scheme and more.

Provides [RFC 8032](https://tools.ietf.org/html/rfc8032)/libsodium-compatible detached [EdDSA signatures](https://download.libsodium.org/doc/public-key_cryptography/public-key_signatures) as well as non-deterministic signatures using Trevor Perrin's [generalized EdDSA](https://moderncrypto.org/mail-archive/curves/2017/000925.html) scheme.

Plus:

- Multi-part hashing
- HMAC
- Scalar multiplication over Ed25519 with and without clamping, point validation, scalar reduction, scalar inversion mod L for secure multiparty computation and oblivious pseudorandom functions.
