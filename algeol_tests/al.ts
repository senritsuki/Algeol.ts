declare const require: any;
const fs = require('fs');

import * as al from "../algeol/al";
import * as li from "../algeol/seqlim";
import * as ut from "../algeol/math/util";
import * as vc from "../algeol/math/vector";
import * as mx from "../algeol/math/matrix";

import * as wo from "../algeol/presets/format_wavefrontobj";
import * as prim from "../algeol/presets/prim_old";

const deg1 = Math.PI / 180;
const deg90 = Math.PI / 2;


const exportGeo = (geo: al.Geo, name: string) => {
	fs.writeFile(`al_out/${name}.obj`, wo.geo_str(geo));
};
const exportGeos = (geos: al.Geo[], name: string) => {
	//fs.writeFile(`al_out/${name}.obj`, wo.geogroup_str(al.geoGroup(name, geos)));
};

function testLimObj() {
	{
		const limobj = al.limobj(prim.octahedron(), [
		]);
		exportGeos(limobj.geo(), 'empty');
	}
	{
		const limobj1 = al.limobj(prim.octahedron(), [
			li.lim(mx.scale_m4(0.5, 0.5, 1)),
			li.lim(mx.trans_m4(5, 0, 1)),
			li.seqlim(ut._arithobj(8, 0, ut.pi2/8), i => mx.rotZ_m4(i)),
		]);
		const limobj2 = al.limobj(prim.cube(), [
			li.lim(mx.scale_m4(0.5, 0.5, 0.5)),
			li.lim(mx.trans_m4(5, 0, 0.5)),
			li.seqlim(ut._arithobj(8, ut.pi2/16, ut.pi2/8), i => mx.rotZ_m4(i)),
		]);
		exportGeos(limobj1.geo().concat(limobj2.geo()), 'seqlim');
	}
}

function testGeo() {
	{
		const geo = al.geo([], []);
		exportGeo(geo, 'empty');
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
		const geo = al.geo(verts, faces);
		exportGeo(geo, 'triangle');
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
		const geo = al.geo(verts, faces);
		exportGeo(geo, 'triangle4');
	}
	// 螺旋階段
	/**
	const curve = new Curve(
		(i) => V3.FromV2(Deg(i * 90).v2(), i),
		(i, d) => );
	 */
}
//testGeo();
testLimObj();
