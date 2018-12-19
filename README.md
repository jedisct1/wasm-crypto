![wasm-crypto](https://raw.github.com/jedisct1/wasm-crypto/master/logo.png)
==============

A WebAssembly (via AssemblyScript) set of cryptographic primitives for building authentication and key exchange protocols.

Currently provides:

- [RFC 8032](https://tools.ietf.org/html/rfc8032)/libsodium-compatible detached [EdDSA signatures](https://download.libsodium.org/doc/public-key_cryptography/public-key_signatures)
- Non-deterministic signatures using Trevor Perrin's [generalized EdDSA](https://moderncrypto.org/mail-archive/curves/2017/000925.html) scheme
- Hashing (simple + multi-parts)
- HMAC-SHA-512
- Ed25519 point validation, point addition, scalar multiplication with and without clamping
- Scalar reduction, scalar inversion mod the order of the main subgroup for multiparty computation and oblivious pseudorandom functions.
