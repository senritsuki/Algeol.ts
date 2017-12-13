import * as al from "../geometry/geo";
import * as ut from "../algorithm/utility";
import * as seq from "../algorithm/sequence";
import * as vc from "../algorithm/vector";
import * as mx from "../algorithm/matrix";
import * as cv from "../algorithm/curve";
import * as prim from "../geometry/primitive";
import * as multi from "../geometry/array";

/** ? */
export class RPZ {
    constructor(
        public r: number,
        public p: number,
        public z: number,
    ) { }
}
export function rpz(r: number, p: number, z: number) {
    return new RPZ(r, p, z);
}
export function rpzl(d: number, r1: number, r2: number, zz: number[]): RPZ[] {
    return zz.map((z, i) => rpz(i % 2 == 0 ? r1 : r2, ut.deg180 * i / d, z));
}

/**
 * アーチ
 * w    幅
 * h    高さ
 * rate ?
 * div  ?
 */
export function vxzArch(w: number, h: number, rate: number = 1.0, div: number = 6): vc.V3[] {
    // 原点中心楕円, 0: w,0,0, 0.25: 0,0,h, 0.5: -w,0,0
    const arc = cv.circle(vc.v3(0, 0, 0), vc.v3(w, 0, 0), vc.v3(0, 0, h));
    // rate=0 の場合, 0 ... 0.5 の div+1 点
    return seq.arith(div + 1, (1 - rate) / 2, (rate / 2) / div).map(i => arc.coord(i));
}
export function vxzArchWall(w: number, h: number, h2: number, rate: number = 1.0, div: number = 6): vc.V3[] {
    const verts: vc.V3[] = vxzArch(w, h, rate, div);
    verts.push(vc.v3(-w, 0, h2));
    verts.push(vc.v3(w, 0, h2));
    return verts;
}
export function vxzArchBar(w1: number, w2: number, h1: number, h2: number, rate: number = 1.0, div: number = 24): vc.V3[] {
    const arc1 = vxzArch(w1, h1, rate, div);
    const arc2 = vxzArch(w2, h2, rate, div);
    arc2.reverse();
    return arc1.concat(arc2);
}

export function gArchBar(v1: vc.V3, v2: vc.V3, h: number): al.Geo {
    const d1 = 1 / 32;
    const d2 = 1 / 16;
    const dir = v2.sub(v1);
    const mid = v1.add(v2).scalar(0.5);
    const w = dir.length() / 2;
    const archBar = extrudeY(vxzArchBar(w - d1, w + d1, h - d1, h + d1), d2);
    return archBar.clone_apply(v => mx.trans_v3_m4(mid).mul(mx.rotYZ_x_m4(dir)).map_v3(v, 1));
}
export function gArchWall(v1: vc.V3, v2: vc.V3, h: number, h2: number): al.Geo {
    const d2 = 1 / 32;
    const dir = v2.sub(v1);
    const mid = v1.add(v2).scalar(0.5);
    const w = dir.length() / 2;
    const archWall = extrudeY(vxzArchWall(w, h, h2), d2);
    return archWall.clone_apply(v => mx.trans_v3_m4(mid).mul(mx.rotYZ_x_m4(dir)).map_v3(v, 1));
}

export function extrudeY(vv: vc.V3[], d: number): al.Geo {
    return multi.extrude(vv, vc.v3(0, -d, 0), vc.v3(0, d, 0));
}
export function extrudeZZ(vv: vc.V3[], d1: number, d2: number): al.Geo {
    return multi.extrude(vv, vc.v3(0, 0, d1), vc.v3(0, 0, d2));
}

export function antiprism(d = 4, rz: RPZ[] = []): al.Geo {
    return multi.antiprismArray(seq.arith(rz.length).map(i =>
        prim.fn.circle.verts_i(d, rz[i].r, ut.deg180 * i / d, rz[i].z)));
}


export const lvTrans = (trans: vc.V3) => (v: vc.V3) => mx.trans_v3_m4(trans).map_v3(v, 1);
export const lvICube = (v: vc.V3) => mx.rotY_m3(-(ut.deg90 - Math.atan2(1, ut.r2))).mul(mx.rotZ_m3(-ut.deg45)).map(v);

export const g1oHalfCube = prim.cube(0.5).clone_apply(v => mx.scale_m3([1, 1, 0.5]).map(v));

