var ut = require("../../algeol/math/util");
var dummy = ut.r2;
// 簡易目視テスト
function test() {
    var printEval = function (s) { return console.log(s + ' = ', eval(s)); };
    {
        console.log('testFn');
        printEval('ut.r2');
        printEval('ut.r3');
        printEval('ut.r5');
        printEval('ut.pi');
        printEval('ut.pi2');
        printEval('ut.phi');
        printEval('ut.deg_rad(90)');
        printEval('ut.rad_deg(Math.PI/2)');
        printEval('ut.seq(5)');
        printEval('ut.seq(5, 1)');
        printEval('ut.seq(5, 1, 2)');
    }
}
test();
//# sourceMappingURL=util.js.map