/** Wavefront .obj, .mtl */

import * as vc from "../algorithm/vector";
import * as al from "../geometry/geo";


export let vert_to_str = (v: vc.V3): string => 'v ' + v._v.join(' ');
export let face_to_str = (f: number[]): string => 'f ' + f.join(' ');
export let __face_to_str = (f: number[], offset: number): string => ['f'].concat(f.map(i => '' + (i + offset))).join(' ');

/**
 * OpenGL座標系を用いる (default)
 * [1, 2, 3] -> 'v 1 2 3'
 */
export function useOpenGLCoordinateSystem(): void {
    vert_to_str = (v: vc.V3): string => ['v', v.x(), v.y(), v.z()].join(' ');
}

/**
 * Blender座標系を用いる
 * [1, 2, 3] -> 'v 1 3 -2'
 */
export function useBlenderCoordinateSystem(): void {
    vert_to_str = (v: vc.V3): string => ['v', v.x(), v.z(), -v.y()].join(' ');
}

export interface ObjString {
    objfile: string;
    objstrs: string[];
}
export interface ObjMtlString extends ObjString {
    mtlfile: string;
    mtlstrs: string[];
}

export function geos_to_strings(name: string, geos: al.Geo[]): ObjString {
    const objfile = name + '.obj';

    let objstrs: string[] = [];
    let index = 1;  // .objのインデックスは0ではなく1スタート

    geos.forEach(geo => {
        objstrs = objstrs.concat(geo.verts.map(v => vert_to_str(v)));
        objstrs.push('');
        geo.faces.forEach(face => {
            objstrs.push(face_to_str(face.map(i => i + index)));
        });
        objstrs.push('');
        index += geo.verts.length;
    });

    return {objstrs, objfile};
}

export function objs_to_strings(name: string, objs: al.Obj[]): ObjMtlString {
    const objfile = name + '.obj';
    const mtlfile = name + '.mtl';

    let objstrs: string[] = [];
    let index = 1;  // .objのインデックスは0ではなく1スタート
    
    objstrs.push(`mtllib ${mtlfile}`);
    objstrs.push('');

    objs.forEach(obj => {
        objstrs.push(obj.name != null ? `## ${obj.name}` : '##');
        objstrs = objstrs.concat(obj.verts.map(v => vert_to_str(v)));
        objstrs.push('');
        obj.faces.forEach(face => {
            objstrs.push(face.name != null ? `g ${face.name}` : 'g');
            objstrs.push(face.material != null ? `usemtl ${face.material.name}` : '#usemtl');
            objstrs = objstrs.concat(face.clone_offset(index).faces.map(f => face_to_str(f)));
            objstrs.push('');
        });
        index += obj.verts.length;
    });

    let mtlstrs: string[] = [];
    const mtlset: {[name: string]: boolean} = {};

    objs.forEach(obj => {
        obj.faces.forEach(face => {
            if (face.material == null || mtlset[face.material.name] == true) {
                return;
            }
            mtlset[face.material.name] = true;
            mtlstrs.push(`newmtl ${face.material.name}`);
            mtlstrs.push(face.material.diffuse != null ? 'Kd ' + face.material.diffuse.join(' ') : '#Kd');
            mtlstrs.push('');
        });
    });

    return {objstrs, mtlstrs, objfile, mtlfile};
}
