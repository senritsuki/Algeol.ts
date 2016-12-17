import * as ut from "./math/util";
import * as mx from "./math/matrix";
export interface SeqLim {
    lim(): mx.M4[];
}
export declare function lims(m4: mx.M4[]): SeqLim;
export declare function lim(m4: mx.M4): SeqLim;
export declare function seqlim(seq: ut.Seq, lambda_m4: (i: number) => mx.M4): SeqLim;
export declare function merge(seqlims: SeqLim[]): SeqLim;
