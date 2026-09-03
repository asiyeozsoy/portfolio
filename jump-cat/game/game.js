/* Jump Cat! — Alto calm pixel. Gameplay unchanged. */

(function () {
  "use strict";

  var DESIGN_W = 360;
  var DESIGN_H = 640;

  var CAT_W = 36;
  var CAT_H = 28;
  var CAT_SCREEN = 0.28;

  var GRAVITY = 2400;
  var JUMP_VEL = -780;
  var COYOTE = 0.12;
  var BUFFER = 0.12;

  var SPEED_START = 172;
  var SPEED_MAX = 248;
  var SPEED_PER_M = 0.52;

  var PX_PER_M = 42;
  var ROOF_Y = 428;
  var ROOF_H = 260;
  var BEST_KEY = "cati-kedi-best";
  var TOP_KEY = "cati-kedi-top5";
  var GOLD_KEY = "jumpcat-gold";
  var OWNED_KEY = "jumpcat-owned";
  var EQUIP_KEY = "jumpcat-equip";
  var BIKES_KEY = "jumpcat-bikes";
  var BIKE_SEL_KEY = "jumpcat-bike";
  var NAME_KEY = "jumpcat-name";

  var BUF_W = 90;
  var BUF_H = 160;
  var SCALE = BUF_W / DESIGN_W;

  var FONT = '"Pixelify Sans", ui-monospace, monospace';
  var FS_TITLE = 64;
  var FS_NUM = 88;
  var FS_LABEL = 44;
  var FS_BTN = 40;
  var FS_SMALL = 36;
  var CREAM = "#f0e6d4";
  var CREAM_DIM = "#c4b8a4";
  var SHADOW = "#1a1714";
  var ROOF_COL = "#1a1714";

  var CYCLE_M = 1000;

  var CAT_DRAW_H = 105;
  var CAT_NW = 771;
  var CAT_NH = 708;
  var BIKE_W = 72;
  var SEAT_FX = 0.282;
  var SEAT_FY = 0.102;
  var WHEEL_REAR_FX = 0.177;
  var WHEEL_REAR_FY = 0.997;
  var BIKE = "#c4b49a";
  var WHEEL = "#efe6d6";
  var RIM = "#6a6058";

  var SHOP_PRICE = 1000;
  var BIKE_PRICES = [0, 800, 1200, 1600];
  var BIKE_NAMES = ["CRIMSON", "SAGE", "BERRY", "SUN"];
  var SMILE_DUR = 0.45;
  var BOLT_EVERY = 300;
  var GLASS_NAMES = ["AVIATOR", "HEART", "MINT"];

  var FACE_CX = 0.79;
  var FACE_CY = 0.455;
  var GLASS_WF = 0.50;

  var BTN_PLAY = { x: 8, y: 50, w: 24, h: 12 };
  var BTN_PEACE = { x: 34, y: 50, w: 24, h: 12 };
  var BTN_SHOP = { x: 60, y: 50, w: 24, h: 12 };
  var BTN_BACK = { x: 28, y: 132, w: 34, h: 12 };
  var BTN_NAME = { x: 8, y: 64, w: 74, h: 12 };
  var BTN_CONTINUE = { x: 8, y: 90, w: 74, h: 16 };
  var BTN_AGAIN = { x: 8, y: 110, w: 74, h: 12 };
  var BTN_HOME = { x: 8, y: 124, w: 74, h: 12 };
  var FLOOR_H = 90;
  var FAR_FLOOR_H = 62;
  var TREES_H = 118;
  var SHOP_HIT = [
    { x: 0, y: 0, w: 0, h: 0 },
    { x: 0, y: 0, w: 0, h: 0 },
    { x: 0, y: 0, w: 0, h: 0 },
    { x: 0, y: 0, w: 0, h: 0 },
    { x: 0, y: 0, w: 0, h: 0 },
    { x: 0, y: 0, w: 0, h: 0 },
    { x: 0, y: 0, w: 0, h: 0 }
  ];

  var canvas = document.getElementById("game");
  var ctx = canvas.getContext("2d");
  var wrap = document.getElementById("wrap");

  var buf = document.createElement("canvas");
  buf.width = BUF_W;
  buf.height = BUF_H;
  var bctx = buf.getContext("2d");

  function loadImg(src) {
    var im = new Image();
    im.src = src;
    return im;
  }

  var imgIdle = loadImg("img/idle.png");
  var imgSmile = loadImg("img/smile.png");
  var imgGlasses = [
    null,
    loadImg("img/3.png"),
    loadImg("img/1.png"),
    loadImg("img/2.png")
  ];
  var imgCoin = loadImg("img/coin.png");
  var imgSun = loadImg("img/sun.png");
  var imgMoon = loadImg("img/moon.png");
  var imgCloud = loadImg("img/cloud.png");
  var imgBikes = [
    loadImg("img/bike-0.png"),
    loadImg("img/bike-1.png"),
    loadImg("img/bike-2.png"),
    loadImg("img/bike-3.png")
  ];
  var imgBldgs = [
    loadImg("img/bldg-0.png"),
    loadImg("img/bldg-1.png"),
    loadImg("img/bldg-2.png"),
    loadImg("img/bldg-3.png"),
    loadImg("img/bldg-4.png"),
    loadImg("img/bldg-5.png"),
    loadImg("img/bldg-6.png"),
    loadImg("img/bldg-7.png"),
    loadImg("img/bldg-8.png")
  ];
  imgBldgs[9] = loadImg("img/bldg-9.png");
  imgBldgs[10] = loadImg("img/bldg-10.png");
  imgBldgs[11] = loadImg("img/bldg-11.png");
  var imgFloor = loadImg("img/floor.png");
  var imgFloorFar = loadImg("img/floor-far.png");
  var imgTrees = loadImg("img/fg-trees.png");
  var imgLogo = loadImg("img/logo.png");
  var imgBolt = loadImg("img/bolt.png");
  var imgCity = [
    loadImg("img/city-0.png"),
    loadImg("img/city-1.png"),
    loadImg("img/city-2.png"),
    loadImg("img/city-3.png"),
    loadImg("img/city-4.png"),
    loadImg("img/city-5.png"),
    loadImg("img/city-6.png"),
    loadImg("img/city-7.png"),
    loadImg("img/city-8.png")
  ];
  var CITY_NAT = [
    [199, 409], [117, 294], [105, 428], [161, 365], [99, 263], [111, 430],
    [186, 371], [153, 488], [139, 442]
  ];
  var CITY_3D = [0, 6, 7, 8];
  var CITY_FLAT = [1, 2, 3, 4, 5];
  var BLDG_NAT = [
    [591, 885], [596, 889], [592, 886], [381, 945], [378, 927],
    [594, 914], [590, 892], [380, 916], [548, 876]
  ];
  BLDG_NAT[9] = [591, 885];
  BLDG_NAT[10] = [910, 1676];
  BLDG_NAT[11] = [910, 1676];
  var BLDG_UNIT = 0.25;
  var BLDG_WIDE = [0, 1, 2, 5, 6, 8, 9];
  var BLDG_NARROW = [3, 4, 7];

  function bldgUnit(id) {
    return isRestBldg(id) ? BLDG_UNIT * 0.5 : BLDG_UNIT;
  }

  function restTiles(id) {
    return isRestBldg(id) ? 10 : 5;
  }

  function bldgWorld(id) {
    var n = BLDG_NAT[id] || [580, 880];
    var u = bldgUnit(id);
    return { w: n[0] * u, h: n[1] * u };
  }

  function isRestBldg(id) {
    return id === 10 || id === 11;
  }

  function isLongRoof(r) {
    return !!(r && isRestBldg(r.bldg));
  }

  function pickBldgId(worldX) {
    var d = difficulty(worldX);
    if (Math.random() < 0.18 + d * 0.5) {
      return BLDG_NARROW[(Math.random() * BLDG_NARROW.length) | 0];
    }
    return BLDG_WIDE[(Math.random() * BLDG_WIDE.length) | 0];
  }

  function imgOk(im) {
    return im && im.complete && im.naturalWidth > 0;
  }

  var dispW = 360;
  var dispH = 640;
  var dpr = 1;

  var state = "start";
  var cat = null;
  var roofs = [];
  var lastRoofX = 0;
  var startX = 0;
  var cameraX = 0;
  var score = 0;
  var best = 0;
  var top5 = [];
  var gold = 0;
  var owned = [false, false, false];
  var equipped = 0;
  var grounded = false;
  var coyote = 0;
  var jumpBuffer = 0;
  var squash = 0;
  var bikeSquash = 0;
  var catHop = 0;
  var glassOff = 0;
  var glassV = 0;
  var shake = 0;
  var runPhase = 0;
  var tailPhase = 0;
  var inputQueued = false;
  var pointerBufX = 0;
  var pointerBufY = 0;
  var pointerCssX = 0;
  var pointerCssY = 0;
  var buildings = [];
  var cityFar = [];
  var cityMid = [];
  var cityFarSpan = 1;
  var cityMidSpan = 1;
  var stars = [];
  var clouds = [];
  var lastTs = 0;
  var spinning = false;
  var spin = 0;
  var spinTime = 0;
  var spinDir = -1;
  var peace = false;
  var smileTime = 0;
  var airJump = false;
  var coinPhase = 0;
  var coinFx = [];
  var catFlash = 0;
  var playerName = "CAT";
  var bikeTilt = 0;
  var hangPhase = 0;
  var boostT = 0;
  var boostDur = 3.4;
  var boostZoom = 1;
  var rainbow = [];
  var rainbowGlow = [];
  var lastBoltM = 0;
  var boostLandPlaced = false;
  var lastRestM = 0;
  var restFlip = 0;
  var sparks = [];
  var usedContinue = false;
  var DEAD_LINES = [
    "MEOWCH",
    "WHOOPS",
    "CAT DOWN",
    "NOT A BIRD",
    "ROOF SAID NO",
    "GRAVITY WINS",
    "SEND TUNA",
    "NICE TRY",
    "OVERBOARD",
    "WIPEOUT",
    "BONK",
    "NOPE"
  ];
  var deadLine = "MEOWCH";
  var shopSuperT = 0;
  var shopNoGoldT = 0;
  var shopBurst = [];
  var btnSpark = [];
  var btnWait = null;
  var BTN_PRESS = 0.14;
  var selectedBike = 0;
  var ownedBikes = [true, false, false, false];
  var peaceZoomT = 0;
  var peaceZoomWait = 0;
  var peaceZoomPeak = 1.15;
  var nameEl = document.getElementById("namein");

  try {
    best = parseInt(localStorage.getItem(BEST_KEY) || "0", 10) || 0;
  } catch (e) {
    best = 0;
  }

  function loadGold() {
    try {
      gold = parseInt(localStorage.getItem(GOLD_KEY) || "0", 10) || 0;
      if (gold < 0) gold = 0;
    } catch (e) {
      gold = 0;
    }
  }

  function saveGold() {
    try {
      localStorage.setItem(GOLD_KEY, String(gold));
    } catch (e) {}
  }

  function loadShop() {
    owned = [false, false, false];
    equipped = 0;
    try {
      var raw = localStorage.getItem(OWNED_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          owned[0] = !!parsed[0];
          owned[1] = !!parsed[1];
          owned[2] = !!parsed[2];
        }
      }
    } catch (e) {
      owned = [false, false, false];
    }
    try {
      equipped = parseInt(localStorage.getItem(EQUIP_KEY) || "0", 10) || 0;
      if (equipped < 0 || equipped > 3) equipped = 0;
      if (equipped > 0 && !owned[equipped - 1]) equipped = 0;
    } catch (e) {
      equipped = 0;
    }
  }

  function saveShop() {
    try {
      localStorage.setItem(OWNED_KEY, JSON.stringify(owned));
      localStorage.setItem(EQUIP_KEY, String(equipped));
    } catch (e) {}
  }

  function loadBikes() {
    ownedBikes = [true, false, false, false];
    selectedBike = 0;
    try {
      var raw = localStorage.getItem(BIKES_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          ownedBikes[0] = true;
          ownedBikes[1] = !!parsed[1];
          ownedBikes[2] = !!parsed[2];
          ownedBikes[3] = !!parsed[3];
        }
      }
    } catch (e) {
      ownedBikes = [true, false, false, false];
    }
    try {
      selectedBike = parseInt(localStorage.getItem(BIKE_SEL_KEY) || "0", 10) || 0;
      if (selectedBike < 0 || selectedBike > 3) selectedBike = 0;
      if (!ownedBikes[selectedBike]) selectedBike = 0;
    } catch (e) {
      selectedBike = 0;
    }
  }

  function saveBikes() {
    try {
      ownedBikes[0] = true;
      localStorage.setItem(BIKES_KEY, JSON.stringify(ownedBikes));
      localStorage.setItem(BIKE_SEL_KEY, String(selectedBike));
    } catch (e) {}
  }

  function scoreOf(e) {
    if (e && typeof e === "object") return parseInt(e.score, 10) || 0;
    return parseInt(e, 10) || 0;
  }

  function nameOf(e) {
    if (e && typeof e === "object" && e.name) return String(e.name);
    return "CAT";
  }

  function sanitizeName(n) {
    n = String(n || "")
      .replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ _-]/g, "")
      .trim();
    if (n.length > 10) n = n.slice(0, 10);
    return n || "CAT";
  }

  function loadName() {
    try {
      var n = localStorage.getItem(NAME_KEY);
      if (n) playerName = sanitizeName(n);
    } catch (e) {}
  }

  function saveName() {
    try {
      localStorage.setItem(NAME_KEY, playerName);
    } catch (e) {}
  }

  function closeNameEdit() {
    if (!nameEl) return;
    playerName = sanitizeName(nameEl.value);
    saveName();
    nameEl.classList.remove("open");
    nameEl.blur();
  }

  function openNameEdit() {
    if (!nameEl) return;
    nameEl.value = playerName === "CAT" ? "" : playerName;
    nameEl.classList.add("open");
    setTimeout(function () {
      nameEl.focus();
      nameEl.select();
    }, 0);
  }

  function loadTop5() {
    var arr = [];
    try {
      var raw = localStorage.getItem(TOP_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) arr = parsed;
      }
    } catch (e) {
      arr = [];
    }
    var out = [];
    var i;
    for (i = 0; i < arr.length; i++) {
      var item = arr[i];
      var n = scoreOf(item);
      var nm = nameOf(item);
      if (n >= 0) out.push({ name: sanitizeName(nm), score: n });
    }
    out.sort(function (a, b) { return b.score - a.score; });
    top5 = out.slice(0, 5);
    if (best > 0) {
      var hasBest = false;
      for (i = 0; i < top5.length; i++) {
        if (top5[i].score === best) hasBest = true;
      }
      if (!hasBest) {
        top5.push({ name: playerName, score: best });
        top5.sort(function (a, b) { return b.score - a.score; });
        top5 = top5.slice(0, 5);
      }
    }
    if (top5.length) best = top5[0].score;
  }

  function persistScores() {
    if (top5.length) best = scoreOf(top5[0]);
    try {
      localStorage.setItem(TOP_KEY, JSON.stringify(top5));
      localStorage.setItem(BEST_KEY, String(best));
    } catch (e) {}
  }

  function insertScore(s) {
    s = parseInt(s, 10);
    if (isNaN(s) || s <= 0) return;
    top5.push({ name: playerName, score: s });
    top5.sort(function (a, b) { return b.score - a.score; });
    if (top5.length > 5) top5.length = 5;
    persistScores();
  }

  loadName();
  loadTop5();
  persistScores();
  loadGold();
  loadShop();
  loadBikes();
  if (nameEl) {
    nameEl.addEventListener("pointerdown", function (e) {
      e.stopPropagation();
    });
    nameEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        closeNameEdit();
      }
    });
    nameEl.addEventListener("blur", function () {
      if (nameEl.classList.contains("open")) closeNameEdit();
    });
  }

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }

  function metersAt(worldX) {
    return Math.max(0, (worldX - startX) / PX_PER_M);
  }

  function speedAt(worldX) {
    return Math.min(SPEED_MAX, SPEED_START + metersAt(worldX) * SPEED_PER_M);
  }

  function airTime() {
    return (2 * Math.abs(JUMP_VEL)) / GRAVITY;
  }

  function maxJumpGap(worldX) {
    var d = difficulty(worldX);
    var frac = 0.52 + d * 0.22;
    return speedAt(worldX) * airTime() * frac;
  }

  function difficulty(worldX) {
    return clamp(metersAt(worldX) / 520, 0, 1);
  }

  function lastRoofY() {
    return roofs.length ? roofs[roofs.length - 1].y : ROOF_Y;
  }

  function pickRoofY(x) {
    var m = metersAt(x);
    var prev = lastRoofY();
    var maxStep = 0;
    if (m >= 500) maxStep = 64;
    else if (m >= 280) maxStep = 36;
    else if (m >= 120) maxStep = 18;
    else return ROOF_Y;
    var delta = Math.random() < 0.28 ? 0 : rand(-maxStep, maxStep);
    return clamp(prev + delta, ROOF_Y - 88, ROOF_Y + 72);
  }

  function makeCity() {
    cityFar = [];
    cityMid = [];
    var x = 0;
    while (x < 980) {
      var id = CITY_FLAT[(Math.random() * CITY_FLAT.length) | 0];
      var nat = CITY_NAT[id];
      var h = 118 + Math.random() * 45;
      var w = h * (nat[0] / nat[1]);
      cityFar.push({ id: id, x: x, w: w, h: h });
      x += w + 10 + Math.random() * 20;
    }
    cityFarSpan = x;
    x = 0;
    while (x < 980) {
      var id2 = CITY_3D[(Math.random() * CITY_3D.length) | 0];
      var nat2 = CITY_NAT[id2];
      var h2 = 104 + Math.random() * 40;
      var w2 = h2 * (nat2[0] / nat2[1]);
      cityMid.push({ id: id2, x: x, w: w2, h: h2 });
      x += w2 + 28 + Math.random() * 36;
    }
    cityMidSpan = x;
  }

  function makeStars() {
    stars = [];
    for (var i = 0; i < 28; i++) {
      stars.push({
        x: Math.random() * BUF_W,
        y: rand(2, 72),
        k: Math.random()
      });
    }
  }

  function makeClouds() {
    clouds = [
      { x: 6, y: 14, s: 0.72, v: 3.2 },
      { x: 38, y: 22, s: 0.5, v: 2.1 },
      { x: 62, y: 10, s: 0.9, v: 2.8 },
      { x: 80, y: 28, s: 0.42, v: 1.6 }
    ];
  }

  function addCoin(roof, x, y) {
    roof.coins.push({ x: x, y: y, taken: false });
  }

  function placeGapCoins(roof, gap) {
    var g = gap || 40;
    var cx = roof.x - g * 0.5;
    var y = roof.y;
    var m = metersAt(roof.x);
    var roll = Math.random();
    if (m < 35 || roll < 0.36) {
      addCoin(roof, cx, y - 96);
      return;
    }
    if (roll < 0.62) {
      addCoin(roof, cx - 10, y - 90);
      addCoin(roof, cx + 12, y - 162);
      return;
    }
    addCoin(roof, cx - g * 0.18, y - 84);
    addCoin(roof, cx, y - 154);
    addCoin(roof, cx + g * 0.2, y - 228);
  }

  function spawnRoof(x, w, y, withCoin, gap, bldgId) {
    if (y == null) y = ROOF_Y;
    if (bldgId == null) bldgId = pickBldgId(x);
    var sz = bldgWorld(bldgId);
    if (!(w > sz.w)) {
      if (isRestBldg(bldgId)) w = sz.w * restTiles(bldgId);
      else w = sz.w;
    }
    var g = gap || 0;
    var roof = {
      x: x,
      y: y,
      w: w,
      visH: sz.h,
      h: DESIGN_H - y + 80,
      coins: [],
      bldg: bldgId
    };
    if (withCoin) placeGapCoins(roof, g);
    if (withCoin && wantBolt(x)) {
      roof.bolt = { x: x + w * 0.55, y: y - 150, taken: false };
      lastBoltM = metersAt(x);
    }
    roofs.push(roof);
    lastRoofX = x + w;
  }

  function placeStarterCoins(roof) {
    if (peace) return;
    var y = roof.y;
    var x0 = Math.max(roof.x + 160, 130);
    var x1 = roof.x + roof.w - 80;
    var i = 0;
    var x;
    for (x = x0; x < x1; x += 56) {
      var k = i % 6;
      var h = 50;
      if (k === 1) h = 78;
      else if (k === 2) h = 118;
      else if (k === 3) h = 86;
      else if (k === 4) h = 50;
      else if (k === 5) h = 102;
      addCoin(roof, x, y - h);
      i++;
    }
  }

  function spawnStarter() {
    var tile = bldgWorld(11);
    spawnRoof(-40, tile.w * restTiles(11), ROOF_Y, false, 0, 11);
    placeStarterCoins(roofs[roofs.length - 1]);
  }

  function placeRestCoins(roof) {
    if (peace) return;
    var y = roof.y;
    var x0 = roof.x + 56;
    var x1 = roof.x + roof.w - 46;
    var hop = [50, 86, 128, 86, 50, 102, 154, 78];
    var x;
    var i = 0;
    for (x = x0; x < x1; x += 32) {
      addCoin(roof, x, y - hop[i % hop.length]);
      i++;
    }
  }

  function spawnRest() {
    var id = restFlip === 0 ? 10 : 11;
    restFlip = 1 - restFlip;
    var tile = bldgWorld(id);
    spawnRoof(lastRoofX - 4, tile.w * restTiles(id), ROOF_Y, false, 0, id);
    var rest = roofs[roofs.length - 1];
    placeRestCoins(rest);
    if (wantBolt(rest.x)) {
      rest.bolt = { x: rest.x + rest.w * 0.45, y: rest.y - 150, taken: false };
      lastBoltM = metersAt(rest.x);
    }
    lastRestM = metersAt(lastRoofX);
  }

  function fillRoofs(untilX) {
    if (peace) return;
    while (lastRoofX < untilX) {
      var m = metersAt(lastRoofX);
      var restEvery = m < 1000 ? 160 : 340;
      if (m > 50 && m - lastRestM >= restEvery) {
        spawnRest();
        continue;
      }
      var d = difficulty(lastRoofX);
      var easy = m < 55;
      var y = pickRoofY(lastRoofX);
      var rise = Math.max(0, lastRoofY() - y);
      var gapMin = easy ? 26 : 40 + d * 18;
      var gapMax = maxJumpGap(lastRoofX);
      if (easy) gapMax = Math.min(gapMax, 50);
      if (rise > 20) gapMax *= 0.72;
      if (gapMax < gapMin + 8) gapMax = gapMin + 8;
      var gap = rand(gapMin, gapMax);
      var id = easy
        ? BLDG_WIDE[(Math.random() * BLDG_WIDE.length) | 0]
        : pickBldgId(lastRoofX);
      spawnRoof(lastRoofX + gap, 0, y, true, gap, id);
    }
  }

  function resetRun() {
    roofs = [];
    startX = 0;
    lastRoofX = 0;
    sparks = [];
    if (!peace) {
      spawnStarter();
      fillRoofs(DESIGN_W + 800);
    }
    cat = {
      x: 72,
      y: ROOF_Y,
      vx: SPEED_START,
      vy: 0
    };
    cameraX = cat.x - DESIGN_W * CAT_SCREEN;
    score = 0;
    grounded = true;
    coyote = COYOTE;
    jumpBuffer = 0;
    squash = 0;
    bikeSquash = 0;
    catHop = 0;
    glassOff = 0;
    glassV = 0;
    shake = 0;
    runPhase = 0;
    tailPhase = 0;
    spinning = false;
    spin = 0;
    spinTime = 0;
    spinDir = -1;
    smileTime = 0;
    airJump = true;
    coinPhase = 0;
    coinFx = [];
    catFlash = 0;
    bikeTilt = 0;
    hangPhase = 0;
    boostT = 0;
    boostZoom = 1;
    rainbow = [];
    rainbowGlow = [];
    lastBoltM = 0;
    boostLandPlaced = false;
    lastRestM = 0;
    restFlip = 0;
    usedContinue = false;
    inputQueued = false;
    jumpBuffer = 0;
    peaceZoomT = 0;
    peaceZoomWait = 8 + Math.random() * 6;
    peaceZoomPeak = 1.15;
  }

  function die() {
    if (peace) return;
    if (boostT > 0) return;
    if (state !== "play") return;
    var pick = DEAD_LINES[(Math.random() * DEAD_LINES.length) | 0];
    if (pick === deadLine && DEAD_LINES.length > 1) {
      pick = DEAD_LINES[(DEAD_LINES.indexOf(deadLine) + 1 + ((Math.random() * (DEAD_LINES.length - 1)) | 0)) % DEAD_LINES.length];
    }
    deadLine = pick;
    state = "dead";
    cat.vx = 0;
    cat.vy = 0;
    shake = 1;
    jumpBuffer = 0;
    inputQueued = false;
  }

  function continueFromAd() {
    if (usedContinue || !cat) return;
    usedContinue = true;
    jumpBuffer = 0;
    inputQueued = false;
    spinning = false;
    spin = 0;
    sparks = [];
    rainbow = [];
    rainbowGlow = [];
    boostT = 0;
    boostZoom = 1;
    shake = 0;
    bikeTilt = 0;
    var found = null;
    var i;
    var mid = cat.x + CAT_W * 0.5;
    if (cat.y < DESIGN_H + 10) {
      for (i = 0; i < roofs.length; i++) {
        var r = roofs[i];
        if (mid > r.x && mid < r.x + r.w) {
          found = r;
          break;
        }
      }
    }
    if (found) {
      cat.y = found.y;
    } else {
      var tile = bldgWorld(10);
      var landX = cat.x - 80;
      var landW = tile.w * restTiles(10);
      roofs = roofs.filter(function (rr) {
        return rr.x + rr.w < landX - 4;
      });
      spawnRoof(landX, landW, ROOF_Y, false, 0, 10);
      lastRoofX = landX + landW;
      lastRestM = metersAt(lastRoofX);
      cat.y = ROOF_Y;
    }
    cat.vy = 0;
    cat.vx = speedAt(cat.x);
    grounded = true;
    airJump = true;
    coyote = COYOTE;
    cameraX = cat.x - DESIGN_W * CAT_SCREEN;
    fillRoofs(cameraX + DESIGN_W + 700);
    state = "play";
  }

  function jump() {
    cat.vy = JUMP_VEL;
    grounded = false;
    coyote = 0;
    jumpBuffer = 0;
    squash = -0.7;
    bikeSquash = -0.55;
    catHop = 1;
    glassV += 55;
    spinning = false;
    spinDir = -1;
    spinTime = 0;
    spin = 0;
  }

  function queueInput() {
    inputQueued = true;
  }

  function consumeInput() {
    if (!inputQueued) return false;
    inputQueued = false;
    return true;
  }

  function onPointer(e) {
    if (e.target === nameEl) return;
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var rw = rect.width || 1;
    var rh = rect.height || 1;
    pointerCssX = ((e.clientX - rect.left) / rw) * dispW;
    pointerCssY = ((e.clientY - rect.top) / rh) * dispH;
    pointerBufX = ((e.clientX - rect.left) / rw) * BUF_W;
    pointerBufY = ((e.clientY - rect.top) / rh) * BUF_H;
    queueInput();
  }

  function onKey(e) {
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      if (!e.repeat) {
        pointerBufX = -1;
        pointerBufY = -1;
        pointerCssX = -1;
        pointerCssY = -1;
        queueInput();
      }
    }
  }

  canvas.addEventListener("pointerdown", onPointer, { passive: false });
  wrap.addEventListener("pointerdown", onPointer, { passive: false });
  window.addEventListener("keydown", onKey, { passive: false });
  window.addEventListener("touchmove", function (e) { e.preventDefault(); }, { passive: false });

  function crisp(c) {
    c.imageSmoothingEnabled = false;
    c.webkitImageSmoothingEnabled = false;
    c.mozImageSmoothingEnabled = false;
    c.msImageSmoothingEnabled = false;
  }

  function smooth(c) {
    c.imageSmoothingEnabled = true;
    c.webkitImageSmoothingEnabled = true;
    c.mozImageSmoothingEnabled = true;
    c.msImageSmoothingEnabled = true;
  }

  function catAspect() {
    var src = imgOk(imgIdle) ? imgIdle : null;
    var nw = src ? (src.naturalWidth || CAT_NW) : CAT_NW;
    var nh = src ? (src.naturalHeight || CAT_NH) : CAT_NH;
    if (!nh) return CAT_NW / CAT_NH;
    return nw / nh;
  }

  function startLogoSize() {
    if (!imgOk(imgLogo)) return { w: 0, h: Math.round(dispH * 0.08) };
    var nw = imgLogo.naturalWidth;
    var nh = imgLogo.naturalHeight;
    var maxW = dispW * 0.62;
    var maxH = dispH * 0.24;
    var s = Math.min(maxW / nw, maxH / nh);
    return { w: Math.round(nw * s), h: Math.round(nh * s) };
  }

  function catDrawSize() {
    var dh = (dispH * (CAT_DRAW_H / DESIGN_H)) | 0;
    if (dh < 90) dh = 90;
    if (dh > 120) dh = 120;
    var dw = Math.round(dh * catAspect());
    return { w: dw, h: dh };
  }

  function layoutUI() {
    var pad = Math.max(10, (dispW * 0.04) | 0);
    var gap = Math.max(8, (dispW * 0.03) | 0);
    var bw = ((dispW - pad * 2 - gap) / 2) | 0;
    var bh = Math.max(72, (dispH * 0.09) | 0);
    var logo = startLogoSize();
    var by = Math.max(uiY(36), 10 + logo.h + 8);
    BTN_PLAY.x = pad;
    BTN_PLAY.y = by;
    BTN_PLAY.w = bw;
    BTN_PLAY.h = bh;
    BTN_SHOP.x = pad + bw + gap;
    BTN_SHOP.y = by;
    BTN_SHOP.w = bw;
    BTN_SHOP.h = bh;
    BTN_PEACE.x = -999;
    BTN_PEACE.y = -999;
    BTN_PEACE.w = 0;
    BTN_PEACE.h = 0;

    var backW = Math.max(90, (dispW * 0.32) | 0);
    BTN_BACK.w = backW;
    BTN_BACK.h = bh;
    BTN_BACK.x = ((dispW - backW) / 2) | 0;
    BTN_BACK.y = dispH - Math.max(52, uiY(18));

    var colW = ((dispW - pad * 2) / 3) | 0;
    var itemY = Math.max(uiY(42), 28 + FS_TITLE + FS_SMALL + 16);
    var itemH = Math.max(90, (dispH * 0.22) | 0);
    var i;
    for (i = 0; i < 3; i++) {
      SHOP_HIT[i].x = pad + i * colW;
      SHOP_HIT[i].y = itemY;
      SHOP_HIT[i].w = colW;
      SHOP_HIT[i].h = itemH;
    }
    var bikeY = itemY + itemH + Math.max(8, uiY(3));
    var bikeH = Math.max(90, (dispH * 0.22) | 0);
    var maxBikeBottom = BTN_BACK.y - 8;
    if (bikeY + bikeH > maxBikeBottom) bikeH = Math.max(70, maxBikeBottom - bikeY);
    var bikeColW = ((dispW - pad * 2) / 4) | 0;
    for (i = 0; i < 4; i++) {
      SHOP_HIT[3 + i].x = pad + i * bikeColW;
      SHOP_HIT[3 + i].y = bikeY;
      SHOP_HIT[3 + i].w = bikeColW;
      SHOP_HIT[3 + i].h = bikeH;
    }

    BTN_NAME.x = pad;
    BTN_NAME.y = BTN_PLAY.y + BTN_PLAY.h + Math.max(8, uiY(4));
    BTN_NAME.w = dispW - pad * 2;
    BTN_NAME.h = Math.max(28, FS_SMALL + 8);

    var deadW = dispW - pad * 2;
    var deadH = Math.max(48, (dispH * 0.072) | 0);
    var deadGap = Math.max(8, uiY(3));
    BTN_HOME.w = deadW;
    BTN_HOME.h = deadH;
    BTN_HOME.x = pad;
    BTN_HOME.y = dispH - Math.max(16, uiY(5)) - deadH;
    BTN_AGAIN.w = deadW;
    BTN_AGAIN.h = deadH;
    BTN_AGAIN.x = pad;
    BTN_AGAIN.y = BTN_HOME.y - deadGap - deadH;
    BTN_CONTINUE.w = deadW;
    BTN_CONTINUE.h = Math.max(deadH + 10, (dispH * 0.1) | 0);
    BTN_CONTINUE.x = pad;
    BTN_CONTINUE.y = BTN_AGAIN.y - deadGap - BTN_CONTINUE.h;
  }

  function resize() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var aspect = 9 / 16;
    var w;
    var h;
    if (vw / vh > aspect) {
      h = vh;
      w = vh * aspect;
    } else {
      w = vw;
      h = vw / aspect;
    }
    dispW = Math.round(w);
    dispH = Math.round(h);
    dpr = window.devicePixelRatio || 1;
    canvas.style.width = dispW + "px";
    canvas.style.height = dispH + "px";
    canvas.width = Math.round(dispW * dpr);
    canvas.height = Math.round(dispH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    crisp(ctx);
    crisp(bctx);
    layoutUI();
  }

  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", function () {
    setTimeout(resize, 80);
  });

  function spawnCoinFx(x, y) {
    var i;
    coinFx.push({ k: "flash", x: x, y: y, vx: 0, vy: 0, t: 0.2, life: 0.2, sz: 28 });
    coinFx.push({ k: "ring", x: x, y: y, vx: 0, vy: 0, t: 0.45, life: 0.45, sz: 10 });
    coinFx.push({ k: "ring", x: x, y: y, vx: 0, vy: 0, t: 0.3, life: 0.3, sz: 6 });
    for (i = 0; i < 26; i++) {
      var a = (i / 26) * Math.PI * 2 + Math.random() * 0.35;
      var sp = 170 + Math.random() * 240;
      coinFx.push({
        k: "spark",
        x: x,
        y: y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 110,
        t: 0.5 + Math.random() * 0.18,
        life: 0.62,
        sz: 5 + ((Math.random() * 9) | 0)
      });
    }
    for (i = 0; i < 10; i++) {
      coinFx.push({
        k: "star",
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 180,
        vy: -140 - Math.random() * 180,
        t: 0.55 + Math.random() * 0.16,
        life: 0.68,
        sz: 7 + ((Math.random() * 7) | 0)
      });
    }
  }

  function updateCoinFx(dt) {
    var i;
    for (i = coinFx.length - 1; i >= 0; i--) {
      var p = coinFx[i];
      p.t -= dt;
      if (p.k === "spark" || p.k === "star") {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 520 * dt;
      }
      if (p.t <= 0) coinFx.splice(i, 1);
    }
    if (catFlash > 0) {
      catFlash -= dt;
      if (catFlash < 0) catFlash = 0;
    }
  }

  function worldHasBolt() {
    var i;
    for (i = 0; i < roofs.length; i++) {
      if (roofs[i].bolt && !roofs[i].bolt.taken) return true;
    }
    return false;
  }

  function wantBolt(x) {
    if (peace || boostT > 0) return false;
    if (!x && x !== 0) return false;
    var m = metersAt(x);
    if (m < BOLT_EVERY) return false;
    if (worldHasBolt()) return false;
    var slot = Math.floor(m / BOLT_EVERY) * BOLT_EVERY;
    if (slot < BOLT_EVERY) return false;
    if (lastBoltM >= slot) return false;
    return true;
  }

  function startBoost(wx, wy) {
    boostDur = 3.4;
    boostT = boostDur;
    boostZoom = 1;
    bikeTilt = -0.42;
    smileTime = SMILE_DUR;
    catFlash = 0.7;
    shake = 0.55;
    spawnCoinFx(wx, wy);
    rainbow = [];
    rainbowGlow = [];
    boostLandPlaced = false;
  }

  function placeBoostLanding() {
    if (boostLandPlaced || !cat) return;
    boostLandPlaced = true;
    var landX = cat.x - 140;
    var tile = bldgWorld(10);
    var landW = tile.w * restTiles(10);
    roofs = roofs.filter(function (r) {
      return r.x + r.w < landX - 4;
    });
    spawnRoof(landX, landW, ROOF_Y, false, 0, 10);
    lastRoofX = landX + landW;
    lastRestM = metersAt(lastRoofX);
  }

  function snapBoostLand() {
    if (!cat) return;
    if (!boostLandPlaced) placeBoostLanding();
    cat.y = ROOF_Y;
    cat.vy = 0;
    grounded = true;
    airJump = true;
    coyote = COYOTE;
    bikeTilt = 0;
    hangPhase = 0;
    squash = 1;
    bikeSquash = 0.9;
    catHop = 0;
    shake = 0;
    boostZoom = 1;
  }

  function pickupBolts() {
    if (peace || boostT > 0) return;
    var i;
    var bodyL = cat.x - 4;
    var bodyR = cat.x + 52;
    var bodyT = cat.y - 78;
    var bodyB = cat.y + 8;
    var br = 20;
    for (i = 0; i < roofs.length; i++) {
      var b = roofs[i].bolt;
      if (!b || b.taken) continue;
      if (bodyR > b.x - br && bodyL < b.x + br && bodyB > b.y - br && bodyT < b.y + br) {
        roofs[i].bolt = null;
        lastBoltM = metersAt(cat.x);
        startBoost(b.x, b.y);
        return;
      }
    }
  }

  function pickupCoins() {
    if (peace) return;
    var i;
    var j;
    var coinR = 16;
    var bodyL = cat.x - 2;
    var bodyR = cat.x + 48;
    var bodyT = cat.y - 70;
    var bodyB = cat.y + 4;
    for (i = 0; i < roofs.length; i++) {
      var r = roofs[i];
      if (!r.coins) continue;
      for (j = 0; j < r.coins.length; j++) {
        var c = r.coins[j];
        if (c.taken) continue;
        if (
          bodyR > c.x - coinR &&
          bodyL < c.x + coinR &&
          bodyB > c.y - coinR &&
          bodyT < c.y + coinR
        ) {
          c.taken = true;
          gold += 1;
          saveGold();
          smileTime = SMILE_DUR;
          catFlash = 0.42;
          shake = Math.max(shake, 0.7);
          spawnCoinFx(c.x, c.y);
        }
      }
    }
  }

  function catOnLongFlat() {
    if (peace) return false;
    if (!cat || !grounded || boostT > 0) return false;
    var i;
    for (i = 0; i < roofs.length; i++) {
      var r = roofs[i];
      if (!isLongRoof(r)) continue;
      var landL = cat.x - 6;
      var landR = cat.x + CAT_W + 8;
      var landOverlap = landR > r.x && landL < r.x + r.w;
      if (landOverlap && cat.y > r.y - 8 && cat.y < r.y + 16) return true;
    }
    return false;
  }

  function updatePeaceZoom(dt) {
    if (!peace) return;
    if (peaceZoomT > 0) {
      peaceZoomT += dt;
      var zIn = 0.6;
      var zHold = 0.5;
      var zOut = 0.6;
      var peak = peaceZoomPeak;
      var t = peaceZoomT;
      var z = 1;
      var k;
      if (t < zIn) {
        k = t / zIn;
        k = k * k * (3 - 2 * k);
        z = 1 + (peak - 1) * k;
      } else if (t < zIn + zHold) {
        z = peak;
      } else if (t < zIn + zHold + zOut) {
        k = (t - zIn - zHold) / zOut;
        k = k * k * (3 - 2 * k);
        z = peak + (1 - peak) * k;
      } else {
        z = 1;
        peaceZoomT = 0;
        peaceZoomWait = 8 + Math.random() * 6;
      }
      boostZoom = z;
    } else {
      peaceZoomWait -= dt;
      if (peaceZoomWait <= 0) {
        peaceZoomT = 0.0001;
        peaceZoomPeak = 1.12 + Math.random() * 0.06;
      }
      if (boostZoom > 1.002) {
        boostZoom += (1 - boostZoom) * Math.min(1, dt * 8);
        if (boostZoom < 1.01) boostZoom = 1;
      } else {
        boostZoom = 1;
      }
    }
  }

  function updatePlay(dt) {
    if (boostT > 0) {
      consumeInput();
      jumpBuffer = 0;
    } else if (consumeInput()) jumpBuffer = BUFFER;

    jumpBuffer -= dt;
    coyote -= dt;
    if (smileTime > 0) {
      smileTime -= dt;
      if (smileTime < 0) smileTime = 0;
    }
    coinPhase += dt;

    if (boostT > 0) {
      boostT -= dt;
      if (boostT < 0) boostT = 0;
      if (boostT > 0 && boostT < 1) placeBoostLanding();
      if (boostT === 0) {
        snapBoostLand();
      } else {
      var gone = boostDur - boostT;
      var left = boostT;
      var z = 1.24;
      if (gone < 0.44) z = 1 + 0.24 * (gone / 0.44);
      else if (left < 0.8) z = 1 + 0.24 * (left / 0.8);
      boostZoom = z;
      cat.vx = speedAt(cat.x) * 2.2;
      cat.x += cat.vx * dt;
      cat.vy = 0;
      cat.y += (ROOF_Y - 56 - cat.y) * Math.min(1, dt * 8);
      smileTime = Math.max(smileTime, 0.2);
      grounded = false;
      airJump = false;
      hangPhase += dt * 7;
      bikeTilt += ((-0.36 + Math.sin(hangPhase * 2.3) * 0.14) - bikeTilt) * Math.min(1, dt * 10);
      rainbow.push({ x: cat.x - 40, y: cat.y + 6, t: 0.72 });
      if (rainbow.length > 52) rainbow.shift();
      var gi;
      for (gi = 0; gi < 2; gi++) {
        rainbowGlow.push({
          x: cat.x - 28 - Math.random() * 90,
          y: cat.y - 8 + Math.random() * 28,
          vx: -25 - Math.random() * 55,
          vy: (Math.random() - 0.5) * 40,
          t: 0.4 + Math.random() * 0.28,
          life: 0.62,
          sz: 5 + Math.random() * 9
        });
      }
      if (Math.random() < 0.55) {
        coinFx.push({
          k: "star",
          x: cat.x - 24 - Math.random() * 90,
          y: cat.y - 16 + Math.random() * 30,
          vx: -30 - Math.random() * 60,
          vy: (Math.random() - 0.5) * 70,
          t: 0.28 + Math.random() * 0.22,
          life: 0.5,
          sz: 3 + ((Math.random() * 5) | 0)
        });
      }
      }
    } else if ((grounded || coyote > 0) && jumpBuffer > 0) {
      jump();
      airJump = true;
    } else if (!grounded && airJump && jumpBuffer > 0) {
      jump();
      airJump = false;
      bikeTilt = -0.36;
      if (!peace && Math.random() < 0.2) {
        spinning = true;
        spinDir = -1;
        spinTime = 0;
        spin = 0;
      }
    }

    if (boostT <= 0) {
      if (peace) updatePeaceZoom(dt);
      else {
        boostZoom += (1 - boostZoom) * Math.min(1, dt * 8);
        if (boostZoom < 1.01) boostZoom = 1;
      }
      if (grounded && catOnLongFlat()) {
        bikeTilt += (-0.30 - bikeTilt) * Math.min(1, dt * 10);
        var sxW = dispW / DESIGN_W;
        var syW = dispH / DESIGN_H;
        var b = bikeLayout(worldToScreen(cat.x) * sxW + CAT_W * sxW * 0.5, cat.y * syW);
        var rearX = (b.x + b.w * WHEEL_REAR_FX) / sxW + cameraX;
        var rearY = (b.y + b.h * WHEEL_REAR_FY) / syW;
        var ns = 4 + ((Math.random() * 4) | 0);
        var si;
        for (si = 0; si < ns; si++) {
          var life = 0.2 + Math.random() * 0.18;
          sparks.push({
            x: rearX + (Math.random() - 0.5) * 2,
            y: rearY + (Math.random() - 0.5) * 1.5,
            vx: -110 - Math.random() * 150,
            vy: -40 - Math.random() * 90,
            t: life,
            life: life,
            soot: false
          });
        }
        if (sparks.length > 180) sparks.splice(0, sparks.length - 180);
      } else if (grounded) bikeTilt *= Math.exp(-dt * 10);
      else bikeTilt *= Math.exp(-dt * 1.6);
      if (Math.abs(bikeTilt) < 0.01) bikeTilt = 0;
      cat.vx = speedAt(cat.x);
      cat.x += cat.vx * dt;
      cat.vy += GRAVITY * dt;
    if (cat.vy > 980) cat.vy = 980;
    var prevY = cat.y;
    var prevRight = cat.x - cat.vx * dt + CAT_W;
    cat.y += cat.vy * dt;

    var wasGrounded = grounded;
    grounded = false;

    if (peace) {
      if (cat.vy >= -80 && cat.y >= ROOF_Y - 2) {
        cat.y = ROOF_Y;
        cat.vy = 0;
        grounded = true;
      }
    }

    for (var i = 0; i < roofs.length; i++) {
      var r = roofs[i];
      var catLeft = cat.x;
      var catRight = cat.x + CAT_W;
      var landL = cat.x - 6;
      var landR = cat.x + CAT_W + 8;
      var landOverlap = landR > r.x && landL < r.x + r.w;
      var bodyOverlap = catRight > r.x + 2 && catLeft < r.x + r.w - 2;

      var landed =
        landOverlap &&
        cat.vy >= -80 &&
        prevY <= r.y + 16 &&
        cat.y >= r.y - 2;

      if (landed) {
        cat.y = r.y;
        cat.vy = 0;
        grounded = true;
        continue;
      }

      if (!bodyOverlap) continue;

      var overlapY = cat.y > r.y + 4 && cat.y - CAT_H < r.y + r.h;
      if (!overlapY) continue;

      var hitFace = catRight > r.x && prevRight <= r.x + 10 && catLeft < r.x + 8;
      if (!peace && hitFace) {
        die();
        return;
      }
    }

    if (grounded) {
      coyote = COYOTE;
      if (!wasGrounded) {
        squash = 1;
        bikeSquash = 0.9;
        catHop = 0;
      }
      spinning = false;
      spin = 0;
      spinTime = 0;
      airJump = true;
    } else if (spinning) {
      spinTime += dt;
      var dur = airTime();
      spin = (spinTime / dur) * Math.PI * 2 * spinDir;
      if (spinDir < 0) {
        if (spin < -Math.PI * 2) spin = -Math.PI * 2;
      } else if (spin > Math.PI * 2) spin = Math.PI * 2;
    }

    if (cat.y > DESIGN_H + 50) {
      if (peace) {
        cat.y = ROOF_Y;
        cat.vy = 0;
        grounded = true;
      } else {
        die();
        return;
      }
    }
    }

    pickupCoins();
    pickupBolts();
    var ri;
    for (ri = rainbow.length - 1; ri >= 0; ri--) {
      rainbow[ri].t -= dt;
      if (rainbow[ri].t <= 0) rainbow.splice(ri, 1);
    }
    for (ri = rainbowGlow.length - 1; ri >= 0; ri--) {
      var g = rainbowGlow[ri];
      g.t -= dt;
      g.x += g.vx * dt;
      g.y += g.vy * dt;
      if (g.t <= 0) rainbowGlow.splice(ri, 1);
    }
    updateCoinFx(dt);
    var spi;
    for (spi = sparks.length - 1; spi >= 0; spi--) {
      var spk = sparks[spi];
      spk.t -= dt;
      spk.vy += (spk.soot ? 640 : 220) * dt;
      spk.x += spk.vx * dt;
      spk.y += spk.vy * dt;
      if (!spk.soot && spk.life && Math.random() < dt * 14) {
        var tipX = spk.x + spk.vx * 0.06;
        var tipY = spk.y + spk.vy * 0.06;
        sparks.push({
          x: tipX,
          y: tipY,
          vx: spk.vx * 0.25 - Math.random() * 20,
          vy: 50 + Math.random() * 70,
          t: 0.22 + Math.random() * 0.18,
          life: 0.28,
          soot: true
        });
      }
      if (spk.t <= 0) sparks.splice(spi, 1);
    }

    cameraX = cat.x - DESIGN_W * CAT_SCREEN;
    score = Math.floor(metersAt(cat.x));
    if (score > best) best = score;

    fillRoofs(cameraX + DESIGN_W + 700);
    while (roofs.length && roofs[0].x + roofs[0].w < cameraX - 120) {
      roofs.shift();
    }

    runPhase += dt * (8 + cat.vx * 0.03);
    tailPhase += dt * 7;
    squash *= Math.exp(-dt * 12);
    if (Math.abs(squash) < 0.02) squash = 0;
    bikeSquash *= Math.exp(-dt * 9);
    if (Math.abs(bikeSquash) < 0.02) bikeSquash = 0;
    if (catHop > 0) {
      catHop -= dt / 0.26;
      if (catHop < 0) catHop = 0;
    }
    var gTarget = 0;
    if (boostT <= 0 && !grounded && cat) gTarget = -cat.vy * 0.005;
    glassV += (gTarget - glassOff) * 36 * dt;
    glassV *= Math.exp(-dt * 10);
    glassOff += glassV * dt;
    if (glassOff > 4) glassOff = 4;
    if (glassOff < -3) glassOff = -3;
    shake *= Math.exp(-dt * 8);
    if (shake < 0.02) shake = 0;
  }

  function updateDead(dt) {
    layoutUI();
    shake *= Math.exp(-dt * 7);
    if (shake < 0.02) shake = 0;
    updateCoinFx(dt);
    if (btnWait) return;
    if (!consumeInput()) return;
    if (pointerCssX < 0) return;
    if (!usedContinue && hitBtn(pointerCssX, pointerCssY, BTN_CONTINUE)) {
      pokeBtn(BTN_CONTINUE, function () { continueFromAd(); });
      return;
    }
    if (hitBtn(pointerCssX, pointerCssY, BTN_AGAIN)) {
      pokeBtn(BTN_AGAIN, function () {
        insertScore(score);
        resetRun();
        state = "play";
      });
      return;
    }
    if (hitBtn(pointerCssX, pointerCssY, BTN_HOME)) {
      pokeBtn(BTN_HOME, function () {
        insertScore(score);
        goStart();
      });
    }
  }

  function hitBtn(bx, by, b) {
    return bx >= b.x && bx < b.x + b.w && by >= b.y && by < b.y + b.h;
  }

  function btnScale(b) {
    if (!b || !(b.pressT > 0)) return 1;
    var u = b.pressT / BTN_PRESS;
    if (u < 0) u = 0;
    if (u > 1) u = 1;
    var t = 1 - u;
    if (t < 0.4) return 0.92 + 0.16 * (t / 0.4);
    return 1.08 - 0.08 * ((t - 0.4) / 0.6);
  }

  function spawnBtnSpark(cx, cy) {
    var n = 10;
    var i;
    for (i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2 + Math.random() * 0.45;
      var sp = 55 + Math.random() * 120;
      btnSpark.push({
        x: cx,
        y: cy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 35,
        t: 0.24 + Math.random() * 0.12,
        life: 0.34,
        s: 2 + ((Math.random() * 2) | 0)
      });
    }
  }

  function pokeBtn(b, after) {
    if (!b) return;
    b.pressT = BTN_PRESS;
    spawnBtnSpark(b.x + b.w * 0.5, b.y + b.h * 0.5);
    if (after) btnWait = { t: 0.11, fn: after };
  }

  function updateBtnFx(dt) {
    if (!dt || dt < 0) dt = 0.016;
    var list = [BTN_PLAY, BTN_SHOP, BTN_BACK, BTN_NAME, BTN_CONTINUE, BTN_AGAIN, BTN_HOME];
    var i;
    var b;
    for (i = 0; i < list.length; i++) {
      b = list[i];
      if (b.pressT > 0) {
        b.pressT -= dt;
        if (b.pressT < 0) b.pressT = 0;
      }
    }
    for (i = 0; i < SHOP_HIT.length; i++) {
      b = SHOP_HIT[i];
      if (b && b.pressT > 0) {
        b.pressT -= dt;
        if (b.pressT < 0) b.pressT = 0;
      }
    }
    for (i = btnSpark.length - 1; i >= 0; i--) {
      var p = btnSpark[i];
      p.t -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 380 * dt;
      if (p.t <= 0) btnSpark.splice(i, 1);
    }
    if (btnWait) {
      btnWait.t -= dt;
      if (btnWait.t <= 0) {
        var fn = btnWait.fn;
        btnWait = null;
        fn();
      }
    }
  }

  function drawBtnFx() {
    if (!btnSpark.length) return;
    var i;
    for (i = 0; i < btnSpark.length; i++) {
      var p = btnSpark[i];
      var a = p.t / (p.life || 0.34);
      if (a < 0) a = 0;
      ctx.globalAlpha = a;
      ctx.fillStyle = "#ffffff";
      fillCircle(ctx, p.x, p.y, p.s || 3);
    }
    ctx.globalAlpha = 1;
  }

  function goStart() {
    peace = false;
    resetRun();
    state = "start";
  }

  function beginRun(isPeace) {
    peace = isPeace;
    resetRun();
    state = "play";
  }

  function spawnShopBurst(idx) {
    var slot = SHOP_HIT[idx];
    if (!slot) return;
    var cx = slot.x + slot.w * 0.5;
    var cy = slot.y + slot.h * 0.38;
    var cols = ["#ff9a2a", "#ffe56a", "#fff", "#f0e6d4"];
    var n = 12;
    var i;
    for (i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2 + Math.random() * 0.4;
      var sp = 90 + Math.random() * 170;
      shopBurst.push({
        x: cx,
        y: cy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 70,
        t: 0.45 + Math.random() * 0.2,
        life: 0.6,
        col: cols[i % cols.length]
      });
    }
  }

  function shopFailGold() {
    shopNoGoldT = 0.9;
    shake = Math.max(shake, 0.45);
  }

  function tapShopGlass(idx) {
    if (idx < 0 || idx > 2) return;
    if (owned[idx]) {
      equipped = equipped === idx + 1 ? 0 : idx + 1;
      saveShop();
      return;
    }
    if (gold < SHOP_PRICE) {
      shopFailGold();
      return;
    }
    gold -= SHOP_PRICE;
    owned[idx] = true;
    equipped = idx + 1;
    saveGold();
    saveShop();
    shopSuperT = 1.4;
    spawnShopBurst(idx);
  }

  function tapShopBike(idx) {
    if (idx < 0 || idx > 3) return;
    if (ownedBikes[idx]) {
      selectedBike = idx;
      saveBikes();
      return;
    }
    var price = BIKE_PRICES[idx] || 0;
    if (gold < price) {
      shopFailGold();
      return;
    }
    gold -= price;
    ownedBikes[idx] = true;
    selectedBike = idx;
    saveGold();
    saveBikes();
    shopSuperT = 1.4;
    spawnShopBurst(3 + idx);
  }

  function updateStart() {
    if (nameEl && nameEl.classList.contains("open")) {
      consumeInput();
      return;
    }
    if (btnWait) return;
    if (consumeInput()) {
      if (hitBtn(pointerCssX, pointerCssY, BTN_NAME)) {
        pokeBtn(BTN_NAME);
        openNameEdit();
        return;
      }
      if (hitBtn(pointerCssX, pointerCssY, BTN_SHOP)) {
        pokeBtn(BTN_SHOP, function () { state = "shop"; });
        return;
      }
      if (hitBtn(pointerCssX, pointerCssY, BTN_PLAY)) {
        pokeBtn(BTN_PLAY, function () { beginRun(false); });
        return;
      }
      beginRun(false);
    }
  }

  function updateShop(dt) {
    layoutUI();
    if (!dt || dt < 0) dt = 0.016;
    if (shopNoGoldT > 0) {
      shopNoGoldT -= dt;
      if (shopNoGoldT < 0) shopNoGoldT = 0;
    }
    if (shopSuperT > 0) {
      shopSuperT -= dt;
      if (shopSuperT < 0) shopSuperT = 0;
    }
    shake *= Math.exp(-dt * 8);
    if (shake < 0.02) shake = 0;
    var i;
    for (i = shopBurst.length - 1; i >= 0; i--) {
      var p = shopBurst[i];
      p.t -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 420 * dt;
      if (p.t <= 0) shopBurst.splice(i, 1);
    }
    if (btnWait) return;
    if (consumeInput()) {
      if (hitBtn(pointerCssX, pointerCssY, BTN_BACK)) {
        pokeBtn(BTN_BACK, function () {
          shopSuperT = 0;
          shopNoGoldT = 0;
          shopBurst = [];
          goStart();
        });
        return;
      }
      for (i = 0; i < 3; i++) {
        if (hitBtn(pointerCssX, pointerCssY, SHOP_HIT[i])) {
          pokeBtn(SHOP_HIT[i]);
          tapShopGlass(i);
          return;
        }
      }
      for (i = 0; i < 4; i++) {
        if (hitBtn(pointerCssX, pointerCssY, SHOP_HIT[3 + i])) {
          pokeBtn(SHOP_HIT[3 + i]);
          tapShopBike(i);
          return;
        }
      }
    }
  }

  function worldToScreen(x) {
    return x - cameraX;
  }

  function px(v) {
    return (v * SCALE) | 0;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function lerp3(a, b, t) {
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  }

  function rgb(a) {
    return "rgb(" + (a[0] | 0) + "," + (a[1] | 0) + "," + (a[2] | 0) + ")";
  }

  function ease(t) {
    return t * t * (3 - 2 * t);
  }

  function skyPhase() {
    return (((score % CYCLE_M) + CYCLE_M) % CYCLE_M) / CYCLE_M;
  }

  function sampleSky(p) {
    var keys = [
      { p: 0, top: [214, 168, 152], mid: [228, 188, 168], bot: [236, 208, 184] },
      { p: 0.25, top: [168, 188, 176], mid: [188, 204, 184], bot: [212, 216, 196] },
      { p: 0.5, top: [148, 132, 168], mid: [176, 152, 168], bot: [196, 168, 164] },
      { p: 0.75, top: [52, 56, 80], mid: [64, 64, 88], bot: [76, 72, 96] },
      { p: 1, top: [214, 168, 152], mid: [228, 188, 168], bot: [236, 208, 184] }
    ];
    var i = 0;
    while (i < keys.length - 1 && p >= keys[i + 1].p) i++;
    var a = keys[i];
    var b = keys[i + 1];
    var t = ease((p - a.p) / (b.p - a.p));
    return {
      top: lerp3(a.top, b.top, t),
      mid: lerp3(a.mid, b.mid, t),
      bot: lerp3(a.bot, b.bot, t)
    };
  }

  function nightAmt(p) {
    if (p > 0.6 && p < 0.95) {
      if (p < 0.7) return (p - 0.6) / 0.1;
      if (p > 0.88) return (0.95 - p) / 0.07;
      return 1;
    }
    return 0;
  }

  function celestialLocal(p0, p1, p) {
    return clamp((p - p0) / (p1 - p0), 0, 1);
  }

  function drawPng(c, img, dx, dy, dw, dh) {
    if (!imgOk(img)) return;
    dx = Math.round(dx);
    dy = Math.round(dy);
    dw = Math.max(1, Math.round(dw));
    dh = Math.max(1, Math.round(dh));
    c.drawImage(img, dx, dy, dw, dh);
  }

  function drawPngVis(c, img, dx, dy, dw, dh) {
    if (!img || !img.complete || !img.naturalWidth) return;
    if (dw < 1 || dh < 1) return;
    var nw = img.naturalWidth, nh = img.naturalHeight;
    var sx0 = 0, sy0 = 0, sw = nw, sh = nh;
    var ddx = dx, ddy = dy, ddw = dw, ddh = dh;
    if (ddx < 0) {
      var cutX = -ddx;
      sx0 += cutX * (nw / dw);
      sw -= cutX * (nw / dw);
      ddw -= cutX;
      ddx = 0;
    }
    if (ddy < 0) {
      var cutY = -ddy;
      sy0 += cutY * (nh / dh);
      sh -= cutY * (nh / dh);
      ddh -= cutY;
      ddy = 0;
    }
    if (ddx + ddw > dispW) {
      var extraX = ddx + ddw - dispW;
      sw -= extraX * (nw / dw);
      ddw -= extraX;
    }
    if (ddy + ddh > dispH) {
      var extraY = ddy + ddh - dispH;
      sh -= extraY * (nh / dh);
      ddh -= extraY;
    }
    if (ddw < 1 || ddh < 1 || sw < 1 || sh < 1) return;
    c.imageSmoothingEnabled = false;
    c.drawImage(img, sx0, sy0, sw, sh, Math.round(ddx), Math.round(ddy), Math.round(ddw), Math.round(ddh));
  }

  function drawSkyHi() {
    var p = skyPhase();
    var col = sampleSky(p);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, dispW, dispH);
    var farTop = Math.round((ROOF_Y - 72) * (dispH / DESIGN_H)) - 1;
    if (farTop < 8) farTop = 8;
    var g = ctx.createLinearGradient(0, 0, 0, farTop);
    g.addColorStop(0, rgb(col.top));
    g.addColorStop(0.55, rgb(col.mid));
    g.addColorStop(1, rgb(col.bot));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, dispW, farTop + 2);

    var n = nightAmt(p);
    var sx = dispW / BUF_W;
    var sy = dispH / BUF_H;
    if (n > 0) {
      ctx.fillStyle = CREAM_DIM;
      ctx.globalAlpha = n;
      var i;
      for (i = 0; i < stars.length; i++) {
        if (stars[i].k < n) {
          var syStar = stars[i].y * sy;
          if (syStar < farTop) {
            ctx.fillRect(
              stars[i].x * sx,
              syStar,
              Math.max(1.5, sx * 0.35),
              Math.max(1.5, sy * 0.35)
            );
          }
        }
      }
      ctx.globalAlpha = 1;
    }

  }

  function drawCelestials() {
    var p = skyPhase();
    var sx = dispW / BUF_W;
    var sy = dispH / BUF_H;
    crisp(ctx);
    function celestialXY(t, size) {
      var margin = size / sx + 6;
      var x = (BUF_W + margin - ease(t) * (BUF_W + margin * 2)) * sx;
      var y = (50 - Math.sin(t * Math.PI) * 38) * sy;
      return { x: x, y: y };
    }
    ctx.globalAlpha = 0.2;
    if (p >= 0 && p < 0.5 && imgOk(imgSun)) {
      var st = p / 0.5;
      var size = Math.max(36, 16 * sx);
      var sp = celestialXY(st, size);
      drawPng(ctx, imgSun, sp.x - size * 0.5, sp.y - size * 0.5, size, size);
    }
    if (p >= 0.5 && p < 1 && imgOk(imgMoon)) {
      var mt = (p - 0.5) / 0.5;
      var ms = Math.max(32, 14 * sx);
      var mp = celestialXY(mt, ms);
      drawPng(ctx, imgMoon, mp.x - ms * 0.5, mp.y - ms * 0.5, ms, ms);
    }
    ctx.globalAlpha = 1;

    drawCloudsHi(sx, sy);
  }

  function wrapMod(v, span) {
    v = v % span;
    if (v < 0) v += span;
    return v;
  }

  function drawCloudsHi(sx, sy) {
    if (!imgOk(imgCloud)) return;
    crisp(ctx);
    var t = (typeof performance !== "undefined" ? performance.now() : 0) / 1000;
    var span = BUF_W + 40;
    var i;
    for (i = 0; i < clouds.length; i++) {
      var cld = clouds[i];
      var cw = 28 * sx * cld.s;
      var ch = cw * (321 / 503);
      var wx = wrapMod(cld.x + t * cld.v * 0.35 - cameraX * 0.012, span) - 20;
      var wy = cld.y * sy;
      ctx.globalAlpha = 0.2;
      drawPng(ctx, imgCloud, wx * sx, wy, cw, ch);
    }
    ctx.globalAlpha = 1;
  }

  function drawCityLayer(arr, span, par, alpha, baseY, sx) {
    if (!span || span < 1) return;
    var i;
    var k;
    ctx.globalAlpha = alpha;
    for (i = 0; i < arr.length; i++) {
      var b = arr[i];
      var im = imgCity[b.id];
      if (!imgOk(im)) continue;
      var wx = ((b.x - par) % span + span) % span;
      var dw = b.w * sx;
      var dh = b.h * sx;
      for (k = -1; k <= 1; k++) {
        var dx = (wx + k * span) * sx;
        if (dx + dw < -24 || dx > dispW + 24) continue;
        drawPng(ctx, im, dx, baseY - dh, dw, dh);
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawCityFar() {
    var sx = dispW / DESIGN_W;
    var sy = dispH / DESIGN_H;
    var baseFar = (ROOF_Y - 72) * sy;
    ctx.save();
    crisp(ctx);
    drawCityLayer(cityFar, cityFarSpan, cameraX * 0.02, 0.55, baseFar, sx);
    drawLoopedStrip(imgFloorFar, cameraX * 0.02 * sx, baseFar - 1, FAR_FLOOR_H * sy);
    ctx.restore();
  }

  function drawCityMid() {
    var sx = dispW / DESIGN_W;
    var sy = dispH / DESIGN_H;
    var baseMid = (ROOF_Y + 12) * sy;
    ctx.save();
    crisp(ctx);
    drawCityLayer(cityMid, cityMidSpan, cameraX * 0.055, 0.88, baseMid, sx);
    ctx.restore();
  }

  function drawLoopedStrip(img, parPx, yPx, hPx) {
    if (!imgOk(img) || hPx < 1) return;
    var nw = img.naturalWidth;
    var nh = img.naturalHeight;
    if (!nw || !nh) return;
    var dw = Math.round(hPx * nw / nh);
    if (dw < 1) return;
    var off = ((parPx % dw) + dw) % dw;
    var x = Math.round(-off) - dw;
    ctx.save();
    crisp(ctx);
    while (x < dispW + 2) {
      drawPngVis(ctx, img, x, yPx, dw + 2, hPx);
      x += dw;
    }
    ctx.restore();
  }

  function drawFloor() {
    var sx = dispW / DESIGN_W;
    var sy = dispH / DESIGN_H;
    var midTop = (ROOF_Y + 12) * sy;
    drawLoopedStrip(imgFloor, cameraX * 0.055 * sx, midTop, FLOOR_H * sy);
  }

  function drawTrees() {
    var sx = dispW / DESIGN_W;
    var sy = dispH / DESIGN_H;
    var h = TREES_H * sy;
    drawLoopedStrip(imgTrees, cameraX * sx, dispH - h, h);
  }

  function drawRoofs() {}

  function drawRoofsHi(shx, shy) {
    if (peace) return;
    var sx = dispW / DESIGN_W;
    var sy = dispH / DESIGN_H;
    ctx.save();
    ctx.translate(shx || 0, shy || 0);
    crisp(ctx);
    var i;
    for (i = 0; i < roofs.length; i++) {
      var r = roofs[i];
      var dx = worldToScreen(r.x) * sx;
      var s = sx;
      var im = imgBldgs[r.bldg || 0];
      var nat = BLDG_NAT[r.bldg || 0] || [580, 880];
      if (imgOk(im)) {
        nat = [im.naturalWidth, im.naturalHeight];
      }
      var u = bldgUnit(r.bldg || 0);
      var dw = Math.round(nat[0] * u * s);
      var dh = Math.round(nat[1] * u * s);
      dx = Math.round(dx);
      var visW = isLongRoof(r) ? Math.round(r.w * s) : dw;
      if (dx + visW < -8 || dx > dispW + 8) continue;
      var dy = Math.round(r.y * sy);
      if (imgOk(im) && isLongRoof(r)) {
        var tileW = dw;
        if (tileW < 1) tileW = 1;
        var totalW = visW;
        var tx = dx;
        while (tx < dx + totalW) {
          if (tx + tileW > -2 && tx < dispW + 2) {
            drawPngVis(ctx, im, tx, dy, tileW + 2, dh);
            var restL = dispH - (dy + dh);
            if (restL > 0 && tx >= 0) {
              var fx = tx;
              var fw = tileW;
              if (fx + fw > dispW) fw = dispW - fx;
              if (fw >= 1) {
                ctx.drawImage(im, 0, nat[1] - 1, nat[0], 1, Math.round(fx), dy + dh, Math.round(fw), restL);
              }
            }
          }
          tx += tileW;
        }
      } else if (imgOk(im)) {
        dx = dx - 1;
        drawPng(ctx, im, dx, dy, dw + 2, dh);
        var rest = dispH - (dy + dh);
        if (rest > 0) {
          ctx.drawImage(im, 0, nat[1] - 1, nat[0], 1, dx, dy + dh, dw, rest);
        }
      } else {
        ctx.fillStyle = ROOF_COL;
        ctx.fillRect(dx, dy, dw, Math.max(dh, dispH - dy));
      }
    }
    ctx.restore();
  }


  function drawCoinsHi(shx, shy) {
    if (peace || !imgOk(imgCoin) || !cat) return;
    var sx = dispW / DESIGN_W;
    var sy = dispH / DESIGN_H;
    var cw = Math.max(28, (44 * sx) | 0);
    if (cw > 56) cw = 56;
    var ch = cw;
    var scx = Math.sin(coinPhase * 9.6);
    crisp(ctx);
    ctx.save();
    ctx.translate(shx || 0, shy || 0);
    var i;
    for (i = 0; i < roofs.length; i++) {
      var r = roofs[i];
      if (!r.coins) continue;
      var j;
      for (j = 0; j < r.coins.length; j++) {
        var c = r.coins[j];
        if (c.taken) continue;
        var cx = worldToScreen(c.x) * sx;
        var cy = c.y * sy;
        if (cx < -40 || cx > dispW + 40) continue;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scx, 1);
        drawPng(ctx, imgCoin, -cw * 0.5, -ch * 0.5, cw, ch);
        ctx.restore();
      }
    }
    ctx.restore();
  }

  function drawBoltsHi(shx, shy) {
    if (peace || !imgOk(imgBolt) || !cat) return;
    var sx = dispW / DESIGN_W;
    var sy = dispH / DESIGN_H;
    var bw = Math.max(26, (38 * sx) | 0);
    var bh = Math.round(bw * (imgBolt.naturalHeight / imgBolt.naturalWidth));
    var blink = 0.55 + 0.45 * Math.sin(coinPhase * 14);
    crisp(ctx);
    ctx.save();
    ctx.translate(shx || 0, shy || 0);
    var i;
    for (i = 0; i < roofs.length; i++) {
      var b = roofs[i].bolt;
      if (!b || b.taken) continue;
      var bx = worldToScreen(b.x) * sx;
      var by = b.y * sy + Math.sin(coinPhase * 6) * 4;
      if (bx < -40 || bx > dispW + 40) continue;
      ctx.globalAlpha = blink;
      drawPng(ctx, imgBolt, bx - bw * 0.5, by - bh * 0.5, bw, bh);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function fillCircle(c, x, y, r) {
    if (r < 0.6) return;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
  }

  function strokeCircle(c, x, y, r, th) {
    if (r < 0.6) return;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.lineWidth = Math.max(1.5, th);
    c.stroke();
  }

  function drawCoinFx(shx, shy) {
    if (!coinFx.length) return;
    var sx = dispW / DESIGN_W;
    var sy = dispH / DESIGN_H;
    var i;
    ctx.save();
    ctx.translate(shx || 0, shy || 0);
    smooth(ctx);
    for (i = 0; i < coinFx.length; i++) {
      var p = coinFx[i];
      var a = p.t / p.life;
      if (a < 0) a = 0;
      var px = worldToScreen(p.x) * sx;
      var py = p.y * sy;
      if (p.k === "flash") {
        var fr = (16 + (1 - a) * 28) * sx;
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = a * 0.9;
        ctx.fillStyle = "#fff6c2";
        fillCircle(ctx, px, py, fr);
        ctx.fillStyle = "#ffe56a";
        fillCircle(ctx, px, py, fr * 0.45);
        ctx.globalCompositeOperation = "source-over";
        continue;
      }
      if (p.k === "ring") {
        var rr = (10 + (1 - a) * 48) * sx;
        ctx.globalAlpha = a * 0.95;
        ctx.strokeStyle = "#f4e27a";
        strokeCircle(ctx, px, py, rr, 3.5 * a + 1.5);
        continue;
      }
      var rad = Math.max(2.2, (p.sz || 6) * a * 0.55);
      ctx.globalAlpha = a;
      if (p.k === "star") {
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = "#fff8e0";
        fillCircle(ctx, px, py, rad);
        ctx.globalCompositeOperation = "source-over";
      } else {
        ctx.fillStyle = a > 0.55 ? "#ffe56a" : "#f0e6d4";
        fillCircle(ctx, px, py, rad);
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();
    crisp(ctx);
  }

  function drawGlasses(dest, catX, catY, dw, dh, offY) {
    if (equipped < 1 || equipped > 3) return;
    var g = imgGlasses[equipped];
    if (!imgOk(g)) return;
    var gw0 = g.naturalWidth || 400;
    var gh0 = g.naturalHeight || 150;
    var gdw = dw * GLASS_WF;
    var gdh = gdw * (gh0 / gw0);
    var gx = catX + dw * FACE_CX - gdw * 0.5;
    var gy = catY + dh * FACE_CY - gdh * 0.5 + (offY || 0);
    dest.save();
    dest.globalAlpha = 1;
    dest.globalCompositeOperation = "source-over";
    drawPng(dest, g, gx, gy, gdw, gdh);
    dest.restore();
  }

  function bikeIndex() {
    var b = selectedBike | 0;
    if (b < 0 || b > 3) b = 0;
    return b;
  }

  function bikeLayout(cx, roofY) {
    var im = imgBikes[bikeIndex()];
    var ratio = 568 / 908;
    if (imgOk(im)) ratio = im.naturalHeight / im.naturalWidth;
    var sx = dispW / DESIGN_W;
    var bw = Math.round(BIKE_W * sx);
    var bh = Math.round(bw * ratio);
    var x = Math.round(cx - bw * 0.45);
    var y = Math.round(roofY - bh + 18);
    var seatX = x + bw * SEAT_FX;
    var seatY = y + bh * SEAT_FY;
    return { im: im, x: x, y: y, w: bw, h: bh, seatX: seatX, seatY: seatY };
  }

  function drawBike(c, b) {
    if (!b || !imgOk(b.im)) return;
    drawPng(c, b.im, b.x, b.y, b.w, b.h);
  }


  function drawCat(shx, shy, optCx, optRoofY) {
    if (!cat) return;
    var src = smileTime > 0 && imgOk(imgSmile) ? imgSmile : imgIdle;
    if (!imgOk(src)) return;
    var sx = dispW / DESIGN_W;
    var sy = dispH / DESIGN_H;
    var hitW = CAT_W * sx;
    var screenX = worldToScreen(cat.x) * sx;
    var roofY = cat.y * sy;
    if (optRoofY != null) {
      roofY = optRoofY;
      screenX = (optCx != null ? optCx : dispW * 0.5) - hitW * 0.5;
    }
    var cx = screenX + hitW * 0.5;
    var bob = 0;
    if (grounded) {
      bob = Math.sin(runPhase) > 0 ? 1 : 0;
    }
    var b = bikeLayout(cx, roofY + bob);
    var dh = Math.max(24, Math.round(b.h * 0.76));
    var dw = Math.round(dh * catAspect());
    var catX = Math.round(b.seatX - dw * 0.36);
    var catY = Math.round(b.seatY - dh + 6);

    ctx.save();
    ctx.translate(shx || 0, shy || 0);
    crisp(ctx);

    if (state !== "shop") drawRainbowTrail();

    ctx.save();
    if (Math.abs(bikeTilt) > 0.008) {
      var hubX = b.x + b.w * 0.2;
      var hubY = b.y + b.h * 0.86;
      ctx.translate(hubX, hubY);
      ctx.rotate(bikeTilt);
      ctx.translate(-hubX, -hubY);
    }
    if (spinning && spin !== 0 && !grounded) {
      var pvX = cx;
      var pvY = b.seatY;
      ctx.translate(pvX, pvY);
      ctx.rotate(spin);
      ctx.translate(-pvX, -pvY);
    }
    ctx.save();
    var bY = 1 - bikeSquash * 0.07;
    var bX = 1 + bikeSquash * 0.05;
    if (bY < 0.9) bY = 0.9;
    if (bY > 1.07) bY = 1.07;
    if (bX < 0.94) bX = 0.94;
    if (bX > 1.07) bX = 1.07;
    ctx.translate(b.x + b.w * 0.5, b.y + b.h);
    ctx.scale(bX, bY);
    ctx.translate(-(b.x + b.w * 0.5), -(b.y + b.h));
    drawBike(ctx, b);
    if (catFlash > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = Math.min(1, catFlash / 0.14) * 0.8;
      drawBike(ctx, b);
      ctx.restore();
    }
    ctx.restore();

    var hopY = catHop > 0 ? -Math.sin(catHop * Math.PI) * 11 : 0;
    var hangX = 0;
    var hangY = 0;
    var hangR = 0;
    if (boostT > 0) {
      hangX = Math.sin(hangPhase * 2.1) * 5 + Math.sin(hangPhase * 5.4) * 2;
      hangY = -7 + Math.sin(hangPhase * 3.6) * 6;
      hangR = -0.16 + Math.sin(hangPhase * 2.8) * 0.2;
    }
    ctx.save();
    var sqY = 1 - squash * 0.08;
    var sqX = 1 + squash * 0.06;
    if (sqY < 0.88) sqY = 0.88;
    if (sqY > 1.08) sqY = 1.08;
    if (sqX < 0.94) sqX = 0.94;
    if (sqX > 1.08) sqX = 1.08;
    ctx.translate(b.seatX, b.seatY + hopY);
    ctx.rotate(hangR);
    ctx.scale(sqX, sqY);
    ctx.translate(-b.seatX, -(b.seatY + hopY));
    drawPng(ctx, src, catX + hangX, catY + hopY + hangY, dw, dh);
    if (catFlash > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = Math.min(1, catFlash / 0.14) * 0.95;
      drawPng(ctx, src, catX + hangX, catY + hopY + hangY, dw, dh);
      drawPng(ctx, src, catX + hangX, catY + hopY + hangY, dw, dh);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    drawGlasses(ctx, catX + hangX, catY + hopY + hangY, dw, dh, glassOff * sy);
    ctx.restore();
    ctx.restore();
    if (state !== "shop" && sparks.length) {
      var spi;
      var k;
      for (spi = 0; spi < sparks.length; spi++) {
        var spk = sparks[spi];
        var sa = spk.t / (spk.life || 0.3);
        if (sa < 0) sa = 0;
        var sx2 = worldToScreen(spk.x) * sx;
        var sy2 = spk.y * sy;
        if (spk.soot) {
          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = Math.min(1, sa * 1.1);
          ctx.fillStyle = sa > 0.5 ? "#1a1512" : "#0a0908";
          fillCircle(ctx, sx2, sy2, sa > 0.45 ? 1.6 : 1.1);
          continue;
        }
        var spd = Math.sqrt(spk.vx * spk.vx + spk.vy * spk.vy) || 1;
        var nx = spk.vx / spd;
        var ny = spk.vy / spd;
        var len = (9 + sa * 14) * sx;
        ctx.globalCompositeOperation = "lighter";
        for (k = 0; k < 6; k++) {
          var u = k / 5;
          var fx = sx2 + nx * len * u;
          var fy = sy2 + ny * len * u;
          var rad = (1 - u * 0.7) * (2.2 + sa * 2.4);
          ctx.globalAlpha = sa * (1 - u * 0.35);
          ctx.fillStyle = u < 0.2 ? "#fff6c8" : u < 0.45 ? "#ffe56a" : u < 0.75 ? "#ff8a22" : "#ff4a10";
          fillCircle(ctx, fx, fy, rad);
        }
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = Math.min(1, sa * 0.95);
        ctx.fillStyle = "#0a0908";
        fillCircle(ctx, sx2 + nx * len, sy2 + ny * len, 1.5);
        fillCircle(ctx, sx2 + nx * len - 1.2, sy2 + ny * len + 1.4, 1.1);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.restore();
    crisp(ctx);
  }

  function drawRainbowTrail() {
    if (!rainbow.length && !rainbowGlow.length) return;
    var sx = dispW / DESIGN_W;
    var sy = dispH / DESIGN_H;
    var cols = ["#ff4d4d", "#ff9f2e", "#ffe14a", "#4ae07a", "#4aa7ff", "#c46bff"];
    var band = Math.max(4, (6 * sx) | 0);
    var blink = ((performance.now() / 80) | 0) % 2 === 0;
    var i;
    var k;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (i = 0; i < rainbowGlow.length; i++) {
      var g = rainbowGlow[i];
      var ga = g.t / g.life;
      if (ga < 0) ga = 0;
      ctx.globalAlpha = ga * (blink ? 0.7 : 0.35);
      ctx.fillStyle = "#ffffff";
      fillCircle(ctx, worldToScreen(g.x) * sx, g.y * sy, g.sz * sx * (0.55 + ga * 0.7));
    }
    for (i = 0; i < rainbow.length - 1; i++) {
      var p0 = rainbow[i];
      var p1 = rainbow[i + 1];
      var x0 = worldToScreen(p0.x) * sx;
      var x1 = worldToScreen(p1.x) * sx;
      var y0 = p0.y * sy;
      var w = Math.max(4, Math.round(x1 - x0) + 2);
      var a = p0.t / 0.72;
      if (a < 0) a = 0;
      var rx = Math.round(x0);
      ctx.globalAlpha = a * 0.5;
      for (k = 0; k < cols.length; k++) {
        var by = Math.round(y0 + (k - 3) * band);
        ctx.shadowColor = cols[k];
        ctx.shadowBlur = blink ? Math.max(14, band * 4) : Math.max(7, band * 2);
        ctx.fillStyle = cols[k];
        ctx.fillRect(rx, by, w, band);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = a * 0.22;
        ctx.fillRect(rx, by - 2, w, band + 4);
        ctx.globalAlpha = a * 0.5;
      }
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();
  }

  function uiY(bufY) {
    return (bufY * dispH / BUF_H) | 0;
  }

  function pixelText(c, str, x, y, color) {
    var o = Math.max(2, (dispW / 180) | 0);
    c.fillStyle = SHADOW;
    c.fillText(str, x + o, y);
    c.fillText(str, x, y + o);
    c.fillStyle = color;
    c.fillText(str, x, y);
  }

  function drawGoldChip(x, y, align) {
    var icon = Math.max(28, (FS_SMALL * 0.9) | 0);
    ctx.font = "700 " + FS_SMALL + "px " + FONT;
    var label = String(gold | 0);
    var tw = ctx.measureText(label).width;
    var gap = 8;
    var w = icon + gap + tw;
    var left = align === "center" ? x - w * 0.5 : x;
    if (imgOk(imgCoin)) drawPng(ctx, imgCoin, left, y - icon * 0.5, icon, icon);
    var prevAlign = ctx.textAlign;
    var prevBase = ctx.textBaseline;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    pixelText(ctx, label, left + icon + gap, y, CREAM);
    ctx.textAlign = prevAlign;
    ctx.textBaseline = prevBase;
  }

  function drawTop5(cx, y, maxY) {
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = "600 " + FS_LABEL + "px " + FONT;
    pixelText(ctx, "BEST", cx, y, CREAM_DIM);
    var lh = FS_SMALL + 10;
    var lines = 5;
    if (maxY != null) {
      lines = Math.floor((maxY - (y + FS_LABEL + 8)) / lh);
      if (lines > 5) lines = 5;
      if (lines < 1) lines = 1;
    }
    var i;
    for (i = 0; i < lines; i++) {
      var line = "-";
      if (i < top5.length) {
        line = nameOf(top5[i]) + "  " + String(scoreOf(top5[i]));
      }
      ctx.font = "600 " + FS_SMALL + "px " + FONT;
      pixelText(ctx, (i + 1) + "  " + line, cx, y + FS_LABEL + 8 + i * lh, CREAM);
    }
  }

  function drawHud() {
    if (peace) return;
    if (state !== "play") return;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    var cx = (dispW * 0.5) | 0;
    ctx.font = "600 " + FS_LABEL + "px " + FONT;
    pixelText(ctx, "SCORE", cx, 8, CREAM);
    ctx.font = "700 " + FS_NUM + "px " + FONT;
    pixelText(ctx, String(score), cx, 8 + FS_LABEL, CREAM);
    ctx.font = "600 " + FS_SMALL + "px " + FONT;
    pixelText(ctx, "BEST  " + best, cx, 8 + FS_LABEL + FS_NUM, CREAM_DIM);
    ctx.textAlign = "left";
    drawGoldChip(Math.max(10, (dispW * 0.04) | 0), 8 + FS_SMALL * 0.5, "left");
  }

  function drawBtn(b, label) {
    var sc = btnScale(b);
    var w = Math.max(8, Math.round(b.w * sc));
    var h = Math.max(8, Math.round(b.h * sc));
    var x = Math.round(b.x + (b.w - w) * 0.5);
    var y = Math.round(b.y + (b.h - h) * 0.5);
    ctx.fillStyle = "#241f1b";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = CREAM;
    var t = Math.max(2, (dispW / BUF_W) | 0);
    ctx.fillRect(x, y, w, t);
    ctx.fillRect(x, y + h - t, w, t);
    ctx.fillRect(x, y, t, h);
    ctx.fillRect(x + w - t, y, t, h);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 " + FS_BTN + "px " + FONT;
    pixelText(ctx, label, (x + w / 2) | 0, (y + h / 2) | 0, CREAM);
  }

  function drawStartUI() {
    layoutUI();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var logo = startLogoSize();
    if (imgOk(imgLogo) && logo.w > 0) {
      drawPng(ctx, imgLogo, ((dispW - logo.w) / 2) | 0, 8, logo.w, logo.h);
    } else {
      ctx.font = "700 " + FS_TITLE + "px " + FONT;
      pixelText(ctx, "JUMP CAT!", (dispW * 0.5) | 0, 28, CREAM);
    }
    drawGoldChip(Math.max(10, (dispW * 0.04) | 0), 8 + FS_SMALL * 0.5, "left");

    drawBtn(BTN_PLAY, "PLAY");
    drawBtn(BTN_SHOP, "SHOP");

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "600 " + FS_SMALL + "px " + FONT;
    pixelText(ctx, playerName, (dispW * 0.5) | 0, BTN_NAME.y + BTN_NAME.h * 0.5, CREAM);

    var listY = BTN_NAME.y + BTN_NAME.h + Math.max(18, uiY(8));
    var listBot = Math.round((ROOF_Y - 28) * (dispH / DESIGN_H));
    drawTop5((dispW * 0.5) | 0, listY, listBot);

  }

  function drawShopSprite(img, slot, on) {
    if (!imgOk(img)) return null;
    var priceH = Math.max(40, FS_SMALL + 16);
    var maxW = slot.w - 8;
    var maxH = Math.max(32, slot.h - priceH - 10);
    var nw = img.naturalWidth || 1;
    var nh = img.naturalHeight || 1;
    var sc = Math.min(maxW / nw, maxH / nh);
    if (on) sc *= 1.1;
    if (slot.pressT > 0) sc *= btnScale(slot);
    var dw = Math.max(1, Math.round(nw * sc));
    var dh = Math.max(1, Math.round(nh * sc));
    var dx = Math.round(slot.x + (slot.w - dw) * 0.5);
    var dy = Math.round(slot.y + 2);
    var maxBottom = slot.y + slot.h - priceH;
    if (dy + dh > maxBottom) {
      dh = Math.max(8, maxBottom - dy);
    }
    crisp(ctx);
    ctx.fillStyle = "rgba(240,230,212,0.2)";
    ctx.fillRect(dx - 4, dy - 4, dw + 8, dh + 8);
    drawPng(ctx, img, dx, dy, dw, dh);
    return { dx: dx, dy: dy, dw: dw, dh: dh };
  }

  function drawShopCost(cx, y, price, owned, on) {
    ctx.textBaseline = "middle";
    ctx.font = "700 " + FS_SMALL + "px " + FONT;
    if (on || owned) {
      ctx.textAlign = "center";
      pixelText(ctx, on ? "ON" : "OWNED", cx | 0, y | 0, on ? CREAM : CREAM_DIM);
      return;
    }
    var icon = Math.max(24, (FS_SMALL * 0.78) | 0);
    var label = String(price);
    var tw = ctx.measureText(label).width;
    var gap = 6;
    var left = cx - (icon + gap + tw) * 0.5;
    if (imgOk(imgCoin)) drawPng(ctx, imgCoin, left, y - icon * 0.5, icon, icon);
    ctx.textAlign = "left";
    pixelText(ctx, label, (left + icon + gap) | 0, y | 0, CREAM);
  }

  function drawShopUI() {
    layoutUI();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 " + FS_TITLE + "px " + FONT;
    pixelText(ctx, "SHOP", (dispW * 0.5) | 0, 28, CREAM);
    drawGoldChip((dispW * 0.5) | 0, 28 + FS_TITLE + FS_SMALL * 0.5, "center");
    if (shopNoGoldT > 0) {
      ctx.font = "700 " + FS_LABEL + "px " + FONT;
      ctx.globalAlpha = Math.min(1, shopNoGoldT / 0.3);
      pixelText(ctx, "NO GOLD", (dispW * 0.5) | 0, 28 + FS_TITLE + FS_SMALL + 18, "#e88880");
      ctx.globalAlpha = 1;
    }

    var i;
    var t = Math.max(2, (dispW / BUF_W) | 0);
    crisp(ctx);
    for (i = 0; i < 3; i++) {
      var slot = SHOP_HIT[i];
      var gon = equipped === i + 1;
      var gspr = drawShopSprite(imgGlasses[i + 1], slot, gon);
      var gcx = slot.x + slot.w * 0.5;
      var costHalf = Math.max(14, (FS_SMALL * 0.4) | 0);
      var gy = gspr ? gspr.dy + gspr.dh + 4 + costHalf : slot.y + slot.h - costHalf;
      drawShopCost(gcx, gy, SHOP_PRICE, owned[i], gon);
    }
    for (i = 0; i < 4; i++) {
      var bslot = SHOP_HIT[3 + i];
      var bon = selectedBike === i;
      var bspr = drawShopSprite(imgBikes[i], bslot, bon);
      var bcx = bslot.x + bslot.w * 0.5;
      var byp = bspr ? bspr.dy + bspr.dh + 4 + costHalf : bslot.y + bslot.h - costHalf;
      drawShopCost(bcx, byp, BIKE_PRICES[i], ownedBikes[i], bon);
    }

    var shopRoofY = Math.round(ROOF_Y * (dispH / DESIGN_H));
    drawCat(0, 0, dispW * 0.5, shopRoofY);
    drawBtn(BTN_BACK, "BACK");

    if (shopBurst.length) {
      var bi;
      for (bi = 0; bi < shopBurst.length; bi++) {
        var bp = shopBurst[bi];
        var ba = bp.t / (bp.life || 0.5);
        if (ba < 0) ba = 0;
        ctx.globalAlpha = ba;
        ctx.fillStyle = bp.col;
        var bsz = ba > 0.5 ? 4 : 3;
        fillCircle(ctx, bp.x, bp.y, bsz);
      }
      ctx.globalAlpha = 1;
    }

    if (shopSuperT > 0) {
      var pulse = 1 + 0.12 * Math.sin(shopSuperT * 18);
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.translate(dispW * 0.5, dispH * 0.46);
      ctx.scale(pulse, pulse);
      ctx.font = "700 " + Math.round(FS_TITLE * 1.4) + "px " + FONT;
      var sa = shopSuperT > 0.28 ? 1 : shopSuperT / 0.28;
      ctx.globalAlpha = sa;
      pixelText(ctx, "SUPER!", 0, 0, "#ffe56a");
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }

    function drawAdIcon(x, y, size) {
    var s0 = Math.max(12, size | 0);
    var t = Math.max(2, (s0 / 8) | 0);
    ctx.fillStyle = CREAM;
    ctx.fillRect(x, y, s0, s0);
    ctx.fillStyle = "#241f1b";
    ctx.fillRect(x + t, y + t, s0 - t * 2, s0 - t * 2);
    ctx.fillStyle = CREAM;
    var ax = x + s0 * 0.38;
    var ay = y + s0 * 0.26;
    ctx.beginPath();
    ctx.moveTo(Math.round(ax), Math.round(ay));
    ctx.lineTo(Math.round(ax), Math.round(y + s0 * 0.74));
    ctx.lineTo(Math.round(x + s0 * 0.76), Math.round(y + s0 * 0.5));
    ctx.closePath();
    ctx.fill();
  }

function drawDead() {
    layoutUI();
    ctx.fillStyle = "rgba(26,23,20,0.4)";
    ctx.fillRect(0, 0, dispW, dispH);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var cx = (dispW * 0.5) | 0;
    ctx.font = "600 " + FS_LABEL + "px " + FONT;
    pixelText(ctx, "SCORE", cx, 36, CREAM_DIM);
    ctx.font = "700 " + FS_NUM + "px " + FONT;
    var numY = 36 + FS_LABEL + 8;
    pixelText(ctx, String(score), cx, numY, CREAM);
    var quipY = numY + (FS_NUM * 0.5) + 16;
    ctx.font = "700 " + FS_SMALL + "px " + FONT;
    pixelText(ctx, deadLine, cx, quipY, CREAM);
    var listTop = quipY + (FS_SMALL * 0.5) + 12;
    var listBot = (usedContinue ? BTN_AGAIN.y : BTN_CONTINUE.y) - 10;
    drawTop5(cx, listTop, listBot);
    if (!usedContinue) {
      var cb = BTN_CONTINUE;
      var csc = btnScale(cb);
      var cw = Math.max(8, Math.round(cb.w * csc));
      var ch = Math.max(8, Math.round(cb.h * csc));
      var cxb = Math.round(cb.x + (cb.w - cw) * 0.5);
      var cyb = Math.round(cb.y + (cb.h - ch) * 0.5);
      ctx.fillStyle = "#241f1b";
      ctx.fillRect(cxb, cyb, cw, ch);
      ctx.fillStyle = CREAM;
      var ct = Math.max(2, (dispW / BUF_W) | 0);
      ctx.fillRect(cxb, cyb, cw, ct);
      ctx.fillRect(cxb, cyb + ch - ct, cw, ct);
      ctx.fillRect(cxb, cyb, ct, ch);
      ctx.fillRect(cxb + cw - ct, cyb, ct, ch);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.font = "700 " + FS_LABEL + "px " + FONT;
      var watch = "WATCH";
      var icon = Math.max(14, FS_LABEL);
      var gap = Math.max(8, (FS_LABEL * 0.28) | 0);
      var tw = ctx.measureText(watch).width;
      var total = tw + gap + icon;
      var rowY = (cyb + ch * 0.5) | 0;
      var startX = (cxb + (cw - total) * 0.5) | 0;
      pixelText(ctx, watch, startX, rowY, CREAM);
      drawAdIcon(startX + tw + gap, (rowY - icon * 0.5) | 0, icon);
    }
    drawBtn(BTN_AGAIN, "AGAIN");
    drawBtn(BTN_HOME, "HOME");
  }

  function render() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawSkyHi();
    ctx.save();
    if (boostZoom > 1.002 && cat) {
      var zs = dispW / DESIGN_W;
      var zy = dispH / DESIGN_H;
      var fx = worldToScreen(cat.x + CAT_W * 0.5) * zs;
      var fy = (cat.y - 36) * zy;
      ctx.translate(fx, fy);
      ctx.scale(boostZoom, boostZoom);
      ctx.translate(-fx, -fy);
    }
    drawCityFar();
    drawCelestials();
    drawCityMid();
    drawFloor();

    crisp(bctx);
    bctx.clearRect(0, 0, BUF_W, BUF_H);
    var ox = 0;
    var oy = 0;
    if (shake > 0) {
      ox = (((Math.random() - 0.5) * 2 * shake) | 0);
      oy = (((Math.random() - 0.5) * 2 * shake) | 0);
    }
    bctx.save();
    bctx.translate(ox, oy);
    bctx.restore();

    crisp(ctx);
    ctx.drawImage(buf, 0, 0, dispW, dispH);

    var shx = ox * dispW / BUF_W;
    var shy = oy * dispH / BUF_H;
    drawRoofsHi(shx, shy);
    if (state === "play" || state === "dead") drawCoinsHi(shx, shy);
    if (state === "play" || state === "dead") drawBoltsHi(shx, shy);
    if (state !== "shop") drawCat(shx, shy);
    if (state === "play" || state === "dead") drawCoinFx(shx, shy);
    drawTrees();
    ctx.restore();

    if (state === "start") drawStartUI();
    else if (state === "shop") drawShopUI();
    else if (state === "play") drawHud();
    else if (state === "dead") drawDead();
    drawBtnFx();
  }

  function frame(ts) {
    if (!lastTs) lastTs = ts;
    var dt = (ts - lastTs) / 1000;
    lastTs = ts;
    if (dt > 0.05) dt = 0.05;

    updateBtnFx(dt);
    if (state === "start") updateStart();
    else if (state === "shop") updateShop(dt);
    else if (state === "play") updatePlay(dt);
    else if (state === "dead") updateDead(dt);

    render();
    requestAnimationFrame(frame);
  }

  makeCity();
  makeStars();
  makeClouds();
  resetRun();
  cameraX = cat.x - DESIGN_W * CAT_SCREEN;
  state = "start";
  resize();
  if (document.fonts && document.fonts.load) {
    document.fonts.load("700 " + FS_TITLE + "px Pixelify Sans").catch(function () {});
  }
  requestAnimationFrame(frame);
})();
