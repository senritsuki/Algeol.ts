declare const require: any;
const fs = require('fs');

import * as al from "../../geometry/geo";
import * as prim from "../../geometry/primitive";
import * as wo from "../../decoder/wavefront";


function save(name: string, geo: al.Geo): void {
    const dir = 'test_geo_primitive/'
    const data = wo.geos_to_strings(name, [geo]);
    const path = dir + data.objfile;
    fs.writeFile(path, data.objstrs);
    console.log('save: ' + path);
}

function test() {
    save('tetrahedron',
        prim.tetrahedron(1));
    save('octahedron',
        prim.octahedron(1));
    save('cube',
        prim.cube(1));
    save('dodecahedron',
        prim.dodecahedron(1));
    save('icosahedron',
        prim.icosahedron(1));
    save('prism',
        prim.prism(8, 1, 2));
    save('pyramid',
        prim.pyramid(8, 1 , 2));
    save('bipyramid',
        prim.bipyramid(8, 1, 1, 1));
}
test();
