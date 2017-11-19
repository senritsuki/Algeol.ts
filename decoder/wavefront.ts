/** Wavefront .obj, .mtl */

import * as vc from "../algorithm/vector";
import * as al from "../geometry/geo";

namespace col {
    export interface NamedColor{
        name(): any;
        color(): any;
    }
}

let _vert_to_str = (v: vc.V3): string => ['v', v.x(), v.y(), v.z()].join(' ');
let _face_to_str = (f: number[], offset: number): string => ['f'].concat(f.map(i => '' + (i + offset))).join(' ');

/**
 * OpenGL座標系を用いる (default)
 * <ul>
 * <li> [1, 2, 3] -> 'v 1 2 3'
 * </ul>
 */
export function useOpenGLCoordinateSystem(): void {
    _vert_to_str = (v: vc.V3): string => ['v', v.x(), v.y(), v.z()].join(' ');
}

/**
 * Blender座標系を用いる
 * <ul>
 * <li> [1, 2, 3] -> 'v 1 3 -2'
 * </ul>
 */
export function useBlenderCoordinateSystem(): void {
    _vert_to_str = (v: vc.V3): string => ['v', v.x(), v.z(), -v.y()].join(' ');
}


namespace priv {
    export function vf_to_str(verts: vc.V3[], faces: number[][], offset: number = 1): string {
        const strs: string[] = [
            verts.map(v => _vert_to_str(v)).join('\n'),
            faces.map(f => _face_to_str(f, offset)).join('\n'),
        ];
        return strs.join('\n') + '\n';
    }

    export class GO<T extends al.GeoBase<T>> {
        constructor(
            public geo: T,
            public offset: number) { }
    }

    export function array_to_vfo<T extends al.GeoBase<T>>(array: T[], offset: number = 1): GO<T>[] {
        const vo: GO<T>[] = [];
        array.forEach(geo => {
            vo.push(new GO(geo, offset));
            offset += geo.verts().length;
        });
        return vo;
    }

    export const to_mtlstr_sub_1 = (s: string, rgb: number[]|null): string => 
        rgb != null ? `${s} ${rgb[0]} ${rgb[1]} ${rgb[2]}\n` : '';

    export const to_mtlstr_sub_2 = (s: string, n: number|null): string => 
        n != null ? `${s} ${n}\n` : '';
}


/** algeol.Geo を.obj形式に文字列化 */
export function geoUnit_to_objstr(unit: al.GeoUnit, offset: number = 1): string {
    return priv.vf_to_str(unit.verts(), unit.faces(), offset);
}

/** algeol.Geo[] を.obj形式に文字列化 */
export function geoUnitArray_to_objstr(unitArray: al.GeoUnit[], offset: number = 1): string {
    return priv.array_to_vfo<al.GeoUnit>(unitArray, offset)
        .map(go => geoUnit_to_objstr(go.geo, go.offset))
        .join('\n');
}

/** algeol.GeoGroup を.obj形式に文字列化 */
export function geo_to_objstr(geo: al.Geo, offset: number = 1): string {
    const color = geo.getColor();
    const s1 = `g ${geo.name()}\n`;
    const s2 = color != null ? `usemtl ${color.name()}\n` : '';
    return s1 + s2 + geoUnit_to_objstr(geo, offset);
}

/** algeol.GeoGroup[] を.obj形式に文字列化 */
export function geoArray_to_objstr(geoArray: al.Geo[], offset: number = 1): string {
    return priv.array_to_vfo<al.Geo>(geoArray, offset)
        .map(go => geo_to_objstr(go.geo, go.offset))
        .join('\n');
}

/** algeol.GeoDict を.obj形式に文字列化 */
export function geoDict_to_objstr(dict: al.GeoDict, _offset: number = 1): string {
    return geoArray_to_objstr(dict.geogroups());
}

/** algeol.GeoGroup を.mtl形式に文字列化 */
export function geo_to_mtlstr(geo: al.Geo): string {
    return namedColor_to_mtlstr(geo.getColor());
}

/** algeol.GeoGroup[] を.mtl形式に文字列化 */
export function geoArray_to_mtlstr(geoArray: al.Geo[]): string {
    return geoArray
        .map(geo => namedColor_to_mtlstr(geo.getColor()))
        .join('\n');
}

/** algeol.GeoDict を.mtl形式に文字列化 */
export function geoDict_to_mtlstr(geoDict: al.GeoDict, _offset: number = 1): string {
    return geoArray_to_mtlstr(geoDict.geogroups());
}

export function objstr_mtllib(mtlFileName: string): string {
    return `mtllib ${mtlFileName}\n\n`;
}


export function to_mtlstr(
        name: string,
        rgb_ambient: number[]|null,
        rgb_diffuse: number[]|null,
        rgb_specular: number[]|null,
        dissolve: number|null,
        ): string {
    let mtl = `newmtl ${name}\n`;
    mtl += priv.to_mtlstr_sub_1('Ka', rgb_ambient);
    mtl += priv.to_mtlstr_sub_1('Kd', rgb_diffuse);
    mtl += priv.to_mtlstr_sub_1('Ks', rgb_specular);
    mtl += priv.to_mtlstr_sub_2('d', dissolve);
    mtl += '';
    return mtl;
}

export function namedColor_to_mtlstr(namedColor: col.NamedColor|null): string {
    if (namedColor == null) {
        return '';
    }
    return to_mtlstr(namedColor.name(), null, namedColor.color().rgb_0_1(), null, null);
}

