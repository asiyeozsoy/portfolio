(function () {
  const frame = document.getElementById("game-frame");
  const waiting = document.getElementById("game-waiting");
  if (!frame || !waiting) return;

  fetch("game/index.html", { method: "GET", cache: "no-store" })
    .then((response) => {
      if (!response.ok) return;
      const type = response.headers.get("content-type") || "";
      if (type.includes("text/html") || type.includes("text/plain") || !type) {
        frame.src = "game/index.html";
        frame.hidden = false;
        waiting.hidden = true;
      }
    })
    .catch(() => {
      /* Keep the waiting shell. Original game files are not in the repo yet. */
    });
})();
