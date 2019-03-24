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

import * as mx from '../algeol/datatype/matrix';
import * as cc from '../algeol/algorithm/color_converter';
import * as obj from '../algeol/datatype/object';
import * as 塔 from './塔';
import * as 木 from './木';
import * as 地 from './地';
import * as 風 from './風';
import * as grad from './gradient';

const grad_70_40_24 = grad.circle(70, 40, 24);

function build_obj(): obj.Object {
    //obj.dump();
    return obj.objGrouped(
        [
            //塔.test(),
            //木.test(),
            obj.objWrapped(
                塔.test(), null, mx.m4_translate3([5, 0, 0])),
            obj.objWrapped(
                地.床と木({
                    g_name_床: 'white',
                    g_name_葉: 'green',
                    g_name_幹: 'brown',
                }), 
                null, mx.m4_translate3([0, 0, 0])),
            風.circleTree({
                g_name_床: 'white',
                g_name_幹: 'brown',
                g_name_葉: grad_70_40_24.map(v => v.key),
            }),
        ],
        null, null,
    );
}

function build_mats(): obj.Material[] {
    return [
        obj.material('white', cc.lch_to_rgb01([95, 0, 0])),
        obj.material('blue', cc.lch_to_rgb01([70, 40, 180])),
        obj.material('brown', cc.lch_to_rgb01([70, 40, 60])),
        obj.material('green', cc.lch_to_rgb01([70, 40, 120])),
        obj.material('trunk', cc.lch_to_rgb01([70, 40, 60])),
    ]
    .concat(grad_70_40_24.map(v => obj.material(v.key, v.rgb01)));
}

import * as wf from '../algeol/decoder/wavefront';
import * as sf from '../examples/savefile';

wf.useBlenderCoordinateSystem();
wf.setFloatFixed(3);
sf.save_obj_mtl('./out/c95', build_obj(), build_mats());
