import * as vc from '../../datatype/vector';
import * as mx from '../../datatype/matrix';
import * as gut from '../../geometry/utility';
import * as mesh from '../../geometry/mesh/rectangle';
import * as obj from '../object';

function wave_heigth(v: vc.V3): vc.V3 {
    const t = (v.x / 3 + v.y / 12) * Math.PI;
    const z = 1 - Math.abs(Math.sin(t));
    return vc.v3(0, 0, z);
}

export function wavedcuboid(
    facename_water: string = 'water',
    radius: vc.V2|number[] = [0.5, 0.5],
    depth: number = 1,
    div: vc.V2|number[] = [4, 4],
    height: (v: vc.V3) => vc.V3 = wave_heigth,
    transform: mx.M4|null = null,
): obj.Object {
    div = vc.to_array_if_not(div);
    const r = vc.to_v2_if_not(radius);
    const to = vc.v3(-r.x, -r.y, 0);
    const bo = vc.v3(-r.x, -r.y, -depth);
    const dx = vc.v3(r.x, 0, 0);
    const dy = vc.v3(0, r.y, 0);
    const wave = new mesh.Rectangle(to, dx, dy, div[0], div[1]);
    const bottom = new mesh.Rectangle(bo, dx, dy, div[0], div[1]);
    const verts_wave = wave.verts(height);
    const verts_bottom = bottom.verts(null);
    const verts = verts_wave.concat(verts_bottom);
    const faces_wave = wave.faces_triangle(null);
    const face_bottom = bottom.face_corner().map(i => i + verts_wave.length);
    const faces_side = gut.faces_side(face_bottom, wave.face_corner());
    const fgs = [
        obj.faceGroup(faces_wave, facename_water, facename_water),
        obj.faceGroup(faces_side, facename_water, facename_water),
        obj.faceGroup([face_bottom], facename_water, facename_water),
    ];
    return obj.objMultiFaceGroup(verts, fgs, transform);
}

