#!/usr/bin/env node

var {Project, require} = require('../index');

var project = new Project({
    inputPut: './css/**/!(_)*.{scss,css}',
    outPut: (outPut)=>{
        return outPut.replace(/\/css/, '/test')
    },
    tsAble:true,
    // literalObject: false,
    specialReactNative: {
            // 'padding-horizontal': (value) => {
            //     return parseFloat(value.replace(/px|\s*/g, ''));
            // }
            transform: (value)=>{
                let result = [],
                    regArr = ['rotate','rotateX','rotateY','rotateZ','scale','scaleX','scaleY','translate','translateX','translateY', 'skew','skewX', 'skewY', 'perspective'];

                function isNumber(property) {
                    return ['perspective', 'scale', 'translate'].some((item)=>{
                        return (new RegExp(item)).test(property)
                    })
                }

                regArr.forEach((item)=>{
                    let matchResults = value.match(new RegExp(item+'\\((.+?)\\)'));

                    if( !matchResults || !matchResults[1] ){
                        return;
                    }
                    let matchResult = matchResults[1];

                    switch (item){
                        case 'rotate':
                        case 'scale':
                        case 'translate':
                            let mArr = matchResult.split(','),
                                temp = {};
                            if( mArr.length == 1 ){
                                temp[item] =  mArr[0];
                            }else{
                                ['X','Y','Z'].forEach((key, idx)=>{
                                    mArr[key] !== void(0) && (  temp[item+key] =  mArr[0] )
                                })
                            }
                            result.push(temp);
                            break;
                        default:
                            result.push({[item]:matchResult})
                    }

                });

                result.forEach((item)=>{
                    let key = Object.keys(item)[0];
                    if(isNumber(key)){
                        item[key] = parseFloat(item[key].replace(/px|\s*/g, ''))
                    }
                });

                return result;

            }
        }
});
project.run();

