import * as ut from '../../algeol/common';

test('normalize_rad', () => {
    [
        [0, 0],
        [Math.PI, Math.PI],
        [Math.PI * 3, Math.PI],
        [Math.PI * -5, Math.PI],
    ].forEach(d => expect(ut.normalizeRad(d[0])).toBeCloseTo(d[1]));
});

test('normalize_deg', () => {
    [
        [0, 0],
        [180, 180],
        [540, 180],
        [-900, 180],
    ].forEach(d => expect(ut.normalizeDeg(d[0])).toBeCloseTo(d[1]));
});

test('deg_to_rad', () => {
    [
        [0, 0],
        [180, Math.PI],
        [360, Math.PI * 2],
        [-540, Math.PI * -3],
    ].forEach(d => expect(ut.degToRad(d[0])).toBeCloseTo(d[1]));
});

test('rad_to_deg', () => {
    [
        [0, 0],
        [Math.PI, 180],
        [Math.PI * 2, 360],
        [Math.PI * -3, -540],
    ].forEach(d => expect(ut.radToDeg(d[0])).toBeCloseTo(d[1]));
});

test('factorial', () => {
    [
        [0, 1],
        [1, 1],
        [2, 2],
        [3, 6],
        [4, 24],
        [5, 120],
    ].forEach(d => expect(ut.factorial(d[0])).toBe(d[1]));
});

test('combination', () => {
    [
        [6, 1, 6],
        [6, 2, 15],
        [6, 3, 20],
        [6, 4, 15],
        [6, 5, 6],
        [6, 6, 1],
    ].forEach(d => expect(ut.combination(d[0], d[1])).toBe(d[2]));
});

test('transpose', () => {
    [
        [[[1, 2], [3, 4]], [[1, 3], [2, 4]]],
        [[[1, 2], [3, 4], [5, 6]], [[1, 3, 5], [2, 4, 6]]],
    ].forEach(d => expect(ut.transpose(d[0])).toEqual(d[1]));
});

test('bernstein_basis', () => {
});

test('b_spline_basis', () => {
});

test('format_02x', () => {
    (<[number, string][]>[
        [0, '00'],
        [1, '01'],
        [100, '64'],
        [255, 'ff'],
    ]).forEach(d => expect(ut.format02x(d[0])).toBe(d[1]));
});

test('format_02d', () => {
    (<[number, string][]>[
        [0, '00'],
        [1, '01'],
        [64, '64'],
    ]).forEach(d => expect(ut.format02d(d[0])).toBe(d[1]));
});

test('format_03d', () => {
    (<[number, string][]>[
        [0, '000'],
        [1, '001'],
        [64, '064'],
        [256, '256'],
    ]).forEach(d => expect(ut.format03d(d[0])).toBe(d[1]));
});

test('clamp', () => {
    [
        [0, 255, -1, 0],
        [0, 255, 0, 0],
        [0, 255, 100, 100],
        [0, 255, 255, 255],
        [0, 255, 256, 255],
    ].forEach(d => expect(ut.clamp(d[0], d[1], d[2])).toBe(d[3]));
});

test('sin_deg', () => {
    [
        [60, Math.sin(Math.PI / 3)],
    ].forEach(d => expect(ut.sinDeg(d[0])).toBeCloseTo(d[1]));
});

test('cos_deg', () => {
    [
        [60, Math.cos(Math.PI / 3)],
    ].forEach(d => expect(ut.cosDeg(d[0])).toBeCloseTo(d[1]));
});

test('tan_deg', () => {
    [
        [60, Math.tan(Math.PI / 3)],
    ].forEach(d => expect(ut.tanDeg(d[0])).toBeCloseTo(d[1]));
});

test('isin', () => {
    (<[number, number, number, boolean][]>[
        [0, 255, -1, false],
        [0, 255, 0, true],
        [0, 255, 100, true],
        [0, 255, 255, true],
        [0, 255, 256, false],
    ]).forEach(d => expect(ut.isIn(d[0], d[1], d[2])).toBe(d[3]));
});

test('xpor', () => {
    (<[boolean, boolean, boolean][]>[
        [true, true, false],
        [true, false, true],
        [false, true, true],
        [false, false, false],
    ]).forEach(d => expect(ut.xor(d[0], d[1])).toBe(d[2]));
});
