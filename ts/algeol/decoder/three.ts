/**
 * three.js BufferGeometryフォーマットへの変換
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../datatype/vector';
import * as sq from '../algorithm/sequence';
import * as cc from '../algorithm/color_converter';
import * as al from '../object/object';
import * as THREE from 'three';

export let vert_to_array = (v: vc.V3): number[] => [v.x, v.y, v.z];

/**
 * OpenGL座標系を用いる (default)
 * [1, 2, 3] -> [1, 2, 3]
 */
export function useOpenGLCoordinateSystem(): void {
    vert_to_array = v => [v.x, v.y, v.z];
}

/**
 * Blender座標系を用いる
 * [1, 2, 3] -> [1, 3, -2]
 */
export function useBlenderCoordinateSystem(): void {
    vert_to_array = v => [v.x, v.z, -v.y];
}

function mtlsToHash(mtls: al.Material[]): {[key: string]: number} {
    const hash: {[key: string]: number} = {};
    mtls.forEach(m => {
        hash[m.material_name] = cc.rgb01_to_rgbhex(m.diffuse);
    });
    return hash;
}

export function buildMeshes(obj: al.Object, mtls: al.Material[], defaultColor = 0xeeeeee): THREE.Mesh[] {
    const mtlHash = mtlsToHash(mtls);
    const meshes: THREE.Mesh[] = [];
    const verts1: vc.V3[] = [];
    obj.verts(v => verts1.push(v), null);
    obj.face_groups((fg, offset) => {
        const verts2: number[] = [];
        fg.faces(f => 
            sq.arithmetic(f.length - 2).forEach(i => 
                [f[0], f[i+1], f[i+2]].forEach(i => 
                    vert_to_array(verts1[i]).map(n => 
                        verts2.push(n)))), offset);
        const geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(verts2), 3));
        geometry.computeVertexNormals();
        let color = defaultColor;
        if (fg.info && fg.info.material_name) {
            const c = mtlHash[fg.info.material_name];
            if (c != null) {
                color = c;
            }
        }
        const material = new THREE.MeshLambertMaterial({
            color: color,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, material);
        meshes.push(mesh);
    }, 0);
    return meshes;
}
