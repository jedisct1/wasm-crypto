// tslint:disable-next-line:no-reference
/// <reference path="../node_modules/assemblyscript/index.d.ts" />

import "allocator/tlsf";
import { precomp_base } from "./precomp";
export { memory };

// SHA512

function set_u8(t: Uint8Array, s: Uint8Array, o: isize): void {
    let ss = s.length;
    for (let i: isize = 0; i < ss; i++) {
        t[i + o] = s[i];
    }
}

@inline
function Sigma0(x: u64):
    u64 {
    return rotr(x, 28) ^ rotr(x, 34) ^ rotr(x, 39);
}

@inline function Sigma1(x: u64):
    u64 {
    return rotr(x, 14) ^ rotr(x, 18) ^ rotr(x, 41);
}

@inline function sigma0(x: u64):
    u64 {
    return rotr(x, 1) ^ rotr(x, 8) ^ (x >> 7);
}

@inline function sigma1(x: u64):
    u64 {
    return rotr(x, 19) ^ rotr(x, 61) ^ (x >> 6);
}

@inline function Ch(x: u64, y: u64, z: u64):
    u64 {
    return (x & y) ^ (~x & z);
}

@inline function Maj(x: u64, y: u64, z: u64):
    u64 {
    return (x & y) ^ (x & z) ^ (y & z);
}

function load64(x: Uint8Array, offset: isize):
    u64 {
    let u: u64 = 0;
    for (let i = 0; i < 8; ++i) {
        u = (u << 8) | x[offset + i];
    }
    return u;
}

function store64(x: Uint8Array, offset: isize, u: u64):
    void {
    for (let i = 7; i >= 0; --i) {
        x[offset + i] = u as u8;
        u >>= 8;
    }
}

let K: u64[] = [
    0x428a2f98d728ae22, 0x7137449123ef65cd, 0xb5c0fbcfec4d3b2f,
    0xe9b5dba58189dbbc, 0x3956c25bf348b538, 0x59f111f1b605d019,
    0x923f82a4af194f9b, 0xab1c5ed5da6d8118, 0xd807aa98a3030242,
    0x12835b0145706fbe, 0x243185be4ee4b28c, 0x550c7dc3d5ffb4e2,
    0x72be5d74f27b896f, 0x80deb1fe3b1696b1, 0x9bdc06a725c71235,
    0xc19bf174cf692694, 0xe49b69c19ef14ad2, 0xefbe4786384f25e3,
    0x0fc19dc68b8cd5b5, 0x240ca1cc77ac9c65, 0x2de92c6f592b0275,
    0x4a7484aa6ea6e483, 0x5cb0a9dcbd41fbd4, 0x76f988da831153b5,
    0x983e5152ee66dfab, 0xa831c66d2db43210, 0xb00327c898fb213f,
    0xbf597fc7beef0ee4, 0xc6e00bf33da88fc2, 0xd5a79147930aa725,
    0x06ca6351e003826f, 0x142929670a0e6e70, 0x27b70a8546d22ffc,
    0x2e1b21385c26c926, 0x4d2c6dfc5ac42aed, 0x53380d139d95b3df,
    0x650a73548baf63de, 0x766a0abb3c77b2a8, 0x81c2c92e47edaee6,
    0x92722c851482353b, 0xa2bfe8a14cf10364, 0xa81a664bbc423001,
    0xc24b8b70d0f89791, 0xc76c51a30654be30, 0xd192e819d6ef5218,
    0xd69906245565a910, 0xf40e35855771202a, 0x106aa07032bbd1b8,
    0x19a4c116b8d2d0c8, 0x1e376c085141ab53, 0x2748774cdf8eeb99,
    0x34b0bcb5e19b48a8, 0x391c0cb3c5c95a63, 0x4ed8aa4ae3418acb,
    0x5b9cca4f7763e373, 0x682e6ff3d6b2b8a3, 0x748f82ee5defb2fc,
    0x78a5636f43172f60, 0x84c87814a1f0ab72, 0x8cc702081a6439ec,
    0x90befffa23631e28, 0xa4506cebde82bde9, 0xbef9a3f7b2c67915,
    0xc67178f2e372532b, 0xca273eceea26619c, 0xd186b8c721c0c207,
    0xeada7dd6cde0eb1e, 0xf57d4f7fee6ed178, 0x06f067aa72176fba,
    0x0a637dc5a2c898a6, 0x113f9804bef90dae, 0x1b710b35131c471b,
    0x28db77f523047d84, 0x32caab7b40c72493, 0x3c9ebe0a15c9bebc,
    0x431d67c49c100d4c, 0x4cc5d4becb3e42b6, 0x597f299cfc657e2a,
    0x5fcb6fab3ad6faec, 0x6c44198c4a475817,
];

