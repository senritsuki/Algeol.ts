/**
 * Wavefront (.obj, .mtl) format - Wavefrontフォーマットへの変換
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../datatype/vector';
import * as al from '../object/object';


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

/**
 * Wavefront .obj フォーマットに変換して1行ずつコールバック
 * @param obj       変換するオブジェクト
 * @param mtlfile   参照するマテリアルファイル名
 * @param callback  変換結果を1行ずつ受け取るコールバック関数
 */
export function dump_obj(obj: al.Object, mtlfile: string|null, callback: (line: string) => void): void {
    callback(mtlfile != null ? `mtllib ${mtlfile}` : '#mtllib');
    callback('');
<<<<<<< HEAD
    callback(obj.objectName != null ? `#o ${obj.objectName}` : '#o');
    obj.scanVerts(v => callback(vert_to_str(v)), null);
    callback('');
    obj.scanFaceGroups((fg, offset) => {
=======
    callback(obj.object_name != null ? `#o ${obj.object_name}` : '#o');
    obj.verts(v => callback(vert_to_str(v)), null);
    callback('');
    obj.face_groups((fg, offset) => {
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
        if (fg.info != null) {
            callback(fg.info.group_name != null ? `g ${fg.info.group_name}` : '#g');
            if (fg.info.material_name != null) callback(`usemtl ${fg.info.material_name}`);
        } else {
            callback('#g');
        }
        fg.faces(f => callback(face_to_str(f)), offset);
        callback('');
    }, 1);
}

/**
 * Wavefront .obj フォーマットに変換して1行ずつコールバック
 * @param mtls      変換するマテリアル配列
 * @param callback  変換結果を1行ずつ受け取るコールバック関数
 */
export function dump_mtl(mtls: al.Material[], callback: (line: string) => void): void {
    mtls.forEach(m => {
        callback(`newmtl ${m.material_name}`);
        callback(`Ka ${rgb_to_str(m.ambient)}`);
        callback(`Kd ${rgb_to_str(m.diffuse)}`);
        callback('');
    });
}
