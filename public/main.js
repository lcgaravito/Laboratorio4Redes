var socket = io.connect('http://localhost:8080', { 'forceNew': true });

socket.on('autorizacion', function(data) {
    console.log(data);
    if (data.auth == "true") {
        addVideo();
    } else {
        alert("Usuario o contraseña incorrecta");
    }
});

function render(data) {
    var html = data.map(function(elem, index) {
        return (`<div>
              <strong>${elem.author}</strong>:
              <em>${elem.text}</em>
            </div>`);
    }).join(" ");
    document.getElementById("messages").innerHTML = html;
}

function addVideo() {
    var html = `<video id="videoPlayer" controls muted="muted" autoplay> 
                    <source src="http://localhost:8080/video" type="video/mp4">
                </video>`;
    document.getElementById("frame").innerHTML = html;
}

function addMessage(e) {
    var payLoad = {
        author: document.getElementById("user").value,
        text: document.getElementById("texto").value
    };
    socket.emit('new-message', payLoad);
    return false;
}