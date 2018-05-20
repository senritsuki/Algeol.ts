import * as vc from '../../algorithm/vector';

const closed = (nn: number[]) => nn.map(n => Math.round(n * 1000) / 1000);

test('v2', () => {
    expect(vc.v2(1, 2).array()).toEqual([1, 2]);
});
test('v3', () => {
    expect(vc.v3(1, 2, 3).array()).toEqual([1, 2, 3]);
});
test('v4', () => {
    expect(vc.v4(1, 2, 3, 4).array()).toEqual([1, 2, 3, 4]);
});

const deg90 = Math.PI / 2;
const deg180 = Math.PI;

test('polar_to_v2', () => {
    expect(closed(vc.polar_to_v2(2, 0).array())).toEqual([2, 0]);
    expect(closed(vc.polar_to_v2(2, deg90).array())).toEqual([0, 2]);
    expect(closed(vc.polar_to_v2(2, deg180).array())).toEqual([-2, 0]);
});
test('polar_to_v3', () => {
    expect(closed(vc.polar_to_v3(2, 0, 3).array())).toEqual([2, 0, 3]);
    expect(closed(vc.polar_to_v3(2, deg90, 4).array())).toEqual([0, 2, 4]);
    expect(closed(vc.polar_to_v3(2, deg180, 5).array())).toEqual([-2, 0, 5]);
});
test('sphere_to_v3', () => {
    expect(closed(vc.sphere_to_v3(2, 0, 0).array())).toEqual([2, 0, 0]);
    expect(closed(vc.sphere_to_v3(2, deg90, 0).array())).toEqual([0, 2, 0]);
    expect(closed(vc.sphere_to_v3(2, deg180, 0).array())).toEqual([-2, 0, 0]);
    expect(closed(vc.sphere_to_v3(2, 0, deg90).array())).toEqual([0, 0, 2]);
    expect(closed(vc.sphere_to_v3(2, deg90, deg90).array())).toEqual([0, 0, 2]);
    expect(closed(vc.sphere_to_v3(2, 0, -deg90).array())).toEqual([0, 0, -2]);
    expect(closed(vc.sphere_to_v3(2, deg90, -deg90).array())).toEqual([0, 0, -2]);
});

test('v.add', () => {
    expect(vc.v2(1, 2).add(vc.v2(2, 3)).array()).toEqual([3, 5]);
    expect(vc.v3(1, 2, 3).add(vc.v3(2, 3, 4)).array()).toEqual([3, 5, 7]);
    expect(vc.v4(1, 2, 3, 4).add(vc.v4(2, 3, 4, 5)).array()).toEqual([3, 5, 7, 9]);
});
test('v.sub', () => {
    expect(vc.v2(1, 2).sub(vc.v2(2, 3)).array()).toEqual([-1, -1]);
    expect(vc.v3(1, 2, 3).sub(vc.v3(2, 3, 4)).array()).toEqual([-1, -1, -1]);
    expect(vc.v4(1, 2, 3, 4).sub(vc.v4(2, 3, 4, 5)).array()).toEqual([-1, -1, -1, -1]);
});
test('v.el_mul', () => {
    expect(vc.v2(1, 2).el_mul(vc.v2(2, 3)).array()).toEqual([2, 6]);
    expect(vc.v3(1, 2, 3).el_mul(vc.v3(2, 3, 4)).array()).toEqual([2, 6, 12]);
    expect(vc.v4(1, 2, 3, 4).el_mul(vc.v4(2, 3, 4, 5)).array()).toEqual([2, 6, 12, 20]);
});
test('v.scalar', () => {
    expect(vc.v2(1, 2).scalar(2).array()).toEqual([2, 4]);
    expect(vc.v3(1, 2, 3).scalar(2).array()).toEqual([2, 4, 6]);
    expect(vc.v4(1, 2, 3, 4).scalar(2).array()).toEqual([2, 4, 6, 8]);
});
test('v.ip', () => {
    expect(vc.v2(1, 2).ip(vc.v2(2, 3))).toBe(8);
    expect(vc.v3(1, 2, 3).ip(vc.v3(2, 3, 4))).toBe(20);
    expect(vc.v4(1, 2, 3, 4).ip(vc.v4(2, 3, 4, 5))).toBe(40);
});
test('v.cp', () => {
    expect(vc.v2(1, 0).cp(vc.v2(1, 0))).toBe(0);
    expect(vc.v2(1, 0).cp(vc.v2(1/2, 1/2))).toBe(1/2);
    expect(vc.v2(1, 0).cp(vc.v2(0, 1))).toBe(1);
    expect(vc.v2(0, 1).cp(vc.v2(1, 0))).toBe(-1);
    expect(vc.v2(0, 1).cp(vc.v2(-1, 0))).toBe(1);
    expect(vc.v3(1, 0, 0).cp(vc.v3(1, 0, 0)).array()).toEqual([0, 0, 0]);
    expect(vc.v3(1, 0, 0).cp(vc.v3(0, 1, 0)).array()).toEqual([0, 0, 1]);
    expect(vc.v3(1, 0, 0).cp(vc.v3(0, -1, 0)).array()).toEqual([0, 0, -1]);
    expect(vc.v3(1, 0, 0).cp(vc.v3(0, 0, 1)).array()).toEqual([0, -1, 0]);
    expect(vc.v3(0, 1, 0).cp(vc.v3(-1, 0, 0)).array()).toEqual([0, -0, 1]);
});
