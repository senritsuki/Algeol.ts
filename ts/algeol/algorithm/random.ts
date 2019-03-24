
/**
 * Pseudorandom number generator (PRNG) 擬似乱数列生成
 */
export interface prng {
    generate(): number;
    generate_0_1(): number;
}

/**
 * Linear congruential generator 線形合同法
 */
export class lcg implements prng {
    xn: number;
    constructor(
        public a: number,
        public b: number,
        public mod: number,
        public x0: number,
    ) {
        this.xn = x0;
    }

    generate(): number {
        let xn1 = (this.a * this.xn) >>> 0;
        xn1 = (xn1 + this.b) >>> 0;
        xn1 = (xn1 % this.mod) >>> 0;
        this.xn = xn1;
        return xn1;
    }
    generate_0_1(): number {
        return this.generate() / 0xffffffff;
    }
}

/**
 * Park–Miller RNG
 */
export function lcg_parkmiller(x0: number): lcg {
    return new lcg(48271, 0, 0x7fffffff, x0);
}

/**
 * Xorshift
 */
export class xor implements prng {
    xn: number;
    constructor(
        public a: number,
        public b: number,
        public c: number,
        public x0: number,
    ) {
        this.xn = x0;
    }

    generate(): number {
        let xn1 = this.xn;
        xn1 ^= xn1 << this.a;
        xn1 ^= xn1 >>> this.b;
        xn1 ^= xn1 << this.c;
        xn1 = xn1 >>> 0;
        this.xn = xn1;
        return xn1;
    }
    generate_0_1(): number {
        return this.generate() / 0xffffffff;
    }
}

/**
 * Xorshift32
 */
export function xor32(x0: number): xor {
    return new xor(13, 17, 5, x0);
}


/**
 * Fisher–Yates shuffle
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
export function fisher_yates_shuffle<T>(n: T[], random_0_1: () => number): void {
    for (let i = n.length - 1; i >= 1; i--) {
        const j = Math.floor(random_0_1() * i);
        const ni = n[i];
        n[i] = n[j];
        n[j] = ni;
    }
}