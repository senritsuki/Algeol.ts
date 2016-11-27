import * as vector from "../../algeol/math/vector";

const V2 = vector._Vector2;
const V3 = vector._Vector3;

// 簡易目視テスト
function test() {
	const printEval = (s: string) => console.log(s + ' = ', eval(s));
	{
		console.log('testFn');
		const v1 = [1, 0, 0];
		const v2 = [1, 1, 0];
		const dim = 3;
		const n = 2;
		printEval('v1');
		printEval('v2');
		printEval('dim');
		printEval('vector.add(v1, v2, dim)');
		printEval('vector.sub(v1, v2, dim)');
		printEval('vector.ip(v1, v2, dim)');
		printEval('vector.cp3(v1, v2)');
	}
	{
		console.log('testVector3');
		const v1 = new V3(1, 0, 0);
		const v2 = new V3(1, 1, 0);
		printEval('v1');
		printEval('v2');
		printEval('v1.add(v2)');
		printEval('v1.sub(v2)');
		printEval('v1.scalar(3)');
		printEval('v1.hadamart(v2)');
		printEval('v1.ip(v2)');
		printEval('v1.cp(v2)');
		printEval('v2.cp(v1)');
	}
}

test();
