// Sequence and Linear Map
var LimImpl = (function () {
    function LimImpl(_lims) {
        this._lims = _lims;
    }
    LimImpl.prototype.lim = function () {
        return this._lims();
    };
    return LimImpl;
})();
var SeqLimImpl = (function () {
    function SeqLimImpl(_seq, _lim) {
        this._seq = _seq;
        this._lim = _lim;
    }
    SeqLimImpl.prototype.lim = function () {
        var _this = this;
        return this._seq.seq().map(function (i) { return _this._lim(i); });
    };
    return SeqLimImpl;
})();
function lims(m4) {
    return new LimImpl(function () { return m4; });
}
exports.lims = lims;
function lim(m4) {
    return lims([m4]);
}
exports.lim = lim;
function seqlim(seq, lambda_m4) {
    return new SeqLimImpl(seq, lambda_m4);
}
exports.seqlim = seqlim;
function mul(s1, s2) {
    var m1l = s1.lim();
    var m2l = s2.lim();
    var m = [];
    m1l.forEach(function (m1) {
        m2l.forEach(function (m2) {
            m.push(m1.mul(m2));
        });
    });
    return lims(m);
}
function merge(seqlims) {
    return seqlims.reduce(function (a, b) { return mul(a, b); });
}
exports.merge = merge;
//# sourceMappingURL=seqlim.js.map