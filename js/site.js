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

function bindHTracks() {
  document.querySelectorAll(".h-track").forEach(bindHTrack);
}

function bindHTrack(track) {
  const wrap = track.closest(".h-track-wrap");
  const inner = track.querySelector(".h-track-inner") || track;
  const dragThreshold = 6;
  let pointerId = null;
  let startX = 0;
  let startScroll = 0;
  let dragged = false;

  function canScroll() {
    return track.scrollWidth - track.clientWidth > 2;
  }

  function updateFades() {
    if (!wrap) return;
    const max = track.scrollWidth - track.clientWidth;
    const left = track.scrollLeft;
    wrap.classList.toggle("is-start", left <= 1 || max <= 2);
    wrap.classList.toggle("is-end", left >= max - 1 || max <= 2);
  }

  track.addEventListener(
    "wheel",
    (event) => {
      if (!canScroll()) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      track.scrollLeft += event.deltaY;
    },
    { passive: false }
  );

  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") return;
    if (event.button !== 0) return;
    if (!canScroll()) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScroll = track.scrollLeft;
    dragged = false;
    track.setPointerCapture(event.pointerId);
    track.classList.add("is-dragging");
  });

  track.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > dragThreshold) dragged = true;
    track.scrollLeft = startScroll - delta;
  });

  function endDrag(event) {
    if (pointerId !== event.pointerId) return;
    pointerId = null;
    track.classList.remove("is-dragging");
    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
  }

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);

  track.addEventListener(
    "click",
    (event) => {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    },
    true
  );

  track.addEventListener("dragstart", (event) => event.preventDefault());
  track.addEventListener("scroll", updateFades, { passive: true });
  window.addEventListener("resize", updateFades);

  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(updateFades);
    observer.observe(track);
    observer.observe(inner);
  }

  track.querySelectorAll("img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", updateFades, { once: true });
  });

  updateFades();
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

bindHTracks();
bindCopyEmail();
loadGiphy();
