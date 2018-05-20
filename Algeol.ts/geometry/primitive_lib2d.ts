/** プリミティブオブジェクト */

import * as al from "./surface_core";
import * as ut from "../algorithm/utility";
import * as sq from "../algorithm/sequence";
import * as vc from "../algorithm/vector";
import * as prim from './primitive_core';

const geometry = (verts: vc.V3[], faces: number[][]) => new al.Surfaces(verts, faces);

/**
 * 楕円に内接するn角形
 * @param   n_gonal     多角形の頂点数
 * @param   r           多角形の外接円の半径
 * @param   rad         多角形の1つ目の頂点の偏角
 */
export function ellipse_verts(n_gonal: number, r: vc.V2, rad: number): vc.V2[] {
    return sq.arithmetic(n_gonal, rad, ut.deg360 / n_gonal)
        .map(rad => vc.polar_to_v2(1, rad))
        .map(v => v.el_mul(r));
}

/*
 * 円に内接するn角形
 * @param   n_gonal     多角形の頂点数
 * @param   r           多角形の外接円の半径
 * @param   rad         多角形の1つ目の頂点の偏角
 */
export function circle_verts(n_gonal: number, r: number, rad: number): vc.V2[] {
    return ellipse_verts(n_gonal, vc.v2(r, r), rad);
}
/**
 * 円に外接するn角形
 * @param   n_gonal     多角形の頂点数
 * @param   r           多角形の内接円の半径
 * @param   rad         多角形の1つ目の頂点の偏角
 */
export function circle_verts_c(n_gonal: number, r: number, rad: number): vc.V2[] {
    const theta = ut.deg360 / (n_gonal * 2);
    const r2 = r / Math.cos(theta);
    const p2 = rad + theta;
    return circle_verts(n_gonal, r2, p2);
}

export function ellipse_b2(r: vc.V2): (v: vc.V2) => boolean {
    return v => {
        v = v.el_div(r);
        v = v.el_mul(v);
        return v.x + v.y <= 1;
    };
}
export function circle_b2(r: number): (v: vc.V2) => boolean {
    return ellipse_b2(vc.v2(r, r));
}

/**
 * 円
 * @param n_gonal   円を近似する多角形の頂点数
 * @param rad       円を近似する多角形の最初の頂点の角度（default: 0）
 * @param use_c     多角形を円に外接させるか否か（false: 内接, true: 外接, default: false）
 */
export function circle(n_gonal: number, r: number = 1, rad: number = 0, use_c: boolean = false): prim.Primitive2 {
    const f = use_c == false ? circle_verts : circle_verts_c;
    return prim.primitive2(
        circle_b2(r),
        f(n_gonal, r, rad),
    );
}
export function ellipse(n_gonal: number, r: vc.V2|number[], rad: number = 0): prim.Primitive2 {
    r = vc.to_v2_if(r);
    return prim.primitive2(
        ellipse_b2(r),
        ellipse_verts(n_gonal, r, rad),
    );
}

export function round4_1(x: number, y: number): vc.V2[] {
    return [
        vc.v2(x, 0),
        vc.v2(0, y),
        vc.v2(-x, 0),
        vc.v2(0, -y),
    ];
}
export function round4_2(x: number, y: number): vc.V2[] {
    return [
        vc.v2(x, y),
        vc.v2(-x, y),
        vc.v2(-x, -y),
        vc.v2(x, -y),
    ];
}

