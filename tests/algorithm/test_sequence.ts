import * as t from '../test_common';
import * as seq from "../../algorithm/sequence";

export function test(): t.OkNg {
    return t.printModule('algeol/math/sequence', [
        {group: 'sequence', results: t.tests([
            t.dataNumArray('seq.arith(5)', seq.arith(5), [0, 1, 2, 3, 4]),
            t.dataNumArray('seq.arith(3, 11)', seq.arith(3, 11), [11, 12, 13]),
            t.dataNumArray('seq.arith(6, 1.0, -0.2)', seq.arith(6, 1.0, -0.2), [1.0, 0.8, 0.6, 0.4, 0.2, 0.0]),
            t.dataNumArray('seq.geo(5)', seq.geo(5), [1, 2, 4, 8, 16]),
            t.dataNumArray('seq.geo(3, 5)', seq.geo(3, 5), [5, 10, 20]),
            t.dataNumArray('seq.geo(4, 1, 10)', seq.geo(4, 1, 10), [1, 10, 100, 1000]),
            t.dataNumArray('seq.recurrence_relation_1(5, 1, n=>n+1)', seq.recurrence_relation_1(5, 1, n=>n+1), [1, 2, 3, 4, 5]),
            t.dataNumArray('seq.recurrence_relation_1(4, 2, n=>n*2)', seq.recurrence_relation_1(4, 2, n=>n*2), [2, 4, 8, 16]),
            t.dataNumArray('seq.recurrence_relation_1(6, 0, n=>n*2+1)', seq.recurrence_relation_1(6, 0, n=>n*2+1), [0, 1, 3, 7, 15, 31]),
            t.dataNumArray('seq.recurrence_relation_2(12, 0, 1, (a,b)=>a+b)', seq.recurrence_relation_2(12, 0, 1, (a,b)=>a+b), [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]),
            t.dataNumArray('seq.fibonacci(1)', seq.fibonacci(1), [0]),
            t.dataNumArray('seq.fibonacci(6)', seq.fibonacci(6), [0, 1, 1, 2, 3, 5]),
            t.dataNumArray('seq.fibonacci(12)', seq.fibonacci(12), [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]),
            t.dataNumArray('seq.binomial_coefficients(0)', seq.binomial_coefficients(0), [1]),
            t.dataNumArray('seq.binomial_coefficients(1)', seq.binomial_coefficients(1), [1, 1]),
            t.dataNumArray('seq.binomial_coefficients(2)', seq.binomial_coefficients(2), [1, 2, 1]),
            t.dataNumArray('seq.binomial_coefficients(3)', seq.binomial_coefficients(3), [1, 3, 3, 1]),
            t.dataNumArray('seq.binomial_coefficients(4)', seq.binomial_coefficients(4), [1, 4, 6, 4, 1]),
            t.dataNumArray('seq.bernstein(2, 0/4)', seq.bernstein_basis_coefficients(2, 0/4), [1, 0, 0]),
            t.dataNumArray('seq.bernstein(2, 1/4)', seq.bernstein_basis_coefficients(2, 1/4), [9/16, 6/16, 1/16]),
            t.dataNumArray('seq.bernstein(2, 2/4)', seq.bernstein_basis_coefficients(2, 2/4), [1/4, 2/4, 1/4]),
            t.dataNumArray('seq.bernstein(2, 3/4)', seq.bernstein_basis_coefficients(2, 3/4), [1/16, 6/16, 9/16]),
            t.dataNumArray('seq.bernstein(2, 4/4)', seq.bernstein_basis_coefficients(2, 4/4), [0, 0, 1]),
            t.dataNumArray('seq.bernstein(3, 0/4)', seq.bernstein_basis_coefficients(3, 0/4), [1, 0, 0, 0]),
            t.dataNumArray('seq.bernstein(3, 1/4)', seq.bernstein_basis_coefficients(3, 1/4), [27/64, 27/64, 9/64, 1/64]),
            t.dataNumArray('seq.bernstein(3, 2/4)', seq.bernstein_basis_coefficients(3, 2/4), [1/8, 3/8, 3/8, 1/8]),
            t.dataNumArray('seq.bernstein(3, 3/4)', seq.bernstein_basis_coefficients(3, 3/4), [1/64, 9/64, 27/64, 27/64]),
            t.dataNumArray('seq.bernstein(3, 4/4)', seq.bernstein_basis_coefficients(3, 4/4), [0, 0, 0, 1]),
        ], t.evalNumArray)},
    ]);
}

declare const module: any;
if (module != null && !module.parent) test();
