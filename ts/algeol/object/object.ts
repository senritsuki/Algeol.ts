/**
 * オブジェクトとマテリアルの生成とグループ化、オブジェクトの変形と複製
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../datatype/vector';
import * as mx from '../datatype/matrix';


/** オブジェクト */
export interface Object {
    /** オブジェクト名 */
<<<<<<< HEAD
    objectName: string|null;
=======
    object_name: string|null;
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
    /**
     * 全ての頂点をコールバック関数で順次受け取る
     * @param callback コールバック関数
     * @param m コールバック時に適用するアフィン変換（任意）
     */
<<<<<<< HEAD
    scanVerts(callback: (v: vc.V3) => void, m: mx.M4|null): void;
    /** 頂点数 */
    getVertsSize(): number;
=======
    verts(callback: (v: vc.V3) => void, m: mx.M4|null): void;
    /** 頂点数 */
    verts_size(): number;
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
    /**
     * 全てのサーフェイスグループをコールバック関数で順次受け取る
     * @param callback コールバック関数
     * @param offset コールバック時に適用するサーフェイスインデックスのオフセット
     */
<<<<<<< HEAD
    scanFaceGroups(callback: (faceGroup: FaceGroup, offset: number) => void, offset: number): void;

    dump(): void;
=======
    face_groups(callback: (face_group: FaceGroup, offset: number) => void, offset: number): void;
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
}

/** 頂点とポリゴンインデックス */
export interface VF {
    verts: vc.V3[];
    faces: number[][];
}

/** サーフェイスグループの名前とマテリアル */
export interface FaceInfo {
    /** グループ名 */
    group_name: string|null;
    /** 適用するマテリアルの名称 */
    material_name: string|null;
}

/** サーフェイスグループ */
export interface FaceGroup {
    /** サーフェイスグループの名前とマテリアル */
    info: FaceInfo|null;
    /**
     * 全てのサーフェイスをコールバック関数で順次受け取る
     * @param callback コールバック関数
     * @param offset コールバック時に適用するサーフェイスインデックスのオフセット
     */
    faces(callback: (face: number[]) => void, offset: number|null): void;
}

/** マテリアル */
export interface Material {
    /** マテリアル名 */
    material_name: string;
    /** アンビエントカラー。0以上1以下ののRGB配列 */
    ambient: number[];
    /** ディフューズカラー。0以上1以下ののRGB配列 */
    diffuse: number[];
}


class SimpleFaceGroup implements FaceGroup {
    constructor(
        public _faces: number[][],
        public info: FaceInfo|null,
    ) {}

    faces(callback: (face: number[]) => void, offset: number|null): void {
        const i = offset != null ? offset : 0;
        this._faces.forEach(face => callback(face.map(n => n + i)));
    }
}

class SingleObject implements Object {
    constructor(
        public _verts: vc.V3[],
        public _face_groups: FaceGroup[],
        public transform: mx.M4|null,
<<<<<<< HEAD
        public objectName: string|null,
    ) {}

    scanVerts(callback: (v: vc.V3) => void, m: mx.M4|null): void {
        const t = mergeTransfrom(m, this.transform);
=======
        public object_name: string|null,
    ) {}

    verts(callback: (v: vc.V3) => void, m: mx.M4|null): void {
        const t = merge_transform(m, this.transform);
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
        if (t != null) {
            this._verts.forEach(v => callback(t.map_v3(v, 1)));
        } else {
            this._verts.forEach(v => callback(v));
        }
    }
<<<<<<< HEAD
    getVertsSize(): number {
        return this._verts.length;
    }
    scanFaceGroups(callback: (face_group: FaceGroup, offset: number) => void, offset: number): void {
        this._face_groups.forEach(face_group => callback(face_group, offset));
    }

    dump(): void {
        console.log('SingleObject');
        console.log('- objectName: ' + this.objectName);
        console.log('- verts.length: ' + this._verts.length);
        console.log('- faceGroups.length: ' + this._face_groups.length);
        console.log('- transform?: ' + (this.transform != null));
    }
}

class WrappedObject implements Object {
    constructor(
        public obj: Object,
        public transform: mx.M4|null,
        public faceInfo: FaceInfo|null,
        public objectName: string|null,
    ) {}

    scanVerts(callback: (v: vc.V3) => void, m: mx.M4|null): void {
        const t = mergeTransfrom(m, this.transform);
        this.obj.scanVerts(callback, t);
    }
    getVertsSize(): number {
        return this.obj.getVertsSize();
    }
    scanFaceGroups(callback: (face_group: FaceGroup, offset: number) => void, offset: number): void {
        callback(new SimpleFaceGroup([], this.faceInfo), offset);
        this.obj.scanFaceGroups(callback, offset);
    }

    dump(): void {
        console.log('WrappedObject');
        console.log('- objectName: ' + this.objectName);
        console.log('- transform?: ' + (this.transform != null));
        console.log('- groupInfo?: ' + (this.faceInfo != null));
        this.obj.dump();
    }
}

