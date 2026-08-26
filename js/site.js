const GIPHY_USER = "asiyeaydinli";
const GIPHY_KEY = "";
const GIPHY_FALLBACK_IDS = [
  "TAMNRrio1bqwLEJYfF",
  "w3Jh4pDYUfZOBHMJ69",
  "4VbJrXjGYix9rZlYDm",
  "XtCeRbxqksvePbGrtI",
  "yOR3TcdEy7x2jN3QJE",
  "7rlAQ69VJXoTeKxa9x"
];

function bindGamesTrack() {
  const track = document.querySelector(".games-track");
  if (!track) return;

  track.addEventListener(
    "wheel",
    (event) => {
      if (window.matchMedia("(max-width: 720px)").matches) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      track.scrollLeft += event.deltaY;
    },
    { passive: false }
  );
}

function bindCopyEmail() {
  document.querySelectorAll("[data-copy-email]").forEach((button) => {
    const label = button.textContent;
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText("asiyeap2d@gmail.com");
        button.classList.add("copied");
        button.textContent = "Copied";
        setTimeout(() => {
          button.textContent = label;
          button.classList.remove("copied");
        }, 1600);
      } catch (error) {
        window.location.href = "mailto:asiyeap2d@gmail.com";
      }
    });
  });
}

function giphySrc(id) {
  return "https://media.giphy.com/media/" + id + "/giphy.gif";
}

function renderGiphy(ids) {
  const strip = document.querySelector(".giphy-strip");
  if (!strip) return;
  strip.innerHTML = ids
    .map((id) => {
      return (
        '<a href="https://giphy.com/gifs/' +
        id +
        '" target="_blank" rel="noopener">' +
        '<img src="' +
        giphySrc(id) +
        '" alt=""></a>'
      );
    })
    .join("");
}

async function loadGiphy() {
  const strip = document.querySelector(".giphy-strip");
  if (!strip) return;

  let ids = GIPHY_FALLBACK_IDS.slice();
  if (GIPHY_KEY) {
    try {
      const url =
        "https://api.giphy.com/v1/gifs/search?api_key=" +
        encodeURIComponent(GIPHY_KEY) +
        "&q=" +
        encodeURIComponent(GIPHY_USER) +
        "&limit=8";
      const response = await fetch(url);
      const payload = await response.json();
      const live = (payload.data || []).map((item) => item.id).filter(Boolean);
      if (live.length) ids = live;
    } catch (error) {
      ids = GIPHY_FALLBACK_IDS.slice();
    }
  }

  renderGiphy(ids);
}

bindGamesTrack();
bindCopyEmail();
loadGiphy();
