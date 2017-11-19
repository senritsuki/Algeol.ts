//import * as vc from "../../algorithm/vector";

//const dummy = vc.fn;

// 簡易目視テスト
export function test() {
	const printEval = (s: string) => console.log(s + ' = ', eval(s));
	{
		console.log('testNsFn');
		//const v1 = [1, 0, 0];
		//const v2 = [1, 1, 0];
		//const dim = 3;
		//const n = 2;
		printEval('v1');
		printEval('v2');
		printEval('n');
		printEval('vc.fn.add(v1, v2)');
		printEval('vc.fn.sub(v1, v2)');
		printEval('vc.fn.hadamart(v1, v2)');
		printEval('vc.fn.scalar(v1, n)');
		printEval('vc.fn.ip(v1, v2)');
		printEval('vc.fn.cp3(v1, v2)');
	}
	{
		console.log('testFn');
		printEval('vc.v2(1, 2)');
		printEval('vc.ar_v2([1, 2])');
		printEval('vc.v3(1, 2, 3)');
		printEval('vc.ar_v3([1, 2, 3])');
		printEval('vc.v4(1, 2, 3, 4)');
		printEval('vc.ar_v4([1, 2, 3, 4])');
		printEval('vc.v2_v3(vc.v2(1, 2), 3)');
		printEval('vc.v3_v2(vc.v3(1, 2, 3))');
		printEval('vc.v3_v4(vc.v3(1, 2, 3), 4)');
		printEval('vc.v4_v3(vc.v4(1, 2, 3, 4))');
	}
}
test();
