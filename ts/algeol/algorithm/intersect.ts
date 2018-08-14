
import * as vc from '../datatype/vector';
import * as ray from '../datatype/ray';
import * as plane from '../datatype/plane';



export function intersectRayPlane(ray: ray.Ray3, plane: plane.Plane): number|null {
    const n1 = ray.d.ip(plane.n);
    if (n1 == 0) {
        return null;    // 平行の場合交差しない
    }
    const n2 = plane.d - ray.c.ip(plane.n);
    return n2 / n1;
}

export function intersectRayTriangle(ray: ray.Ray3, triangle: plane.Triangle3): number|null {
    
}
