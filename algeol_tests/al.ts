declare const require: any;
const fs = require('fs');

import * as al from "../algeol/al";
import * as vc from "../algeol/math/vector";

const deg1 = Math.PI / 180;
const deg90 = Math.PI / 2;

function test() {
	{
		const geo = al.geo('empty', [], []);
		const geoText = al.geo_wavefrontObj(geo).join('\n');
		fs.writeFile(`out/${geo.name()}.obj`, geoText);
	}
	{
		const verts = [
			vc.v3(0, 0, 0),
			vc.v3(1, 0, 0),
			vc.v3(0, 1, 0),
		];
		const faces = [
			[0, 1, 2],
		];
		const geo = al.geo('triangle', verts, faces);
		const geoText = al.geo_wavefrontObj(geo).join('\n');
		fs.writeFile(`out/${geo.name()}.obj`, geoText);
	}
	{
		const verts = [
			vc.v3(0, 0, 0),
			vc.v3(1, 0, 0),
			vc.v3(0, 1, 0),
			vc.v3(0, 0, 1),
		];
		const faces = [
			[0, 1, 3],
			[1, 2, 3],
			[2, 0, 3],
			[2, 1, 0],
		];
		const geo = al.geo('triangle4', verts, faces);
		const geoText = al.geo_wavefrontObj(geo).join('\n');
		fs.writeFile(`out/${geo.name()}.obj`, geoText);
	}
	// 螺旋階段
	/**
	const curve = new Curve(
		(i) => V3.FromV2(Deg(i * 90).v2(), i),
		(i, d) => );
	 */
}
test();
