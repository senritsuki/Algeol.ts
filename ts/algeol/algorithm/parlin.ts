import * as seq from './sequence';
import * as rand from './random';

type int = number;
type double = number;

const prng = rand.xor32(12345);

const permutation = seq.arithmetic(256);
rand.fisher_yates_shuffle(permutation, prng.generate_0_1);

function perlin_array(): int[] {
    return seq.arithmetic(512).map(i => permutation[i % 256]);
}
const p = perlin_array();

export function perlin(x: double, y: double, z: double, repeat: int): double {
    if (repeat > 0) {
        x %= repeat;
        y %= repeat;
        z %= repeat;
    }
 
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);
    const xi2 = xi & 0xff;
    const yi2 = yi & 0xff;
    const zi2 = zi & 0xff;
    const xf = x - xi;
    const yf = y - yi;
    const zf = z - zi;

    const u = fade(xf);
    const v = fade(yf);
    const w = fade(zf);

    const inc = (n: int) => increment(n, repeat);

    const aaa = p[p[p[    xi ] +     yi ] +     zi ];
    const aba = p[p[p[    xi ] + inc(yi)] +     zi ];
    const aab = p[p[p[    xi ] +     yi ] + inc(zi)];
    const abb = p[p[p[    xi ] + inc(yi)] + inc(zi)];
    const baa = p[p[p[inc(xi)] +     yi ] +     zi ];
    const bba = p[p[p[inc(xi)] + inc(yi)] +     zi ];
    const bab = p[p[p[inc(xi)] +     yi ] + inc(zi)];
    const bbb = p[p[p[inc(xi)] + inc(yi)] + inc(zi)];

    let x1, x2, y1, y2;
    x1 = lerp(
        grad(aaa, xf  , yf  , zf),
        grad(baa, xf-1, yf  , zf),
        u);
    x2 = lerp(
        grad(aba, xf  , yf-1, zf),
        grad(bba, xf-1, yf-1, zf),
        u);
    y1 = lerp(x1, x2, v);
 
    x1 = lerp(
        grad(aab, xf  , yf  , zf-1),
        grad(bab, xf-1, yf  , zf-1),
        u);
    x2 = lerp(
        grad(abb, xf  , yf-1, zf-1),
        grad(bbb, xf-1, yf-1, zf-1),
        u);
    y2 = lerp (x1, x2, v);
 
    return (lerp(y1, y2, w) + 1) / 2;
}

function fade(t: double): double {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function increment(n: int, repeat: int): int {
    n++;
    if (repeat > 0) n %= repeat;
    return n;
}

function grad(hash: int, x: double, y: double, z: double): double {
    switch (hash & 0xF) {
        case 0x0: return  x + y;
        case 0x1: return -x + y;
        case 0x2: return  x - y;
        case 0x3: return -x - y;
        case 0x4: return  x + z;
        case 0x5: return -x + z;
        case 0x6: return  x - z;
        case 0x7: return -x - z;
        case 0x8: return  y + z;
        case 0x9: return -y + z;
        case 0xA: return  y - z;
        case 0xB: return -y - z;
        case 0xC: return  y + x;
        case 0xD: return -y + z;
        case 0xE: return  y - x;
        case 0xF: return -y - z;
        default: return 0; // never happens
    }
}

/** Linear Interpolate */
function lerp(a: double, b: double, x: double): double {
    return a + x * (b - a);
}

export function octavePerlin(x: double, y: double, z: double, octaves: int, persistence: double, repeat: int) {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;
    for (let i = 0; i < octaves; i++) {
        total += perlin(x * frequency, y * frequency, z * frequency, repeat) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2;
    }
    return total / maxValue;
}
