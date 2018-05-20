import * as vc from '../algorithm/vector';
import * as cv from '../algorithm/curve';

/** 線分 */
export function build_b3_segment(p1: vc.V3, p2: vc.V3, r: number): (v: vc.V3) => boolean {
    return v => cv.distance_sp(p1, p2, v) <= r;
}
