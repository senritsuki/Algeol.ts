import * as vc from "./math/vector";
import * as mx from "./math/matrix";
import * as al from "./al";
export declare function duplicate_with_affine(geo: al.Geo, m4: mx.M4[]): al.Geo[];
export declare function duplicate_with_lambda(geo: al.Geo, map: (v: vc.V3) => vc.V3[]): al.Geo[];
export declare function composite_affine<T>(data: T[], lambdas: Array<(d: T) => mx.M4>): mx.M4[];
