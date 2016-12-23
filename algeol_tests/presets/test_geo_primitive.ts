declare const require: any;
const fs = require('fs');

import * as al from "../../algeol/algeol";
import * as wo from "../../algeol/presets/format_wavefrontobj";
import * as prim from "../../algeol/presets/geo_primitive";


function write(name: string, geo: al.Geo): void {
	const path = `test_geo_primitive/${name}.obj`;
	fs.writeFile(path, wo.geo_str(geo));
	console.log('save: ' + path);
}

function test() {
	write('tetrahedron',
		prim.tetrahedron());
	write('octahedron',
		prim.octahedron());
	write('cube',
		prim.cube());
	write('dodecahedron',
		prim.dodecahedron());
	write('icosahedron',
		prim.icosahedron());
	write('prism',
		prim.prism(8));
	write('pyramid',
		prim.pyramid(8));
	write('bipyramid',
		prim.bipyramid(8));
}
test();
