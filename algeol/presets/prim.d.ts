import * as al from "../al";
import * as vc from "../math/vector";
/** プリミティブオブジェクト生成用関数群 */
export declare namespace fn {
    namespace tetrahedron {
        function verts(x: number, y: number, z: number): vc.V3[];
        function faces(): number[][];
    }
    namespace octahedron {
        function verts(x: number, y: number, z: number): vc.V3[];
        function faces(): number[][];
    }
    namespace cube {
        function verts(x: number, y: number, z: number): vc.V3[];
        function faces(): number[][];
    }
    namespace trirect {
        function verts(s: number, l: number): vc.V3[];
    }
    namespace dodecahedron {
        function verts(r: number): vc.V3[];
        function faces(): number[][];
    }
    namespace icosahedron {
        function verts(r: number): vc.V3[];
        function faces(): number[][];
    }
    namespace crystal {
        function verts(v: number, x: number, y: number, zt: number, zb: number): vc.V3[];
        function faces(v: number): number[][];
    }
    namespace cone {
        function verts(v: number, x: number, y: number, z: number): vc.V3[];
        function faces(v: number): number[][];
    }
    namespace prism {
        function verts(v: number, x: number, y: number, zt: number, zb: number): vc.V3[];
        function faces(v: number): number[][];
    }
}
/** Polygon - 多角形 */
export declare function polygon(verts: vc.V3[], faces: number[][]): al.Geo;
/** Tetrahedron - 正4面体 */
export declare function tetrahedron(): al.Geo;
/** Octahedron - 正8面体 */
export declare function octahedron(): al.Geo;
/** Cube - 正6面体・立方体 */
export declare function cube(sp?: al.Space): al.Geo;
/** Dodecahedron - 正12面体 */
export declare function dodecahedron(): al.Geo;
/** Icosahedron - 正20面体 */
export declare function icosahedron(): al.Geo;
