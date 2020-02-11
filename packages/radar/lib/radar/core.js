"use strict";

var _interopRequireDefault = require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _classCallCheck2 = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/helpers/defineProperty"));

var _lib = _interopRequireDefault(require("./lib"));

var Radar = // 1、setHangPoint; 2、initialBaseMap；3、drawMap;4、combineLayer & hangOut
// ElId: 挂载的节点id， definition: 画布清晰度等级，为整数，清晰度越高，线越清晰
function Radar(ElId, _definition) {
  var _this = this;

  (0, _classCallCheck2.default)(this, Radar);
  (0, _defineProperty2.default)(this, "setData", function (data) {
    if (!(data instanceof Array)) return; // data 的元素为百分比[0.1, 0.2, 0.4],该百分比即相对于半径的百分比，
    // 这样设百分比为a, 半径为r,则[deg, a*r]即是该点的极坐标, 其中deg为this.Axis中定义的几个坐标轴的角度

    _this.data = (0, _map.default)(data).call(data, function (percent, ind) {
      var lineLength = percent * (_this.width / 2) - _this.margin;
      var deg = _this.Axis[ind];
      return [deg, lineLength];
    });

    _this.drawMap();
  });
  (0, _defineProperty2.default)(this, "setHangPoint", function (Elid) {
    _this.hangPoint = Elid;
    _this.root = document.createElement('div');
  });
  (0, _defineProperty2.default)(this, "setPictureFeature", function (definition) {
    _this.margin = 1; // 默认的canvas留边，当可能绘到canvas边缘时，应减掉该值，以留出边缘

    _this.definition = definition;
    _this.Axis = [90, 210, 330];
  });
  (0, _defineProperty2.default)(this, "initial", function () {
    if (!_this.hangPoint) return;
    var El = document.getElementById(_this.hangPoint);
    if (!El) return;

    var _El$getBoundingClient = El.getBoundingClientRect(),
        width = _El$getBoundingClient.width,
        height = _El$getBoundingClient.height;

    _this.width = width;
    _this.height = height;
    _this.MapCenterX = _this.width / 2;
    _this.MapCenterY = _this.height / 2;

    _this.drawBaseMap();
  });
  (0, _defineProperty2.default)(this, "drawBaseMap", function () {
    var _context, _context2, _context3;

    var firstLayer = new _lib.default(_this.width, _this.height, _this.definition);
    firstLayer.drawCircle([0.5, 0.5, _this.width / 2 - _this.margin], {
      fill: {
        color: '#efeff4',
        opacity: 0.1
      },
      line: {
        color: '#efeff4',
        opacity: 0.2
      }
    });
    var secondLayer = new _lib.default(_this.width, _this.height, _this.definition);
    secondLayer.drawPolygon({
      center: [_this.MapCenterX, _this.MapCenterY],
      vertex: (0, _map.default)(_context = _this.Axis).call(_context, function (deg) {
        return [deg, _this.width / 2 - _this.margin];
      })
    }, {
      fill: {
        color: '#efeff4',
        opacity: 0.1
      },
      line: {
        color: '#efeff4',
        opacity: 0.1
      }
    });
    var thirdLayer = new _lib.default(_this.width, _this.height, _this.definition);
    (0, _forEach.default)(_context2 = _this.Axis).call(_context2, function (deg) {
      thirdLayer.drawRay({
        originPoint: [_this.MapCenterX, _this.MapCenterY],
        vertex: [deg, _this.width / 2 - _this.margin]
      }, {
        type: 'dash',
        ll: 1 * _this.definition,
        bl: 2 * _this.definition,
        color: '#efeff4',
        opacity: 0.3
      });
    });

    _this.clearQuene(_this.baseLayerQuene);

    _this.baseLayerQuene = (0, _concat.default)(_context3 = _this.baseLayerQuene).call(_context3, [firstLayer.ctx.canvas, secondLayer.ctx.canvas, thirdLayer.ctx.canvas]);

    _this.hangLayer(_this.baseLayerQuene);
  });
  (0, _defineProperty2.default)(this, "drawMap", function () {
    var _context4, _context5, _context6;

    var firstLayer = new _lib.default(_this.width, _this.height, _this.definition);
    firstLayer.drawPolygon({
      center: [_this.MapCenterX, _this.MapCenterY],
      vertex: _this.data
    }, {
      fill: {
        color: 'rgba(229, 194, 143, 0.8)',
        opacity: 0.1
      },
      line: {
        color: '#e5c28f',
        opacity: 1
      }
    });
    var secondLayer = new _lib.default(_this.width, _this.height, _this.definition);
    (0, _forEach.default)(_context4 = _this.data).call(_context4, function (vertex) {
      var circleR = 3 * _this.width / 138;
      secondLayer.drawDiscretionalCircle([_this.MapCenterX, _this.MapCenterY], vertex, circleR, {
        fill: {
          gradient: {
            type: 'radial',
            sColor: '#ffffff',
            eColor: 'rgba(255, 255, 255, 0)'
          } // color: 'rgba(255, 255, 255, 0.1)', opacity: 0.1

        },
        line: {
          color: '#ffffff',
          opacity: 0
        }
      });
    });

    _this.clearQuene(_this.dataLayerQuene);

    _this.dataLayerQuene = (0, _concat.default)(_context5 = _this.dataLayerQuene).call(_context5, [firstLayer.ctx.canvas, secondLayer.ctx.canvas]);

    _this.hangLayer((0, _concat.default)(_context6 = _this.baseLayerQuene).call(_context6, _this.dataLayerQuene));
  });
  (0, _defineProperty2.default)(this, "clearQuene", function (quene) {
    if (_this.hangPoint) {
      var hangEl = document.getElementById(_this.hangPoint);

      while (quene.length) {
        var canvas = quene.pop();
        hangEl.removeChild(canvas);
      }
    }
  });
  (0, _defineProperty2.default)(this, "hangLayer", function (quene) {
    if (_this.hangPoint) {
      var hangEl = document.getElementById(_this.hangPoint);
      (0, _forEach.default)(quene).call(quene, function (canvas) {
        hangEl.appendChild(canvas);
      });
    }
  });
  this.data = null;
  this.radar = null;
  this.baseLayerQuene = [];
  this.dataLayerQuene = [];
  this.setHangPoint(ElId);
  this.setPictureFeature(_definition);
  this.initial();
};

exports.default = Radar;