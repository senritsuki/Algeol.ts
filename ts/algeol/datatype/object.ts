/**
 * オブジェクトとマテリアルの生成とグループ化、オブジェクトの変形と複製
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from './vector';
import * as mx from './matrix';

/** オブジェクト */
export interface Object {
    /** オブジェクト名 */
    objectName: string|null;
    /**
     * 全ての頂点をコールバック関数で順次受け取る
     * @param callback コールバック関数
     * @param m コールバック時に適用するアフィン変換（任意）
     */
    scanVerts(callback: (v: vc.V3) => void, m: mx.M4|null): void;
    /** 頂点数 */
    getVertsSize(): number;
    /**
     * 全てのサーフェイスグループをコールバック関数で順次受け取る
     * @param callback コールバック関数
     * @param offset コールバック時に適用するサーフェイスインデックスのオフセット
     */
    scanFaceGroups(callback: (faceGroup: FaceGroup, offset: number) => void, offset: number): void;

    dump(): void;
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
        public objectName: string|null,
    ) {}

    scanVerts(callback: (v: vc.V3) => void, m: mx.M4|null): void {
        const t = mergeTransfrom(m, this.transform);
        if (t != null) {
            this._verts.forEach(v => callback(t.map_v3(v, 1)));
        } else {
            this._verts.forEach(v => callback(v));
        }
    }
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
    constructor(
        public children: Object[],
        public transform: mx.M4|null,
        public group_info: FaceInfo|null,
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
}

/**
 * 単一のオブジェクトを生成する
 * @param verts 頂点
 * @param faceGroups ポリゴングループ
 * @param transform 適用するアフィン変換（任意）
 * @param o_name オブジェクト名（任意）
 */
export function objMultiFaceGroup(verts: vc.V3[], faceGroups: FaceGroup[], transform: mx.M4|null, o_name?: string|null): Object {
    return new SingleObject(verts, faceGroups, transform, o_name||null);
}

/**
 * 複数のオブジェクトをグループ化したオブジェクトを生成する
 * @param children グループ化するオブジェクト
 * @param transform 適用するアフィン変換（任意）
 * @param g_info サーフェイスグループの名前と適用マテリアル名（任意）
 * @param o_name オブジェクト名（任意）
 */
export function objGrouped(children: Object[], g_info: string|FaceInfo|null, transform: mx.M4|null, o_name?: string|null): Object {
    if (typeof g_info === 'string') {
        g_info = faceInfo(g_info);
    }
    return new GroupedObject(children, transform, g_info, o_name||null);
}

/**
 * あるオブジェクトを複製しグループ化したオブジェクトを生成する
 * @param src 複製元オブジェクト
 * @param duplicate 適用するアフィン変換リスト。リスト要素1つにつきオブジェクト1つが複製される
 * @param o_name オブジェクト名（任意）
 */
export function objDuplicated(src: Object, duplicate: mx.M4[], o_name?: string|null): Object {
    return new DuplicatedObject(src, duplicate, o_name||null);
}

/**
 * サーフェイスを生成する
 * @param faces サーフェイスリスト。サーフェイスは頂点インデックスリストであり、サーフェイスリストは頂点インデックスの二次元配列
 * @param g_name サーフェイスグループの名前（任意）
 * @param material_name サーフェイスグループに適用するマテリアル名（任意）
 */
export function faceGroup(faces: number[][], g_name: string|null, material_name: string|null = g_name): FaceGroup {
    return new SimpleFaceGroup(faces, faceInfo(g_name, material_name));
}

/**
 * サーフェイス情報を生成する
 * @param g_name サーフェイスグループの名前（任意）
 * @param material_name サーフェイスグループに適用するマテリアル名（任意）
 */
export function faceInfo(g_name: string|null, material_name: string|null = g_name): FaceInfo|null {
    return g_name != null || material_name != null ? {group_name: g_name, material_name} : null;
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
