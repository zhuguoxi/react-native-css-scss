import fs from 'fs';

export default class Utils {

    static arrayContains(value, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (value === arr[i]) {
                return true
            }
        }
        return false;
    }

    static clean(string) {
        return string.replace(/\r?\n|\r/g, "");
    }

    static readFile(file, cb) {
        fs.readFile(file, "utf8", cb);
    }

    static pasteTs(style, indentation) {
        let blankStr = '    ';
        let tsType = [{
                match: '__view',
                suffix:'as React.ViewStyle'
            },
            {
                match: '__text',
                suffix:'as React.TextStyle'
            }
        ];

        let pasteResult = [];


        pasteResult.push('{');

        indentation && pasteResult.push('\n');

        Object.keys(style).forEach((item)=>{
            let key = item, tsSuffix = '';

            tsType.forEach((ts)=>{
                let idx = item.indexOf(ts.match);

                if( idx !== -1 ){
                    key = item.slice(0, idx);
                    tsSuffix  = ts.suffix
                }
            })

            pasteResult.push( blankStr + key+':' );
            let jsonStr = JSON.stringify(style[item], null, indentation+blankStr.length);

            jsonStr = jsonStr.slice(0,-1) + blankStr + '}';

            pasteResult.push( jsonStr );



            pasteResult.push(' '+tsSuffix)
            pasteResult.push(',');
            indentation && pasteResult.push('\n');
        })
        pasteResult.push('}');
        return pasteResult.join('')

    }

    static outputReactFriendlyStyle(style, outputFile, prettyPrint, literalObject, es6Able) {
        var indentation = prettyPrint ? 4 : 0;
        var jsonOutput = Utils.pasteTs(style, indentation);
        var output;

        if (es6Able) {

            output = `import {StyleSheet} from 'react-native'; \nexport default StyleSheet.create(${jsonOutput});`

            if( literalObject ){
                output = `export default ${jsonOutput}`;
            }


        } else {
            output = "module.exports = ";
            output += (literalObject) ? `${jsonOutput}` : `require('react-native').StyleSheet.create(${jsonOutput});`;
        }

        // Write to file
        fs.writeFileSync(outputFile, output);
        return output;
    }

    static contains(string, needle) {
        var search = string.match(needle);
        return search && search.length > 0;
    }
}
