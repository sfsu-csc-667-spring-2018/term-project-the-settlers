const gameId = document.querySelector("#gameId").value;

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
