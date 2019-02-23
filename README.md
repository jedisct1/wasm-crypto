![wasm-crypto](https://raw.github.com/jedisct1/wasm-crypto/master/logo.png)
==============

A WebAssembly (via AssemblyScript) set of cryptographic primitives for building authentication and key exchange protocols.

Currently provides:

- [RFC 8032](https://tools.ietf.org/html/rfc8032)/libsodium-compatible detached [EdDSA signatures](https://download.libsodium.org/doc/public-key_cryptography/public-key_signatures)
- Non-deterministic signatures using Trevor Perrin's [generalized EdDSA](https://moderncrypto.org/mail-archive/curves/2017/000925.html) scheme
- Hashing (simple + multi-parts)
- Authentication (HMAC-SHA-512)
- Point validation, point addition, scalar multiplication with and without clamping over Curve25519 using the standard Ed25519 point encoding.
- Fast point validation, hash-to-point, point addition, scalar multiplication over the [Ristretto](https://ristretto.group) prime-order group.
- Scalar reduction, scalar multiplication, scalar inversion mod the order of the prime-order groups for multiparty computation and oblivious pseudorandom functions.
