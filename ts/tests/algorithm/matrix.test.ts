import * as ut from '../../algeol/common';
import * as vc from '../../algeol/datatype/vector';
import * as mx from '../../algeol/datatype/matrix';

<<<<<<< HEAD
=======
function expect_toBeClosedToZero<T extends vc.Vector<T>>(v: vc.Vector<T>) {
    vc.to_array_if_not(v).forEach(n => expect(n).toBeCloseTo(0));
}

>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
test('m2', () => {
    const a = [[1, 2], [3, 4]];
    const b = [[1, 3], [2, 4]];
    expect(mx.rows_to_m2(a).array_rows()).toEqual(a);
    expect(mx.rows_to_m2(a).array_cols()).toEqual(b);
    expect(mx.cols_to_m2(b).array_rows()).toEqual(a);
    expect(mx.cols_to_m2(b).array_cols()).toEqual(b);
});
test('m3', () => {
    const a = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const b = [[1, 4, 7], [2, 5, 8], [3, 6, 9]];
    expect(mx.rows_to_m3(a).array_rows()).toEqual(a);
    expect(mx.rows_to_m3(a).array_cols()).toEqual(b);
    expect(mx.cols_to_m3(b).array_rows()).toEqual(a);
    expect(mx.cols_to_m3(b).array_cols()).toEqual(b);
});
test('m4', () => {
    const a = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];
    const b = [[1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], [4, 8, 12, 16]];
    expect(mx.rows_to_m4(a).array_rows()).toEqual(a);
    expect(mx.rows_to_m4(a).array_cols()).toEqual(b);
    expect(mx.cols_to_m4(b).array_rows()).toEqual(a);
    expect(mx.cols_to_m4(b).array_cols()).toEqual(b);
});

test('translate', () => {
    expect(mx.m3_translate2([1, 2]).map_v2([0, 0], 1).array()).toEqual([1, 2]);
    expect(mx.m3_translate2([1, 2]).map_v2([2, 3], 1).array()).toEqual([3, 5]);
    expect(mx.m4_translate3([1, 2, 3]).map_v3([0, 0, 0], 1).array()).toEqual([1, 2, 3]);
    expect(mx.m4_translate3([1, 2, 3]).map_v3([2, 3, 4], 1).array()).toEqual([3, 5, 7]);
});

test('scale', () => {
    expect(mx.m3_scale2([1, 2]).map_v2([0, 0], 1).array()).toEqual([0, 0]);
    expect(mx.m3_scale2([1, 2]).map_v2([2, 3], 1).array()).toEqual([2, 6]);
    expect(mx.m4_scale3([1, 2, 3]).map_v3([0, 0, 0], 1).array()).toEqual([0, 0, 0]);
    expect(mx.m4_scale3([1, 2, 3]).map_v3([2, 3, 4], 1).array()).toEqual([2, 6, 12]);
});

