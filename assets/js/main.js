/*jslint node: true */
/*jslint browser: true */

// var fs = require('fs');
// var ipc = require('ipc');
// var levelup = require('levelup');

// var level = require('level');
// var db = level('./dttsdb');

// var job_list = {};

// db.createReadStream({ keys: true, values: true })
//  .on('data', function (data) {
//  job_list[data.key] = data.value;
// })
// .on('end', function () {
//  console.log( job_list );
// });

window.$ = window.jQuery = require('./assets/js_libs/jquery.min.js');

$(document).ready(function() {

    // console.log('t');
    $('.show_modal_button').click(function() {
        $('.modal_cover').show();
    });

    $('.close_modal_button').click(function(){
        $('.modal_cover').hide();
    });

});