function _hashblocks(st: Uint8Array, m: Uint8Array, n: isize): isize {
    let z: Uint64Array = new Uint64Array(8), b: Uint64Array = new Uint64Array(8),
        a: Uint64Array = new Uint64Array(8),
        w: Uint64Array = new Uint64Array(16);
    let t: u64;

    for (let i = 0; i < 8; ++i) {
        z[i] = a[i] = load64(st, 8 * i);
    }
    let pos = 0;
    while (n >= 128) {
        for (let i = 0; i < 16; ++i) {
            w[i] = load64(m, 8 * i + pos);
        }
        for (let i = 0; i < 80; ++i) {
            for (let j = 0; j < 8; ++j) {
                b[j] = a[j];
            }
            t = a[7] + Sigma1(a[4]) + Ch(a[4], a[5], a[6]) + K[i] + w[i & 15];
            b[7] = t + Sigma0(a[0]) + Maj(a[0], a[1], a[2]);
            b[3] += t;
            for (let j = 0; j < 8; ++j) {
                a[(j + 1) & 7] = b[j];
            }
            if ((i & 15) === 15) {
                for (let j = 0; j < 16; ++j) {
                    w[j] += w[(j + 9) & 15] + sigma0(w[(j + 1) & 15]) +
                        sigma1(w[(j + 14) & 15]);
                }
            }
        }
        for (let i = 0; i < 8; ++i) {
            a[i] += z[i];
            z[i] = a[i];
        }
        pos += 128;
        n -= 128;
    }
    for (let i = 0; i < 8; ++i) {
        store64(st, 8 * i, z[i]);
    }
    return n;
}

let iv_: u8[] = [
    0x6a, 0x09, 0xe6, 0x67, 0xf3, 0xbc, 0xc9, 0x08, 0xbb, 0x67, 0xae, 0x85, 0x84,
    0xca, 0xa7, 0x3b, 0x3c, 0x6e, 0xf3, 0x72, 0xfe, 0x94, 0xf8, 0x2b, 0xa5, 0x4f,
    0xf5, 0x3a, 0x5f, 0x1d, 0x36, 0xf1, 0x51, 0x0e, 0x52, 0x7f, 0xad, 0xe6, 0x82,
    0xd1, 0x9b, 0x05, 0x68, 0x8c, 0x2b, 0x3e, 0x6c, 0x1f, 0x1f, 0x83, 0xd9, 0xab,
    0xfb, 0x41, 0xbd, 0x6b, 0x5b, 0xe0, 0xcd, 0x19, 0x13, 0x7e, 0x21, 0x79,
];

let iv: Uint8Array = new Uint8Array(64);
for (let i = 0; i < 64; ++i) {
    iv[i] = iv_[i];
}

function _hash_init(): Uint8Array {
    let st = new Uint8Array(64 + 128 + 8 * 2);

    for (let i = 0; i < 64; ++i) {
        st[i] = iv[i];
    }
    return st;
}

function _hash_update(
    st: Uint8Array, m: Uint8Array, n: isize, r: isize): isize {
    let w = st.subarray(64);
    let pos: isize = 0;
    let av: isize = 128 - r;
    let tc = n;

    if (tc > av) {
        tc = av;
    }
    set_u8(w, m.subarray(0, tc), r);
    r += tc;
    n -= tc;
    pos += tc;
    if (r === 128) {
        _hashblocks(st, w, 128);
        r = 0;
    }
    if (r === 0 && n > 0) {
        let rb = _hashblocks(st, m.subarray(pos), n);
        if (rb > 0) {
            set_u8(w, m.subarray(pos + n - rb), r);
            r += rb;
        }
    }
    return r;
}