export const g1oICube = prim.cube(0.5 / ut.r3).clone_apply(lvICube);
export const g1zpICube = g1oICube.clone_apply(lvTrans(vc.v3(0, 0, 0.5)));
export const g1xpznCCube = g1oHalfCube.clone_apply(lvTrans(vc.v3(0.5, 0, -0.25)));

export const g0columnFloor = antiprism(4, rpzl(4, 0.25, 0.25, [-0.75, -0.25, 0.25]));
export const g0cube = g1zpICube.clone_apply(v => mx.scale_m4([0.5, 0.5, 0.5]).map_v3(v, 1));
export const g0crys4 = prim.tetrahedron(0.5).clone_apply(v => mx.scale_m4([0.5, 0.5, 1]).mul(mx.trans_m4([0, 0, 0.5])).map_v3(v, 1));

const merge_geos = (name: string, geos: al.Geo[]): al.Obj => al.merge_geos(geos, null, name);
const merge_objs = (objs: al.Obj[][]): al.Obj[][] => objs;

// 塔
export namespace node {
    const nr25 = Math.sqrt(2.5); // 1.58

    const nColumnH = 5;
    const nRoofH = 10;
    const nFloorD = 0.25;
    const nUnderFloorD = 2;
    const nArchHeight = 1.0;
    const nArchWallHeight = 1.5;
    const nInner = 0.95;
    const vInner = vc.v3(nInner, nInner, 1);
    const nRingR = 0.125;
    const nRingD = nFloorD / 2;

    export const vxyFloor4 = al.duplicate_verts([
            vc.v3(1.5, 0.5, 0), 
            vc.v3(nr25 / ut.r2, nr25 / ut.r2, 0),
            vc.v3(0.5, 1.5, 0),
        ],
        al.compose<number>(seq.arith(4),
            [d => mx.rotZ_m4(ut.deg90 * d)]
        )
    ).reduce((a, b) => a.concat(b), <vc.V3[]>[]);

    export const vxyFloor6 = al.duplicate_verts([
            vc.v3(1.5, -0.5, 0),
            vc.v3(1.5, 0.5, 0),
        ],
        al.compose<number>(seq.arith(6),
            [d => mx.rotZ_m4(ut.deg60 * d)]
        )
    ).reduce((a, b) => a.concat(b), <vc.V3[]>[]);

    export const g4Floor = extrudeZZ(vxyFloor4, -nFloorD, 0);
    export const g6Floor = extrudeZZ(vxyFloor6, -nFloorD, 0);

    const rotZ_atan2_m4 = (v: vc.V3) => mx.rotZ_m4(Math.atan2(v.y(), v.x()));

    const vRing = prim.fn.circle.verts_i(6, nRingR);
    const gRing = extrudeZZ(vRing, -nRingD, nRingD);
    const mapRingFloor = (v: vc.V3) => mx.trans_m4([0, 0, -nRingD]).mul(mx.scale_m4([1, 1, 1.5])).map_v3(v, 1);
    const mapRingArch = (v: vc.V3) => mx.trans_m4([0, 0, nColumnH - nArchWallHeight]).mul(mx.scale_m4([1, 1, 0.25])).map_v3(v, 1)
    export const g4Rings = al.duplicate(gRing, al.compose<number>(
        seq.arith(vxyFloor4.length),
        [_ => mx.trans_m4([nr25 * nInner, 0, 0]), i => rotZ_atan2_m4(vxyFloor4[i])]));
    export const g6Rings = al.duplicate(gRing, al.compose<number>(
        seq.arith(vxyFloor6.length),
        [_ => mx.trans_m4([nr25 * nInner, 0, 0]), i => rotZ_atan2_m4(vxyFloor6[i])]));
    export const g4FloorRings = g4Rings.map(g => g.clone_apply(v => mapRingFloor(v)));
    export const g6FloorRings = g6Rings.map(g => g.clone_apply(v => mapRingFloor(v)));
    export const g4ArchRings = g4Rings.map(g => g.clone_apply(v => mapRingArch(v)));
    export const g6ArchRings = g6Rings.map(g => g.clone_apply(v => mapRingArch(v)));
    export const g4RoofRings = g4FloorRings.map(g => g.clone_apply(v => v.add(vc.v3(0, 0, nColumnH))));
    export const g6RoofRings = g6FloorRings.map(g => g.clone_apply(v => v.add(vc.v3(0, 0, nColumnH))));
    export const g4BottomRings = g4FloorRings.map(g => g.clone_apply(v => v.sub(vc.v3(0, 0, nUnderFloorD))));
    export const g6BottomRings = g6FloorRings.map(g => g.clone_apply(v => v.sub(vc.v3(0, 0, nUnderFloorD))));

