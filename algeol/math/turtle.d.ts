import * as vc from './vector';
import * as cv2 from './curve2';
import * as cv3 from './curve3';
export interface Turtle2 {
    coord(): vc.V2;
    dir(): vc.V2;
    moveDraw(len: number): TLTuple2;
    move(len: number): Turtle2;
    turn(degree: number): Turtle2;
}
export interface Turtle3 {
    coord(): vc.V3;
    dir(): vc.V3;
    moveDraw(len: number): TLTuple3;
    move(len: number): Turtle3;
    turnH(degree: number): Turtle3;
    turnV(degree: number): Turtle3;
}
export interface TLTuple2 {
    turtle: Turtle2;
    line: cv2.Curve;
}
export interface TLTuple3 {
    turtle: Turtle3;
    line: cv3.Curve;
}
export declare function turtle2(coord?: vc.V2, degree?: number): Turtle2;
export declare function turtle3(coord?: vc.V3, degreeH?: number, degreeV?: number): Turtle3;
