/*jslint node: true */
/*jslint browser: true */
/*globals jQuery, Backbone, _ */

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

// jQuery(document).ready(function() {
//     var init_socket_connect = false;
//     var server_url = 'ws://localhost:9005';
//     var ws = new WebSocket(server_url);

//     ws.onclose = function() {
//         if (!init_socket_connect) {
//             toast( 'Unable to establish WebSocket connection.');
//         } else {
//             toast( 'WebSocket Connection closed');
//         }
//     };

//     ws.onerror = function(e) {
//         toast('There was an error with the WebSocket connection.');
//     };

//     ws.onopen = function() {
//         init_socket_connect = true;
//         ws.send(get_json({type: 'hello'}));
//     };

//     // console.log('t');
//     $('#login_form').submit(function(e) {

//     });

//     $('.show_modal_button').click(function() {
//         $('.modal_cover').show();
//     });

//     $('.close_modal_button').click(function() {
//         $('.modal_cover').hide();
//     });

// });

var app_server = 'http://localhost:9001';
var app = app || {};

;(function($, Backbone, _) {

    app.login_form_model = Backbone.Model.extend({
        urlRoot: app_server + '/login',
        defaults: {
            email: 'brian',
            password: '123456'
        },
        validate : function() {
            var error = false;

            if (0) { // Check for bad things
                error = {message: 'something bad happened'};
            }

            return error;
        }
    });

    app.login_form = Backbone.View.extend({
        className: 'login_form',
        events: {
            submit: 'submit'
        },
        initialize: function() {

        },
        submit: function(e) {
            e.preventDefault();

            if (!this.model.isValid()) {

                console.log( this.model.validationError );
                // window.alert('Please fix the highlighted fields.');

            } else {
                this.model.save()
                .success(function( response ) {
                    console.log( response );

                    if (response.success) {
                        $('.login_container').hide();
                    }

                    if (response.message) {
                        alert(response.message);
                    }

                    // Check auth required route
                    // $.get(app_server + '/pwd', function(r){
                    //     console.log( r );
                    // });
                });
            }
        }
    });

    var login_form = new app.login_form({
        model: new app.login_form_model(),
        el : $('#login_form')
    });

})(jQuery, Backbone, _);

function toast(message) {
    console.log(message);
}

function get_json(input) {
    try {
        var json_string = JSON.stringify(input);
    } catch (err) {
        console.log('Invalid Json');
        console.log(err);
        return false;
    }

    return json_string;
}
