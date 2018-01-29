/** プリミティブオブジェクト */

import * as al from "./geo";
import * as ut from "../algorithm/utility";
import * as sq from "../algorithm/sequence";
import * as vc from "../algorithm/vector";

type V2 = vc.V2;
type V3 = vc.V3;
const v3 = vc.v3;
const v2_polar = vc.polar_to_v2;
const geometry = (verts: V3[], faces: number[][]) => new al.Geo(verts, faces);

/** Polygon - 多角形 */
export namespace polygon {
    /**
     * 円に内接するn角形
     * @param   n_gonal     多角形の頂点数
     * @param   r           多角形の外接円の半径
     * @param   t           多角形の1つ目の頂点の偏角
     */
    export function verts_i(n_gonal: number, r: number, t: number = 0): V2[] {
        return sq.arith(n_gonal, t, ut.deg360 / n_gonal)
            .map(rad => v2_polar(r, rad));
    }
    /**
     * 円に外接するn角形
     * @param   n_gonal     多角形の頂点数
     * @param   r           多角形の内接円の半径
     * @param   t           多角形の1つ目の頂点の偏角
     */
    export function verts_c(n_gonal: number, r: number, t: number = 0): V2[] {
        const theta = ut.deg360 / (n_gonal * 2);
        const r2 = r / Math.cos(theta);
        const p2 = t + theta;
        return verts_i(n_gonal, r2, p2);
    }
}

export function arc(n: number, r: number, t1: number, t2: number): V2[] {
    const step = n >= 2 ? (t2 - t1) / (n - 1) : 0;
    return sq.arith(n, t1, step).map(t => v2_polar(r, t));
}

export function pie(n: number, r: number, t1: number, t2: number): V2[] {
    return [vc.v2_zero].concat(arc(n, r, t1, t2));
}

export function doughnut(n: number, r1: number, r2: number, t1: number, t2: number): V2[] {
    const arc1 = arc(n, r1, t1, t2);
    const arc2 = arc(n, r2, t2, t1);
    return arc1.concat(arc2);
}

/** 円に内接するn角形 */
export function circle_i(n_gonal: number, r: number, t: number = 0): V2[] {
    return polygon.verts_i(n_gonal, r, t);
}

/** 円に外接するn角形 */
export function circle_c(n_gonal: number, r: number, t: number = 0): V2[] {
    const theta = ut.deg360 / (n_gonal * 2);
    const r2 = r / Math.cos(theta);
    const p2 = t + theta;
    return circle_i(n_gonal, r2, p2);
}

export function to_v3_xy(z: number = 0): (v: V2) => V3 {
    return v => v3(v.x, v.y, z);
}
export function to_v3_xz(y: number = 0): (v: V2) => V3 {
    return v => v3(v.x, y, v.y);
}

export function plane(verts: V2[], f: (v: V2) => V3): al.Geo {
    return geometry(verts.map(v => f(v)), [verts.map((_, i) => i)]);
}


export function extrude(verts: V2[], z: number): al.Geo {
    const len = verts.length;
    const new_verts_1 = verts.map(v => vc.v2_to_v3(v, 0))
    const new_verts_2 = verts.map(v => vc.v2_to_v3(v, z))
    const new_verts = new_verts_1.concat(new_verts_2);
    const new_face_1 = sq.arith(len);
    const new_face_2 = sq.arith(len, len);
    const new_side_faces = sq.arith(len).map(n => [n, (n+1)%len, len+(n+1)%len, len+n]);
    const new_faces: number[][] = [];
    new_faces.push(new_face_1);
    new_faces.push(new_face_2);
    new_side_faces.forEach(f => new_faces.push(f));
    return geometry(new_verts, new_faces);
}
