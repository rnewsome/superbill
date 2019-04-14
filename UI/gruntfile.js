module.exports = function (grunt) {
    "use strict";

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-less");

    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks('grunt-browserify');

    grunt.initConfig({
        "pkg": grunt.file.readJSON('package.json'),
        "browserify": {
            "dist": {     
                "files": {
                    'dist/app-bundle.js': ['app.js']
                },
                "options": {
                    "transform": [['babelify', { "presets": ['es2015', 'react']}]],
                    "browserifyOptions": {
                        "extensions": ['.jsx']
                    }
                }
            }
        },
        "babel": {
            "options": {
                "sourceMap": true,
                "presets": ['es2015', 'react'],
                "plugins": ["transform-es2015-modules-amd", "transform-es2015-modules-commonjs"]
            },
            "dist": {
                "files": [{
                    "expand": true,
                    "cwd": "",
                    "src": ["**/*.jsx", "**/*.js", "*.jsx", "*.js"],
                    "dest": "dist",
                    "ext": ".js"
                }]
            }
        }
    });

    grunt.registerTask("default", ["browserify"]);
    
};
