import * as vc from '../../datatype/vector';

export function hexagon(幅x: number, 幅y: number, round_x: number, z: number): vc.V3[] {
    const x2 = 幅x / 2;
    const y2 = 幅y / 2;
    const x2r = x2 - round_x;
    const vv = [
        vc.v3(x2, 0, z),
        vc.v3(x2r, y2, z),
        vc.v3(-x2r, y2, z),
    ];
    return vv.concat(vv.map(v => vc.v3(-v.x, -v.y, v.z)));
}

export function octagon(幅x: number, 幅y: number, round_x: number, round_y: number, z: number): vc.V3[] {
    const x2 = 幅x / 2;
    const y2 = 幅y / 2;
    const x2r = x2 - round_x;
    const y2r = y2 - round_y;
    const vv = [
        vc.v3(x2, y2r, z),
        vc.v3(x2r, y2, z),
        vc.v3(-x2r, y2, z),
        vc.v3(-x2, y2r, z),
    ];
    return vv.concat(vv.map(v => vc.v3(-v.x, -v.y, v.z)));
}

