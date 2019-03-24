import * as mx from '../../datatype/matrix';
import * as obj from '../../datatype/object';
import * as prim from '../primitive';

export interface ConicalInfo {
    leaf_top: number;
    leaf_bottom: number;
    leaf_radius: number;
    leaf_vertex: number;
    trunk_radius: number;
    trunk_vertex: number;
    facename_leaf: string;
    facename_trunk: string;
}

export class DefaultConical implements ConicalInfo {
    constructor(
        public leaf_top: number = 3,
        public leaf_bottom: number = 0.5,
        public leaf_radius: number = 0.5,
        public leaf_vertex: number = 6,
        public trunk_radius: number = 0.1,
        public trunk_vertex: number = 4,
        public facename_leaf: string = 'leaf',
        public facename_trunk: string = 'trunk',
    ) {}
}

export function conical(
    d: ConicalInfo,
    transform: mx.M4|null = null,
): obj.Object {
    const trunk = prim.regular_prism(d.trunk_vertex);
    const leaf = prim.regular_pyramid(d.leaf_vertex);
    return common_singleleaf(trunk, leaf, d, transform);
}

export interface SphericalInfo {
    leaf_top: number;
    leaf_bottom: number;
    leaf_radius: number;
    leaf_subdiv: number;
    trunk_radius: number;
    trunk_vertex: number;
    facename_leaf: string;
    facename_trunk: string;
}

export class DefaultSpherical implements SphericalInfo {
    constructor(
        public leaf_top: number = 1.5,
        public leaf_bottom: number = 0.5,
        public leaf_radius: number = 0.5,
        public leaf_subdiv: number = 0,
        public trunk_radius: number = 0.1,
        public trunk_vertex: number = 4,
        public facename_leaf: string = 'leaf',
        public facename_trunk: string = 'trunk',
    ) {}
}

export function spherical(
    d: SphericalInfo,
    transform: mx.M4|null = null,
): obj.Object {
    const trunk = prim.regular_prism(d.trunk_vertex, 1, 1);
    const leaf = prim.icosphere(d.leaf_subdiv, 1);
    return common_singleleaf(trunk, leaf, d, transform);
}




interface CommonInfo {
    leaf_top: number;
    leaf_bottom: number;
    leaf_radius: number;
    trunk_radius: number;
    facename_leaf: string;
    facename_trunk: string;
}

function common_singleleaf(
    trunk: obj.VF, 
    leaf: obj.VF, 
    d: CommonInfo, 
    transform: mx.M4|null = null,
): obj.Object {
    const tr_trunk = mx.m4_scale3([d.trunk_radius, d.trunk_radius, d.leaf_bottom]);
    const tr_leaf = mx.mulAllRev([
        mx.m4_scale3([d.leaf_radius, d.leaf_radius, d.leaf_top - d.leaf_bottom]),
        mx.m4_translate3([0, 0, d.leaf_bottom]),
    ]);

    const fg_trunk = [obj.faceGroup(trunk.faces, d.facename_trunk, d.facename_trunk)];
    const fg_leaf = [obj.faceGroup(leaf.faces, d.facename_leaf, d.facename_leaf)];

    return obj.objGrouped([
        obj.objMultiFaceGroup(trunk.verts, fg_trunk, tr_trunk),
        obj.objMultiFaceGroup(leaf.verts, fg_leaf, tr_leaf),
    ], null, transform);
}
