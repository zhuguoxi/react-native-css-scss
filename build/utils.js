"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var Utils = (function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: "arrayContains",
        value: function arrayContains(value, arr) {
            for (var i = 0; i < arr.length; i++) {
                if (value === arr[i]) {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: "clean",
        value: function clean(string) {
            return string.replace(/\r?\n|\r/g, "");
        }
    }, {
        key: "readFile",
        value: function readFile(file, cb) {
            _fs2["default"].readFile(file, "utf8", cb);
        }
    }, {
        key: "pasteTs",
        value: function pasteTs(style, indentation) {
            var blankStr = '    ';
            var tsType = [{
                match: '__view',
                suffix: 'as React.ViewStyle'
            }, {
                match: '__text',
                suffix: 'as React.TextStyle'
            }];

            var pasteResult = [];

            pasteResult.push('{');

            indentation && pasteResult.push('\n');

            Object.keys(style).forEach(function (item) {
                var key = item,
                    tsSuffix = '',
                    sData = style[item];

                tsType.forEach(function (ts) {
                    var idx = item.indexOf(ts.match);

                    if (idx !== -1) {
                        key = item.slice(0, idx);
                        tsSuffix = ts.suffix;
                    }
                });

                pasteResult.push(blankStr + key + ':');

                var secoundObj = {};
                Object.keys(sData).forEach(function (skey) {
                    if (typeof sData[skey] === 'object') {
                        secoundObj[skey] = sData[skey];
                        delete sData[skey];
                    }
                });

                var jsonStr = JSON.stringify(style[item], null, indentation + blankStr.length);
                pasteResult.push(jsonStr.slice(0, -1));

                if (Object.keys(secoundObj).length > 0) {

                    pasteResult[pasteResult.length - 1] = pasteResult[pasteResult.length - 1].replace(/\n$/, ',');

                    var secoundJsonStr = JSON.stringify(secoundObj, null, indentation + blankStr.length);
                    pasteResult.push(secoundJsonStr.slice(1, -1).replace(/\n$/, ''));
                    tsSuffix && pasteResult.push(' as any');
                    pasteResult.push(',\n');
                }

                pasteResult.push(blankStr + '}');

                pasteResult.push(' ' + tsSuffix);
                pasteResult.push(',');
                indentation && pasteResult.push('\n');
            });
            pasteResult.push('}');
            return pasteResult.join('');
        }
    }, {
        key: "outputReactFriendlyStyle",
        value: function outputReactFriendlyStyle(style, outputFile, prettyPrint, literalObject, es6Able) {
            var indentation = prettyPrint ? 4 : 0;
            var jsonOutput = Utils.pasteTs(style, indentation);
            var output;

            if (es6Able) {

                output = "import {StyleSheet} from 'react-native'; \nexport default StyleSheet.create(" + jsonOutput + ");";

                if (literalObject) {
                    output = "export default " + jsonOutput;
                }
            } else {
                output = "module.exports = ";
                output += literalObject ? "" + jsonOutput : "require('react-native').StyleSheet.create(" + jsonOutput + ");";
            }

            // Write to file
            _fs2["default"].writeFileSync(outputFile, output);
            return output;
        }
    }, {
        key: "contains",
        value: function contains(string, needle) {
            var search = string.match(needle);
            return search && search.length > 0;
        }
    }]);

    return Utils;
})();

exports["default"] = Utils;
module.exports = exports["default"];