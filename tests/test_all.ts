import * as t from './test_common';
import * as ut from './algorithm/test_utility';
import * as vc from './algorithm/test_vector';
import * as mx from './algorithm/test_matrix';
import * as col from './algorithm/test_color_converter';

export function test(): t.OkNg {
    const okng = [
        ut.test(),
        vc.test(),
        mx.test(),
        col.test(),
    ].reduce((a, b) => t.mergeOkNg(a, b), t.okng0);
    console.log();
    console.log('total');
    console.log('================================');
    console.log(`- ${okng.ng === 0}: ${okng.ok} / ${okng.ok + okng.ng}`);
    console.log();
    return okng;
}

declare const module: any;
if (module != null && !module.parent) test();
