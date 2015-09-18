/*jslint node: true */
var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
// var ipc = require('ipc');

// var level = require('level');
// var db = level('./dttsdb');

// db.put('foo', 'bar', function (err) {
//  if (err) return console.log('Ooops!', err);
//  console.log('new thing saved');
// });

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {

    // If OSX, don't kill the app on window close
    // if (process.platform !== 'darwin') {
    //     app.quit();
    // }

    app.quit();
});

app.on('ready', function() {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // frame: false
    });

    mainWindow.loadUrl('file://' + __dirname + '/assets/dist/index.html');

    mainWindow.openDevTools();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
