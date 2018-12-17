// 1. 樽型のケース、シンプルな筒のケース
// 2. 球表面（ハンモック）の大ケース
// 3. 木（輪郭を線でナゾルのではなく、放射線で木を形作る）
// 4. 垂れる緑
// 5. 銀の台座と銀の平面木

/*

構造
    四角形の塔
    n角形の塔
    n角形のn段の塔

ケース
    n角形の籠
    n角形の台座

接続
    アーチ橋
    階段
    螺旋階段

オブジェ
    木
    色のついた木
    結晶

*/

import * as cc from '../algeol/algorithm/color_converter';
import * as geo from '../algeol/object/object';
import * as 塔 from './塔';
import * as 木 from './木';

function build_obj(): geo.Object {
    const obj = geo.objGrouped(
        [
            塔.test(),
            木.test(),
        ],
        null, null,
    );
    //obj.dump();
    return obj;
}

function build_mats(): geo.Material[] {
    return [
        geo.material('white', cc.lch_to_rgb01([95, 0, 0])),
        geo.material('blue', cc.lch_to_rgb01([70, 40, 180])),
        geo.material('brown', cc.lch_to_rgb01([70, 40, 60])),
        geo.material('green', cc.lch_to_rgb01([70, 40, 120])),
    ];
}

import * as wf from '../algeol/decoder/wavefront';
import * as sf from '../examples/savefile';

wf.useBlenderCoordinateSystem();
wf.setFloatFixed(3);
sf.save_obj_mtl('./out/c95', build_obj(), build_mats());
