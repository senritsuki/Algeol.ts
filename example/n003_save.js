"use strict";
exports.__esModule = true;
var wf = require("../decoder/wavefront");
var fs = require('fs');
wf.useBlenderCoordinateSystem();
function save_obj(data) {
    fs.writeFile(data.objfile, data.objstrs.join('\n'), function (err) {
        if (err)
            throw err;
        console.log('save: ' + data.objfile);
    });
}
exports.save_obj = save_obj;
function save_objmtl(data) {
    fs.writeFile(data.objfile, data.objstrs.join('\n'), function (err) {
        if (err)
            throw err;
        console.log('save: ' + data.objfile);
    });
    fs.writeFile(data.mtlfile, data.mtlstrs.join('\n'), function (err) {
        if (err)
            throw err;
        console.log('save: ' + data.mtlfile);
    });
}
exports.save_objmtl = save_objmtl;