    const gColumn = antiprism(4, rpzl(4, 1 / 16, 1 / 32, seq.arith(7, 0, (nColumnH - 0.25) / 6)));
    export const g4Columns = al.duplicate(gColumn, al.compose<number>(
        seq.arith(vxyFloor4.length),
        [_ => mx.trans_m4([nr25 * nInner, 0, 0]), i => rotZ_atan2_m4(vxyFloor4[i])]));
    export const g6Columns = al.duplicate(gColumn, al.compose<number>(
        seq.arith(vxyFloor6.length),
        [_ => mx.trans_m4([nr25 * nInner, 0, 0]), i => rotZ_atan2_m4(vxyFloor6[i])]));

    const gColumnUnder = antiprism(4, rpzl(4, 1 / 16, 1 / 32, seq.arith(7, -nUnderFloorD, (nUnderFloorD - 0.25) / 6)));
    export const g4ColumnUnders = al.duplicate(gColumnUnder, al.compose<number>(
        seq.arith(vxyFloor4.length),
        [_ => mx.trans_m4([nr25 * nInner, 0, 0]), i => rotZ_atan2_m4(vxyFloor4[i])]));
    export const g6ColumnUnders = al.duplicate(gColumnUnder, al.compose<number>(
        seq.arith(vxyFloor6.length),
        [_ => mx.trans_m4([nr25 * nInner, 0, 0]), i => rotZ_atan2_m4(vxyFloor6[i])]));

    const vArchOffset = vc.v3(0, 0, nColumnH - nArchWallHeight);
    const mapVPair = (vv: vc.V3[], d: vc.V3) => (i: number) => ({ v1: vv[i].add(d), v2: vv[(i + 1) % vv.length].add(d) });
    //const mapVPair = (vv: vc.V3[], d: vc.V3) => (i: number) => { return { v1: vv[i].add(d), v2: vv[(i + 1) % vv.length].add(d) }; };
    const mapVPair4 = mapVPair(vxyFloor4, vArchOffset);
    const mapVPair6 = mapVPair(vxyFloor6, vArchOffset);
    export const g4ArchBars = seq.arith(vxyFloor4.length)
        .map(i => mapVPair4(i))
        .map(v => gArchBar(v.v1.hadamart(vInner), v.v2.hadamart(vInner), nArchHeight));
    export const g6ArchBars = seq.arith(vxyFloor6.length)
        .map(i => mapVPair6(i))
        .map(v => gArchBar(v.v1.hadamart(vInner), v.v2.hadamart(vInner), nArchHeight));
    export const g4ArchWalls = seq.arith(vxyFloor4.length)
        .map(i => mapVPair4(i))
        .map(v => gArchWall(v.v1.hadamart(vInner), v.v2.hadamart(vInner), nArchHeight, nArchWallHeight));
    export const g6ArchWalls = seq.arith(vxyFloor6.length)
        .map(i => mapVPair6(i))
        .map(v => gArchWall(v.v1.hadamart(vInner), v.v2.hadamart(vInner), nArchHeight, nArchWallHeight));

    export const g4RoofBase = g4Floor.clone_apply(v => v.add(vc.v3(0, 0, nColumnH)));
    export const g6RoofBase = g6Floor.clone_apply(v => v.add(vc.v3(0, 0, nColumnH)));

    const mapsRoofA = al.composite_m4<vc.V2>([vc.v2(1, nColumnH), vc.v2(0.625, nColumnH + 0.75), vc.v2(1 / 64, nColumnH + nRoofH * 0.875)],
        [d => mx.scale_m4([d.x(), d.x(), 1]), d => mx.trans_m4([0, 0, d.y()])]);
    export const g4RoofAm = multi.prismArray_pyramid(mapsRoofA.map(m => vxyFloor4.map(v => m.map_v3(v, 1))), vc.v3(0, 0, nColumnH + nRoofH));
    export const g6RoofAm = multi.prismArray_pyramid(mapsRoofA.map(m => vxyFloor6.map(v => m.map_v3(v, 1))), vc.v3(0, 0, nColumnH + nRoofH));

