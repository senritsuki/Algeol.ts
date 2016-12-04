var vc = require("../../algeol/math/vector");
var mx = require("../../algeol/math/matrix");
var dummy_vc = vc.fn;
var dummy_mx = mx.fn;
// 簡易目視テスト
function test() {
    var printEval = function (s) { return console.log(s + ' = ', eval(s)); };
    {
        console.log('testFn');
        printEval('mx.m2_m3(mx.rows_m2([[1, 2], [3, 4]]))');
        printEval('mx.m2_m3(mx.cols_m2([[1, 2], [3, 4]]))');
        printEval('mx.m3_m4(mx.rows_m3([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))');
        printEval('mx.m3_m4(mx.cols_m3([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))');
        printEval('mx.m3_m2(mx.rows_m3([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))');
        printEval('mx.m4_m3(mx.rows_m4([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]))');
    }
    {
        console.log('testAffine');
        printEval('mx.trans_m4(1, 2, 3)');
        printEval('mx.trans_v3_m4(vc.v3(1, 2, 3))');
        printEval('mx.scale_m4(1, 2, 3)');
        printEval('mx.scale_v3_m4(vc.v3(1, 2, 3))');
        printEval('mx.rotX_m4(Math.PI / 2)');
        printEval('mx.rotY_m4(Math.PI / 2)');
        printEval('mx.rotZ_m4(Math.PI / 2)');
    }
    {
        console.log('testMap');
        var v = vc.v4(1, 0, 0, 1);
        printEval('mx.trans_m4(1, 2, 3).map(v)');
        printEval('mx.rotY_m4(Math.PI/2).map(v)');
        printEval('mx.rotY_m4(Math.PI/2).map(v)');
    }
    {
        console.log('testRot');
        var x3 = vc.v3(1, 0, 0);
        var y3 = vc.v3(0, 1, 0);
        var z3 = vc.v3(0, 0, 1);
        var v3 = vc.v3(1, 1, 1);
        var x4 = vc.v4(1, 0, 0, 0);
        var z4 = vc.v4(0, 0, 1, 0);
        printEval('mx.rotYZ_x_m4(x3).map(x4)');
        printEval('mx.rotYZ_z_m4(x3).map(z4)');
        printEval('mx.rotYZ_x_m4(y3).map(x4)');
        printEval('mx.rotYZ_z_m4(y3).map(z4)');
        printEval('mx.rotYZ_x_m4(z3).map(x4)');
        printEval('mx.rotYZ_z_m4(z3).map(z4)');
        printEval('mx.rotYZ_x_m4(v3).map(x4)');
        printEval('mx.rotYZ_z_m4(v3).map(z4)');
    }
}
test();
//# sourceMappingURL=matrix.js.map