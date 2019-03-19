var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var ids = 0;

app.use(express.static('public'));

app.get('/hello', function(req, res){
  res.status(200).send("Hola mundo cruel");
});

io.on('connection', function(socket){
  ids++;
  console.log('Se ha conectado un cliente vía sockets');
  console.log(`Número de clientes conectados: ${ids}`);
  socket.emit('messages', messages);
  socket.on('new-message', function(data){
    messages.push(data);
    io.sockets.emit('messages', messages);
  });
});

server.listen(8080, function(){
  console.log('Servidor corriendo en http://localhost:8080');
});

var messages = [
  {
    author: "Luis",
    text: "Hola mundo"
  }
];

// https://carlosazaustre.es/websockets-como-utilizar-socket-io-en-tu-aplicacion-web/
// 18:00