class GroupedObject implements Object {
=======
    verts_size(): number {
        return this._verts.length;
    }
    face_groups(callback: (face_group: FaceGroup, offset: number) => void, offset: number): void {
        this._face_groups.forEach(face_group => callback(face_group, offset));
    }
}

class GroupObject implements Object {
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
    constructor(
        public children: Object[],
        public transform: mx.M4|null,
        public group_info: FaceInfo|null,
<<<<<<< HEAD
        public objectName: string|null,
    ) {}

    scanVerts(callback: (v: vc.V3) => void, m: mx.M4|null): void {
        const t = mergeTransfrom(m, this.transform);
        this.children.forEach(o => o.scanVerts(callback, t));
    }
    getVertsSize(): number {
        return this.children.reduce((a, o) => a + o.getVertsSize(), 0);
    }
    scanFaceGroups(callback: (face_group: FaceGroup, offset: number) => void, offset: number): void {
        callback(new SimpleFaceGroup([], this.group_info), offset);
        this.children.forEach(o => {
            o.scanFaceGroups(callback, offset);
            offset += o.getVertsSize();
        });
    }

    dump(): void {
        console.log('GroupObject');
        console.log('- objectName: ' + this.objectName);
        console.log('- children.length: ' + this.children.length);
        console.log('- transform?: ' + (this.transform != null));
        console.log('- groupInfo?: ' + (this.group_info != null));
        this.children.forEach(c => c.dump());
    }
}

class DuplicatedObject implements Object {
    constructor(
        public src: Object,
        public duplicate: mx.M4[],
        public objectName: string|null,
    ) {}

    scanVerts(callback: (v: vc.V3) => void, m: mx.M4|null): void {
        this.duplicate.forEach(dup => {
            const t = mergeTransfrom(m, dup);
            this.src.scanVerts(callback, t);
        });
    }
    getVertsSize(): number {
        return this.src.getVertsSize() * this.duplicate.length;
    }
    scanFaceGroups(callback: (face_group: FaceGroup, offset: number) => void, offset: number): void {
        const d = this.src.getVertsSize();
        for (let i = 0; i < this.duplicate.length; i++) {
            this.src.scanFaceGroups(callback, offset);
            offset += d;
        }
    }

    dump(): void {
        console.log('DuplicateObject');
        console.log('- objectName: ' + this.objectName);
        console.log('- src.objectName: ' + this.src.objectName);
        console.log('- duplicate.length: ' + this.duplicate.length);
    }
}

