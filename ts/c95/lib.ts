
import * as ut from '../algeol/common';

export function 内接円の半径_to_外接円の半径(角数: number, 内接円の半径: number): number {
    const rad = ut.degToRad(180 / 角数);
    return 内接円の半径 / Math.cos(rad);
}

export function 外接円の半径_to_内接円の半径(角数: number, 外接円の半径: number): number {
    const rad = ut.degToRad(180 / 角数);
    return 外接円の半径 * Math.cos(rad);
}