function _hash_final(
    st: Uint8Array, out: Uint8Array, t: isize, r: isize): void {
    let w = st.subarray(64);
    let x = new Uint8Array(256);

    set_u8(x, w.subarray(0, r), 0);
    x[r] = 128;
    r = 256 - 128 * isize(r < 112);
    x[r - 9] = 0;
    store64(x, r - 8, t << 3);
    _hashblocks(st, x, r);
    for (let i = 0; i < 64; ++i) {
        out[i] = st[i];
    }
}

function _hash(out: Uint8Array, m: Uint8Array, n: isize): void {
    let st = _hash_init();
    let r = _hash_update(st, m, n, 0);

    _hash_final(st, out, n, r);
}

// HMAC

function _hmac(m: Uint8Array, k: Uint8Array): Uint8Array {
    let b = new Uint8Array(256);
    let ib = b.subarray(128);
    if (k.length > 128) {
        k = hash(k);
    }
    set_u8(b, k, 0);
    for (let i = 0; i < 128; ++i) {
        b[i] ^= 0x5c;
    }
    set_u8(ib, k, 0);
    for (let i = 0; i < 128; ++i) {
        ib[i] ^= 0x36;
    }
    let st = _hash_init();
    let r = _hash_update(st, ib, 128, 0);
    r = _hash_update(st, m, m.length, r);
    _hash_final(st, b, 128 + m.length, r);

    return hash(b);
}

// helpers

function _verify_32(x: Uint8Array, y: Uint8Array): bool {
    let d: u8 = 0;

    for (let i = 0; i < 32; ++i) {
        d |= x[i] ^ y[i];
    }
    return d === 0;
}

// mod(2^255-19) field arithmetic

@inline
function fe25519n():
    Int64Array {
    return new Int64Array(16);
}

function fe25519(init: i64[]):
    Int64Array {
    let r: Int64Array = new Int64Array(16);

    for (let i = 0, len = init.length; i < len; ++i) {
        r[i] = init[i];
    }
    return r;
}

let fe25519_0: Int64Array = fe25519n();
let fe25519_1: Int64Array = fe25519([1]);
let D: Int64Array = fe25519([
    0x78a3,
    0x1359,
    0x4dca,
    0x75eb,
    0xd8ab,
    0x4141,
    0x0a4d,
    0x0070,
    0xe898,
    0x7779,
    0x4079,
    0x8cc7,
    0xfe73,
    0x2b6f,
    0x6cee,
    0x5203,
]);
let D2: Int64Array = fe25519([
    0xf159,
    0x26b2,
    0x9b94,
    0xebd6,
    0xb156,
    0x8283,
    0x149a,
    0x00e0,
    0xd130,
    0xeef3,
    0x80f2,
    0x198e,
    0xfce7,
    0x56df,
    0xd9dc,
    0x2406,
]);
let X: Int64Array = fe25519([
    0xd51a,
    0x8f25,
    0x2d60,
    0xc956,
    0xa7b2,
    0x9525,
    0xc760,
    0x692c,
    0xdc5c,
    0xfdd6,
    0xe231,
    0xc0a4,
    0x53fe,
    0xcd6e,
    0x36d3,
    0x2169,
]);
let Y: Int64Array = fe25519([
    0x6658,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
    0x6666,
]);
let I: Int64Array = fe25519([
    0xa0b0,
    0x4a0e,
    0x1b27,
    0xc4ee,
    0xe478,
    0xad2f,
    0x1806,
    0x2f43,
    0xd7a7,
    0x3dfb,
    0x0099,
    0x2b4d,
    0xdf0b,
    0x4fc1,
    0x2480,
    0x2b83,
]);

function fe25519_copy(r: Int64Array, a: Int64Array): void {
    for (let i = 0; i < 16; ++i) {
        r[i] = a[i];
    }
}