test('rotate-2d', () => {
<<<<<<< HEAD
    mx.m3_rotate2(ut.deg90).map_v2([1, 0], 1).sub([0, 1]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m3_rotate2(ut.deg90).map_v2([0, 1], 1).sub([-1, 0]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m3_rotate2(-ut.deg90).map_v2([1, 0], 1).sub([0, -1]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m3_rotate2(-ut.deg90).map_v2([0, 1], 1).sub([1, 0]).array().forEach(n => expect(n).toBeCloseTo(0));
});
test('rotate-3d-z', () => {
    mx.m4_rotate3_z(ut.deg90).map_v3([1, 0, 0], 1).sub([0, 1, 0]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m4_rotate3_z(ut.deg90).map_v3([0, 1, 0], 1).sub([-1, 0, 0]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m4_rotate3_z(ut.deg90).map_v3([0, 0, 1], 1).sub([0, 0, 1]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m4_rotate3_z(-ut.deg90).map_v3([1, 0, 0], 1).sub([0, -1, 0]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m4_rotate3_z(-ut.deg90).map_v3([0, 1, 0], 1).sub([1, 0, 0]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m4_rotate3_z(-ut.deg90).map_v3([0, 0, 1], 1).sub([0, 0, 1]).array().forEach(n => expect(n).toBeCloseTo(0));
});
test('rotate-3d-x', () => {
    mx.m4_rotate3_x(ut.deg90).map_v3([1, 0, 0], 1).sub([1, 0, 0]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m4_rotate3_x(ut.deg90).map_v3([0, 1, 0], 1).sub([0, 0, 1]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m4_rotate3_x(ut.deg90).map_v3([0, 0, 1], 1).sub([0, -1, 0]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m4_rotate3_x(-ut.deg90).map_v3([1, 0, 0], 1).sub([1, 0, 0]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m4_rotate3_x(-ut.deg90).map_v3([0, 1, 0], 1).sub([0, 0, -1]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m4_rotate3_x(-ut.deg90).map_v3([0, 0, 1], 1).sub([0, 1, 0]).array().forEach(n => expect(n).toBeCloseTo(0));
});
test('rotate-3d-y', () => {
    mx.m4_rotate3_y(ut.deg90).map_v3([1, 0, 0], 1).sub([0, 0, -1]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m4_rotate3_y(ut.deg90).map_v3([0, 1, 0], 1).sub([0, 1, 0]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m4_rotate3_y(ut.deg90).map_v3([0, 0, 1], 1).sub([1, 0, 0]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m4_rotate3_y(-ut.deg90).map_v3([1, 0, 0], 1).sub([0, 0, 1]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m4_rotate3_y(-ut.deg90).map_v3([0, 1, 0], 1).sub([0, 1, 0]).array().forEach(n => expect(n).toBeCloseTo(0));
    mx.m4_rotate3_y(-ut.deg90).map_v3([0, 0, 1], 1).sub([-1, 0, 0]).array().forEach(n => expect(n).toBeCloseTo(0));
=======
    expect_toBeClosedToZero(mx.m3_rotate2(ut.deg90).map_v2([1, 0], 1).sub([0, 1]));
    expect_toBeClosedToZero(mx.m3_rotate2(ut.deg90).map_v2([0, 1], 1).sub([-1, 0]));
    expect_toBeClosedToZero(mx.m3_rotate2(-ut.deg90).map_v2([1, 0], 1).sub([0, -1]));
    expect_toBeClosedToZero(mx.m3_rotate2(-ut.deg90).map_v2([0, 1], 1).sub([1, 0]));
});
test('rotate-3d-z', () => {
    expect_toBeClosedToZero(mx.m4_rotate3_z(ut.deg90).map_v3([1, 0, 0], 1).sub([0, 1, 0]));
    expect_toBeClosedToZero(mx.m4_rotate3_z(ut.deg90).map_v3([0, 1, 0], 1).sub([-1, 0, 0]));
    expect_toBeClosedToZero(mx.m4_rotate3_z(ut.deg90).map_v3([0, 0, 1], 1).sub([0, 0, 1]));
    expect_toBeClosedToZero(mx.m4_rotate3_z(-ut.deg90).map_v3([1, 0, 0], 1).sub([0, -1, 0]));
    expect_toBeClosedToZero(mx.m4_rotate3_z(-ut.deg90).map_v3([0, 1, 0], 1).sub([1, 0, 0]));
    expect_toBeClosedToZero(mx.m4_rotate3_z(-ut.deg90).map_v3([0, 0, 1], 1).sub([0, 0, 1]));
});
test('rotate-3d-x', () => {
    expect_toBeClosedToZero(mx.m4_rotate3_x(ut.deg90).map_v3([1, 0, 0], 1).sub([1, 0, 0]));
    expect_toBeClosedToZero(mx.m4_rotate3_x(ut.deg90).map_v3([0, 1, 0], 1).sub([0, 0, 1]));
    expect_toBeClosedToZero(mx.m4_rotate3_x(ut.deg90).map_v3([0, 0, 1], 1).sub([0, -1, 0]));
    expect_toBeClosedToZero(mx.m4_rotate3_x(-ut.deg90).map_v3([1, 0, 0], 1).sub([1, 0, 0]));
    expect_toBeClosedToZero(mx.m4_rotate3_x(-ut.deg90).map_v3([0, 1, 0], 1).sub([0, 0, -1]));
    expect_toBeClosedToZero(mx.m4_rotate3_x(-ut.deg90).map_v3([0, 0, 1], 1).sub([0, 1, 0]));
});
test('rotate-3d-y', () => {
    expect_toBeClosedToZero(mx.m4_rotate3_y(ut.deg90).map_v3([1, 0, 0], 1).sub([0, 0, -1]));
    expect_toBeClosedToZero(mx.m4_rotate3_y(ut.deg90).map_v3([0, 1, 0], 1).sub([0, 1, 0]));
    expect_toBeClosedToZero(mx.m4_rotate3_y(ut.deg90).map_v3([0, 0, 1], 1).sub([1, 0, 0]));
    expect_toBeClosedToZero(mx.m4_rotate3_y(-ut.deg90).map_v3([1, 0, 0], 1).sub([0, 0, 1]));
    expect_toBeClosedToZero(mx.m4_rotate3_y(-ut.deg90).map_v3([0, 1, 0], 1).sub([0, 1, 0]));
    expect_toBeClosedToZero(mx.m4_rotate3_y(-ut.deg90).map_v3([0, 0, 1], 1).sub([-1, 0, 0]));
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
});

test('rot_yz_x_m3', () => {
    let v = vc.v3(1, 1, 1);
<<<<<<< HEAD
    mx.m3_rotate_from_100_to_v(v).map([1, 0, 0]).sub(v.unit()).array().forEach(n => expect(n).toBeCloseTo(0));
    v = vc.v3(1, 2, 3);
    mx.m3_rotate_from_100_to_v(v).map([1, 0, 0]).sub(v.unit()).array().forEach(n => expect(n).toBeCloseTo(0));
});
test('rot_yz_z_m3', () => {
    let v = vc.v3(1, 1, 1);
    mx.m3_rotate_from_001_to_v(v).map([0, 0, 1]).sub(v.unit()).array().forEach(n => expect(n).toBeCloseTo(0));
    v = vc.v3(1, 2, 3);
    mx.m3_rotate_from_001_to_v(v).map([0, 0, 1]).sub(v.unit()).array().forEach(n => expect(n).toBeCloseTo(0));
});

test('Rodrigues1', () => {
    const axis = [1, 0, 0];
    const b1 = [1, 0, 0];
    const b2 = [0, 0, 1];
    const b3 = [0, -1, 0];
    const rad = Math.PI / 2;
    const m3 = mx.m3_rodrigues(axis, rad);
    const a1 = m3.map([1, 0, 0]);
    const a2 = m3.map([0, 1, 0]);
    const a3 = m3.map([0, 0, 1]);
    a1.sub(b1).array().forEach(n => expect(n).toBeCloseTo(0));
    a2.sub(b2).array().forEach(n => expect(n).toBeCloseTo(0));
    a3.sub(b3).array().forEach(n => expect(n).toBeCloseTo(0));
});

test('Rodrigues2', () => {
    const axis = [0, 1, 0];
    const b1 = [0, 0, -1];
    const b2 = [0, 1, 0];
    const b3 = [1, 0, 0];
    const rad = Math.PI / 2;
    const m3 = mx.m3_rodrigues(axis, rad);
    const a1 = m3.map([1, 0, 0]);
    const a2 = m3.map([0, 1, 0]);
    const a3 = m3.map([0, 0, 1]);
    a1.sub(b1).array().forEach(n => expect(n).toBeCloseTo(0));
    a2.sub(b2).array().forEach(n => expect(n).toBeCloseTo(0));
    a3.sub(b3).array().forEach(n => expect(n).toBeCloseTo(0));
});

test('Rodrigues3', () => {
    const axis = [0, 0, 1];
    const b1 = [0, 1, 0];
    const b2 = [-1, 0, 0];
    const b3 = [0, 0, 1];
    const rad = Math.PI / 2;
    const m3 = mx.m3_rodrigues(axis, rad);
    const a1 = m3.map([1, 0, 0]);
    const a2 = m3.map([0, 1, 0]);
    const a3 = m3.map([0, 0, 1]);
    a1.sub(b1).array().forEach(n => expect(n).toBeCloseTo(0));
    a2.sub(b2).array().forEach(n => expect(n).toBeCloseTo(0));
    a3.sub(b3).array().forEach(n => expect(n).toBeCloseTo(0));
});

test('RodriguesMul', () => {
    const axis1 = [0, 0, 1];
    const rad1 = Math.PI / 2;
    const axis2 = [-1, 0, 0];
    const rad2 = -Math.PI / 2;
    const b1 = [0, 0, 1];
    const b2 = [-1, 0, 0];
    const b3 = [0, -1, 0];
    const m1 = mx.m3_rodrigues(axis1, rad1);
    const m2 = mx.m3_rodrigues(axis2, rad2);
    const m3 = m2.mul(m1);
    const a1 = m3.map([1, 0, 0]);
    const a2 = m3.map([0, 1, 0]);
    const a3 = m3.map([0, 0, 1]);
    a1.sub(b1).array().forEach(n => expect(n).toBeCloseTo(0));
    a2.sub(b2).array().forEach(n => expect(n).toBeCloseTo(0));
    a3.sub(b3).array().forEach(n => expect(n).toBeCloseTo(0));
});
=======
    expect_toBeClosedToZero(mx.m3_rotate_from_100_to_v(v).map([1, 0, 0]).sub(v.unit()));
    v = vc.v3(1, 2, 3);
    expect_toBeClosedToZero(mx.m3_rotate_from_100_to_v(v).map([1, 0, 0]).sub(v.unit()));
});
test('rot_yz_z_m3', () => {
    let v = vc.v3(1, 1, 1);
    expect_toBeClosedToZero(mx.m3_rotate_from_001_to_v(v).map([0, 0, 1]).sub(v.unit()));
    v = vc.v3(1, 2, 3);
    expect_toBeClosedToZero(mx.m3_rotate_from_001_to_v(v).map([0, 0, 1]).sub(v.unit()));
});


>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998


