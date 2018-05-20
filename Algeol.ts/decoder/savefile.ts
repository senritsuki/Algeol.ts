import * as fs from "fs"
import * as geo from "../geometry/core";
import * as wf from "./wavefront";

export function save(file: string, callback: (wst: fs.WriteStream) => void): void {
    const wst = fs.createWriteStream(file);
    callback(wst);
    wst.end();
}

export function save_obj(filebase: string, obj: geo.Object): void {
    const wst = fs.createWriteStream(filebase + '.obj');
    wf.dump_obj(obj, null, line => wst.write(line + '\n'));
    wst.end();
}

export function save_obj_mtl(filebase: string, obj: geo.Object, mtls: geo.Material[]): void {
    const objfile = filebase + '.obj';
    const mtlfile = filebase + '.mtl';
    const mtlfile_without_dir = mtlfile.replace(/^.*[\\/]/, '');
    {
        const wst = fs.createWriteStream(objfile);
        wf.dump_obj(obj, mtlfile_without_dir, line => wst.write(line + '\n'));
        wst.end();
    }
    {
        const wst = fs.createWriteStream(mtlfile);
        wf.dump_mtl(mtls, line => wst.write(line + '\n'));
        wst.end();
    }
}