function fe25519_car(o: Int64Array): void {
    let c: i64;

    for (let i = 0; i < 16; ++i) {
        o[i] += (1 << 16);
        c = o[i] >> 16;
        o[(i + 1) * isize(i < 15)] += c - 1 + 37 * (c - 1) * isize(i === 15);
        o[i] -= c << 16;
    }
}

function fe25519_sel(p: Int64Array, q: Int64Array, b: i64): void {
    let t: i64;
    let c: i64 = ~(b - 1);

    for (let i = 0; i < 16; ++i) {
        t = c & (p[i] ^ q[i]);
        p[i] ^= t;
        q[i] ^= t;
    }
}

function fe25519_pack(o: Uint8Array, n: Int64Array): void {
    let b: i64;
    let m = fe25519n();
    let t = fe25519n();

    for (let i: isize = 0; i < 16; i++) {
        t[i] = n[i];
    }
    fe25519_car(t);
    fe25519_car(t);
    fe25519_car(t);
    for (let j = 0; j < 2; ++j) {
        m[0] = t[0] - 0xffed;
        for (let i = 1; i < 15; ++i) {
            m[i] = t[i] - 0xffff - ((m[i - 1] >> 16) & 1);
            m[i - 1] &= 0xffff;
        }
        m[15] = t[15] - 0x7fff - ((m[14] >> 16) & 1);
        b = (m[15] >> 16) & 1;
        m[14] &= 0xffff;
        fe25519_sel(t, m, 1 - b);
    }
    for (let i = 0; i < 16; ++i) {
        let ti = t[i] as u32;
        o[2 * i + 0] = ti & 0xff;
        o[2 * i + 1] = ti >> 8;
    }
}

function fe25519_eq(a: Int64Array, b: Int64Array): bool {
    let c = new Uint8Array(32), d = new Uint8Array(32);

    fe25519_pack(c, a);
    fe25519_pack(d, b);

    return _verify_32(c, d);
}

function fe25519_par(a: Int64Array): u8 {
    let d = new Uint8Array(32);
    fe25519_pack(d, a);

    return d[0] & 1;
}

function fe25519_unpack(o: Int64Array, n: Uint8Array): void {
    for (let i = 0; i < 16; ++i) {
        o[i] = (n[2 * i] as i64) + (n[2 * i + 1] as i64 << 8);
    }
    o[15] &= 0x7fff;
}

function fe25519_add(o: Int64Array, a: Int64Array, b: Int64Array): void {
    for (let i = 0; i < 16; ++i) {
        o[i] = (a[i] + b[i]);
    }
}

function fe25519_sub(o: Int64Array, a: Int64Array, b: Int64Array): void {
    for (let i = 0; i < 16; ++i) {
        o[i] = a[i] - b[i];
    }
}

function fe25519_mul(o: Int64Array, a: Int64Array, b: Int64Array): void {
    let t = new Int64Array(31);

    for (let i = 0; i < 16; ++i) {
        for (let j = 0; j < 16; ++j) {
            t[i + j] += a[i] * b[j];
        }
    }
    for (let i = 0; i < 15; ++i) {
        t[i] += 38 as i64 * t[i + 16];
    }
    for (let i = 0; i < 16; ++i) {
        o[i] = t[i];
    }
    fe25519_car(o);
    fe25519_car(o);
}

function fe25519_sq(o: Int64Array, a: Int64Array): void {
    fe25519_mul(o, a, a);
}

function fe25519_inv(o: Int64Array, i: Int64Array): void {
    let c = fe25519n();

    for (let a = 0; a < 16; ++a) {
        c[a] = i[a];
    }
    for (let a = 253; a >= 0; --a) {
        fe25519_sq(c, c);
        if (a !== 2 && a !== 4) {
            fe25519_mul(c, c, i);
        }
    }
    for (let a = 0; a < 16; ++a) {
        o[a] = c[a];
    }
}

function fe25519_pow2523(o: Int64Array, i: Int64Array): void {
    let c = fe25519n();

    for (let a = 0; a < 16; ++a) {
        c[a] = i[a];
    }
    for (let a = 250; a >= 0; --a) {
        fe25519_sq(c, c);
        if (a !== 1) {
            fe25519_mul(c, c, i);
        }
    }
    for (let a = 0; a < 16; ++a) {
        o[a] = c[a];
    }
}

