var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const fs = require('fs')
const path = require('path')


var ids = 0;

app.use(express.static('public'));

app.get('/hello', function(req, res) {
    res.status(200).send("Hola mundo cruel");
});

app.get('/video', function(req, res) {
    const path = 'video.mp4'
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] ?
            parseInt(parts[1], 10) :
            fileSize - 1

        const chunksize = (end - start) + 1
        const file = fs.createReadStream(path, { start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }

        res.writeHead(206, head)
        file.pipe(res)
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
});

io.on('connection', function(socket) {
    ids++;
    console.log('Se ha conectado un cliente vía sockets');
    console.log(`Número de clientes conectados: ${ids}`);
    socket.on('new-message', function(data) {
        if (data.author == "Luis" && data.text == "Luis") {
            io.emit('autorizacion', {
                auth: 'true'
            });
        } else {
            io.emit('autorizacion', {
                auth: 'false'
            });
        }
        io.sockets.emit('messages', messages);
    });
});

server.listen(8080, function() {
    console.log('Servidor corriendo en http://localhost:8080');
});

var messages = [{
    author: "Luis",
    text: "Hola mundo"
}];

// https://carlosazaustre.es/websockets-como-utilizar-socket-io-en-tu-aplicacion-web/
// 18:00