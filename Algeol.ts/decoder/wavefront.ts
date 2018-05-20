/** Wavefront .obj, .mtl */

import * as vc from "../algorithm/vector";
import * as al from "../geometry/core";


export let vert_to_array = (v: vc.V3): number[] => [v.x, v.y, v.z];
export let float_fix = (n: number): string => n.toString();
export const vert_to_str = (v: vc.V3): string => 'v ' + vert_to_array(v).map(n => float_fix(n)).join(' ');
export const face_to_str = (f: number[]): string => 'f ' + f.join(' ');
export const rgb_to_str = (rgb: number[]): string => rgb.map(n => float_fix(n)).join(' ');

/**
 * OpenGL座標系を用いる (default)
 * [1, 2, 3] -> 'v 1 2 3'
 */
export function useOpenGLCoordinateSystem(): void {
    vert_to_array = v => [v.x, v.y, v.z];
}

/**
 * Blender座標系を用いる
 * [1, 2, 3] -> 'v 1 3 -2'
 */
export function useBlenderCoordinateSystem(): void {
    vert_to_array = v => [v.x, v.z, -v.y];
}

/**
 * 四捨五入する小数点桁数の設定（nullなら四捨五入なし）
 */
export function setFloatFixed(digit: number|null): void {
    float_fix = digit != null ? n => n.toFixed(digit) : n => n.toString();
}


export function dump_obj(obj: al.Object, mtlfile: string|null, callback: (line: string) => void): void {
    callback(mtlfile != null ? `mtllib ${mtlfile}` : '#mtllib');
    callback('');
    callback(obj.object_name != null ? `#o ${obj.object_name}` : '#o');
    obj.verts(null, v => callback(vert_to_str(v)));
    callback('');
    obj.face_groups(1, (fg, offset) => {
        if (fg.info != null) {
            callback(fg.info.group_name != null ? `g ${fg.info.group_name}` : '#g');
            if (fg.info.material_name != null) callback(`usemtl ${fg.info.material_name}`);
        } else {
            callback('#g');
        }
        fg.faces(offset, f => callback(face_to_str(f)));
        callback('');
    });
}

export function dump_mtl(mtls: al.Material[], callback: (line: string) => void): void {
    mtls.forEach(m => {
        callback(`newmtl ${m.material_name}`);
        callback(`Ka ${rgb_to_str(m.ambient)}`);
        callback(`Kd ${rgb_to_str(m.diffuse)}`);
        callback('');
    });
}