    const gRoofAs = prim.pyramid(4, 1 / 12, nRoofH / 4);
    export const g4RoofAs = al.duplicate(gRoofAs, al.compose<number>(
        seq.arith(vxyFloor4.length),
        [_ => mx.trans_m4([nr25 * nInner, 0, nColumnH]), i => rotZ_atan2_m4(vxyFloor4[i])]));
    export const g6RoofAs = al.duplicate(gRoofAs, al.compose<number>(
        seq.arith(vxyFloor6.length),
        [_ => mx.trans_m4([nr25 * nInner, 0, nColumnH]), i => rotZ_atan2_m4(vxyFloor6[i])]));

    const mapsRoofB = al.composite_m4<vc.V2>(seq.arith(12, 0, ut.deg90 / 12).map(rad => vc.v2(Math.cos(rad), nColumnH + nr25 * Math.sin(rad))),
        [d => mx.scale_m4([d.x(), d.x(), 1]), d => mx.trans_m4([0, 0, d.y()])]);
    export const g4RoofB = multi.prismArray_pyramid(mapsRoofB.map(m => vxyFloor4.map(v => m.map_v3(v, 1))), vc.v3(0, 0, nColumnH + nr25));
    export const g6RoofB = multi.prismArray_pyramid(mapsRoofB.map(m => vxyFloor6.map(v => m.map_v3(v, 1))), vc.v3(0, 0, nColumnH + nr25));

    const nObjR = nRingR * 1.5;
    const nCrysR = nRingR / 1.5;
    const gCrys = prim.bipyramid(4, nCrysR, ut.phi / (1 + ut.phi), 1 / (1 + ut.phi))
        .clone_apply(v => mx.trans_m4([0, 0, 1 / (1 + ut.phi)]).map_v3(v, 1));
    const gObj1 = g1oICube
        .clone_apply(v => mx.trans_m4([0, 0, nObjR / 2]).mul(mx.scale_m4([nObjR, nObjR, nObjR])).map_v3(v, 1));
    const gObj2 = prim.dodecahedron(0.5)
        .clone_apply(v => mx.trans_m4([0, 0, nObjR / 2]).mul(mx.scale_m4([nObjR, nObjR, nObjR])).map_v3(v, 1));

    const seq4Obj1 = seq.arith(vxyFloor4.length).filter(i => i % 3 != 2);
    const seq4Obj2 = seq.arith(vxyFloor4.length).filter(i => i % 3 == 2);
    const seq6Obj1 = seq.arith(vxyFloor6.length).filter(i => i % 2 != 1);
    const seq6Obj2 = seq.arith(vxyFloor6.length).filter(i => i % 2 == 1);

    export const g4RoofC1 = al.duplicate(gCrys, al.compose<number>(seq.arith(vxyFloor4.length),
        [i => mx.scale_m4([1, 1, (2 + i % 3) / 2]), _ => mx.trans_m4([nr25 * nInner, 0, nFloorD / 2]), i => rotZ_atan2_m4(vxyFloor4[i])]));
    export const g4RoofC2 = al.duplicate(gObj1, al.compose<number>(seq4Obj1,
        [i => mx.trans_m4([nr25 * nInner, 0, (2 + i % 3) / 2 + nFloorD / 2]), i => rotZ_atan2_m4(vxyFloor4[i])]));
    export const g4RoofC3 = al.duplicate(gObj2, al.compose<number>(seq4Obj2,
        [i => mx.trans_m4([nr25 * nInner, 0, (2 + i % 3) / 2 + nFloorD / 2]), i => rotZ_atan2_m4(vxyFloor4[i])]));
    export const g6RoofC1 = al.duplicate(gCrys, al.compose<number>(seq.arith(vxyFloor6.length),
        [i => mx.scale_m4([1, 1, (2 + 2 * (i % 2)) / 2]), _ => mx.trans_m4([nr25 * nInner, 0, nFloorD / 2]), i => rotZ_atan2_m4(vxyFloor6[i])]));
    export const g6RoofC2 = al.duplicate(gObj1, al.compose<number>(seq6Obj1,
        [i => mx.trans_m4([nr25 * nInner, 0, (2 + 2 * (i % 2)) / 2 + nFloorD / 2]), i => rotZ_atan2_m4(vxyFloor6[i])]));
    export const g6RoofC3 = al.duplicate(gObj2, al.compose<number>(seq6Obj2,
        [i => mx.trans_m4([nr25 * nInner, 0, (2 + 2 * (i % 2)) / 2 + nFloorD / 2]), i => rotZ_atan2_m4(vxyFloor6[i])]));

