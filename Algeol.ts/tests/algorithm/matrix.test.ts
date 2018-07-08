import * as ut from '../../algorithm/utility';
import * as vc from '../../algorithm/vector';
import * as mx from '../../algorithm/matrix';

function expect_toBeClosedToZero<T extends vc.Vector<T>>(v: vc.Vector<T>) {
    vc.to_array_if_not(v).forEach(n => expect(n).toBeCloseTo(0));
}

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
    expect(mx.affine2_translate([1, 2]).map_v2([0, 0], 1).array()).toEqual([1, 2]);
    expect(mx.affine2_translate([1, 2]).map_v2([2, 3], 1).array()).toEqual([3, 5]);
    expect(mx.affine3_translate([1, 2, 3]).map_v3([0, 0, 0], 1).array()).toEqual([1, 2, 3]);
    expect(mx.affine3_translate([1, 2, 3]).map_v3([2, 3, 4], 1).array()).toEqual([3, 5, 7]);
});

test('scale', () => {
    expect(mx.affine2_scale([1, 2]).map_v2([0, 0], 1).array()).toEqual([0, 0]);
    expect(mx.affine2_scale([1, 2]).map_v2([2, 3], 1).array()).toEqual([2, 6]);
    expect(mx.affine3_scale([1, 2, 3]).map_v3([0, 0, 0], 1).array()).toEqual([0, 0, 0]);
    expect(mx.affine3_scale([1, 2, 3]).map_v3([2, 3, 4], 1).array()).toEqual([2, 6, 12]);
});

test('rotate-2d', () => {
    expect_toBeClosedToZero(mx.affine2_rotate(ut.deg90).map_v2([1, 0], 1).sub([0, 1]));
    expect_toBeClosedToZero(mx.affine2_rotate(ut.deg90).map_v2([0, 1], 1).sub([-1, 0]));
    expect_toBeClosedToZero(mx.affine2_rotate(-ut.deg90).map_v2([1, 0], 1).sub([0, -1]));
    expect_toBeClosedToZero(mx.affine2_rotate(-ut.deg90).map_v2([0, 1], 1).sub([1, 0]));
});
test('rotate-3d-z', () => {
    expect_toBeClosedToZero(mx.affine3_rotate_z(ut.deg90).map_v3([1, 0, 0], 1).sub([0, 1, 0]));
    expect_toBeClosedToZero(mx.affine3_rotate_z(ut.deg90).map_v3([0, 1, 0], 1).sub([-1, 0, 0]));
    expect_toBeClosedToZero(mx.affine3_rotate_z(ut.deg90).map_v3([0, 0, 1], 1).sub([0, 0, 1]));
    expect_toBeClosedToZero(mx.affine3_rotate_z(-ut.deg90).map_v3([1, 0, 0], 1).sub([0, -1, 0]));
    expect_toBeClosedToZero(mx.affine3_rotate_z(-ut.deg90).map_v3([0, 1, 0], 1).sub([1, 0, 0]));
    expect_toBeClosedToZero(mx.affine3_rotate_z(-ut.deg90).map_v3([0, 0, 1], 1).sub([0, 0, 1]));
});
test('rotate-3d-x', () => {
    expect_toBeClosedToZero(mx.affine3_rotate_x(ut.deg90).map_v3([1, 0, 0], 1).sub([1, 0, 0]));
    expect_toBeClosedToZero(mx.affine3_rotate_x(ut.deg90).map_v3([0, 1, 0], 1).sub([0, 0, 1]));
    expect_toBeClosedToZero(mx.affine3_rotate_x(ut.deg90).map_v3([0, 0, 1], 1).sub([0, -1, 0]));
    expect_toBeClosedToZero(mx.affine3_rotate_x(-ut.deg90).map_v3([1, 0, 0], 1).sub([1, 0, 0]));
    expect_toBeClosedToZero(mx.affine3_rotate_x(-ut.deg90).map_v3([0, 1, 0], 1).sub([0, 0, -1]));
    expect_toBeClosedToZero(mx.affine3_rotate_x(-ut.deg90).map_v3([0, 0, 1], 1).sub([0, 1, 0]));
});
test('rotate-3d-y', () => {
    expect_toBeClosedToZero(mx.affine3_rotate_y(ut.deg90).map_v3([1, 0, 0], 1).sub([0, 0, -1]));
    expect_toBeClosedToZero(mx.affine3_rotate_y(ut.deg90).map_v3([0, 1, 0], 1).sub([0, 1, 0]));
    expect_toBeClosedToZero(mx.affine3_rotate_y(ut.deg90).map_v3([0, 0, 1], 1).sub([1, 0, 0]));
    expect_toBeClosedToZero(mx.affine3_rotate_y(-ut.deg90).map_v3([1, 0, 0], 1).sub([0, 0, 1]));
    expect_toBeClosedToZero(mx.affine3_rotate_y(-ut.deg90).map_v3([0, 1, 0], 1).sub([0, 1, 0]));
    expect_toBeClosedToZero(mx.affine3_rotate_y(-ut.deg90).map_v3([0, 0, 1], 1).sub([-1, 0, 0]));
});

test('rot_yz_x_m3', () => {
    let v = vc.v3(1, 1, 1);
    expect_toBeClosedToZero(mx.rotate_yz_100_to_xyz(v).map([1, 0, 0]).sub(v.unit()));
    v = vc.v3(1, 2, 3);
    expect_toBeClosedToZero(mx.rotate_yz_100_to_xyz(v).map([1, 0, 0]).sub(v.unit()));
});
test('rot_yz_z_m3', () => {
    let v = vc.v3(1, 1, 1);
    expect_toBeClosedToZero(mx.rotate_yz_010_to_xyz(v).map([0, 0, 1]).sub(v.unit()));
    v = vc.v3(1, 2, 3);
    expect_toBeClosedToZero(mx.rotate_yz_010_to_xyz(v).map([0, 0, 1]).sub(v.unit()));
});




