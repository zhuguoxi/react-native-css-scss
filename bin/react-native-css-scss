#!/usr/bin/env node

var {Project} = require('../index');

var project = new Project({
    inputPut: './css/**/!(_)*.{scss,css}',
    specialReactNative: {
        'border-width': (value)=>{
            //todo
            return value;
        }
    }
});
project.run();