    const mapsBottom = al.composite_m4<vc.V2>(
        [vc.v2(1, 0), vc.v2(1, -0.25), vc.v2(0.75, -0.5), vc.v2(0.5, -1.5), vc.v2(0.25, -6), vc.v2(1 / 16, -30)].map(v => v.sub(vc.v2(0, nUnderFloorD))),
        [d => mx.scale_m4([d.x(), d.x(), 1]), d => mx.trans_m4([0, 0, d.y()])]);
    export const g4Bottom = multi.prismArray_pyramid(mapsBottom.map(m => vxyFloor4.map(v => m.map_v3(v, 1))), vc.v3(0, 0, -256));
    export const g6Bottom = multi.prismArray_pyramid(mapsBottom.map(m => vxyFloor6.map(v => m.map_v3(v, 1))), vc.v3(0, 0, -256));

    export const gdFloor4 = [
        merge_geos('floor', [g4Floor]),
        merge_geos('floor', [g4Bottom]),
        merge_geos('wall', [g4FloorRings, g4BottomRings, g4ColumnUnders].reduce((a, b) => a.concat(b))),
    ];
    export const gdFloor6 = [
        merge_geos('floor', [g6Floor]),
        merge_geos('floor', [g6Bottom]),
        merge_geos('wall', [g6FloorRings, g6BottomRings, g6ColumnUnders].reduce((a, b) => a.concat(b))),
    ];

    export const gdArch4 = [
        merge_geos('wall', [g4Columns, g4ArchBars, g4ArchWalls, g4ArchRings].reduce((a, b) => a.concat(b))),
    ];
    export const gdArch6 = [
        merge_geos('wall', [g6Columns, g6ArchBars, g6ArchWalls, g6ArchRings].reduce((a, b) => a.concat(b))),
    ];

    export const gdRoof4A = [
        merge_geos('wall', [g4RoofBase]),
        merge_geos('wall', g4RoofRings),
        merge_geos('roof', [g4RoofAm].concat(g4RoofAs)),
    ];
    export const gdRoof6A = [
        merge_geos('wall', [g6RoofBase]),
        merge_geos('wall', g6RoofRings),
        merge_geos('roof', [g6RoofAm].concat(g6RoofAs)),
    ];
    export const gdRoof4B = [
        merge_geos('wall', [g4RoofBase]),
        merge_geos('wall', g4RoofRings),
        merge_geos('roof', [g4RoofB].concat(g4RoofAs)),
    ];
    export const gdRoof6B = [
        merge_geos('wall', [g6RoofBase]),
        merge_geos('wall', g6RoofRings),
        merge_geos('roof', [g6RoofB].concat(g6RoofAs)),
    ];
    export const gdRoof4C = [
        merge_geos('wall', g4RoofC1),
        merge_geos('roof', g4RoofC2.concat(g4RoofC3)),
    ];
    export const gdRoof6C = [
        merge_geos('wall', g6RoofC1),
        merge_geos('roof', g6RoofC2.concat(g6RoofC3)),
    ];

    export const gdFullTower4 = merge_objs([
        gdFloor4, gdArch4, gdRoof4A]);
    export const gdFullTower6 = merge_objs([
        gdFloor6, gdArch6, gdRoof6A]);
    export const gdRoundTower4 = merge_objs([
        gdFloor4, gdArch4, gdRoof4B]);
    export const gdRoundTower6 = merge_objs([
        gdFloor6, gdArch6, gdRoof6B]);
    export const gdOpenTower4 = merge_objs([
        gdFloor4, gdRoof4C]);
    export const gdOpenTower6 = merge_objs([
        gdFloor6, gdRoof6C]);
}


export namespace link {
    const nLenH = 3;
    const nStairCount = 11;
    const nStairDepth = 1 / 8;
    const nStairStepX = nLenH / nStairCount;
    const nStairStepY = 1;
    const nObjX = nStairStepX / 2;
    const nObjR1 = nStairStepX / 2;
    const nObjR2 = nStairStepX / 4;
    const nObjR3 = nStairStepX / 1.5;
    const nObjZ = nStairDepth / 2;

    const gStairStep = prim.cube(0.5)
        .clone_apply(v => mx.scale_m4([nStairStepX, nStairStepY, nStairDepth]).mul(mx.trans_m4([0.5, 0, -0.5])).map_v3(v, 1));