let _L: Int64Array = new Int64Array(32);
_L[0] = 237;
_L[1] = 211;
_L[2] = 245;
_L[3] = 92;
_L[4] = 26;
_L[5] = 99;
_L[6] = 18;
_L[7] = 88;
_L[8] = 214;
_L[9] = 156;
_L[10] = 247;
_L[11] = 162;
_L[12] = 222;
_L[13] = 249;
_L[14] = 222;
_L[15] = 20;
_L[31] = 16;

function fe25519_modL(r: Uint8Array, x: Int64Array): void {
    let carry: i64;

    for (let i = 63; i >= 32; --i) {
        carry = 0;
        let k = i - 12;
        for (let j = i - 32; j < k; ++j) {
            x[j] += carry - 16 * x[i] * _L[j - (i - 32)];
            carry = (x[j] + 128) >> 8;
            x[j] -= carry * 256;
        }
        x[k] += carry;
        x[i] = 0;
    }
    carry = 0;
    for (let j = 0; j < 32; ++j) {
        x[j] += carry - (x[31] >> 4) * _L[j];
        carry = x[j] >> 8;
        x[j] &= 255;
    }
    for (let j = 0; j < 32; ++j) {
        x[j] -= carry * _L[j];
    }
    for (let i = 0; i < 32; ++i) {
        x[i + 1] += x[i] >> 8;
        r[i] = x[i] as u8;
    }
}

function fe25519_reduce(r: Uint8Array): void {
    let x = new Int64Array(64);

    for (let i = 0; i < 64; ++i) {
        x[i] = r[i];
    }
    for (let i = 0; i < 64; ++i) {
        r[i] = 0;
    }
    fe25519_modL(r, x);
}

// Ed25519 group arithmetic

@inline
function ge25519n():
    Int64Array[] {
    let e: Int64Array[] = [fe25519n(), fe25519n(), fe25519n(), fe25519n()];

    return e;
}

function add(p: Int64Array[], q: Int64Array[]):
    void {
    let a = fe25519n(), b = fe25519n(), c = fe25519n(), d = fe25519n(),
        e = fe25519n(), f = fe25519n(), g = fe25519n(), h = fe25519n(),
        t = fe25519n();

    fe25519_sub(a, p[1], p[0]);
    fe25519_sub(t, q[1], q[0]);
    fe25519_mul(a, a, t);
    fe25519_add(b, p[0], p[1]);
    fe25519_add(t, q[0], q[1]);
    fe25519_mul(b, b, t);
    fe25519_mul(c, p[3], q[3]);
    fe25519_mul(c, c, D2);
    fe25519_mul(d, p[2], q[2]);
    fe25519_add(d, d, d);
    fe25519_sub(e, b, a);
    fe25519_sub(f, d, c);
    fe25519_add(g, d, c);
    fe25519_add(h, b, a);

    fe25519_mul(p[0], e, f);
    fe25519_mul(p[1], h, g);
    fe25519_mul(p[2], g, f);
    fe25519_mul(p[3], e, h);
}

@inline function cswap(p: Int64Array[], q: Int64Array[], b: u8):
    void {
    for (let i = 0; i < 4; ++i) {
        fe25519_sel(p[i], q[i], b);
    }
}

function pack(r: Uint8Array, p: Int64Array[]):
    void {
    let tx = fe25519n(), ty = fe25519n(), zi = fe25519n();
    fe25519_inv(zi, p[2]);
    fe25519_mul(tx, p[0], zi);
    fe25519_mul(ty, p[1], zi);
    fe25519_pack(r, ty);
    r[31] ^= fe25519_par(tx) << 7;
}

