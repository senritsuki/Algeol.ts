import * as vc from "../../algorithm/vector";
import * as cv from "../../algorithm/curve";

function expect_toBeClosedToZero<T extends vc.Vector<T>>(v: vc.Vector<T>) {
    vc.to_array_if(v).forEach(n => expect(n).toBeCloseTo(0));
}

test('Ray2', () => {
    const ray = cv.ray(vc.v2(1, 0), vc.v2(0, 1));
    expect_toBeClosedToZero(ray.p(0).sub([1, 0]));
    expect_toBeClosedToZero(ray.p(1).sub([1, 1]));
    expect_toBeClosedToZero(ray.p(2).sub([1, 2]));
});
test('Ray3', () => {
    const ray = cv.ray(vc.v3(1, 0, 1), vc.v3(0, 1, 2));
    expect_toBeClosedToZero(ray.p(0).sub([1, 0, 1]));
    expect_toBeClosedToZero(ray.p(1).sub([1, 1, 3]));
    expect_toBeClosedToZero(ray.p(2).sub([1, 2, 5]));
});

test('ray3_to_ray2', () => {
    const ray3 = cv.ray(vc.v3(1, 0, 1), vc.v3(0, 1, 2));
    const ray = cv.ray3_to_ray2(ray3);
    expect_toBeClosedToZero(ray.p(0).sub([1, 0]));
    expect_toBeClosedToZero(ray.p(1).sub([1, 1]));
    expect_toBeClosedToZero(ray.p(2).sub([1, 2]));
});

test('rot_ray3d_z', () => {
    const ray3 = cv.ray(vc.v3(1, 0, 1), vc.v3(0, 1, 2));
    const ray = cv.rot_ray3d_z(ray3, Math.PI / 2);
    expect_toBeClosedToZero(ray.p(0).sub([1, 0, 1]));
    expect_toBeClosedToZero(ray.p(1).sub([0, 0, 3]));
    expect_toBeClosedToZero(ray.p(2).sub([-1, 0, 5]));
});

test('line', () => {
    const curve = cv.line(vc.v3(2, 0, 0), vc.v3(0, 2, 4));
    expect_toBeClosedToZero(curve.coord(0.0).sub([2, 0, 0]));
    expect_toBeClosedToZero(curve.coord(0.5).sub([1, 1, 2]));
    expect_toBeClosedToZero(curve.coord(1.0).sub([0, 2, 4]));
});

test('circle', () => {
    const o = vc.v3(5, 0, 0), dx = vc.v3(1, 0, 0), dy = vc.v3(0, 1, 0);
    const curve = cv.circle(o, o.add(dx), o.add(dy));
    expect_toBeClosedToZero(curve.coord(0.00).sub([6, 0, 0]));
    expect_toBeClosedToZero(curve.coord(0.25).sub([5, 1, 0]));
    expect_toBeClosedToZero(curve.coord(0.50).sub([4, 0, 0]));
    expect_toBeClosedToZero(curve.coord(0.75).sub([5, -1, 0]));
    expect_toBeClosedToZero(curve.coord(1.00).sub([6, 0, 0]));
});

test('spiral', () => {
    const o = vc.v3(5, 0, 0), dx = vc.v3(1, 0, 0), dy = vc.v3(0, 1, 0), dz = vc.v3(0, 0, 4);
    const curve = cv.spiral(o, o.add(dx), o.add(dy), o.add(dz));
    expect_toBeClosedToZero(curve.coord(0.00).sub([6, 0, 0]));
    expect_toBeClosedToZero(curve.coord(0.25).sub([5, 1, 1]));
    expect_toBeClosedToZero(curve.coord(0.50).sub([4, 0, 2]));
    expect_toBeClosedToZero(curve.coord(0.75).sub([5, -1, 3]));
    expect_toBeClosedToZero(curve.coord(1.00).sub([6, 0, 4]));
});



