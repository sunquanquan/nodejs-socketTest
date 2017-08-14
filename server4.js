/**
 * Created by quanquan.sun on 2017/7/20.
 */
var http = require("http");
var express = require("express");
var app = module.exports.app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var bodyParser = require('body-parser');
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));


server.listen(3004);

//连接

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index4.html');
});

var users = [];
//handle the socket
io.sockets.on('connection', function(socket) {
    socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
        };
    });
    //user leaves
    socket.on('disconnect', function() {
        if (socket.nickname != null) {
            users.splice(users.indexOf(socket.nickname), 1);
            socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
        }
    });
    //new message get
    socket.on('postMsg', function(msg, color) {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
    //new image get
    socket.on('img', function(imgData, color) {
        socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });
});