function scalarmult(p: Int64Array[], q: Int64Array[], s: Uint8Array):
    void {
    let b: u8;

    fe25519_copy(p[0], fe25519_0);
    fe25519_copy(p[1], fe25519_1);
    fe25519_copy(p[2], fe25519_1);
    fe25519_copy(p[3], fe25519_0);
    for (let i = 255; i >= 0; --i) {
        b = (s[(i >> 3)] >> (i as u8 & 7)) & 1;
        cswap(p, q, b);
        add(q, p);
        add(p, p);
        cswap(p, q, b);
    }
}

function scalarmult_base(p: Int64Array[], s: Uint8Array):
    void {
    let q: Int64Array[] = ge25519n();
    let t: Int64Array[] = ge25519n();
    let b: u8;

    fe25519_copy(p[0], fe25519_0);
    fe25519_copy(p[1], fe25519_1);
    fe25519_copy(p[2], fe25519_1);
    fe25519_copy(p[3], fe25519_0);

    for (let i: isize = 0; i <= 255; ++i) {
        b = (s[(i >>> 3)] >>> (i as u8 & 7)) & 1;
        q[0] = fe25519(precomp_base[i][0]);
        q[1] = fe25519(precomp_base[i][1]);
        q[2] = fe25519(precomp_base[i][2]);
        q[3] = fe25519(precomp_base[i][3]);
        cswap(t, p, b);
        add(t, q);
        cswap(t, p, b);
        add(q, q);
    }
}

// EdDSA

function _sign_keypair_from_seed(sk: Uint8Array):
    void {
    let pk = new Uint8Array(32);
    let d = new Uint8Array(64);
    let p = ge25519n();

    _hash(d, sk, 32);
    d[0] &= 248;
    d[31] = (d[31] & 127) | 64;
    scalarmult_base(p, d);
    pack(pk, p);
    for (let i = 0; i < 32; ++i) {
        sk[i + 32] = pk[i];
    }
}

function unpackneg(r: Int64Array[], p: Uint8Array):
    bool {
    let t = fe25519n(), chk = fe25519n(), num = fe25519n(), den = fe25519n(),
        den2 = fe25519n(), den4 = fe25519n(), den6 = fe25519n();

    fe25519_copy(r[2], fe25519_1);
    fe25519_unpack(r[1], p);
    fe25519_sq(num, r[1]);
    fe25519_mul(den, num, D);
    fe25519_sub(num, num, r[2]);
    fe25519_add(den, r[2], den);
    fe25519_sq(den2, den);
    fe25519_sq(den4, den2);
    fe25519_mul(den6, den4, den2);
    fe25519_mul(t, den6, num);
    fe25519_mul(t, t, den);
    fe25519_pow2523(t, t);
    fe25519_mul(t, t, num);
    fe25519_mul(t, t, den);
    fe25519_mul(t, t, den);
    fe25519_mul(r[0], t, den);
    fe25519_sq(chk, r[0]);
    fe25519_mul(chk, chk, den);
    if (!fe25519_eq(chk, num)) {
        fe25519_mul(r[0], r[0], I);
    }
    fe25519_sq(chk, r[0]);
    fe25519_mul(chk, chk, den);
    if (!fe25519_eq(chk, num)) {
        return false;
    }
    if (fe25519_par(r[0]) === (p[31] >> 7)) {
        fe25519_sub(r[0], fe25519_0, r[0]);
    }
    fe25519_mul(r[3], r[0], r[1]);

    return true;
}

function is_canonical(s: Uint8Array):
    bool {
    let c: u32 = (s[31] & 0x7f) ^ 0x7f;

    for (let i = 30; i > 0; --i) {
        c |= s[i] ^ 0xff;
    }
    c = (c - 1) >> 8;
    let d = ((0xed - 1) as u32 - (s[0] as u32)) >> 8;

    return !(c & d & 1);
}

// Ed25519

let B = new Uint8Array(32);
for (let i = 0; i < 32; ++i) {
    B[i] = 0x66;
}

