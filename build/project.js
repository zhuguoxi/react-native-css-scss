'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Rncs = require('./index.js');
var cssOpera = new Rncs();
var path = require('path');
var fs = require('fs');
var chokidar = require('chokidar');

var glob = require("glob");

var specialReactNative = {
    'transform': function transform(value) {
        // todo fix
        return value;
    },
    // fix react-native
    __$$: function __$$(property, value) {
        switch (property) {
            case 'shadow-radius':
            case 'elevation':
            case 'margin-horizontal':
            case 'margin-vertical':
            case 'padding-horizontal':
            case 'padding-vertical':
            case 'text-shadow-radius':
                return parseFloat(value.replace(/px|\s*/g, ''));
                break;

        }
        return void 0;
    }
};

var Project = (function () {
    function Project() {
        var _this = this;

        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Project);

        this.options = Object.assign({
            inputPut: '', // 编译文件路径匹配格式
            outPut: function outPut(_outPut) {
                return _outPut;
            }, // 输出文件路径转换函数
            watch: true, // 是否进行监控
            prettyPrint: true, // 是否进行格式化打印
            suffix: 'js', // 输出文件格式
            useEs6: true, // 以es6输出
            tsAble: false,
            literalObject: true, // 不包括reactnative StyleSheet处理
            specialReactNative: {} // 扩展reactNative样式处理
        }, options);

        this.options.suffix = this.options.suffix[0] !== '.' ? '.' + this.options.suffix : this.options.suffix;

        specialReactNative = Object.assign(specialReactNative, options.specialReactNative);

        ['parseCSS', 'watchAction'].forEach(function (item) {
            _this[item] = _this[item].bind(_this);
        });
        var parseCSS = this.parseCSS;
        var watchAction = this.watchAction;

        this._callback = (function (err, fileList) {
            if (err) {
                console.log(err);
                return;
            }
            fileList.forEach(function (item) {
                parseCSS({ input: item });
            });
            watchAction(this.options.inputPut);
        }).bind(this);
    }

    _createClass(Project, [{
        key: 'inputTranOut',
        value: function inputTranOut(inputPath) {

            var outPut = path.join(path.dirname(inputPath), path.basename(inputPath, path.extname(inputPath))) + this.options.suffix;

            typeof this.options.outPut === 'function' && (outPut = this.options.outPut(outPut));
            return outPut;
        }

        /**
         * 监控文件 【增删改】 变化
         */
    }, {
        key: 'watchAction',
        value: function watchAction(watchPath) {
            var _this2 = this;

            if (!this.options.watch) return;

            var watcher = chokidar.watch(watchPath, {
                ignored: /[\/\\]\./,
                persistent: true,
                ignoreInitial: true
            }).on('change', function (filePath) {
                console.log(filePath, 'has been changed ');
                _this2.parseCSS({
                    input: filePath
                });
            }).on('add', function (filePath) {
                console.log(filePath, 'has been added ');
                _this2.parseCSS({
                    input: filePath
                });
            }).on('unlink', function (filePath) {
                console.log(filePath, 'has been unlink ');
                fs.unlink(_this2.inputTranOut(path.resolve(process.cwd(), filePath), _this2.options.suffix));
            });
            console.log(' ============= react-native-css-scss run watch =============');
            return watcher;
        }
    }, {
        key: 'parseCSS',
        value: function parseCSS(options) {
            var _arguments = arguments;

            var input = options.input,
                output = options.output,
                callback = options.callback;

            var reInput = path.resolve(process.cwd(), input);
            if (!output) {
                output = this.inputTranOut(reInput, this.options.suffix);
            }
            try {
                cssOpera.parse(reInput, output, this.options.prettyPrint, this.options.literalObject, function () {

                    callback && callback.apply(null, _arguments);
                    console.log(input, 'compile is ok √');
                }, this.options.useEs6, specialReactNative, this.options.tsAble);
            } catch (err) {
                console.log(err);
            }
        }
    }, {
        key: 'run',
        value: function run() {
            glob(this.options.inputPut, { cwd: process.cwd(), mark: true }, this._callback);
        }
    }]);

    return Project;
})();

exports['default'] = Project;
module.exports = exports['default'];