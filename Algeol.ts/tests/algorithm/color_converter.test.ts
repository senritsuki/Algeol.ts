import * as cc from "../../algorithm/color_converter";

function expect_toBeClosedTo(a: number[], b: number[], E: number) {
    const c = a.map((_, i) => Math.abs(a[i] - b[i]));
    c.forEach(n => expect(n).toBeLessThan(E));
}

test('function', () => {
    expect(cc.etc.format_02f(0)).toBe('00');
    expect(cc.etc.format_02f(10)).toBe('0a');
    expect(cc.etc.format_02f(100)).toBe('64');
    expect(cc.etc.format_02f(255)).toBe('ff');
});

test('rgb255_to_rgbhex', () => {
    expect(cc.rgb255_to_rgbhex([0, 128, 255])).toBe('#0080ff');
    expect(cc.rgb255_to_rgbhex([51, 102, 153])).toBe('#336699');
});
test('rgbhex_to_rgb255', () => {
    expect(cc.rgbhex_to_rgb255('#0080ff')).toEqual([0, 128, 255]);
    expect(cc.rgbhex_to_rgb255('#336699')).toEqual([51, 102, 153]);
    expect(cc.rgbhex_to_rgb255('#369')).toEqual([51, 102, 153]);
});

test('rgb255_to_rgb01', () => {
    expect_toBeClosedTo(cc.rgb255_to_rgb01([0, 153, 255]), [0, 0.6, 1], 0.005);
});
test('rgb01_to_rgb255', () => {
    expect_toBeClosedTo(cc.rgb01_to_rgb255([0, 0.6, 1]), [0, 153, 255], 0.5);
});

(<[string, number[]][]>[
    ['#000', [0, 0, 0]],
    ['#666', [43, 0, 0]],
    ['#ccc', [82, 0, 0]],
    ['#fff', [100, 0, 0]],
    ['#321', [15, 7, 15]],
    ['#369', [42, -5, -33]],
    ['#cba', [77, 4, 11]],
    ['#cde', [87, -3, -10]],
]).forEach(d => test(
    `photoshop:rgbhex_to_lab(${d[0]})`,
    () => expect_toBeClosedTo(cc.rgbhex_to_lab(d[0]), d[1], 0.5),
));

(<[number[], string][]>[
    [[0, 0, 0], '#000000'],
    [[50, 0, 0], '#777777'],
    [[50, 50, 0], '#c14e79'],
    [[50, 0, 50], '#887616'],
    [[50, -50, 0], '#008c75'],
    [[50, 0, -50], '#367acd'],
    [[100, 0, 0], '#ffffff'],
]).forEach(d => test(
    `photoshop:lab_to_rgbhex(${d[0]})`,
    () => expect(cc.lab_to_rgbhex(d[0])).toBe(d[1]),
));

