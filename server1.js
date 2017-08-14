/**
 * Created by quanquan.sun on 2017/7/20.
 */
var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req,res){
    fs.readFile('./index1.html',function(error,data){
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(data,'utf-8');
    });
}).listen(3001,"127.0.0.1");
console.log('Server running at http://127.0.0.1:3001/');

var io = require('socket.io').listen(server);

io.sockets.on('connection',function(socket){
    socket.on('message',function(data){
        console.log(data);
        socket.broadcast.emit('push message',data);
    });
});