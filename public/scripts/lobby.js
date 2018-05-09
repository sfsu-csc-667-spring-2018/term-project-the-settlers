var socket = io("/lobby");

document.querySelector("form.chat").addEventListener("submit", event => {
  const message = $("#m").val();

  console.log(message);
  if (message !== undefined) {
    fetch("/chat/lobby", {
      method: "post",
      body: JSON.stringify({ message }),
      credentials: "include",
      headers: new Headers({ "Content-Type": "application/json" })
    }).catch(error => console.log(error));
  }

  event.preventDefault();
  event.stopPropagation();
  return false;
});

// Receive from server
socket.on("lobby receive message", function(data) {
  if (data) {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var ampm = h < 12 ? "AM" : "PM";
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    m = m < 10 ? "0" + m : m;
    var strTime = h + ":" + m + " " + ampm;
    $("#messages").append(
      "<li><b>" + data.user + "</b> (" + strTime + "): " + data.msg + "</li>"
    );
  }
});