/** ひし形 */
export function rhombus_verts(r: vc.V2): vc.V2[] {
    return round4_1(r.x, r.y);
}
/** ひし形 */
export function rhombus_b2(r: vc.V2): (v: vc.V2) => boolean {
    return v => {
        v = v.el_div(r);
        return Math.abs(v.x) + Math.abs(v.y) <= 1;
    };
}
/** ひし形 */
export function rhombus(r: vc.V2|number[]): prim.Primitive2 {
    r = vc.to_v2_if(r);
    return prim.primitive2(
        rhombus_b2(r),
        rhombus_verts(r),
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
    return ellipse_arc_verts(n, vc.v2(r, r), rad1, rad2);
}
/**
 * 楕円弧
 * @param n             円弧を近似する辺の数
 * @param r             円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
export function ellipse_arc_verts(n: number, r: vc.V2, rad1: number, rad2: number): vc.V2[] {
    const step = n >= 2 ? (rad2 - rad1) / (n - 1) : 0;
    return sq.arithmetic(n + 1, rad1, step).map(t => vc.polar_to_v2(1, t).el_mul(r));
}

/**
 * パイ（円弧＋原点）
 * @param n             円弧を近似する辺の数
 * @param r             円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
export function pie_verts(n: number, r: number, rad1: number, rad2: number): vc.V2[] {
    return ellipse_arc_verts(n, vc.v2(r, r), rad1, rad2);
}
export function ellipse_pie_verts(n: number, r: vc.V2, rad1: number, rad2: number): vc.V2[] {
    return [vc.v2_zero].concat(ellipse_arc_verts(n, r, rad1, rad2));
}
/** 半径1のパイ */
export function pie_b2(r: number, rad1: number, rad2: number): (v: vc.V2) => boolean {
    return ellipse_pie_b2(vc.v2(r, r), rad1, rad2);
}
export function ellipse_pie_b2(r: vc.V2, rad1: number, rad2: number): (v: vc.V2) => boolean {
    return v => {
        v = v.el_div(r);
        const r_r = vc.v2_to_polar(v);
        if (r_r[0] > 1) return false;
        const rad = ut.normalize_rad(r_r[1]);
        rad1 = ut.normalize_rad(rad1);
        rad2 = ut.normalize_rad(rad2);
        return ut.isin(rad1, rad2, rad);
    }
}

export function pie(n_gonal: number, r: number, rad1: number, rad2: number): prim.Primitive2 {
    return prim.primitive2(
        pie_b2(r, rad1, rad2),
        pie_verts(n_gonal, r, rad1, rad2),
    );
}
export function ellipse_pie(n_gonal: number, r: vc.V2|number[], rad1: number, rad2: number): prim.Primitive2 {
    r = vc.to_v2_if(r);
    return prim.primitive2(
        ellipse_pie_b2(r, rad1, rad2),
        ellipse_pie_verts(n_gonal, r, rad1, rad2),
    );
}


/** 90度のパイやドーナツの角柱化は容易だが、リングの角柱化は意外と難しい。ドーナツを一周させるか */

export function ellipse_doughnut_verts(n: number, r1: vc.V2, r2: vc.V2): Array<[vc.V2, vc.V2]> {
    const v1 = ellipse_verts(n, r1, 0);
    const v2 = ellipse_verts(n, r2, 0);
    const f = (i: number): [vc.V2, vc.V2] => [v1[i], v2[i]];
    return sq.arithmetic(n).map(i => f(i));
}
export function doughnut_verts(n: number, r1: number, r2: number): Array<[vc.V2, vc.V2]> {
    return ellipse_doughnut_verts(n, vc.v2(r1, r1), vc.v2(r2, r2));
}

export function ellipse_doughnut_b2(r1: vc.V2, r2: vc.V2): (v: vc.V2) => boolean {
    const b1 = ellipse_b2(r1);
    const b2 = ellipse_b2(r2);
    return v => {
        return ut.xor(b1(v), b2(v));
    }
}
export function doughnut_b2(r1: number, r2: number): (v: vc.V2) => boolean {
    return ellipse_doughnut_b2(vc.v2(r1, r1), vc.v2(r2, r2));
}



/**
 * 穴あきパイ
 * @param n             円弧を近似する辺の数
 * @param r1            内側の円の半径
 * @param r2            外側の円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
export function doughnut_pie_verts(n: number, r1: number, r2: number, rad1: number, rad2: number): vc.V2[] {
    return ellipse_doughnut_pie_verts(n, vc.v2(r1, r1), vc.v2(r2, r2), rad1, rad2);
}
/**
 * 楕円穴あきパイ（円ドーナツの楕円化における厚みの歪み対策）
 * @param n             円弧を近似する辺の数
 * @param rx1           内側の円のx半径
 * @param ry1           内側の円のy半径
 * @param rx2           外側の円のx半径
 * @param ry2           外側の円のy半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
export function ellipse_doughnut_pie_verts(n: number, r1: vc.V2, r2: vc.V2, rad1: number, rad2: number): vc.V2[] {
    const arc1 = ellipse_arc_verts(n, r1, rad1, rad2);
    const arc2 = ellipse_arc_verts(n, r2, rad2, rad1);
    return arc1.concat(arc2);
}
/** 半分のひし形ドーナツ */
export function rhombus_doughnut_half_verts(rx1: number, ry1: number, rx2: number, ry2: number): vc.V2[] {
    return [
        vc.v2(rx1, 0),
        vc.v2(0, ry1),
        vc.v2(-rx1, 0),
        vc.v2(-rx2, 0),
        vc.v2(0, ry2),
        vc.v2(rx2, 0),
    ];
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
    const new_face_1 = sq.arithmetic(len);
    const new_face_2 = sq.arithmetic(len, len);
    const new_side_faces = sq.arithmetic(len).map(n => [n, (n+1)%len, len+(n+1)%len, len+n]);
    const new_faces: number[][] = [];
    new_faces.push(new_face_1);
    new_faces.push(new_face_2);
    new_side_faces.forEach(f => new_faces.push(f));
    return geometry(new_verts, new_faces);
}
