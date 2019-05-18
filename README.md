# ![wasm-crypto](https://raw.github.com/jedisct1/wasm-crypto/master/logo.png)

A WebAssembly (via AssemblyScript) set of cryptographic primitives for building authentication and key exchange protocols.

Currently provides:

- [RFC 8032](https://tools.ietf.org/html/rfc8032)/libsodium-compatible detached [EdDSA signatures](https://download.libsodium.org/doc/public-key_cryptography/public-key_signatures)
- Ed25519 signatures and non-deterministic signatures using Trevor Perrin's [generalized EdDSA](https://moderncrypto.org/mail-archive/curves/2017/000925.html) scheme
- Deterministic and non-deterministic Schnorr signatures over the Ristretto group.
- Hashing (simple + multi-parts)
- Authentication (HMAC-SHA-512)
- Point validation, point addition, scalar multiplication with and without clamping over Edwards25519 using the standard Ed25519 point encoding.
- Fast encoded element validation, hash-to-group, addition, scalar multiplication over the [Ristretto](https://ristretto.group) prime-order group.
- Scalar reduction, scalar multiplication, scalar inversion mod the order of the prime-order groups for multiparty computation and oblivious pseudorandom functions.
- Constant-time comparison and encoding.

## Javascript (TypeScript) bindings

WASM-Crypto currently lacks a nice set of Javascript wrappers.

This is fairly easy (see the [Terrarium access control example](https://github.com/jedisct1/fastly-terrarium-examples/tree/master/access_control_example) for an example), so if you think you can help, please do!
