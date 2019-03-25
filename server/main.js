var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var status = false;

const fs = require('fs')
const path = require('path')


var ids = 0; // Maneja la cantidad de usuarios concurrentes.

app.use(express.static('public'));


app.get('/video', function(req, res) { // Es el servicio REST que se llama cuando el usuario está autenticado.
    if (status == false) {
        res.status(200).send("No autorizado");
    } else {
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
            const file = fs.createReadStream(path, { start, end }) // Crea el flujo para la transmisión del archivo de video
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }

            res.writeHead(206, head)
            file.pipe(res) // Transmite el video.
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(200, head)
            fs.createReadStream(path).pipe(res)
        }
    }
});

io.on('connection', function(socket) { // Se usa para configurar las nuevas conecciones.
    ids++;
    console.log('Se ha conectado un cliente vía sockets');
    console.log(`Número de clientes conectados: ${ids}`);
    socket.on('new-message', function(data) {
        if (data.author == "Luis" && data.text == "Luis") { // Simula de manera básica elcomportamiento de una base de datos.
            status = true;
            io.emit('autorizacion', {
                auth: 'true'
            });
        } else {
            status = false;
            io.emit('autorizacion', {
                auth: 'false'
            });
        }
    });
});

server.listen(8080, function() {
    console.log('Servidor corriendo en http://localhost:8080');
});

// https://carlosazaustre.es/websockets-como-utilizar-socket-io-en-tu-aplicacion-web/
// 18:00