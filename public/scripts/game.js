const gameId = document.querySelector("#gameId").value;
var socket = io('/game');
let action = "";
$(".vertex[data-item='empty']").toggle();
$(".edge[data-owner='0']").toggle();
$(".robber:not([data-robber])").toggle();


$("body").on("click",".vertex", event => {
 // console.log(event.target.classList);
  if (event.target.classList.contains("vertex")) {
    const { x, y , item } = event.target.dataset;
    // console.log(x, y);
    buildModal(action);

    fetch(`/game/${gameId}/vertex`, {
      method: "post",
      credentials: "include",
      body: JSON.stringify({ x, y, item:action}),
      headers: new Headers({ "Content-Type": "application/json" })
    });
  }
  if (event.target.classList.contains("tile")) {
    //console.log("TILE", event.target);
  }
});

$("body").on("click", ".robber", event => {
  $(".robber:not([data-robber])").toggle();
  if (event.target.classList.contains("robber")) {

    fetch(`/game/${gameId}/move-robber`, {
      method: "post",
      credentials: "include",
      body: JSON.stringify({ tile_order }),
      headers: new Headers({ "Content-Type": "application/json" })
    });
  }
  if (event.target.classList.contains("tile")) {
    //console.log("TILE", event.target);
  }
})

$("body").on("click", ".roads", event => {
  if (event.target.classList.contains("edge")) {
    const { x_start, y_start, x_end, y_end} = event.target.dataset;
    buildModal("road");
    fetch(`/game/${gameId}/edge`, {
      method: "post",
      credentials: "include",
      body: JSON.stringify({ x_start, y_start, x_end, y_end }),
      headers: new Headers({ "Content-Type": "application/json" })
    });
  }
  if (event.target.classList.contains("tile")) {
    console.log("TILE", event.target);
  }
});

// document.querySelector("#roll").addEventListener("click", event => {
//   if (event.target.classList.contains(" ")) {
//     const {  } = event.target.dataset;

//     fetch(`/game/${gameId}/`, {
//       method: "post",
//       credentials: "include",
//       body: JSON.stringify({  }),
//       headers: new Headers({ "Content-Type": "application/json" })
//     });
//   }
//   if (event.target.classList.contains("tile")) {
//     console.log("TILE", event.target);
//   }
// });

$(".buildroad").on("click", function() {
  const road = "true";
  $(".edge[data-owner='0']").toggle();

});
$(".buildsettlement").on("click", function() {
  action = "settlement";
  $(".vertex[data-item='empty']").toggle();
});

$(".buildcity").on("click", function() {
  action = "city";
});

$(".offerplayer").on("click", function() {
  const id = $(this).attr("id")
  $(".offerplayer:not(#"+ id + ")").toggle("dim", function(){
    //$(".offerplayer:not(#"+ id + ")");
  });
  $("#" + id).toggleClass("selected");
});

$(".recieveplayer").on("click", function() {
  const id = $(this).attr("id")
  $(".recieveplayer:not(#"+ id + ")").toggle("dim", function(){
    $(".recieveplayer:not(#"+ id + ")");
    $("#" + id).toggleClass("selected");
  });
});

// $(".offerbank").on("click", function() {
//   const id = $(this).attr("id")
//   $(".offerbank:not(#"+ id + ")").toggle("dim", function(){
//     $(".offerplayer:not(#"+ id + ")");

//   });
// });
// $(".recievebank").on("click", function() {
//   const id = $(this).attr("id")
//   $(".offerplayer:not(#"+ id + ")").toggle("dim", function(){
//     $(".offerplayer:not(#"+ id + ")");
//   });
// });

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

$("#roll").on("click", () => {
  // D6.roll();
  console.log('ROlled')
  fetch(`/game/${gameId}/dice`, {
    method: "post",
    credentials: "include",
    headers: new Headers({ "Content-Type": "application/json" })
  })
})

// $("#diceVal").on("submit", event => {
//   const message = $("#diceVal").val();
//   if (message !== undefined) {
//     fetch(`/chat/game`, {
//       method: "post",
//       body: JSON.stringify({ message, gameId }),
//       credentials: "include",
//       headers: new Headers({ "Content-Type": "application/json" })
//     }),
//     fetch(`/game/${gameId}/droll`, {
//       method: "post",
//       body: JSON.stringify({ dice_rolled: message }),
//       credentials: "include",
//       headers: new Headers({ "Content-Type": "application/json" })
//     })
//     .catch(error => console.log(error));
//   }
//   event.preventDefault();
//   event.stopPropagation();
//   return false;
// });

socket.on(`chat-game-${gameId}`, (data) => {
  if (data && isNaN(data.msg)) {
      var d = new Date()
      var h = d.getHours()
      var m = d.getMinutes()
      var ampm = h < 12 ? 'AM' : 'PM';
      h = h % 12;
      h = h ? h : 12; // the hour '0' should be '12'
      m = m < 10 ? '0'+m : m;
      var strTime = h + ':' + m + ' ' + ampm;
      $('#messages').append('<li>' + data.user.bold() + ' (' + strTime +  '): ' + data.msg + '</li>');
  } else if (data && !isNaN(data.msg)) {
    $('#messages').append('<li>' + data.user.bold() + ' rolled a ' +  data.msg  +' !</li>');
  }
});

socket.on(`refresh-${gameId}`, () => {
  fetch(document.URL,{
    method: "get",
    credentials: "include"
  }).then((response) => {
    return response.text();
  }).then( (html) => {
    const updatedBoard = $(html).find("#display").html();
    const updatedResources = $(html).find("#game_info").html();
    console.log(updatedResources);
    $("#display").html(updatedBoard);
    $("#game_info").html(updatedResources);
    $(".vertex[data-item='empty']").toggle();
    $(".edge[data-owner='0']").toggle();
    $(".robber:not([data-robber])").toggle();

  }).catch( (error) => { console.log(error)})

});


socket.on(`message-${gameId}`, (data) => {
  $('#messages').append('<li><em>' + data.user.bold() + data.message  + '</em></li>');
});

socket.on(`robber-${gameId}`, ()=>{
  $(".robber:not([data-robber])").toggle();
});

var timer;

function attack(result) {
  $("#roll").hide();
  $("#end").show();
  $(document).ready(function() {
    buildModal(result, "dice-roll")
  });
}
D6.dice(2, attack);
function stopModal() {
  clearTimeout(timer);
}

function buildModal(item, event) {
  $("#Modal").modal('show');
  if (event == "dice-roll") {
    $("#Modal").find('.modal-title').text('Dice Roll');
    $("#Modal").find('.modal-body').text('You rolled a ' + item + '!');
    $("#diceVal").val(item);
    $("#diceVal").submit();
  } else if (event == "end-turn") {
    $("#Modal").find('.modal-title').text('End Turn');
    $("#Modal").find('.modal-body').text('You ended your turn!');
  } else {
    $("#Modal").find('.modal-title').text(item.charAt(0).toUpperCase() + item.slice(1) + ' Placed');
    $("#Modal").find('.modal-body').text('You placed a ' + item + '!');
  }
  timer = setTimeout(function() {
    $("#Modal").modal('hide');
  }, 2000);
}

function endTurn() {
  $("#diceall").hide();
  $("#end").hide();
  $("#roll").show();
  buildModal(null, "end-turn");
}
