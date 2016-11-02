
// 引入样式转换函数
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = function (path) {
    if (typeof path === 'string') {
        path = path.replace(/([\.\/a-zA-Z0-9]*?\.)(scss)/gi, '$1js');
        return require(path);
    }

    return require(path);
};

module.exports = exports['default'];