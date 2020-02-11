"use strict";

var _interopRequireWildcard = require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _defineProperties = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _getOwnPropertySymbols = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/core-js-stable/object/keys"));

var _getOwnPropertyNames = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/core-js-stable/object/get-own-property-names"));

var _typeof2 = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/helpers/typeof"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _fill = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/fill"));

var _parseFloat = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/core-js-stable/number/parse-float"));

var _classCallCheck2 = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty3 = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/helpers/defineProperty"));

var _base = _interopRequireWildcard(require("./base"));

var _util = _interopRequireDefault(require("./util"));

function ownKeys(object, enumerableOnly) { var keys = (0, _keys.default)(object); if (_getOwnPropertySymbols.default) { var symbols = (0, _getOwnPropertySymbols.default)(object); if (enumerableOnly) symbols = (0, _filter.default)(symbols).call(symbols, function (sym) { return (0, _getOwnPropertyDescriptor.default)(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context3; (0, _forEach.default)(_context3 = ownKeys(Object(source), true)).call(_context3, function (key) { (0, _defineProperty3.default)(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors.default) { (0, _defineProperties.default)(target, (0, _getOwnPropertyDescriptors.default)(source)); } else { var _context4; (0, _forEach.default)(_context4 = ownKeys(Object(source))).call(_context4, function (key) { (0, _defineProperty2.default)(target, key, (0, _getOwnPropertyDescriptor.default)(source, key)); }); } } return target; }

// 出现的所有角度均为deg，逆时针旋转的角度
// 平面坐标系与极坐标系和数学中坐标系一致
var CanvasLayer =
/*#__PURE__*/
function (_GeneralLayer) {
  (0, _inherits2.default)(CanvasLayer, _GeneralLayer);

  function CanvasLayer(width, height, definition) {
    var _this;

    (0, _classCallCheck2.default)(this, CanvasLayer);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(CanvasLayer).call(this, width, height, definition));
    (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "drawDiscretionalCircle", function (center, poi, circleR, style) {
      // center [x, y], poi [deg, r]
      if (!(poi instanceof Array) && !(center instanceof Array)) return;
      var centerX, centerY;
      centerX = Math.cos(poi[0] * Math.PI / 180 || 0) * poi[1] + center[0];
      centerY = center[1] - Math.sin(poi[0] * Math.PI / 180 || 0) * poi[1];

      _this.drawCircle([centerX, centerY, circleR], style);
    });
    (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "drawCircle", function (poi, style) {
      // poi 为相对于画布长和宽的百分比相对位置以及半径, 画布左上角为圆点
      if (!poi || poi.length < 3) return;
      var x = poi[0],
          y = poi[1],
          r = poi[2];

      if (typeof x === 'string') {
        if (/%/ig.test(x)) {
          x = (0, _parseFloat.default)(x) / 100;
          y = (0, _parseFloat.default)(y) / 100;
        } else if (/px/ig.test(x)) {
          x = (0, _parseFloat.default)(x) / _this.width;
          y = (0, _parseFloat.default)(y) / _this.height;
        } else return;
      }

      if (x < 1) {
        x = (0, _parseFloat.default)(x) * _this.width;
        y = (0, _parseFloat.default)(y) * _this.height;
      }

      if (typeof r === 'string' && /px/ig.test(r)) {
        r = (0, _parseFloat.default)(r);
      }

      _this.ctx.beginPath();

      _this.ctx.arc(_this.definition * x, _this.definition * y, _this.definition * r, 0, 2 * Math.PI);

      if (style.line && style.line.color) _this.ctx.strokeStyle = new _util.default(style.line.color, style.line.opacity).rgb;else if (style.line) _this.ctx.strokeStyle = style.line.style;

      _this.ctx.stroke();

      if ((0, _fill.default)(style)) {
        var gradient = (0, _fill.default)(style).gradient;

        if (gradient) {
          if (gradient.type === 'radial') {
            (0, _fill.default)(style).gradient = _objectSpread({
              type: 'radial',
              sx: poi[0],
              sy: poi[1],
              sr: 0.1,
              sColor: '',
              ex: poi[0],
              ey: poi[1],
              er: poi[2],
              eColor: ''
            }, gradient);
          } else {
            (0, _fill.default)(style).gradient = _objectSpread({
              type: 'liner'
            }, gradient);
          }
        }

        _this.drawFill((0, _fill.default)(style));
      }
    });
    (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "drawPolygon", function (data, style) {
      var _context;

      var center = [0, 0],
          FlatvertexData; // 'center'为已 data.center为中心(x, y)画多边形，
      // data.vertex为多边形全部顶点相对于中心的极坐标（deg, r）形成的数组

      if (!(data.center instanceof Array) || !(data.vertex instanceof Array)) return;
      if (data.center.length === 2) center = data.center;
      FlatvertexData = (0, _map.default)(_context = data.vertex).call(_context, function (vertex, ind) {
        return [Math.cos(vertex[0] * Math.PI / 180 || 0) * vertex[1] + center[1], center[0] - Math.sin(vertex[0] * Math.PI / 180 || 0) * vertex[1]];
      });

      _this.drawClosedPath(FlatvertexData, style);
    });
    (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "drawClosedPath", function (data, style) {
      if (!data || !(data instanceof Array) || data.length < 2) return;

      _this.ctx.beginPath();

      (0, _forEach.default)(data).call(data, function (vertex, ind) {
        if (ind === 0) {
          _this.ctx.moveTo(_this.definition * vertex[0], _this.definition * vertex[1]);

          return;
        }

        _this.ctx.lineTo(_this.definition * vertex[0], _this.definition * vertex[1]);
      });

      _this.ctx.closePath();

      if (style.line && style.line.color) {
        _this.ctx.strokeStyle = new _util.default(style.line.color, style.line.opacity).rgb;
      } else if (style.line) {
        _this.ctx.strokeStyle = style.line.style;
      }

      _this.ctx.stroke();

      if ((0, _fill.default)(style)) _this.drawFill((0, _fill.default)(style));
    });
    (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "drawFill", function (style) {
      var _context2;

      // style { color , opacity, pattern, gradient ={type, sx, sy, sr, sColor, ex, ey, er, eColor} },前缀 s 为开始位置， 前缀 e 为结束位置
      if ((0, _typeof2.default)(style) !== 'object') return;
      var color,
          opacity = 1,
          grd;

      if (style.color) {
        if (style.opacity || style.opacity === 0) opacity = style.opacity;
        color = new _util.default(style.color, opacity).rgb;
        _this.ctx.fillStyle = color;
      }

      if (style.gradient) {
        var gradient = style.gradient;

        if (gradient.type === 'liner') {
          grd = _this.ctx.createLinearGradient(gradient.sx, gradient.sy, gradient.ex, gradient.ey);
        } else if (gradient.type === 'radial') {
          grd = _this.ctx.createRadialGradient(gradient.sx, gradient.sy, gradient.sr, gradient.ex, gradient.ey, gradient.er);
        }

        grd.addColorStop(0, new _util.default(gradient.sColor, 1).rgb);
        grd.addColorStop(1, new _util.default(gradient.eColor, 1).rgb);
        _this.ctx.fillStyle = grd;
      }

      (0, _fill.default)(_context2 = _this.ctx).call(_context2);
    });
    (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "drawRay", function (data, style) {
      // data.originPoint [x,y]， data.vertex [deg, r]
      if ((0, _typeof2.default)(data) !== 'object' || !data.originPoint || !data.vertex) return;
      var startX = data.originPoint[0],
          startY = data.originPoint[1],
          endX = Math.cos(data.vertex[0] * Math.PI / 180 || 0) * data.vertex[1] + startX,
          endY = startY - Math.sin(data.vertex[0] * Math.PI / 180 || 0) * data.vertex[1];

      _this.drawLine([[startX, startY], [endX, endY]], style);
    });
    (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "drawLine", function (data, style) {
      // data为二维数组[[startX, startY], [endX, endY]]，单位为px
      // style { type, ll, bl, color,  }为line的颜色等设置, 'dash'为虚线，ll为线长，bl为断长
      if (!(data instanceof Array)) return;
      if (data.length !== 2) return;
      var startX = data[0][0],
          startY = data[0][1],
          endX = data[1][0],
          endY = data[1][1];

      if (typeof startX === 'string') {
        startX = (0, _parseFloat.default)(startX);
        startY = (0, _parseFloat.default)(startY);
        endX = (0, _parseFloat.default)(endX);
        endY = (0, _parseFloat.default)(endY);
      }

      _this.ctx.beginPath();

      _this.ctx.moveTo(_this.definition * startX, _this.definition * startY);

      _this.ctx.lineTo(_this.definition * endX, _this.definition * endY);

      if ((0, _typeof2.default)(style) === 'object') {
        if (style.type === 'dash') {
          // 虚线
          _this.ctx.setLineDash([style.ll, style.bl]);
        }

        if (style.color) _this.ctx.strokeStyle = new _util.default(style.color, style.opacity).rgb;else if (style.style) _this.ctx.strokeStyle = style.style;
      }

      _this.ctx.stroke();
    });
    (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "drawTextPanel", function (text, url, poi) {
      // poi [x, y, width, height], 
      // 其中 x, y指textpanel的中心坐标，width ,height指textpanel的尺寸
      var imgPoi, textPoi;
      if (url) _this.drawImage(url, imgPoi);
      if (text) _this.drawText(text, textPoi);
    });
    (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "drawImage", function (url, poi) {
      // poi [x, y, width, height]
      if (!url || !(poi instanceof Array)) return;
      var img = document.createElement('img');
      img.src = url;
      ctx.drawImage(img, poi[0], poi[1], poi[2], poi[3]);
    });
    (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "drawText", function (text, poi) {
      // text {text, style: {color, font}}, poi [x, y] 文字绘制的起始坐标
      if (!text || !(poi instanceof Array)) return;

      if (text.style) {
        var style = text.style;
        _this.ctx.fillStyle = style.color;
        _this.ctx.font = style.font; // "30px Verdana";
      }

      _this.ctx.fillText(text.text, poi[0], poi[1]);
    });
    _this.ctx = new _base.default(_this.width, _this.height, _this.definition);
    var funcNames = (0, _getOwnPropertyNames.default)(_this.__proto__);
    (0, _forEach.default)(funcNames).call(funcNames, function (name) {
      if (name === 'ctxIsExist' || name === 'constructor') return;
      _this[name] = _this.ctxIsExist(_this[name]);
    });
    return (0, _possibleConstructorReturn2.default)(_this, (0, _assertThisInitialized2.default)(_this));
  }

  return CanvasLayer;
}(_base.GeneralLayer);

exports.default = CanvasLayer;