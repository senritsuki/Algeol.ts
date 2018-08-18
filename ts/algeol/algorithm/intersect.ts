import * as vc from '../datatype/vector';
import * as ray from '../datatype/ray';
import * as prim from '../datatype/primitive';



export class Intersection {
    constructor(
        public inRay: ray.Ray3,
        public t: number,
        public normal: vc.V3,
    ) {}
}

export function intersectRaySphere(ray: ray.Ray3, sphere: prim.Sphere): Intersection|null {
    const r2 = sphere.r * sphere.r;
    const e = sphere.c.sub(ray.c);
    const e2 = e.ip(e);
    const a = e.ip(ray.d);
    const a2 = a * a;
    const c = r2 - e2 + a2;
    if (c < 0) {
        return null;
    }
    const t = a - Math.sqrt(c);
    const n = ray.p(t).sub(sphere.c);
    return new Intersection(ray, t, n);
}

export function intersectRayPlane(ray: ray.Ray3, plane: prim.Plane): Intersection|null {
    const n1 = ray.d.ip(plane.n);
    if (n1 == 0) {
        return null;    // 平行の場合交差しない
    }
    const n2 = plane.d - ray.c.ip(plane.n);
    const t = n2 / n1;
    return new Intersection(ray, t, plane.n);
}

export function intersectRayTriangle(ray: ray.Ray3, triangle: prim.Triangle3): Intersection|null {
    const plane = triangle.plane();
    if (!plane) {
        return null;    // 三角形の三点が線形従属で平面が求まらない
    }
    const isec = intersectRayPlane(ray, plane);
    if (isec == null) {
        return null;    // 光線と平面が平行
    }
    const g = triangle.gravCoord(ray.p(isec.t));
    if (!g || g.isInnerTriangle() == false) {
        return null;    // 光線と平面の交点が三角形の内側でない
    }
    return isec;
}
