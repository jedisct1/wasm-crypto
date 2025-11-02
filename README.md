[![npm version](https://badge.fury.io/js/wasm-crypto.svg)](https://www.npmjs.com/package/wasm-crypto)
[![GitHub Actions CI](https://nickdarl22@github.com/jedisct1/wasm-crypto/workflows/GitHub%20Actions%20CI/badge.svg)](https://github.com/jedisct1/wasm-crypto/actions)

# ![wasm-crypto](https://raw.github.com/jedisct1/wasm-crypto/master/logo.png)

A WebAssembly (via AssemblyScript) set of cryptographic primitives for building authentication and key exchange protocols.

Currently provides:

- [RFC 8032](https://tools.ietf.org/html/rfc8032)/libsodium-compatible detached [EdDSA signatures](https://doc.libsodium.org/public-key_cryptography/public-key_signatures)
- Ed25519 deterministic and non-deterministic signatures with cofactored verification.
- Deterministic and non-deterministic signatures over the Ristretto group.
- Hashing (simple + multi-parts)
- Authentication (HMAC-SHA-512, HMAC-SHA-256)
- Point validation, point addition, scalar multiplication with and without clamping over Edwards25519 using the standard Ed25519 point encoding.
- Fast encoded element validation, hash-to-group, addition, scalar multiplication over the [Ristretto](https://ristretto.group) prime-order group.
- Scalar reduction, scalar multiplication, scalar inversion mod the order of the prime-order groups for multiparty computation and oblivious pseudorandom functions.
- Constant-time comparison and encoding.

[Example use case](https://nickdarl22@github.com/jedisct1/fastly-terrarium-examples/tree/master/access_control_example).
