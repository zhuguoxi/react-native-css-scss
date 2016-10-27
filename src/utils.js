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

  static outputReactFriendlyStyle(style, outputFile, prettyPrint, literalObject, es6Able) {
    var indentation = prettyPrint ? 4 : 0;
    var jsonOutput = JSON.stringify(style, null, indentation);
    var output;

    if( es6Able ){
      output = `import {StyleSheet} from 'react-native'; export default StyleSheet.create(${jsonOutput});`
    }else{
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