function mergeTransfrom(m1: mx.M4|null, m2: mx.M4|null): mx.M4|null {
=======
        public object_name: string|null,
    ) {}

    verts(callback: (v: vc.V3) => void, m: mx.M4|null): void {
        const t = merge_transform(m, this.transform);
        this.children.forEach(o => o.verts(callback, t));
    }
    verts_size(): number {
        return this.children.reduce((a, o) => a + o.verts_size(), 0);
    }
    face_groups(callback: (face_group: FaceGroup, offset: number) => void, offset: number): void {
        callback(new SimpleFaceGroup([], this.group_info), offset);
        this.children.forEach(o => {
            o.face_groups(callback, offset);
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

    verts(callback: (v: vc.V3) => void, m: mx.M4|null): void {
        this.duplicate.forEach(dup => {
            const t = merge_transform(m, dup);
            this.src.verts(callback, t);
        });
    }
    verts_size(): number {
        return this.src.verts_size() * this.duplicate.length;
    }
    face_groups(callback: (face_group: FaceGroup, offset: number) => void, offset: number): void {
        const d = this.src.verts_size();
        for (let i = 0; i < this.duplicate.length; i++) {
            this.src.face_groups(callback, offset);
            offset += d;
        }
    }
}

function merge_transform(m1: mx.M4|null, m2: mx.M4|null): mx.M4|null {
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
    const m = m1 != null ?
        m2 != null ?
            m1.mul(m2) :
            m1 :
        m2 != null ?
            m2 :
            null;
    return m;
}


/**
 * 単一のオブジェクトを生成する
<<<<<<< HEAD
 * @param vf 頂点とポリゴンインデックス
 * @param g_name ポリゴングループの名前
 * @param transform 適用するアフィン変換（任意）
 * @param o_name オブジェクト名（任意）
 */
export function objSingle(vf: VF, g_name: string|null, transform: mx.M4|null, o_name?: string|null): Object {
    return new SingleObject(vf.verts, [faceGroup(vf.faces, g_name, g_name)], transform, o_name||null);
}

export function objWrapped(obj: Object, g_name: string|null, transform: mx.M4|null, o_name?: string|null): Object {
    return new WrappedObject(obj, transform, faceInfo(g_name, g_name), o_name||null);
=======
 * @param verts 頂点
 * @param face_groups ポリゴングループ
 * @param transform 適用するアフィン変換（任意）
 * @param object_name オブジェクト名（任意）
 */
export function obj_single(verts: vc.V3[], face_groups: FaceGroup[], transform: mx.M4|null, object_name?: string|null): Object {
    return new SingleObject(verts, face_groups, transform, object_name||null);
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
}

/**
 * 単一のオブジェクトを生成する
<<<<<<< HEAD
 * @param verts 頂点
 * @param faceGroups ポリゴングループ
 * @param transform 適用するアフィン変換（任意）
 * @param o_name オブジェクト名（任意）
 */
export function objMultiFaceGroup(verts: vc.V3[], faceGroups: FaceGroup[], transform: mx.M4|null, o_name?: string|null): Object {
    return new SingleObject(verts, faceGroups, transform, o_name||null);
=======
 * @param vf 頂点とポリゴンインデックス
 * @param facegroup_name ポリゴングループの名前
 * @param transform 適用するアフィン変換（任意）
 * @param object_name オブジェクト名（任意）
 */
export function obj_single_vf(vf: VF, facegroup_name: string|null, transform: mx.M4|null, object_name?: string|null): Object {
    return new SingleObject(vf.verts, [facegroup(vf.faces, facegroup_name, facegroup_name)], transform, object_name||null);
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
}

/**
 * 複数のオブジェクトをグループ化したオブジェクトを生成する
 * @param children グループ化するオブジェクト
 * @param transform 適用するアフィン変換（任意）
<<<<<<< HEAD
 * @param g_info サーフェイスグループの名前と適用マテリアル名（任意）
 * @param o_name オブジェクト名（任意）
 */
export function objGrouped(children: Object[], transform: mx.M4|null, g_info: FaceInfo|null, o_name?: string|null): Object {
    return new GroupedObject(children, transform, g_info, o_name||null);
=======
 * @param group_info サーフェイスグループの名前と適用マテリアル名（任意）
 * @param object_name オブジェクト名（任意）
 */
export function obj_group(children: Object[], transform: mx.M4|null, group_info: FaceInfo|null, object_name?: string|null): Object {
    return new GroupObject(children, transform, group_info, object_name||null);
}

export function obj_group_vf(children: VF[], transform: mx.M4|null, group_info: FaceInfo|null, object_name?: string|null): Object {
    const objs = children.map(vf => obj_single_vf(vf, null, null));
    return new GroupObject(objs, transform, group_info, object_name||null);
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
}

/**
 * あるオブジェクトを複製しグループ化したオブジェクトを生成する
 * @param src 複製元オブジェクト
 * @param duplicate 適用するアフィン変換リスト。リスト要素1つにつきオブジェクト1つが複製される
<<<<<<< HEAD
 * @param o_name オブジェクト名（任意）
 */
export function objDuplicated(src: Object, duplicate: mx.M4[], o_name?: string|null): Object {
    return new DuplicatedObject(src, duplicate, o_name||null);
=======
 * @param object_name オブジェクト名（任意）
 */
export function obj_duplicate(src: Object, duplicate: mx.M4[], object_name?: string|null): Object {
    return new DuplicateObject(src, duplicate, object_name||null);
}

export function obj_duplicate_vf(vf: VF, duplicate: mx.M4[], facegroup_name: string|null, object_name?: string|null): Object {
    const src = obj_single_vf(vf, facegroup_name, null);
    return new DuplicateObject(src, duplicate, object_name||null);
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
}

/**
 * サーフェイスを生成する
 * @param faces サーフェイスリスト。サーフェイスは頂点インデックスリストであり、サーフェイスリストは頂点インデックスの二次元配列
<<<<<<< HEAD
 * @param g_name サーフェイスグループの名前（任意）
 * @param material_name サーフェイスグループに適用するマテリアル名（任意）
 */
export function faceGroup(faces: number[][], g_name: string|null, material_name: string|null = g_name): FaceGroup {
    return new SimpleFaceGroup(faces, faceInfo(g_name, material_name));
=======
 * @param group_name サーフェイスグループの名前（任意）
 * @param material_name サーフェイスグループに適用するマテリアル名（任意）
 */
export function facegroup(faces: number[][], group_name: string|null, material_name: string|null = group_name): FaceGroup {
    return new SimpleFaceGroup(faces, faceinfo(group_name, material_name));
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
}

/**
 * サーフェイス情報を生成する
<<<<<<< HEAD
 * @param g_name サーフェイスグループの名前（任意）
 * @param material_name サーフェイスグループに適用するマテリアル名（任意）
 */
export function faceInfo(g_name: string|null, material_name: string|null = g_name): FaceInfo|null {
    return g_name != null || material_name != null ? {group_name: g_name, material_name} : null;
=======
 * @param group_name サーフェイスグループの名前（任意）
 * @param material_name サーフェイスグループに適用するマテリアル名（任意）
 */
export function faceinfo(group_name: string|null, material_name: string|null = group_name): FaceInfo|null {
    return group_name != null || material_name != null ? {group_name, material_name} : null;
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
}

/**
 * マテリアルを生成する
 * @param material_name マテリアル名
 * @param rgb アンビエントカラーとディフューズカラー。0以上1以下ののRGB配列
 */
export function material(material_name: string, rgb: vc.V3|number[]): Material {
    const c = vc.to_array_if_not(rgb);
    return {
        material_name: material_name,
        ambient: c,
        diffuse: c,
    }
}
