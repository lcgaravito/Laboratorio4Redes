var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/hello', function(req, res){
  res.status(200).send("Hola mundo cruel");
});

io.on('connection', function(socket){
  console.log('Se ha conectado un cliente');
  socket.emit('messages', {
    id: 1,
    text: "Soy un mensaje.",
    author: "Luis"
  });
});

server.listen(8080, function(){
  console.log('Servidor corriendo en http://localhost:8080');
});

var messages = [
  {
    author: "Luis",
    text: "Hola mundo"
  },{
    author: "Pedro",
    text: "Hola mundo cruel"
  },{
    author: "Paco",
    text: "Hola todos"
  }
];

// https://carlosazaustre.es/websockets-como-utilizar-socket-io-en-tu-aplicacion-web/
// 18:00
