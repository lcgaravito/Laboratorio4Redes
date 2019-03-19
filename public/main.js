var socket = io.connect('http://157.253.201.167:8080', {'forceNew': true});

socket.on('messages', function(data){
  console.log(data);
  render(data);
});

function render(data)
{
  var html = data.map(function(elem, index){
    return (`<div>
              <strong>${elem.author}</strong>:
              <em>${elem.text}</em>
            </div>`);
  }).join(" ");
  document.getElementById("messages").innerHTML=html;
}

function addMessage(e)
{
  var payLoad = {
    author: document.getElementById("user").value,
    text: document.getElementById("texto").value
  };
  socket.emit('new-message', payLoad);
  return false;
}