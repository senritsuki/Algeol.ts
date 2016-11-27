var vector = require("../../algeol/math/vector");
var V2 = vector.Vector2;
var V3 = vector.Vector3;
// 簡易目視テスト
function test() {
    var printEval = function (s) { return console.log(s + ' = ', eval(s)); };
    {
        console.log('testFn');
        var v1 = [1, 0, 0];
        var v2 = [1, 1, 0];
        var dim = 3;
        var n = 2;
        printEval('v1');
        printEval('v2');
        printEval('dim');
        printEval('vector.add(v1, v2, dim)');
        printEval('vector.sub(v1, v2, dim)');
        printEval('vector.ip(v1, v2, dim)');
        printEval('vector.cp3(v1, v2)');
    }
    {
        console.log('testVector3');
        var v1 = new V3(1, 0, 0);
        var v2 = new V3(1, 1, 0);
        printEval('v1');
        printEval('v2');
        printEval('v1.add(v2)');
        printEval('v1.sub(v2)');
        printEval('v1.scalar(3)');
        printEval('v1.hadamart(v2)');
        printEval('v1.ip(v2)');
        printEval('v1.cp(v2)');
        printEval('v2.cp(v1)');
    }
}
test();
//# sourceMappingURL=vector.js.map