var socket = io.connect('http://localhost:8080', { 'forceNew': true }); // Crea el socket que se cnectará al servidor

socket.on('autorizacion', function(data) { // Recibe las conecciones relacionadas con la autenticación
    console.log(data);
    if (data.auth == "true") {
        addVideo();
    } else {
        alert("Usuario o contraseña incorrecta");
    }
});

function addVideo() { // Agrega el video al html cuando ya el usuario está autorizado
    var html = `<video id="videoPlayer" controls muted="muted" autoplay> 
                    <source src="http://localhost:8080/video" type="video/mp4">
                </video>`;
    document.getElementById("frame").innerHTML = html;
}

function addMessage(e) { // Se encarga de enviar al servidor el usuario y la contraseña por medio de sockets
    var payLoad = {
        author: document.getElementById("user").value,
        text: document.getElementById("texto").value
    };
    socket.emit('new-message', payLoad);
    return false;
}