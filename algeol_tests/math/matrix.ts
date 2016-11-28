import * as vc from "../../algeol/math/vector";
import * as mx from "../../algeol/math/matrix";

const dummy_vc = vc.fn;
const dummy_mx = mx.fn;

// 簡易目視テスト
function test() {
	const printEval = (s: string) => console.log(s + ' = ', eval(s));
	{
		console.log('testFn');
		printEval('mx.m2_m3(mx.rows_m2([[1, 2], [3, 4]]))');
		printEval('mx.m2_m3(mx.cols_m2([[1, 2], [3, 4]]))');
		printEval('mx.m3_m4(mx.rows_m3([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))');
		printEval('mx.m3_m4(mx.cols_m3([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))');
		printEval('mx.m3_m2(mx.rows_m3([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))');
		printEval('mx.m4_m3(mx.rows_m4([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]))');
	}
	{
		console.log('testAffine');
		printEval('mx.trans_m4(1, 2, 3)');
		printEval('mx.trans_v3_m4(vc.v3(1, 2, 3))');
		printEval('mx.scale_m4(1, 2, 3)');
		printEval('mx.scale_v3_m4(vc.v3(1, 2, 3))');
		printEval('mx.rotX_m4(Math.PI / 2)');
		printEval('mx.rotY_m4(Math.PI / 2)');
		printEval('mx.rotZ_m4(Math.PI / 2)');
	}
	{
		console.log('testMap');
		let v = vc.v4(0, 0, 0, 1);
		let m = mx.trans_m4(1, 2, 3);
		printEval('m.map(v)');
	}
}
test();
