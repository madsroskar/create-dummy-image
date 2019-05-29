#!/usr/bin/env node

var http = require('https');
var fs = require('fs');
var yargs = require('yargs');
var currentFolderName = require('path').basename(process.cwd());
var Promise = require('promise');

var argv = yargs
    .option('width', {
        alias: 'w',
        default: '32'
    })
    .option('height', {
        alias: '32',
        default: '32'
    })
    .option('text', {
        alias: 't',
        default: currentFolderName
            .substr(0, 1)
            .toUpperCase()
    })
    .option('backgroundColor', {
        alias: 'bg',
        default: '000'
    })
    .option('foregroundColor', {
        alias: 'fg',
        default: 'fff'
    })
    .option('output', {
        alias: 'o',
        default: 'favicon.ico'
    }).argv;

var file = fs.createWriteStream(argv.output);
var request = http.get(generateUrl(), function (response) {
    if (response.statusCode === 200) {
        response.pipe(file);
    }
});

request.on("error", function (error) {
    file.close();
    fs.unlink(dest, function () {});
    console.log("An error occurred: ", error.message)
});

file.on("error", function (error) {
    file.close();

    if (error.code === "EEXIST") {
        console.log("File already exists");
    } else {
        fs.unlink(dest, function () {});
        console.log("An error occurred: ", error.message);
    }
});

file.on("finish", function () {
    file.close();
    console.log('Created file:', argv.output);
});

function generateUrl() {
    return 'https://dummyimage.com/' + argv.width + 'x' + argv.height + '/' + argv.backgroundColor + '/' + argv.foregroundColor + '&text=' + argv.text;
}