function _sign_synthetic_r_hv(
    hs: Uint8Array, r: isize, Z: Uint8Array, sk: Uint8Array): isize {
    let zeros = new Uint8Array(128);
    let empty_labelset = new Uint8Array(3);
    let Zlen = Z.length;

    if (Zlen > 128 - (32 + 3)) {
        Z = hash(Z);
        Zlen = Z.length;
    }
    empty_labelset[0] = 0x02;

    r = _hash_update(hs, B, 32, r);
    r = _hash_update(hs, empty_labelset, 3, r);
    r = _hash_update(hs, Z, Zlen, r);
    r = _hash_update(hs, zeros, 128 - (32 + 3 + Zlen) % 128, r);
    r = _hash_update(hs, sk, 32, r);
    r = _hash_update(hs, zeros, 128 - 32 % 128, r);
    r = _hash_update(hs, empty_labelset, 3, r);
    r = _hash_update(hs, sk.subarray(32), 32, r);

    return r;
}

function _sign_detached(
    sig: Uint8Array, m: Uint8Array, sk: Uint8Array, Z: Uint8Array): void {
    let R = ge25519n();
    let az = new Uint8Array(64);
    let nonce = new Uint8Array(64);
    let hram = new Uint8Array(64);
    let x = new Int64Array(64);
    let mlen = m.length;
    let hs = _hash_init();
    let r: isize = 0;

    _hash(az, sk, 32);
    if (Z.length > 0) {
        r = _sign_synthetic_r_hv(hs, r, Z, az);
    } else {
        r = _hash_update(hs, az.subarray(32), 32, r);
    }
    r = _hash_update(hs, m, mlen, r);
    _hash_final(hs, nonce, 32 + mlen, r);
    set_u8(sig, sk.subarray(32), 32);

    fe25519_reduce(nonce);
    scalarmult_base(R, nonce);
    pack(sig, R);

    hs = _hash_init();
    r = _hash_update(hs, sig, 64, 0);
    r = _hash_update(hs, m, mlen, r);
    _hash_final(hs, hram, 64 + mlen, r);
    fe25519_reduce(hram);
    az[0] &= 248;
    az[31] = (az[31] & 127) | 64;
    for (let i = 0; i < 32; ++i) {
        x[i] = nonce[i];
    }
    for (let i = 0; i < 32; ++i) {
        for (let j = 0; j < 32; ++j) {
            x[i + j] += (hram[i] as i64) * (az[j] as i64);
        }
    }
    fe25519_modL(sig.subarray(32), x);
}

function _sign_verify_detached(
    sig: Uint8Array, m: Uint8Array, pk: Uint8Array): bool {
    let A = ge25519n();
    let R = ge25519n();
    let rcheck = new Uint8Array(32);
    let h = new Uint8Array(64);

    if (!is_canonical(sig.subarray(32)) || !is_canonical(pk)) {
        return false;
    }
    if (!unpackneg(A, pk)) {
        return false;
    }
    let hs = _hash_init();
    let r = _hash_update(hs, sig, 32, 0);
    r = _hash_update(hs, pk, 32, r);
    r = _hash_update(hs, m, m.length, r);
    _hash_final(hs, h, 32 + 32 + m.length, r);
    fe25519_reduce(h);

    scalarmult(R, A, h);
    scalarmult_base(A, sig.subarray(32));
    add(R, A);
    pack(rcheck, R);

    return _verify_32(rcheck, sig.subarray(0, 32));
}

// Exported API

/**
 * Signature size, in bytes
 */
export const sign_BYTES: isize = 64;

/**
 * Public key size, in bytes
 */
export const sign_PUBLICKEYBYTES: isize = 32;

/**
 * Secret key size, in bytes
 */
export const sign_SECRETKEYBYTES: isize = 64;

/**
 * Seed size, in bytes
 */
export const sign_SEEDBYTES: isize = 32;

/**
 * Recommended random bytes size, in bytes
 */
export const sign_RANDBYTES: isize = 32;

/**
 * Hash function output size, in bytes
 */
export const hash_BYTES: isize = 64;

/**
 * HMAC output size, in bytes
 */
export const hmac_BYTES: isize = 64;

/**
 * Fill an array with zeros
 * @param x Array to clear
 */
export function memzero(x: Uint8Array): void {
    for (let i = 0, j = x.length; i < j; ++i) {
        x[i] = 0;
    }
}

/**
 * Check two arrays for equality
 * @param x First array
 * @param y Second array
 * @returns true if `x === y`
 */
