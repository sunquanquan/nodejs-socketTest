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


server.listen(3002);

//连接

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index2.html');
});
var nicknames = [];
io.sockets.on('connection', function (socket) {
    socket.on('nickname', function (data, fn) {
        console.log("nickname: "+data);
        if (nicknames.indexOf(data) != -1) {
            fn(true);
        } else {
            fn(false);
            nicknames.push(data);
            socket.nickname = data;
            io.sockets.emit('nicknames', nicknames);
        }
    });
    socket.on('user message', function (data) {
        console.log("user message: "+data);
        io.sockets.emit('user message', {
            nick: socket.nickname,
            message: data
        });
    });
    socket.on('disconnect', function () {
        console.log('disconnect');
        if (!socket.nickname) return;
        nicknames.splice(nicknames.indexOf(socket.nickname), 1);
    });
});