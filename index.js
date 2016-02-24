#!/usr/bin/env node

const fs = require("fs");

const moment = require("moment");
const rimraf = require("rimraf");
const argv = require("yargs")
    .usage("Usage: $0 -d [days] path")
    .demand(1)
    .argv;

const DAYS = argv.d || 7;
const BASE_FOLDER = argv._[0];

const TIME_LIMIT = moment().subtract(DAYS, "days");

getAllFolders(BASE_FOLDER).then(function(data) {
    data.forEach(function(entry) {
        fs.stat(`${BASE_FOLDER}/${entry}`, function(err, stats) {
            if(moment(stats.mtime).isBefore(TIME_LIMIT)) {
                deleteFolder(`${BASE_FOLDER}/${entry}`);
            }
        });
    });
}).catch(function(err) {
    console.log(err);
});

function deleteFolder(folder) {
    rimraf(folder, () => {
        console.log(`rm ${folder}`);
    });
}

function getAllFolders(folder) {
    return new Promise(function(resolve, reject) {
        fs.readdir(folder, function(err, data) {
            if(err) {
                reject(err);
                return;
            }

            resolve(data);
        });
    });
}
