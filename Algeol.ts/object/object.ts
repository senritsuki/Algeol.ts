/**
 * オブジェクトとマテリアルの生成とグループ化、オブジェクトの変形と複製
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../algorithm/vector';
import * as mx from '../algorithm/matrix';

/** オブジェクト */
export interface Object {
    /** オブジェクト名 */
    object_name: string|null;
    /**
     * 全ての頂点をコールバック関数で順次受け取る
     * @param callback コールバック関数
     * @param m コールバック時に適用するアフィン変換（任意）
     */
    verts(callback: (v: vc.V3) => void, m: mx.M4|null): void;
    /** 頂点数 */
    verts_size(): number;
    /**
     * 全てのサーフェイスグループをコールバック関数で順次受け取る
     * @param callback コールバック関数
     * @param offset コールバック時に適用するサーフェイスインデックスのオフセット
     */
    face_groups(callback: (face_group: FaceGroup, offset: number) => void, offset: number): void;
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
        public object_name: string|null,
    ) {}

    verts(callback: (v: vc.V3) => void, m: mx.M4|null): void {
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
    face_groups(callback: (face_group: FaceGroup, offset: number) => void, offset: number): void {
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
 * @param verts 頂点
 * @param face_groups ポリゴングループ
 * @param transform 適用するアフィン変換（任意）
 * @param object_name オブジェクト名（任意）
 */
export function obj_single(verts: vc.V3[], face_groups: FaceGroup[], transform: mx.M4|null, object_name?: string|null): Object {
    return new SingleObject(verts, face_groups, transform, object_name||null);
}

/**
 * 複数のオブジェクトをグループ化したオブジェクトを生成する
 * @param children グループ化するオブジェクト
 * @param transform 適用するアフィン変換（任意）
 * @param group_info サーフェイスグループの名前と適用マテリアル名（任意）
 * @param object_name オブジェクト名（任意）
 */
export function obj_group(children: Object[], transform: mx.M4|null, group_info: FaceInfo|null, object_name?: string|null): Object {
    return new GroupObject(children, transform, group_info, object_name||null);
}

/**
 * あるオブジェクトを複製しグループ化したオブジェクトを生成する
 * @param src 複製元オブジェクト
 * @param duplicate 適用するアフィン変換リスト。リスト要素1つにつきオブジェクト1つが複製される
 * @param object_name オブジェクト名（任意）
 */
export function obj_duplicate(src: Object, duplicate: mx.M4[], object_name?: string|null): Object {
    return new DuplicateObject(src, duplicate, object_name||null);
}

/**
 * サーフェイスを生成する
 * @param faces サーフェイスリスト。サーフェイスは頂点インデックスリストであり、サーフェイスリストは頂点インデックスの二次元配列
 * @param group_name サーフェイスグループの名前（任意）
 * @param material_name サーフェイスグループに適用するマテリアル名（任意）
 */
export function face(faces: number[][], group_name: string|null, material_name: string|null): FaceGroup {
    return new SimpleFaceGroup(faces, faceinfo(group_name, material_name));
}

/**
 * サーフェイス情報を生成する
 * @param group_name サーフェイスグループの名前（任意）
 * @param material_name サーフェイスグループに適用するマテリアル名（任意）
 */
export function faceinfo(group_name: string|null, material_name: string|null): FaceInfo|null {
    return group_name != null || material_name != null ? {group_name, material_name} : null;
}

/**
 * マテリアルを生成する
 * @param material_name マテリアル名
 * @param rgb アンビエントカラーとディフューズカラー。0以上1以下ののRGB配列
 */
export function material(material_name: string, rgb: vc.V3|number[]): Material {
    const c = vc.to_array_if(rgb);
    return {
        material_name: material_name,
        ambient: c,
        diffuse: c,
    }
}
