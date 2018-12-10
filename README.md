# eddsa-wasm-as

A WebAssembly (via AssemblyScript) implementation of the EdDSA signature scheme.

Provides libsodium-compatible detached [EdDSA signatures](https://download.libsodium.org/doc/public-key_cryptography/public-key_signatures) as well as non-deterministic signatures using Trevor Perrin's [generalized EdDSA](https://moderncrypto.org/mail-archive/curves/2017/000925.html) scheme.

SHA2 and field arithmetic implementations are derived from [TweetNacl](https://tweetnacl.cr.yp.to/).