import * as Qt from '../../algeol/datatype/quaternion';

function sub(a: number[], b: number[]): number[] {
    return a.map((_, i) => a[i] - b[i]);
}

test('axis_rad1', () => {
    const axis = [0, 0, 1];
    const rad = 0;
    const qt = Qt.axis_rad(axis, rad);
    const cos2 = Math.cos(rad / 2);
    const sin2 = Math.sin(rad / 2);
    sub(qt.array(), axis.map(n => n * sin2).concat([cos2])).forEach(n => expect(n).toBeCloseTo(0));
});

test('axis_rad2', () => {
    const axis = [0, 0, 1];
    const rad = Math.PI / 2;
    const qt = Qt.axis_rad(axis, rad);
    const cos2 = Math.cos(rad / 2);
    const sin2 = Math.sin(rad / 2);
    sub(qt.array(), axis.map(n => n * sin2).concat([cos2])).forEach(n => expect(n).toBeCloseTo(0));
});

test('axis_rad3', () => {
    const axis = [0, 0, 1];
    const rad = Math.PI;
    const qt = Qt.axis_rad(axis, rad);
    const cos2 = Math.cos(rad / 2);
    const sin2 = Math.sin(rad / 2);
    sub(qt.array(), axis.map(n => n * sin2).concat([cos2])).forEach(n => expect(n).toBeCloseTo(0));
});

test('map1', () => {
    const axis = [1, 0, 0];
    const rad = Math.PI / 2;
    const qt = Qt.axis_rad(axis, rad);
    const a1 = [1, 0, 0];
    const a2 = [0, 1, 0];
    const a3 = [0, 0, 1];
    const b1 = [1, 0, 0];
    const b2 = [0, 0, 1];
    const b3 = [0, -1, 0];
    sub(b1, qt.map(a1)._v).forEach(n => expect(n).toBeCloseTo(0));
    sub(b2, qt.map(a2)._v).forEach(n => expect(n).toBeCloseTo(0));
    sub(b3, qt.map(a3)._v).forEach(n => expect(n).toBeCloseTo(0));
});

test('map2', () => {
    const axis = [0, 1, 0];
    const rad = Math.PI / 2;
    const qt = Qt.axis_rad(axis, rad);
    const a1 = [1, 0, 0];
    const a2 = [0, 1, 0];
    const a3 = [0, 0, 1];
    const b1 = [0, 0, -1];
    const b2 = [0, 1, 0];
    const b3 = [1, 0, 0];
    sub(b1, qt.map(a1)._v).forEach(n => expect(n).toBeCloseTo(0));
    sub(b2, qt.map(a2)._v).forEach(n => expect(n).toBeCloseTo(0));
    sub(b3, qt.map(a3)._v).forEach(n => expect(n).toBeCloseTo(0));
});

test('map3', () => {
    const axis = [0, 0, 1];
    const rad = Math.PI / 2;
    const qt = Qt.axis_rad(axis, rad);
    const a1 = [1, 0, 0];
    const a2 = [0, 1, 0];
    const a3 = [0, 0, 1];
    const b1 = [0, 1, 0];
    const b2 = [-1, 0, 0];
    const b3 = [0, 0, 1];
    sub(b1, qt.map(a1)._v).forEach(n => expect(n).toBeCloseTo(0));
    sub(b2, qt.map(a2)._v).forEach(n => expect(n).toBeCloseTo(0));
    sub(b3, qt.map(a3)._v).forEach(n => expect(n).toBeCloseTo(0));
});

test('mul1', () => {
    const qt1 = Qt.axis_rad([0, 0, 1], Math.PI / 2);
    const qt2 = Qt.axis_rad([1, 0, 0], Math.PI / 2);
    const qt = Qt.mul(qt2, qt1);
    const a1 = [1, 0, 0];
    const a2 = [0, 1, 0];
    const a3 = [0, 0, 1];
    const b1 = [0, 0, 1];
    const b2 = [-1, 0, 0];
    const b3 = [0, -1, 0];
    sub(b1, qt.map(a1)._v).forEach(n => expect(n).toBeCloseTo(0));
    sub(b2, qt.map(a2)._v).forEach(n => expect(n).toBeCloseTo(0));
    sub(b3, qt.map(a3)._v).forEach(n => expect(n).toBeCloseTo(0));
});
