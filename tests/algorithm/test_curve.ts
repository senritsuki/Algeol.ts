import * as t from '../test_common';
//import * as cv from "../../algeol/math/curve";

export function test(): t.OkNg {
    return t.printModule('algeol/math/curve', [
        {group: 'curve', results: t.tests([
        ], t.evalNumArray)},
    ]);
}

declare const module: any;
if (module != null && !module.parent) test();
