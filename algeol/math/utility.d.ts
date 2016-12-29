export declare const sqrt: (x: number) => number;
export declare const pow: (x: number, y: number) => number;
export declare const cos: (x: number) => number;
export declare const sin: (x: number) => number;
export declare const acos: (x: number) => number;
export declare const atan2: (y: number, x: number) => number;
export declare const min: (...values: number[]) => number;
export declare const max: (...values: number[]) => number;
export declare const floor: (x: number) => number;
export declare const abs: (x: number) => number;
/** Square Root of 2 - 2の平方根 */
export declare const r2: number;
/** Square Root of 3 - 3の平方根 */
export declare const r3: number;
/** Square Root of 5 - 5の平方根 */
export declare const r5: number;
/** 円周率 */
export declare const pi: number;
/** 円周率の2倍 */
export declare const pi2: number;
export declare const deg360: number;
export declare const deg180: number;
export declare const deg90: number;
export declare const deg60: number;
export declare const deg45: number;
export declare const deg30: number;
export declare const deg15: number;
export declare const deg5: number;
export declare const deg1: number;
/** Golden Ratio - 黄金比 */
export declare const phi: number;
/** (角度:度数法) -> 角度:弧度法 */
export declare function deg_rad(deg: number): number;
/** (角度:弧度法) -> 角度:度数法 */
export declare function rad_deg(rad: number): number;
/** Factorial - 階乗 */
export declare function factorial(n: number): number;
/** Combination - 組み合わせ */
export declare function combination(n: number, k: number): number;
/** 数列 */
export declare namespace seq {
    /** Arithmetic Sequence - 等差数列 */
    function arith(count: number, start?: number, diff?: number): number[];
    /** Geometric Sequence - 等比数列 */
    function geo(count: number, start?: number, ratio?: number): number[];
    /** Recurrence Relation - 1階漸化式による数列 */
    function recurrenceRelation1(count: number, n0: number, lambda: (n0: number) => number): number[];
    /** Recurrence Relation - 2階漸化式による数列 */
    function recurrenceRelation2(count: number, n0: number, n1: number, lambda: (n0: number, n1: number) => number): number[];
    /** Fibonacci Sequence - フィボナッチ数列 */
    function fibonacci(count: number): number[];
    /** Binomial Coefficients - 2項係数の数列 */
    function binomialCoefficients(n: number): number[];
    /** n次バーンスタイン基底関数のブレンディング関数の数列 */
    function bernstein(n: number, x: number): number[];
}
/** 二次元配列を行列に見立てた転置 */
export declare function transpose<T>(m1: T[][]): T[][];
