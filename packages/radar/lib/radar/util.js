"use strict";

var _interopRequireDefault = require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _parseFloat2 = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/core-js-stable/parse-float"));

var _parseInt2 = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/core-js-stable/parse-int"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

function TransformSyntax(str, opacity) {
  this.opacity = opacity || 0;
  this.origin = str;
  this.reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  this.hex = this.Rgb2Hex();
  this.rgb = this.Hex2Rgb();
}
/*16进制转为RGB*/


TransformSyntax.prototype.Hex2Rgb = function () {
  var sColor = this.origin.toLowerCase();

  if (sColor && this.reg.test(sColor)) {
    if (sColor.length === 4) {
      var sColorNew = "#";

      for (var i = 1; i < 4; i += 1) {
        var _context;

        sColorNew += (0, _concat.default)(_context = (0, _slice.default)(sColor).call(sColor, i, i + 1)).call(_context, (0, _slice.default)(sColor).call(sColor, i, i + 1));
      }

      sColor = sColorNew;
    } //处理六位的颜色值


    var sColorChange = [];

    for (var _i = 1; _i < 7; _i += 2) {
      sColorChange.push((0, _parseInt2.default)("0x" + (0, _slice.default)(sColor).call(sColor, _i, _i + 2)));
    }

    sColorChange.push((0, _parseFloat2.default)(this.opacity));
    return "RGBA(" + sColorChange.join(",") + ")";
  } else {
    return sColor;
  }
};
/*RGB颜色转换为16进制*/


TransformSyntax.prototype.Rgb2Hex = function () {
  var that = this;

  if (/^(rgb(a)?|RGB(A)?)/.test(this.origin)) {
    var aColor = this.origin.replace(/(?:\(|\)|rgb(a)?|RGB(A)?)*/g, "").split(",");
    var strHex = "#";

    for (var i = 0; i < 3; i++) {
      var hex = Number(aColor[i]).toString(16);

      if (hex === "0") {
        hex += hex;
      }

      strHex += hex;
    }

    if (strHex.length !== 7) {
      strHex = that;
    }

    return strHex;
  } else {
    return that;
  }
};

var _default = TransformSyntax;
exports.default = _default;