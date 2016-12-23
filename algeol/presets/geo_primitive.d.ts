/** プリミティブオブジェクト */
import * as al from "../algeol";
import * as vc from "../math/vector";
/** プリミティブオブジェクト生成用関数群 */
export declare namespace fn {
    /** Tetrahedron - 正4面体 */
    namespace tetrahedron {
        /** 原点中心の半径rの球に内接する正4面体の頂点4つ
            1つをz軸上の頭頂点、残り3つをxy平面に平行な底面とする */
        function verts(r: number): vc.V3[];
        /** 正4面体の面4つ
            面は全て合同の正三角形である */
        function faces(): number[][];
    }
    /** Octahedron - 正8面体 */
    namespace octahedron {
        /** 原点中心の半径rの球に内接する正8面体の頂点6つ
            x軸上、y軸上、z軸上それぞれに2点ずつとる */
        function verts(r: number): vc.V3[];
        /** 正8面体の三角形の面8つ
            面は全て合同の正三角形である */
        function faces(): number[][];
    }
    /** Cube - 正6面体・立方体 */
    namespace cube {
        /** 原点中心の半径rの球に外接する立方体の頂点8つ
            (+-1, +-1, +-1)の組み合わせで8点とする */
        function verts(r: number): vc.V3[];
        /** 直方体の頂点8つ
            頂点の順序は立方体と同じであり、同じface配列を流用可能 */
        function verts_xyz(x: number, y: number, z: number): vc.V3[];
        /** 立方体の面6つ
            面は全て合同の正方形である */
        function faces(): number[][];
    }
    /** 原点を含みxy平面・yz平面・zx平面に平行で合同な長方形3枚 */
    namespace trirect {
        /** 原点を含みxy平面・yz平面・zx平面に平行で合同な長方形3枚の頂点12個
            xy平面、yz平面、zx平面の順で、さらに第1象限、第2象限、第3象限、第4象限の順 */
        function verts(a: number, b: number): vc.V3[];
    }
    /** Dodecahedron - 正12面体 */
    namespace dodecahedron {
        /** 原点中心の半径rの球に内接する正12面体の頂点20個
            球に内接する長方形3枚と立方体の頂点を流用する */
        function verts(r: number): vc.V3[];
        /** 正12面体の面12個
            面は全て合同の正五角形である */
        function faces(): number[][];
    }
    /** Icosahedron - 正20面体 */
    namespace icosahedron {
        /** 原点中心の半径rの球に内接する正20面体の頂点12個
            球に内接する長方形3枚の頂点を流用する */
        function verts(r: number): vc.V3[];
        /** 正20面体の面20個
            面は全て合同の正三角形である */
        function faces(): number[][];
    }
    /** Circle - 円 */
    namespace circle {
        /** 円に内接するn角形 */
        function verts_i(n_gonal: number, r: number, p?: number, z?: number): vc.V3[];
        /** 円に外接するn角形 */
        function verts_c(n_gonal: number, r: number, p?: number, z?: number): vc.V3[];
    }
    /** Prism - 角柱 */
    namespace prism {
        /** (底面の頂点数, 底面の外接円の半径, 高さ) -> 角柱の頂点の配列 */
        function verts_i(n_gonal: number, r: number, h: number): vc.V3[];
        /** (底面の頂点数, 底面の内接円の半径, 高さ) -> 角柱の頂点の配列 */
        function verts_c(n_gonal: number, r: number, h: number): vc.V3[];
        function faces(n_gonal: number): number[][];
    }
    /** Pyramid - 角錐 */
    namespace pyramid {
        /** (底面の頂点数, 底面の外接円の半径, 高さ) -> 角錐の頂点の配列 */
        function verts_i(n_gonal: number, r: number, h: number): vc.V3[];
        /** (底面の頂点数, 底面の内接円の半径, 高さ) -> 角錐の頂点の配列 */
        function verts_c(n_gonal: number, r: number, h: number): vc.V3[];
        /** (底面の頂点数) -> 角錐の面の配列 */
        function faces(n_gonal: number): number[][];
    }
    /** Bipyramid - 双角錐 */
    namespace bipyramid {
        /** (底面の頂点数, 底面の外接円の半径, 高さ, 深さ) -> 双角錐の頂点の配列 */
        function verts_i(n_gonal: number, r: number, h: number, d: number): vc.V3[];
        /** (底面の頂点数, 底面の内接円の半径, 高さ, 深さ) -> 双角錐の頂点の配列 */
        function verts_c(n_gonal: number, r: number, h: number, d: number): vc.V3[];
        function faces(n_gonal: number): number[][];
    }
}
/** Tetrahedron - 正4面体 */
export declare function tetrahedron(r?: number): al.Geo;
/** Octahedron - 正8面体 */
export declare function octahedron(r?: number): al.Geo;
/** Cube - 正6面体・立方体 */
export declare function cube(r?: number): al.Geo;
/** Dodecahedron - 正12面体 */
export declare function dodecahedron(r?: number): al.Geo;
/** Icosahedron - 正20面体 */
export declare function icosahedron(r?: number): al.Geo;
/** Prism - 角柱
    (底面の頂点数, 底面の外接円の半径, 高さ) -> ジオメトリ */
export declare function prism(n_gonal: number, r?: number, h?: number): al.Geo;
/** Pyramid - 角錐
    (底面の頂点数, 底面の外接円の半径, 高さ) -> ジオメトリ */
export declare function pyramid(n_gonal: number, r?: number, h?: number): al.Geo;
/** Bipyramid - 双角錐
    (底面の頂点数, 底面の外接円の半径, 高さ, 深さ) -> ジオメトリ */
export declare function bipyramid(n_gonal: number, r?: number, h?: number, d?: number): al.Geo;