    const gRing = prim.prism(4, nObjR1, nStairDepth * 2)
        .clone_apply(v => mx.trans_m4([nObjX, 0, -nStairDepth * 1.5]).map_v3(v, 1));
    const gCrys = prim.bipyramid(4, nObjR2, ut.phi / (1 + ut.phi), 1 / (1 + ut.phi))
        .clone_apply(v => mx.trans_m4([nObjX, 0, 1 / (1 + ut.phi)]).map_v3(v, 1));
    const gObj1 = g1oICube
        .clone_apply(v => mx.trans_m4([nObjX, 0, nObjR1]).mul(mx.scale_m4([nObjR3, nObjR3, nObjR3])).map_v3(v, 1));
    const gObj2 = prim.dodecahedron(0.5)
        .clone_apply(v => mx.trans_m4([nObjX, 0, nObjR1]).mul(mx.scale_m4([nObjR3, nObjR3, nObjR3])).map_v3(v, 1));

    const gRingPair = [-0.5, 0.5].map(i => gRing.clone_apply(v => v.add(vc.v3(0, i * nStairStepY, 0))));
    const gCrysPair = [-0.5, 0.5].map(i => gCrys.clone_apply(v => v.add(vc.v3(0, i * nStairStepY, 0))));
    const gObj1Pair = [-0.5, 0.5].map(i => gObj1.clone_apply(v => v.add(vc.v3(0, i * nStairStepY, 0))));
    const gObj2Pair = [-0.5, 0.5].map(i => gObj2.clone_apply(v => v.add(vc.v3(0, i * nStairStepY, 0))));

    const seqOverZ = seq.arith(nStairCount).map(i => (6 - Math.abs((nStairCount - 1) / 2 - i)) * 0.25);
    const seqUnderZ = seq.arith(nStairCount).map(i => 2 - nLenH / 2 * Math.sin(Math.acos(1 - (0.5 + i) / (nStairCount / 2))));

    const gdStairSteps = seq.arith(nStairCount).map(i => al.merge_objs([
        merge_geos('floor', [gStairStep.clone_apply(v => mx.trans_m4([i * nStairStepX, 0, 0]).map_v3(v, 1))]),
        merge_geos('wall', gRingPair.map(g => g.clone_apply(v => mx.trans_m4([i * nStairStepX, 0, 0]).map_v3(v, 1)))),
        merge_geos('wall', i % 2 != 0 ?
            [] :
            gCrysPair.map(g => g.clone_apply(v => mx.trans_m4([i * nStairStepX, 0, nObjZ]).mul(mx.scale_m4([1, 1, seqOverZ[i]])).map_v3(v, 1)))),
        merge_geos('roof', i % ((nStairCount - 1) / 2) != 0 ?
            gObj1Pair.map(g => g.clone_apply(v => mx.trans_m4([i * nStairStepX, 0, nObjZ + seqOverZ[i]]).map_v3(v, 1))) :
            gObj2Pair.map(g => g.clone_apply(v => mx.trans_m4([i * nStairStepX, 0, nObjZ + seqOverZ[i]]).map_v3(v, 1)))),
        merge_geos('wall', i % 2 != 0 ?
            [] :
            gCrysPair.map(g => g.clone_apply(v => mx.trans_m4([i * nStairStepX, 0, -nObjZ - nStairDepth]).mul(mx.scale_m4([1, 1, -seqUnderZ[i]])).map_v3(v, 1)))),
        merge_geos('wall', i % ((nStairCount - 1) / 2) != 0 ?
            gObj1Pair.map(g => g.clone_apply(v => mx.trans_m4([i * nStairStepX, 0, -nObjZ - nStairDepth - seqUnderZ[i] - nObjR3 * 1.5]).map_v3(v, 1))) :
            gObj2Pair.map(g => g.clone_apply(v => mx.trans_m4([i * nStairStepX, 0, -nObjZ - nStairDepth - seqUnderZ[i] - nObjR3 * 1.5]).map_v3(v, 1)))),
    ]));

