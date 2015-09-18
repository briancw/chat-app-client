/*jslint node: true */
/*jslint browser: true */
/*globals jQuery, Backbone, _ */

// var fs = require('fs');
// var ipc = require('ipc');
// var levelup = require('levelup');

// var level = require('level');
// var db = level('./dttsdb');

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

//     $('.show_modal_button').click(function() {
//         $('.modal_cover').show();
//     });

//     $('.close_modal_button').click(function() {
//         $('.modal_cover').hide();
//     });

// });


// Application Setup
var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var menu = new Menu();
menu.append(new MenuItem({
    label: 'MenuItem1',
    click: function() {
        console.log('item 1 clicked');
    }
}));
// menu.append(new MenuItem({type: 'separator'}));

window.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
}, false);

var app_server = 'http://localhost:9001';
var app = app || {};
var Snap = {
    Model : {},
    // Collection : {},
    // View : {}
};

var EventDelegate = {};
_.extend( EventDelegate, Backbone.Events );

Snap.Model.BaseModel = Backbone.Model.extend({
    initialize : function( options ) {
        this.listenTo( EventDelegate, 'application:sync_error', this.sync_error );
        this.listenTo( EventDelegate, 'application:validation_error', this.validation_error );
    },
    sync: function() {
        return Snap.sync.apply(this, arguments);
    },
    sync_error: function(response) {
        var error_message = response[0].responseText;
        var error_code = response[0].status;
        // console.log( response );
        console.log( error_code, error_message );
    }
});

Snap.sync = function(method, model, options) {
    if (options.hasOwnProperty('error')) {
        options.error = function() {
            EventDelegate.trigger('application:sync_error', arguments);
        };
    }

    return Backbone.sync(method, model, options);
};

function display_page(view) {
    jQuery('.page_container.active').hide().removeClass('active');
    jQuery('.page_container.' + view).addClass('active').show();
}

;(function($, Backbone, _) {

    app.Router = Backbone.Router.extend({
        routes: {
            login:      'login',
            signup:     'signup',
            main:     'main'
        },

        login: function() {
            display_page('login_container');
        },

        signup: function() {
            display_page('signup_container');
        },

        main: function() {
            display_page('main_container');
        }

    });

    // Start The Router
    app.router = new app.Router();
    Backbone.history.start(); // {pushState: true} for non hash urls

    // Check if already authenticated
    $.get(app_server + '/auth-check')
    .success(function(res) {
        console.log('authed');
        app.router.navigate('#main', {trigger: true});

    })
    .fail(function(res) {
        if (res && res.status === 401) {
            console.log('Not Authed');
            app.router.navigate('#login', {trigger: true});
        }
    });

    app.login_form_model = Snap.Model.BaseModel.extend({
        urlRoot: app_server + '/login',
        defaults: {
            email: null,
            password: null
        },
        initialize : function() {
            Snap.Model.BaseModel.prototype.initialize.call( this );
        },
        validate : function() {
            var error = false;
            var message = 'This field is required and may not be empty.';

            if ( _.isEmpty( this.escape( 'email' ))) {
                error = {field : 'email', message : message};
            } else if ( _.isEmpty( this.escape( 'password' ))) {
                error = {field : 'password', message : message};
            }

            return error;
        },
        sync_error: function(response){
            console.log(response);
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

            this.model.set('email', this.$el.find('#email').val() );
            this.model.set('password', this.$el.find('#password').val() );

            var saved = this.model.save();

            if (saved) {
                saved.success(function(response) {
                    // console.log( response );
                    app.router.navigate('#main', {trigger: true});
                });
            } else {
                console.log( this.model.validationError );
                // EventDelegate.trigger('application:validation_error', this.model.validationError );
            }

            // Check auth required route
            // $.get(app_server + '/pwd', function(r){
            //     console.log( r );
            // });

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
