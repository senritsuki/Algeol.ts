/** プリミティブオブジェクト */

import * as al from "./surface_core";
import * as ut from "../algorithm/utility";
import * as sq from "../algorithm/sequence";
import * as vc from "../algorithm/vector";
import * as prim from './primitive_core';

const geometry = (verts: vc.V3[], faces: number[][]) => new al.Surfaces(verts, faces);

/**
 * 円に内接するn角形
 * @param   n_gonal     多角形の頂点数
 * @param   r           多角形の外接円の半径
 * @param   rad         多角形の1つ目の頂点の偏角
 */
export function circle_verts_i(n_gonal: number, r: number, rad: number = 0): vc.V2[] {
    return sq.arith(n_gonal, rad, ut.deg360 / n_gonal)
        .map(rad => vc.polar_to_v2(r, rad));
}
/**
 * 円に外接するn角形
 * @param   n_gonal     多角形の頂点数
 * @param   r           多角形の内接円の半径
 * @param   rad         多角形の1つ目の頂点の偏角
 */
export function circle_verts_c(n_gonal: number, r: number, rad: number = 0): vc.V2[] {
    const theta = ut.deg360 / (n_gonal * 2);
    const r2 = r / Math.cos(theta);
    const p2 = rad + theta;
    return circle_verts_i(n_gonal, r2, p2);
}

export function circle_b2(): (v: vc.V2) => boolean {
    return v => {
        v = v.el_mul(v);
        return v.x + v.y <= 1;
    };
}

/**
 * 円
 * @param n_gonal   円を近似する多角形の頂点数
 * @param rad       円を近似する多角形の最初の頂点の角度（default: 0）
 * @param use_c     多角形を円に外接させるか否か（false: 内接, true: 外接, default: false）
 */
export function Circle(n_gonal: number, rad: number = 0, use_c: boolean = false): prim.Plane {
    const f = use_c == false ? circle_verts_i : circle_verts_c;
    return new prim.Plane(
        circle_b2(),
        f(n_gonal, 1, rad),
    );
}

/**
 * 円弧
 * @param n             円弧を近似する辺の数
 * @param r             円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
export function arc_verts(n: number, r: number, rad1: number, rad2: number): vc.V2[] {
    const step = n >= 2 ? (rad2 - rad1) / (n - 1) : 0;
    return sq.arith(n + 1, rad1, step).map(t => vc.polar_to_v2(r, t));
}

/**
 * パイ（円弧＋原点）
 * @param n             円弧を近似する辺の数
 * @param r             円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
export function pie_verts(n: number, r: number, rad1: number, rad2: number): vc.V2[] {
    return [vc.v2_zero].concat(arc_verts(n, r, rad1, rad2));
}
/** 半径1のパイ */
export function pie_b2(rad1: number, rad2: number): (v: vc.V2) => boolean {
    return v => {
        const r_r = vc.v2_to_polar(v);
        if (r_r[0] > 1) return false;
        const rad = ut.normalize_rad(r_r[1]);
        rad1 = ut.normalize_rad(rad1);
        rad2 = ut.normalize_rad(rad2);
        return ut.isin(rad1, rad2, rad);
    }
}

export function Pie(n_gonal: number, rad1: number, rad2: number): prim.Plane {
    return new prim.Plane(
        pie_b2(rad1, rad2),
        pie_verts(n_gonal, 1, rad1, rad2),
    );
}


/**
 * ドーナツ
 * @param n             円弧を近似する辺の数
 * @param r             円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
export function doughnut_verts(n: number, r1: number, r2: number, t1: number, t2: number): vc.V2[] {
    const arc1 = arc_verts(n, r1, t1, t2);
    const arc2 = arc_verts(n, r2, t2, t1);
    return arc1.concat(arc2);
}


export function to_v3_xy(z: number = 0): (v: vc.V2) => vc.V3 {
    return v => vc.v3(v.x, v.y, z);
}
export function to_v3_xz(y: number = 0): (v: vc.V2) => vc.V3 {
    return v => vc.v3(v.x, y, v.y);
}

export function plane(verts: vc.V2[], f: (v: vc.V2) => vc.V3): al.Surfaces {
    return geometry(verts.map(v => f(v)), [verts.map((_, i) => i)]);
}


export function extrude(verts: vc.V2[], z: number): al.Surfaces {
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
