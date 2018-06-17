import * as vc from '../../algorithm/vector';
import * as vsq from '../../algorithm/vector_sequence';



test('arithmetic', () => {
    const a = [vc.v2(1, 0), vc.v2(2, 2), vc.v2(3, 4)];
    const b = vsq.arithmetic(3, vc.v2(1, 0), vc.v2(1, 2));
    expect(vc.sub(a[0], b[0]).length2()).toBeLessThan(0.001);
    expect(vc.sub(a[1], b[1]).length2()).toBeLessThan(0.001);
    expect(vc.sub(a[2], b[2]).length2()).toBeLessThan(0.001);
});

test('range', () => {
    const a = [vc.v2(1, 0), vc.v2(2, 2), vc.v2(3, 4)];
    const b = vsq.range(vc.v2(1, 0), vc.v2(3, 4), 3);
    const c = vsq.range(vc.v2(1, 0), vc.v2(4, 6), 4, true);
    expect(vc.sub(a[0], b[0]).length2()).toBeLessThan(0.001);
    expect(vc.sub(a[1], b[1]).length2()).toBeLessThan(0.001);
    expect(vc.sub(a[2], b[2]).length2()).toBeLessThan(0.001);
    expect(vc.sub(a[0], c[0]).length2()).toBeLessThan(0.001);
    expect(vc.sub(a[1], c[1]).length2()).toBeLessThan(0.001);
    expect(vc.sub(a[2], c[2]).length2()).toBeLessThan(0.001);
});
