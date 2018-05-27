/**
 * オブジェクトとマテリアルの生成とグループ化、オブジェクトの変形と複製
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../algorithm/vector';
import * as mx from '../algorithm/matrix';

export interface Object {
    object_name: string|null;
    verts(m: mx.M4|null, callback: (v: vc.V3) => void): void;
    verts_size(): number;
    face_groups(offset: number, callback: (face_group: FaceGroup, offset: number) => void): void;
}

export interface FaceInfo {
    group_name: string|null;
    material_name: string|null;
}
export interface FaceGroup {
    info: FaceInfo|null;
    faces(offset: number|null, callback: (face: number[]) => void): void;
}

export interface Material {
    material_name: string;
    ambient: number[];
    diffuse: number[];
}


class SimpleFaceGroup implements FaceGroup {
    constructor(
        public _faces: number[][],
        public info: FaceInfo|null,
    ) {}

    faces(offset: number|null, callback: (face: number[]) => void): void {
        const i = offset != null ? offset : 0;
        this._faces.forEach(face => callback(face.map(n => n + i)));
    }
}

class SingleObject implements Object {
    constructor(
        public _verts: vc.V3[],
        public _face_groups: FaceGroup[],
        public transform: mx.M4|null,
        public object_name: string|null,
    ) {}

    verts(m: mx.M4|null, callback: (v: vc.V3) => void): void {
        const t = merge_transform(m, this.transform);
        if (t != null) {
            this._verts.forEach(v => callback(t.map_v3(v, 1)));
        } else {
            this._verts.forEach(v => callback(v));
        }
    }
    verts_size(): number {
        return this._verts.length;
    }
    face_groups(offset: number, callback: (face_group: FaceGroup, offset: number) => void): void {
        this._face_groups.forEach(face_group => callback(face_group, offset));
    }
}

class GroupObject implements Object {
    constructor(
        public children: Object[],
        public transform: mx.M4|null,
        public group_info: FaceInfo|null,
        public object_name: string|null,
    ) {}

    verts(m: mx.M4|null, callback: (v: vc.V3) => void): void {
        const t = merge_transform(m, this.transform);
        this.children.forEach(o => o.verts(t, callback));
    }
    verts_size(): number {
        return this.children.reduce((a, o) => a + o.verts_size(), 0);
    }
    face_groups(offset: number, callback: (face_group: FaceGroup, offset: number) => void): void {
        callback(new SimpleFaceGroup([], this.group_info), offset);
        this.children.forEach(o => {
            o.face_groups(offset, callback);
            offset += o.verts_size();
        });
    }
}

class DuplicateObject implements Object {
    constructor(
        public src: Object,
        public duplicate: mx.M4[],
        public object_name: string|null,
    ) {}

    verts(m: mx.M4|null, callback: (v: vc.V3) => void): void {
        this.duplicate.forEach(dup => {
            const t = merge_transform(m, dup);
            this.src.verts(t, callback);
        });
    }
    verts_size(): number {
        return this.src.verts_size() * this.duplicate.length;
    }
    face_groups(offset: number, callback: (face_group: FaceGroup, offset: number) => void): void {
        const d = this.src.verts_size();
        for (let i = 0; i < this.duplicate.length; i++) {
            this.src.face_groups(offset, callback);
            offset += d;
        }
    }
}

function merge_transform(m1: mx.M4|null, m2: mx.M4|null): mx.M4|null {
    const m = m1 != null ?
        m2 != null ?
            m1.mul(m2) :
            m1 :
        m2 != null ?
            m2 :
            null;
    return m;
}

export function obj_single(verts: vc.V3[], face_groups: FaceGroup[], transform: mx.M4|null, object_name?: string|null): Object {
    return new SingleObject(verts, face_groups, transform, object_name||null);
}

export function obj_group(children: Object[], transform: mx.M4|null, group_info: FaceInfo|null, object_name?: string|null): Object {
    return new GroupObject(children, transform, group_info, object_name||null);
}

export function obj_duplicate(src: Object, duplicate: mx.M4[], object_name?: string|null): Object {
    return new DuplicateObject(src, duplicate, object_name||null);
}

export function faceinfo(group_name: string|null, material_name: string|null): FaceInfo|null {
    return group_name != null || material_name != null ? {group_name, material_name} : null;
}
export function face(faces: number[][], group_name: string|null, material_name: string|null): FaceGroup {
    return new SimpleFaceGroup(faces, faceinfo(group_name, material_name));
}

export function material(material_name: string, rgb: vc.V3|number[]): Material {
    const c = vc.to_array_if(rgb);
    return {
        material_name: material_name,
        ambient: c,
        diffuse: c,
    }
}
