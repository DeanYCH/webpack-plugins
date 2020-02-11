"use strict";

var _interopRequireDefault = require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.GeneralLayer = exports.CanvasCtxFactory = exports.default = void 0;

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("/Users/jamesyao/Projects/webpack-plugins/packages/radar/node_modules/@babel/runtime-corejs3/helpers/defineProperty"));

var CanvasCtxFactory = function CanvasCtxFactory(_width, _height, _definition) {
  var _this = this;

  (0, _classCallCheck2.default)(this, CanvasCtxFactory);
  (0, _defineProperty2.default)(this, "initalScale", function (width, height, definition) {
    if (_this.canvas) {
      _this.canvas.width = "".concat(width * definition);
      _this.canvas.height = "".concat(height * definition);
      _this.canvas.style.width = "".concat(width, "px");
      _this.canvas.style.height = "".concat(height, "px");
    }
  });
  (0, _defineProperty2.default)(this, "getContext", function () {
    if (!_this.canvas) return null;

    var canvasCtx = _this.canvas.getContext("2d");

    canvasCtx.lineWidth = 1 * _this.definition;
    return canvasCtx;
  });
  this.canvas = document.createElement('canvas');
  this.canvas.style.position = 'absolute';
  this.canvas.style.top = 0;
  this.canvas.style.left = 0;
  this.canvas.style.zIndex = CanvasCtxFactory.zIndex;
  CanvasCtxFactory.zIndex++;
  if (_width && _height) this.initalScale(_width, _height, _definition);

  var _canvasCtx = this.getContext();

  return _canvasCtx;
};

exports.CanvasCtxFactory = exports.default = CanvasCtxFactory;
(0, _defineProperty2.default)(CanvasCtxFactory, "zIndex", 0);

var GeneralLayer = function GeneralLayer(width, height, definition) {
  var _this2 = this;

  (0, _classCallCheck2.default)(this, GeneralLayer);
  (0, _defineProperty2.default)(this, "ctxIsExist", function (func) {
    return function () {
      var _context;

      if (!_this2.ctx) return;

      for (var _len = arguments.length, props = new Array(_len), _key = 0; _key < _len; _key++) {
        props[_key] = arguments[_key];
      }

      func.call.apply(func, (0, _concat.default)(_context = [_this2]).call(_context, props));
    };
  });
  (0, _defineProperty2.default)(this, "checkDataType", function (func) {
    return function () {
      var _context2;

      if (!_this2.ctx) return;

      for (var _len2 = arguments.length, props = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        props[_key2] = arguments[_key2];
      }

      func.call.apply(func, (0, _concat.default)(_context2 = [_this2]).call(_context2, props));
    };
  });
  if (!width || !height) return null;
  this.width = width;
  this.height = height;
  this.definition = definition || 1;
  this.ctx = null;
};

exports.GeneralLayer = GeneralLayer;