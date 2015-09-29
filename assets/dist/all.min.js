/*jslint node: true */
/*jslint browser: true */
/*globals jQuery */

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

var init_socket_connect = false;
var server_url = 'ws://localhost:9005';
var ws = new WebSocket(server_url);

ws.onclose = function() {
    if (!init_socket_connect) {
        toast( 'Unable to establish WebSocket connection.');
    } else {
        toast( 'WebSocket Connection closed');
    }
};

ws.onerror = function(e) {
    toast('There was an error with the WebSocket connection.');
};

ws.onopen = function() {
    init_socket_connect = true;
    ws.send(get_json({type: 'hello'}));
};

ws.onmessage = function(ret) {
    var received_msg = JSON.parse(ret.data);
    var message_type = received_msg.type;

    switch (message_type){

        case 'client_count':
            jQuery('.client_count').html( received_msg.connected_clients );
            break;

        default:
            console.log('Unkown server response');
            break;
    }
};

var app_server = 'http://localhost:9001';

function display_page(view) {
    jQuery('.page_container.active').hide().removeClass('active');
    jQuery('.page_container.' + view).addClass('active').show();
}

;(function($) {
    $(document).ready(function() {
        // Check if already authenticated
        $.get(app_server + '/auth-check')
        .success(function(res) {
            console.log('authed');
            display_page('main_container');
        })
        .fail(function(res) {
            if (res && res.status === 401) {
                console.log('Not Authed');
                display_page('login_container');
            }
        });

        $('#login_form').submit(function(e) {
            e.preventDefault();

            $.ajax({
                type: 'POST',
                url: app_server + '/login',
                dataType: 'JSON',
                data: {
                    email: $('#email').val(),
                    password: $('#password').val()
                },
                success: function(ret) {
                    if (ret && ret.success) {
                        display_page('main_container');
                    }
                },
                error: function(ret) {
                    if (ret.status === 400) {
                        toast( ret.responseJSON.message );
                    }
                }
            });
        });

        $('#chat_input').on('keydown', function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                send_message( $('#chat_input').val() );
                $('#chat_input').val('');
                return false;
            }
        });
    });
}(jQuery));

function send_message(message) {
    ws.send( get_json({type: 'message', message: message}) );
    console.log( get_json({type: 'message', message: message}) );
}

function toast(message) {
    console.log(message);
    jQuery('.toast_text').html(message);
    jQuery('.toast_container').slideDown();

    setTimeout(function() {
        jQuery('.toast_container').slideUp();
    }, 3000);
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
