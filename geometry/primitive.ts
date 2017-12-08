/** プリミティブオブジェクト */

import * as al from "./geo";
import * as ut from "../algorithm/utility";
import * as sq from "../algorithm/sequence";
import * as vc from "../algorithm/vector";

type V2 = vc.V2;
type V3 = vc.V3;
const v2_polar = vc.polar_to_v2;
const geometry = (verts: V3[], faces: number[][]) => new al.Geo(verts, faces);

export namespace fn {
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
}

export function pie(n: number, r: number, t1: number, t2: number): V2[] {
    return [vc.v2_zero].concat(fn.arc(n, r, t1, t2));
}

export function doughnut(n: number, r1: number, r2: number, t1: number, t2: number): V2[] {
    const arc1 = fn.arc(n, r1, t1, t2);
    const arc2 = fn.arc(n, r2, t2, t1);
    return arc1.concat(arc2);
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


/** プリミティブオブジェクト生成用関数群 */
export namespace fn {
    const deg120_c = Math.cos(120 * ut.pi / 180);
    const deg120_s = Math.sin(120 * ut.pi / 180);
    const deg240_c = Math.cos(240 * ut.pi / 180);
    const deg240_s = Math.sin(240 * ut.pi / 180);

    const tetrahedron_rad = Math.acos(-1 / 3); // 正4面体の半径:高さ = 3:4
    const tetrahedron_c = Math.cos(tetrahedron_rad);
    const tetrahedron_s = Math.sin(tetrahedron_rad);

    // +xを右、+yを奥、+zを上、と考える（Blender）
    
    /** Tetrahedron - 正4面体 */
    export namespace tetrahedron {
        /** 原点中心の半径rの球に内接する正4面体の頂点4つ
            1つをz軸上の頭頂点、残り3つをxy平面に平行な底面とする */
        export function verts(r: number): V3[] {
            return [
                vc.v3(0, 0, r), // 上
                vc.v3(r * tetrahedron_s, 0, r * tetrahedron_c), // 下 右
                vc.v3(r * tetrahedron_s * deg120_c, r * tetrahedron_s * deg120_s, r * tetrahedron_c), // 下 左奥
                vc.v3(r * tetrahedron_s * deg240_c, r * tetrahedron_s * deg240_s, r * tetrahedron_c), // 下 左前
            ];
        }
        /** 正4面体の面4つ
            面は全て合同の正三角形である */
        export function faces(): number[][] {
            return [
                [0, 1, 2], // 上 右奥
                [0, 2, 3], // 上 左
                [0, 3, 1], // 上 右前
                [3, 2, 1], // 下
            ];
        }
    }
    /** Octahedron - 正8面体 */
    export namespace octahedron {
        /** 原点中心の半径rの球に内接する正8面体の頂点6つ
            x軸上、y軸上、z軸上それぞれに2点ずつとる */
        export function verts(r: number): V3[] {
            return [
                vc.v3(0, 0, r),  // 上
                vc.v3(r, 0, 0),  // 中 右
                vc.v3(0, r, 0),  // 中 奥
                vc.v3(-r, 0, 0), // 中 左
                vc.v3(0, -r, 0), // 中 前
                vc.v3(0, 0, -r), // 下
            ];
        }
        /** 正8面体の三角形の面8つ
            面は全て合同の正三角形である */
        export function faces(): number[][] {
            return [
                [1, 2, 0], // 上 右奥
                [2, 3, 0], // 上 左奥
                [3, 4, 0], // 上 左前
                [4, 1, 0], // 上 右前
                [1, 4, 5], // 下 右前
                [4, 3, 5], // 下 左前
                [3, 2, 5], // 下 左奥
                [2, 1, 5], // 下 右奥
            ];
        }
    }
    /** Cuboid - 直方体 */
    export namespace cuboid {
        /** 直方体の頂点8つ
            頂点の順序は立方体と同じであり、同じface配列を流用可能 */
        export function verts(x: number, y: number, z: number): V3[] {
            return [
                vc.v3(x, y, z),    // 上 右奥
                vc.v3(-x, y, z),   // 上 左奥
                vc.v3(-x, -y, z),  // 上 左前
                vc.v3(x, -y, z),   // 上 右前
                vc.v3(x, y, -z),   // 下 右奥
                vc.v3(-x, y, -z),  // 下 左奥
                vc.v3(-x, -y, -z), // 下 左前
                vc.v3(x, -y, -z),  // 下 右前
            ];
        }
        /** 直方体の面6つ */
        export function faces(): number[][] {
            return [
                [0, 1, 2, 3], // 上
                [7, 6, 5, 4], // 下
                [4, 5, 1, 0], // 奥
                [5, 6, 2, 1], // 左
                [6, 7, 3, 2], // 前
                [7, 4, 0, 3], // 右
            ];
        }
    }
    /** Cube - 正6面体・立方体 */
    export namespace cube {
        /** 原点中心の半径rの球に外接する立方体の頂点8つ
            (+-1, +-1, +-1)の組み合わせで8点とする */
        export function verts(r: number): V3[] {
            return cuboid.verts(r, r, r);
        }
        /** 立方体の面6つ
            面は全て合同の正方形である */
        export function faces(): number[][] {
            return cuboid.faces();
        }
    }
    /** 原点を含みxy平面・yz平面・zx平面に平行で合同な長方形3枚 */
    export namespace trirect {
        /** 原点を含みxy平面・yz平面・zx平面に平行で合同な長方形3枚の頂点12個
            xy平面、yz平面、zx平面の順で、さらに第1象限、第2象限、第3象限、第4象限の順 */
        export function verts(a: number, b: number): V3[] {
            return [
                vc.v3(a, b, 0),
                vc.v3(-a, b, 0),
                vc.v3(-a, -b, 0),
                vc.v3(a, -b, 0),
                vc.v3(0, a, b),
                vc.v3(0, -a, b),
                vc.v3(0, -a, -b),
                vc.v3(0, a, -b),
                vc.v3(b, 0, a),
                vc.v3(b, 0, -a),
                vc.v3(-b, 0, -a),
                vc.v3(-b, 0, a),
            ];
        }
    }
    /** Dodecahedron - 正12面体 */
    export namespace dodecahedron {
        /** 原点中心の半径rの球に内接する正12面体の頂点20個
            球に内接する長方形3枚と立方体の頂点を流用する */
        export function verts(r: number): V3[] {
            const c = r / ut.r3;
            const s = c / ut.phi;
            const l = c * ut.phi;
            return fn.trirect.verts(l, s).concat(fn.cube.verts(c));
        }
        /** 正12面体の面12個
            面は全て合同の正五角形である */
        export function faces(): number[][] {
            const xy = sq.arith(4, 0);
            const yz = sq.arith(4, 4);
            const zx = sq.arith(4, 8);
            const ct = sq.arith(4, 12);
            const cb = sq.arith(4, 16);
            return [
                [xy[0], ct[0], zx[0], ct[3], xy[3]], // 上 右
                [xy[3], cb[3], zx[1], cb[0], xy[0]], // 下 右
                [xy[2], ct[2], zx[3], ct[1], xy[1]], // 上 左
                [xy[1], cb[1], zx[2], cb[2], xy[2]], // 下 左
                [yz[2], cb[3], xy[3], ct[3], yz[1]], // 中 右前
                [yz[1], ct[2], xy[2], cb[2], yz[2]], // 中 左前
                [yz[0], ct[0], xy[0], cb[0], yz[3]], // 中 右奥
                [yz[3], cb[1], xy[1], ct[1], yz[0]], // 中 左奥
                [zx[3], ct[2], yz[1], ct[3], zx[0]], // 上 前
                [zx[0], ct[0], yz[0], ct[1], zx[3]], // 上 奥
                [zx[1], cb[3], yz[2], cb[2], zx[2]], // 下 前
                [zx[2], cb[1], yz[3], cb[0], zx[1]], // 下 奥
            ];
        }
    }
    /** Icosahedron - 正20面体 */
    export namespace icosahedron {
        /** 原点中心の半径rの球に内接する正20面体の頂点12個
            球に内接する長方形3枚の頂点を流用する */
        export function verts(r: number): V3[] {
            const s = r / Math.sqrt(2 + ut.phi); // 0^2 + 1^2 + ut.phi^2
            const l = s * ut.phi;
            return fn.trirect.verts(l, s);
        }
        /** 正20面体の面20個
            面は全て合同の正三角形である */
        export function faces(): number[][] {
            const xy = sq.arith(4, 0);
            const yz = sq.arith(4, 4);
            const zx = sq.arith(4, 8);
            return [
                [xy[0], zx[0], xy[3]], // 上 右
                [xy[3], zx[1], xy[0]], // 下 右
                [xy[2], zx[3], xy[1]], // 上 左
                [xy[1], zx[2], xy[2]], // 下 左
                [yz[2], xy[3], yz[1]], // 中 前右
                [yz[1], xy[2], yz[2]], // 中 前左
                [yz[0], xy[0], yz[3]], // 中 奥右
                [yz[3], xy[1], yz[0]], // 中 奥左
                [zx[3], yz[1], zx[0]], // 上 前
                [zx[0], yz[0], zx[3]], // 上 奥
                [zx[1], yz[2], zx[2]], // 下 前
                [zx[2], yz[3], zx[1]], // 下 奥
                [zx[0], yz[1], xy[3]], // 中上 右前
                [zx[0], xy[0], yz[0]], // 中上 右奥
                [zx[1], xy[3], yz[2]], // 中下 右前
                [zx[1], yz[3], xy[0]], // 中下 右奥
                [zx[3], xy[2], yz[1]], // 中上 左前
                [zx[3], yz[0], xy[1]], // 中上 左奥
                [zx[2], yz[2], xy[2]], // 中下 左前
                [zx[2], xy[1], yz[3]], // 中下 左奥
            ];
        }
    }
    /** Circle - 円 */
    export namespace circle {
        /** 円に内接するn角形 */
        export function verts_i(n_gonal: number, r: number, t: number = 0, z: number = 0): V3[] {
            return fn.polygon.verts_i(n_gonal, r, t)
                .map(v => vc.v2_to_v3(v, z));
        }
        /** 円に外接するn角形 */
        export function verts_c(n_gonal: number, r: number, t: number = 0, z: number = 0): V3[] {
            const theta = ut.deg360 / (n_gonal * 2);
            const r2 = r / Math.cos(theta);
            const p2 = t + theta;
            return verts_i(n_gonal, r2, p2, z);
        }
    }
    /** Prism - 角柱 */
    export namespace prism {
        /** (底面の頂点数, 底面の外接円の半径, 高さ) -> 角柱の頂点の配列 */
        export function verts_i(n_gonal: number, r: number, h: number): V3[] {
            const verts: V3[] = [];
            circle.verts_i(n_gonal, r, 0, h).forEach(v => verts.push(v)); // 上面
            circle.verts_i(n_gonal, r, 0, 0).forEach(v => verts.push(v)); // 底面
            return verts;
        }
        /** (底面の頂点数, 底面の内接円の半径, 高さ) -> 角柱の頂点の配列 */
        export function verts_c(n_gonal: number, r: number, h: number): V3[] {
            const verts: V3[] = [];
            circle.verts_c(n_gonal, r, 0, h).forEach(v => verts.push(v)); // 上面
            circle.verts_c(n_gonal, r, 0, 0).forEach(v => verts.push(v)); // 底面
            return verts;
        }
        export function faces(n_gonal: number): number[][] {
            const faces: number[][] = [];
            // 側面
            sq.arith(n_gonal)
                .map(i => [i, (i + 1) % n_gonal])
                .map(v => [v[0], v[0] + n_gonal, v[1] + n_gonal, v[1]])
                .forEach(v => faces.push(v));
            // 上面と底面
            faces.push(sq.arith(n_gonal));
            faces.push(sq.arith(n_gonal).map(i => i + n_gonal));
            return faces;
        }
    }
    /** Pyramid - 角錐 */
    export namespace pyramid {
        /** (底面の頂点数, 底面の外接円の半径, 高さ) -> 角錐の頂点の配列 */
        export function verts_i(n_gonal: number, r: number, h: number): V3[] {
            const verts: V3[] = [];
            verts.push(vc.v3(0, 0, h)); // // 頭頂点
            circle.verts_i(n_gonal, r, 0, 0).forEach(v => verts.push(v)); // 底面
            return verts;
        }
        /** (底面の頂点数, 底面の内接円の半径, 高さ) -> 角錐の頂点の配列 */
        export function verts_c(n_gonal: number, r: number, h: number): V3[] {
            const verts: V3[] = [];
            verts.push(vc.v3(0, 0, h)); // // 頭頂点
            circle.verts_c(n_gonal, r, 0, 0).forEach(v => verts.push(v)); // 底面
            return verts;
        }
        /** (底面の頂点数) -> 角錐の面の配列 */
        export function faces(n_gonal: number): number[][] {
            const faces: number[][] = [];
            // 側面
            sq.arith(n_gonal)
                .map(i => [0, i + 1, (i + 1) % n_gonal + 1])
                .forEach(v => faces.push(v));
            // 底面
            faces.push(sq.arith(n_gonal).map(i => i + 1));
            return faces;
        }
    }
    /** Bipyramid - 双角錐 */
    export namespace bipyramid {
        /** (底面の頂点数, 底面の外接円の半径, 高さ, 深さ) -> 双角錐の頂点の配列 */
        export function verts_i(n_gonal: number, r: number, h: number, d: number): V3[] {
            const verts: V3[] = [];
            verts.push(vc.v3(0, 0, h)); // 頭頂点
            verts.push(vc.v3(0, 0, -d)); // 頭頂点の逆
            circle.verts_i(n_gonal, r, 0, 0).forEach(v => verts.push(v)); // 底面
            return verts;
        }
        /** (底面の頂点数, 底面の内接円の半径, 高さ, 深さ) -> 双角錐の頂点の配列 */
        export function verts_c(n_gonal: number, r: number, h: number, d: number): V3[] {
            const verts: V3[] = [];
            verts.push(vc.v3(0, 0, h)); // 頭頂点
            verts.push(vc.v3(0, 0, -d)); // 頭頂点の逆
            circle.verts_c(n_gonal, r, 0, 0).forEach(v => verts.push(v)); // 底面
            return verts;
        }
        export function faces(n_gonal: number): number[][] {
            const faces: number[][] = [];
            // 上側面
            sq.arith(n_gonal)
                .map(i => [0, i + 2, (i + 1) % n_gonal + 2])
                .forEach(v => faces.push(v));
            // 下側面
            sq.arith(n_gonal)
                .map(i => [1, (i + 1) % n_gonal + 2, i + 2])
                .forEach(v => faces.push(v));
            return faces;
        }
    }
}

/**
 * Tetrahedron - 正4面体
 * @param   r   radius of circumscribed sphere - 外接球の半径
 */
export function tetrahedron(r: number): al.Geo {
    return geometry(fn.tetrahedron.verts(r), fn.tetrahedron.faces());
}
/**
 * Octahedron - 正8面体
 * @param   r   radius of circumscribed sphere - 外接球の半径
 */
export function octahedron(r: number): al.Geo {
    return geometry(fn.octahedron.verts(r), fn.octahedron.faces());
}
/**
 * Cube - 正6面体・立方体
 * @param   r   radius of inscribed sphere - 内接球の半径
 */
export function cube(r: number): al.Geo {
    return geometry(fn.cube.verts(r), fn.cube.faces());
}
/**
 * Cuboid - 直方体
 * @param x 
 * @param y 
 * @param z 
 */
export function cuboid(x: number, y: number, z: number): al.Geo {
    return geometry(fn.cuboid.verts(x, y, z), fn.cuboid.faces());
}
/**
 * Dodecahedron - 正12面体
 * @param   r   radius of circumscribed sphere - 外接球の半径
 */
export function dodecahedron(r: number): al.Geo {
    return geometry(fn.dodecahedron.verts(r), fn.dodecahedron.faces());
}
/**
 * Icosahedron - 正20面体
 * @param   r   radius of circumscribed sphere - 外接球の半径
 */
export function icosahedron(r: number): al.Geo {
    return geometry(fn.icosahedron.verts(r), fn.icosahedron.faces());
}

/**
 * Prism - 角柱
 * @param   n_gonal     角柱底面の頂点数
 * @param   r           角柱底面の外接円の半径（xy平面）
 * @param   h           角柱の高さ（+z方向）
 */
export function prism(n_gonal: number, r: number, h: number): al.Geo {
    return geometry(fn.prism.verts_i(n_gonal, r, h), fn.prism.faces(n_gonal));
}
/**
 * Pyramid - 角錐
 * @param   n_gonal     角錐底面の頂点数
 * @param   r           角錐底面の外接円の半径（xy平面）
 * @param   h           角錐の高さ（+z方向）
 */
export function pyramid(n_gonal: number, r: number, h: number): al.Geo {
    return geometry(fn.pyramid.verts_i(n_gonal, r, h), fn.pyramid.faces(n_gonal));
}
/**
 * Bipyramid - 双角錐
 * @param   n_gonal     角錐底面の頂点数
 * @param   r           角錐底面の外接円の半径（xy平面）
 * @param   h           上向き角錐の高さ（+z方向）
 * @param   d           下向き角錐の深さ（-z方向）
 */
export function bipyramid(n_gonal: number, r: number, h: number, d: number): al.Geo {
    return geometry(fn.bipyramid.verts_i(n_gonal, r, h, d), fn.bipyramid.faces(n_gonal));
}

/** v1とv2を対角の頂点とした直方体 */
export function cuboid_vv(v1: number[]|V3, v2: number[]|V3): al.Geo {
    v1 = v1 instanceof Array ? vc.array_to_v3(v1) : v1;
    v2 = v2 instanceof Array ? vc.array_to_v3(v2) : v2;
    const center = v1.add(v2).scalar(0.5);
    const d = v2.sub(center);
    return cuboid(d.x(), d.y(), d.z()).clone_translate(center);
}