export function equals(x: Uint8Array, y: Uint8Array): bool {
    let len = x.length;
    let d: u8 = 0;

    if (len === 0 || len !== y.length) {
        return false;
    }
    for (let i = 0; i < len; ++i) {
        d |= x[i] ^ y[i];
    }
    return d === 0;
}

/**
 * Sign a message and returns its signature.
 * @param m Message to sign
 * @param sk Secret key (`sign_SECRETKEYBYTES` long)
 * @param Z Random bytes. This can be an empty array to produce deterministic
 *     signatures
 * @returns Signature
 */
export function sign(m: Uint8Array, sk: Uint8Array, Z: Uint8Array): Uint8Array {
    let sig = new Uint8Array(sign_BYTES);
    _sign_detached(sig, m, sk, Z);

    return sig;
}

/**
 * Verify a signature
 * @param m Message
 * @param sig Signature
 * @param pk Public key
 * @returns `true` on success
 */
export function sign_verify(
    m: Uint8Array, sig: Uint8Array, pk: Uint8Array): bool {
    if (sig.length !== sign_BYTES) {
        throw new Error("bad signature size");
    }
    if (pk.length !== sign_PUBLICKEYBYTES) {
        throw new Error("bad public key size");
    }
    return _sign_verify_detached(sig, m, pk);
}

/**
 * Create a new key pair from a seed
 * @param seed Seed (`sign_SEEDBYTES` long)
 * @returns Key pair
 */
export function sign_keypair_from_seed(seed: Uint8Array): Uint8Array {
    if (seed.length !== sign_SEEDBYTES) {
        throw new Error("bad seed size");
    }
    let sk = new Uint8Array(sign_SECRETKEYBYTES);
    for (let i: isize = 0; i < 32; i++) {
        sk[i] = seed[i];
    }
    _sign_keypair_from_seed(sk);

    return sk;
}

/**
 * Return the public key from a key pair
 * @param kp Key pair
 * @returns Public key
 */
export function sign_public_key(kp: Uint8Array): Uint8Array {
    const len = sign_PUBLICKEYBYTES;
    let pk = new Uint8Array(len);

    for (let i = 0; i < len; ++i) {
        pk[i] = kp[i + 32];
    }
    return pk;
}

/**
 * Return the secret key from a key pair
 * @param kp Key pair
 * @returns Secret key
 */
export function sign_secret_key(kp: Uint8Array): Uint8Array {
    const len = sign_SECRETKEYBYTES;
    let sk = new Uint8Array(len);

    for (let i = 0; i < len; ++i) {
        sk[i] = kp[i];
    }
    return sk;
}

/**
 * Initialize a multipart hash computation
 * @returns A hash function state
 */
export function hash_init(): Uint8Array {
    return _hash_init();
}

/**
 * Absorb data to be hashed
 * @param st Hash function state
 * @param m (partial) message
 */
export function hash_update(st: Uint8Array, m: Uint8Array): void {
    let r = load64(st, 64 + 128);
    let t = load64(st, 64 + 128 + 8);
    let n = m.length;

    t += n;
    r = _hash_update(st, m, n, r as isize);
    store64(st, 64 + 128, r as u64);
    store64(st, 64 + 128 + 8, t as u64);
}

/**
 * Finalize a hash computation
 * @param st Hash function state
 * @returns Hash
 */
export function hash_final(st: Uint8Array): Uint8Array {
    let h = new Uint8Array(hash_BYTES);
    let r = load64(st, 64 + 128);
    let t = load64(st, 64 + 128 + 8);

    _hash_final(st, h, t as isize, r as isize);

    return h;
}

/**
 * Compute a hash for a single-part message
 * @param m Message
 * @returns Hash
 */
export function hash(m: Uint8Array): Uint8Array {
    let st = hash_init();

    hash_update(st, m);

    return hash_final(st);
}

/**
 * HMAC-SHA-512
 * @param m Message
 * @param k Key
 */
export function hmac(m: Uint8Array, k: Uint8Array): Uint8Array {
    return _hmac(m, k);
}
