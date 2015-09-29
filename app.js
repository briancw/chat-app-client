/*jslint node: true */
var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
// var ipc = require('ipc');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
    // if (process.platform !== 'darwin') {
    app.quit();
    // }
});

app.on('ready', function() {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // frame: false
    });

    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    mainWindow.openDevTools();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
