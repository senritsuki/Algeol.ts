import * as wf from '../decoder/wavefront';

declare const require: any;
const fs = require('fs');

wf.useBlenderCoordinateSystem();

export function save_obj(data: wf.ObjString) {
    fs.writeFile(data.objfile, data.objstrs.join('\n'), (err: any) => {
        if (err) throw err;
        console.log('save: ' + data.objfile);
    });
}

export function save_objmtl(data: wf.ObjMtlString) {
    fs.writeFile(data.objfile, data.objstrs.join('\n'), (err: any) => {
        if (err) throw err;
        console.log('save: ' + data.objfile);
    });
    fs.writeFile(data.mtlfile, data.mtlstrs.join('\n'), (err: any) => {
        if (err) throw err;
        console.log('save: ' + data.mtlfile);
    });
}
