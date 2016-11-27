import * as al from "../algeol/al";
import * as vector from "../algeol/math/vector";
const V3 = vector._Vector3;
const deg1 = Math.PI / 180;
const deg90 = Math.PI / 2;

function test() {
	// 螺旋階段
	const curve = new Curve(
		(i) => V3.FromV2(Deg(i * 90).v2(), i),
		(i, d) => );
}

