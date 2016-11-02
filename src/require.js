
// 引入样式转换函数
export default function (path) {
    if( typeof path === 'string'){
        path = path.replace(/([\.\/a-zA-Z0-9]*?\.)(scss)/gi, '$1js')
        return require(path)
    }

    return require(path);
}



