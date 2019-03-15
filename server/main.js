var express = require('express');
var app = express;
var server = require('http').Server(app);
var io = require('socket.io')(server);

//https://carlosazaustre.es/websockets-como-utilizar-socket-io-en-tu-aplicacion-web/