    export function shortenHorizontal(c: cv.Curve3, r: number): cv.Curve3 {
        const v1 = c.coord(0);
        const v2 = c.coord(1);
        const v1z = vc.v3(v1.x(), v1.y(), 0);
        const v2z = vc.v3(v2.x(), v2.y(), 0);
        const dirH = v2z.sub(v1z).unit().scalar(r);
        const v1r = v1.add(dirH);
        const v2r = v2.sub(dirH);
        return cv.line(v1r, v2r);
    }
    export function gdLink(c: cv.Curve3): al.Obj {
        const cs = shortenHorizontal(c, nLenH / 2);
        const v1 = cs.coord(0);
        const v2 = cs.coord(1);
        const dir = v2.sub(v1);
        const dirH = vc.v3(dir.x(), dir.y(), 0);
        //const dh = dirH.length();
        //const dv = dir.z();
        const count = gdStairSteps.length;
        const seqZ = seq.arith(count, 1).map(i => (v1.z() * (count + 1 - i) + v2.z() * i) / (count + 1));
        const mRotZ = mx.rotYZ_x_m4(dirH);
        const mTransV1 = mx.trans_v3_m4(vc.v3(v1.x(), v1.y(), 0));
        const maps = al.compose<number>(seq.arith(count), [
            i => mx.trans_m4([0, 0, seqZ[i]]),
            _ => mRotZ,
            _ => mTransV1,
        ]);
        return al.merge_objs(seq.arith(count).map(i => gdStairSteps[i].clone_apply(v => maps[i](v))));
    }
}

// 島

export function shortenLine(c: cv.Curve3, r: number): cv.Curve3 {
    const v1 = c.coord(0);
    const v2 = c.coord(1);
    const dir = v2.sub(v1).unit().scalar(r);
    const v1r = v1.add(dir);
    const v2r = v2.sub(dir);
    return cv.line(v1r, v2r);
}

export function gdLinkHorizontal(c: cv.Curve3, geoXp: al.Geo): al.Geo {
    const v1 = c.coord(0);
    const v2 = c.coord(1);
    const dir = v2.sub(v1);
    const dirH = vc.v3(dir.x(), dir.y(), 0);
    const dh = dirH.length();
    //const dv = dir.z();
    const m = mx.compositeLeft_m4([
        mx.scale_m4([dh, 1, 1]),
        mx.rotYZ_x_m4(dirH),
        mx.trans_v3_m4(v1),
    ]);
    return geoXp.clone_apply(v => m.map_v3(v, 1));
}
export function gdLinkR15TypeA(c: cv.Curve3): al.Geo {
    return gdLinkHorizontal(shortenLine(c, 1.5), g1xpznCCube);
}

export function gdNode(v: vc.V3, geo: al.Geo): al.Geo {
    return geo.clone_apply(lvTrans(v));
}
export function gdNodeR15TypeA4(v: vc.V3): al.Geo {
    return gdNode(v, node.g4Floor);
}
export function gdNodeR15TypeA6(v: vc.V3): al.Geo {
    return gdNode(v, node.g6Floor);
}


export function geoColumn(
    r: number,
    h: number,
    dim = 4,
    countColumn = 4,
    hBase = 0.25,
    rBaseT = 0.9,
    rColumn = 0.75,
    vCircle = (dim: number, r: number, z: number, p: number) =>
        prim.fn.circle.verts_i(dim, r, p * ut.deg180, z)
): al.Geo {
    const vCircle2 = (r: number, z: number, p: number) => vCircle(dim, r, z, p);
    const polygons: vc.V3[][] = [];
    polygons.push(vCircle2(r, 0, 0));
    polygons.push(vCircle2(r * rBaseT, hBase, 0));
    seq.arith(countColumn + 1).forEach(i => polygons.push(
        vCircle2(r * rColumn, hBase + (h - hBase * 2) * i / countColumn, i % 2)));
    polygons.push(vCircle2(r * rBaseT, h - hBase, 0));
    polygons.push(vCircle2(r, h, 0));
    return multi.prismArray(polygons);
}


export function dupl(geo: al.Geo, c: cv.Curve3, ii: number[]): al.Geo[] {
    return al.duplicate(geo,
        al.compose<cv.CD3>(ii.map(i => c.cd(i)), [
            d => mx.rotYZ_x_m4(d.d.hadamart(vc.v3(1, 1, 0))),
            d => mx.trans_v3_m4(d.c),
        ]));
}

export function hexaObj() {
    al.duplicate(
        prim.bipyramid(4, 0.25, 0.5, 0.5),
        al.compose<number>(seq.arith(4), [
            _ => mx.rotX_m4(ut.deg90),
            _ => mx.trans_m4([3, 0, 0]),
            d => mx.rotZ_m4(ut.deg90 * d),
        ]));
}

