const gameId = document.querySelector("#gameId").value;
var socket = io('/game');

document.querySelector("#display").addEventListener("click", event => {
  console.log(event.target.classList);

  if (event.target.classList.contains("vertex")) {
    const { x, y } = event.target.dataset;
    console.log(x, y);

    fetch(`/game/${gameId}/vertex`, {
      method: "post",
      credentials: "include",
      body: JSON.stringify({ x, y }),
      headers: new Headers({ "Content-Type": "application/json" })
    });
  }

  if (event.target.classList.contains("tile")) {
    console.log("TILE", event.target);
  }
});

$(".button").on("click", function() {

  var $button = $(this);
  var oldValue = $button.parent().find("input").val();

	var newVal = parseFloat(oldValue) + 1;


  $button.parent().find("input").val(newVal);

});

$("form.message").on("submit", event => {
  const message = $("#m").val();
  if (message !== undefined && message !== "") {
    fetch(`/chat/game`, {
      method: "post",
      body: JSON.stringify({ message, gameId }),
      credentials: "include",
      headers: new Headers({ "Content-Type": "application/json" })
    })
    .then( () => $('#m').val(""))
    .catch(error => console.log(error));
  }
  event.preventDefault();
  event.stopPropagation();
  return false;
})

socket.on(`chat-game-${gameId}`, (data) =>{
  if (data) {
      var d = new Date()
      var h = d.getHours()
      var m = d.getMinutes()
      var ampm = h < 12 ? 'AM' : 'PM';
      h = h % 12;
      h = h ? h : 12; // the hour '0' should be '12'
      m = m < 10 ? '0'+m : m;
      var strTime = h + ':' + m + ' ' + ampm;
      $('#messages').append('<li>' + data.user.bold() + '(' + strTime +  '): ' + data.msg + '</li>');
  }
})
