"use strict";

/*
  Меняешь только CONFIG и файлы в assets.
  Вся логика экранов уже готова.

  ВАЖНО
  Этот файл рассчитан на HTML и CSS из последних правок, где в экране 4 есть:
  - #balloonStage
  - #afterStage
  - #subtitles
  - #screen4Image
*/

const CONFIG = {
  assets: {
    // Можно оставить пустым, тогда будет милый фон из CSS
    background: "./assets/фото1.jpg",

    screen1Image: "./assets/1.jpg",
    envelopeImage: "./assets/3.jpg",
    screen2Image: "./assets/2jpg",
    screen3Image: "./assets/4.jpg",

    // Фото, которое появится по центру после шариков
    screen4Image: "./assets/5.jpg",

    music: "./assets/music.mp3",
  },

  screen1: {
    titleLine1: "С днём рождения",
    titleLine2: "Луничка! (｡•́‿•̀｡)",
    hint: 'Нажми на кнопку "Далее!!" (づ◕‿◕)づ',
    nextButtonText: "Далее!! ♪",

    // musicQuestion: "Ты хочешь включить песню?",
    musicButtonOff: "Включить песню",
    musicButtonOn: "Песня включена",
  },

  screen2: {
    question: "откроешь письмо? (｡•́︿•̀｡)",
    yesText: "конечно!! (っ˘з(˘⌣˘ )",
    noText: "нетт (почему!!) (╥_╥)",
    backText: "вернуться назад (˘･_･˘)",
  },

  screen3: {
    text: "почему? милая, подумай ещё!! пожалуйста((",
    backText: "Вернуться назад",
  },

  screen4: {
    phrase: "HAPPY BIRTHDAY SAIDA",

    // Тайминги как ты просил
    appearTotalMs: 10000,     // 10 сек появляются по очереди
    gatherDurationMs: 950,    // скорость построения в слово
    holdMs: 5000,             // 5 сек стоят
    flyTotalMs: 10000,        // 10 сек улетают по очереди
    flyDurationMs: 1900,      // полёт одной буквы

    // Субтитры
    subtitleIntervalMs: 1700,
    subtitleLines: [
      "С днём рождения, Саида",
      "Желаю счастья и всего наилучшего(меня)",
      "Крепкого здоровья и долгих лет жизни",
      "Чтобы друзья и вся твоя семья были рядом с тобой",
      "Пусть мечты становятся реальностью",
      "MBANK ты багындыр бийик - бийик",
      "Чтобы у тебя исчезли все проблемные клиенты",
      "Пусть будет много радости и спокойствия",
      "Пусть твоя улыбка сияет ещё ярче",
      "Ойлогон ой максаттарына жет !!!",
      "Я в тебя верю , у тебя все получится",
      "Мен сени менен сыймыктанам !!!",
      "Твой день рождения как будто и мой праздник тоже, жаль праздновать не будешь ...",
      "Дагы бир жолу ТУУЛГАН КҮНҮҢ МЕНЕН !!!"
    ],

    musicToggleOff: "Музыка выключена",
    musicToggleOn: "Музыка включена",

    // Милые эффекты
    sparkleRateMs: 260,
    sparkleLifeMs: 1200,
  },

  transitions: {
    ms: 380,
  }
};

/* -------------------- DOM -------------------- */

const screens = new Map();
document.querySelectorAll(".screen").forEach(el => {
  screens.set(el.getAttribute("data-screen"), el);
});

const app = document.getElementById("app");

/* Экран 1 */
const el1Img = document.getElementById("screen1Image");
const el1T1 = document.getElementById("screen1TitleLine1");
const el1T2 = document.getElementById("screen1TitleLine2");
const el1Hint = document.getElementById("screen1Hint");
const btnNext = document.getElementById("btnNext");
const btnMusicStart = document.getElementById("btnMusicStart");
const musicQuestion = document.getElementById("musicQuestion");

/* Экран 2 */
const el2ImgTop = document.getElementById("screen2ImageTop");
const el2ImgBottom = document.getElementById("screen2ImageBottom");

const el2Question = document.getElementById("screen2Question");
const btnYes = document.getElementById("btnOpenYes");
const btnNo = document.getElementById("btnOpenNo");
const btnBackFrom2 = document.getElementById("btnBackFrom2");

/* Экран 3 */
const el3Img = document.getElementById("screen3Image");
const el3Text = document.getElementById("screen3Text");
const btnBackFrom3 = document.getElementById("btnBackFrom3");

/* Экран 4 */
const balloonStage = document.getElementById("balloonStage");
const afterStage = document.getElementById("afterStage");
const subtitles = document.getElementById("subtitles");
const el4Img = document.getElementById("screen4Image");
const btnBackFrom4 = document.getElementById("btnBackFrom4");
const btnMusicToggle = document.getElementById("btnMusicToggle");

/* Audio */
const audio = document.getElementById("bgMusic");

/* -------------------- State -------------------- */

let currentScreen = "1";
let musicEnabled = false;

let introRunning = false;
let subtitlesTimer = null;
let sparklesTimer = null;

/* -------------------- Init -------------------- */

init();

function init(){
  applyBackground();

  fillScreen1();
  fillScreen2();
  fillScreen3();
  fillScreen4();

  setupAudio();
  wireEvents();

  goTo("1", { instant: true });
}

function applyBackground(){
  const bg = (CONFIG.assets.background || "").trim();
  if (bg){
    app.style.setProperty("--bg-image", `url("${bg}")`);
  } else {
    app.style.setProperty("--bg-image", "none");
  }
}

function fillScreen1(){
  if (el1Img) el1Img.src = CONFIG.assets.screen1Image;
  if (el1T1) el1T1.textContent = CONFIG.screen1.titleLine1;
  if (el1T2) el1T2.textContent = CONFIG.screen1.titleLine2;
  if (el1Hint) el1Hint.textContent = CONFIG.screen1.hint;
  if (btnNext) btnNext.textContent = CONFIG.screen1.nextButtonText;

  if (musicQuestion) musicQuestion.textContent = CONFIG.screen1.musicQuestion;
  updateMusicStartButton();
}

function fillScreen2(){

  if (el2ImgTop){
    el2ImgTop.src = CONFIG.assets.screen2Image;
  }

  if (el2ImgBottom){
    el2ImgBottom.src = CONFIG.assets.envelopeImage || CONFIG.assets.screen2Image;
  }

  if (el2Question) el2Question.textContent = CONFIG.screen2.question;

  if (btnYes) btnYes.textContent = CONFIG.screen2.yesText;
  if (btnNo) btnNo.textContent = CONFIG.screen2.noText;

  if (btnBackFrom2) btnBackFrom2.textContent = CONFIG.screen2.backText;
}

function fillScreen3(){
  if (el3Img) el3Img.src = CONFIG.assets.screen3Image;
  if (el3Text) el3Text.textContent = CONFIG.screen3.text;
  if (btnBackFrom3) btnBackFrom3.textContent = CONFIG.screen3.backText;
}

function fillScreen4(){
  if (el4Img) el4Img.src = CONFIG.assets.screen4Image;

  stopSubtitles();
  stopSparkles();
  if (subtitles) subtitles.innerHTML = "";

  // ЖЁСТКО: фото скрыто до конца шариков
  if (afterStage){
    afterStage.classList.add("is-hidden");
    afterStage.style.display = "none";
    afterStage.style.opacity = "0";
    afterStage.style.zIndex = "1";
  }

  // ЖЁСТКО: шарики сверху
  if (balloonStage){
    balloonStage.innerHTML = "";
    balloonStage.style.display = "grid";
    balloonStage.style.opacity = "1";
    balloonStage.style.zIndex = "5";
    balloonStage.setAttribute("aria-hidden", "false");
  }

  updateMusicToggleButton();
}

function setupAudio(){
  if (!audio) return;
  audio.src = CONFIG.assets.music;
  audio.loop = true;
  audio.preload = "auto";
}

function wireEvents(){
  if (btnNext){
    btnNext.addEventListener("click", () => goTo("2"));
  }

  if (btnMusicStart){
    btnMusicStart.addEventListener("click", async () => {
      musicEnabled = !musicEnabled;
      await applyMusicState();
      updateMusicStartButton();
      updateMusicToggleButton();
    });
  }

  if (btnNo){
    btnNo.addEventListener("click", () => goTo("3"));
  }

  if (btnBackFrom2){
    btnBackFrom2.addEventListener("click", () => goTo("1"));
  }

  if (btnBackFrom3){
    btnBackFrom3.addEventListener("click", () => goTo("2"));
  }

  if (btnYes){
    btnYes.addEventListener("click", async () => {
      goTo("4");
      await playBalloonsThenPhotoAndSubtitles();

      if (musicEnabled){
        await applyMusicState();
      }
    });
  }

  if (btnBackFrom4){
    btnBackFrom4.addEventListener("click", () => {
      stopSubtitles();
      stopSparkles();
      goTo("2");
    });
  }

  if (btnMusicToggle){
    btnMusicToggle.addEventListener("click", async () => {
      musicEnabled = !musicEnabled;
      await applyMusicState();
      updateMusicStartButton();
      updateMusicToggleButton();
    });
  }
}

/* -------------------- Navigation -------------------- */

function goTo(screenId, opts = {}){
  const next = String(screenId);
  if (!screens.has(next)) return;

  const prevEl = screens.get(currentScreen);
  const nextEl = screens.get(next);

  if (opts.instant){
    screens.forEach(el => el.classList.remove("is-active"));
    nextEl.classList.add("is-active");
    currentScreen = next;
    onEnter(next);
    return;
  }

  prevEl.classList.remove("is-active");
  setTimeout(() => {
    nextEl.classList.add("is-active");
    currentScreen = next;
    onEnter(next);
  }, CONFIG.transitions.ms);
}

function onEnter(screenId){
  if (screenId !== "4"){
    stopSubtitles();
    stopSparkles();
  }
}

/* -------------------- Music -------------------- */

async function applyMusicState(){
  if (!audio) return;

  if (!musicEnabled){
    audio.pause();
    audio.currentTime = 0;
    return;
  }

  try{
    await audio.play();
  } catch (e){
    console.warn("Музыка не запустилась", e);
  }
}

function updateMusicStartButton(){
  if (!btnMusicStart) return;

  btnMusicStart.textContent = musicEnabled
    ? CONFIG.screen1.musicButtonOn
    : CONFIG.screen1.musicButtonOff;

  btnMusicStart.setAttribute("aria-pressed", String(musicEnabled));
}

function updateMusicToggleButton(){
  if (!btnMusicToggle) return;

  btnMusicToggle.textContent = musicEnabled
    ? CONFIG.screen4.musicToggleOn
    : CONFIG.screen4.musicToggleOff;

  btnMusicToggle.setAttribute("aria-pressed", String(musicEnabled));
}

/* -------------------- Screen 4: Balloons -> Photo -> Subtitles -------------------- */

async function playBalloonsThenPhotoAndSubtitles(){
  if (!balloonStage || !afterStage) return;
  if (introRunning) return;
  introRunning = true;

  stopSubtitles();
  stopSparkles();
  if (subtitles) subtitles.innerHTML = "";

  // ЖЁСТКО: фото скрыто
  afterStage.classList.add("is-hidden");
  afterStage.style.display = "none";
  afterStage.style.opacity = "0";
  afterStage.style.zIndex = "1";

  // ЖЁСТКО: шарики поверх
  balloonStage.style.display = "grid";
  balloonStage.style.opacity = "1";
  balloonStage.style.zIndex = "5";
  balloonStage.setAttribute("aria-hidden", "false");

  balloonStage.innerHTML = "";

  const phrase = CONFIG.screen4.phrase;
  const rect = balloonStage.getBoundingClientRect();

  const sizing = computeBalloonSizing(phrase, rect);
  balloonStage.style.setProperty("--bsize", `${sizing.size}px`);
  balloonStage.style.setProperty("--bfont", `${sizing.font}px`);

  const nodes = buildBalloonLetters(phrase);
  const visibleNodes = nodes.filter(n => !n.classList.contains("is-space"));

  const appearStagger = calcStagger(CONFIG.screen4.appearTotalMs, visibleNodes.length, 55, 420);
  const flyStagger = calcStagger(CONFIG.screen4.flyTotalMs, visibleNodes.length, 55, 420);

  startSparkles();

  // стартовые позиции снизу
  nodes.forEach(n => {
    const x = Math.random() * rect.width;
    const y = rect.height + 90 + Math.random() * 210;
    n.style.left = `${x}px`;
    n.style.top = `${y}px`;
    n.style.opacity = "0";
    n.style.transform = "translate(-50%, -50%) scale(.90)";
  });

  await nextFrame();

  const targets = makePhraseLayout(phrase, rect, sizing);

  // 10 секунд: появляются по очереди и строятся в фразу
  for (let i = 0; i < nodes.length; i++){
    const node = nodes[i];
    const t = targets[i];

    if (node.classList.contains("is-space")) continue;

    node.style.transition =
      `opacity 360ms ease, left ${CONFIG.screen4.gatherDurationMs}ms cubic-bezier(.2,.8,.2,1), top ${CONFIG.screen4.gatherDurationMs}ms cubic-bezier(.2,.8,.2,1), transform ${CONFIG.screen4.gatherDurationMs}ms cubic-bezier(.2,.8,.2,1)`;

    node.style.opacity = "1";
    node.style.left = `${t.x}px`;
    node.style.top = `${t.y}px`;
    node.style.transform = "translate(-50%, -50%) scale(1)";

    node.dataset.wiggle = String((Math.random() * 2 - 1) * 2.2);

    await wait(appearStagger);
  }

  // стоим 5 секунд, с лёгким покачиванием
  const wiggleStart = performance.now();
  const wiggleDuration = Math.max(1200, Math.min(2200, CONFIG.screen4.holdMs));
  await wiggleLetters(visibleNodes, wiggleStart, wiggleDuration);
  await wait(Math.max(0, CONFIG.screen4.holdMs - wiggleDuration));

  // 10 секунд: улет по очереди
  for (let i = 0; i < nodes.length; i++){
    const node = nodes[i];
    if (node.classList.contains("is-space")) continue;

    const drift = (Math.random() * 180) - 90;
    const up = rect.height + 360 + Math.random() * 320;

    node.style.transition =
      `transform ${CONFIG.screen4.flyDurationMs}ms ease-in, opacity ${Math.max(900, CONFIG.screen4.flyDurationMs - 200)}ms ease-in`;

    node.style.transform = `translate(${drift}px, ${-up}px) scale(1.02)`;
    node.style.opacity = "0";

    await wait(flyStagger);
  }

  await wait(Math.max(350, CONFIG.screen4.flyDurationMs - 200));

  stopSparkles();

  // скрыть шарики
  balloonStage.innerHTML = "";
  balloonStage.style.display = "none";
  balloonStage.setAttribute("aria-hidden", "true");

  // показать фото и субтитры только сейчас
  afterStage.classList.remove("is-hidden");
  afterStage.style.display = "grid";
  afterStage.style.opacity = "1";
  afterStage.style.zIndex = "6";

  startSubtitles();

  introRunning = false;
}

function buildBalloonLetters(phrase){
  const chars = [...phrase];
  return chars.map(ch => {
    const wrap = document.createElement("div");
    wrap.className = "balloon-letter";

    if (ch === " "){
      wrap.classList.add("is-space");
      balloonStage.appendChild(wrap);
      return wrap;
    }

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = ch;
    bubble.style.background = randomBalloonColor();
    bubble.style.boxShadow = "0 18px 32px rgba(0,0,0,.22), 0 0 0 1px rgba(255,255,255,.22) inset";

    const string = document.createElement("div");
    string.className = "string";

    wrap.appendChild(bubble);
    wrap.appendChild(string);

    balloonStage.appendChild(wrap);
    return wrap;
  });
}

function computeBalloonSizing(phrase, rect){
  const chars = [...phrase].filter(c => c !== " ").length;
  const isNarrow = rect.width < 420;

  const lines = isNarrow ? 3 : 2;
  const maxWidth = rect.width * 0.92;
  const gap = isNarrow ? 10 : 12;

  const approxPerLine = Math.ceil(chars / lines);
  let size = Math.floor((maxWidth - (approxPerLine - 1) * gap) / approxPerLine);

  size = clamp(size, isNarrow ? 30 : 34, isNarrow ? 48 : 56);

  const font = Math.floor(size * 0.42);
  return { size, font, gap, lines };
}

function makePhraseLayout(phrase, rect, sizing){
  const chars = [...phrase];
  const words = phrase.split(" ");
  const lines = splitWordsToLines(words, sizing.lines);

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const bubble = sizing.size;
  const gap = sizing.gap;
  const lineGap = bubble + 28;

  const positions = new Array(chars.length).fill({ x: centerX, y: centerY });

  let globalIndex = 0;

  lines.forEach((line, li) => {
    const lineChars = [...line];
    const visibleCount = lineChars.filter(c => c !== " ").length;
    const totalWidth = (visibleCount * bubble) + ((visibleCount - 1) * gap);

    let x = centerX - totalWidth / 2 + bubble / 2;
    const y = centerY + (li - (lines.length - 1) / 2) * lineGap;

    lineChars.forEach(c => {
      if (c === " "){
        while (globalIndex < chars.length && chars[globalIndex] !== " ") globalIndex++;
        if (globalIndex < chars.length){
          positions[globalIndex] = { x: centerX, y: centerY };
          globalIndex++;
        }
        return;
      }

      while (globalIndex < chars.length && chars[globalIndex] === " ") globalIndex++;

      if (globalIndex < chars.length){
        positions[globalIndex] = { x, y };
        x += bubble + gap;
        globalIndex++;
      }
    });
  });

  for (let i = 0; i < chars.length; i++){
    if (chars[i] === " "){
      positions[i] = { x: centerX, y: centerY };
    }
  }

  return positions;
}

function splitWordsToLines(words, maxLines){
  if (maxLines <= 1) return [words.join(" ")];

  const result = new Array(maxLines).fill("").map(() => []);
  const lengths = new Array(maxLines).fill(0);

  words.forEach(w => {
    let best = 0;
    for (let i = 1; i < maxLines; i++){
      if (lengths[i] < lengths[best]) best = i;
    }
    result[best].push(w);
    lengths[best] += w.length + 1;
  });

  return result
    .map(arr => arr.join(" ").trim())
    .filter(Boolean);
}

async function wiggleLetters(nodes, startTs, durationMs){
  const end = startTs + durationMs;

  while (performance.now() < end){
    const t = performance.now() / 250;

    nodes.forEach(n => {
      const base = Number(n.dataset.wiggle || "0");
      const w = Math.sin(t + base) * 2.0;
      const y = Math.cos(t * 0.9 + base) * 1.4;
      n.style.transform = `translate(-50%, -50%) rotate(${w}deg) translateY(${y}px)`;
    });

    await nextFrame();
  }

  nodes.forEach(n => {
    n.style.transform = "translate(-50%, -50%)";
  });
}

/* -------------------- Subtitles -------------------- */

function startSubtitles(){
  if (!subtitles) return;

  const lines = CONFIG.screen4.subtitleLines.slice();
  let i = 0;

  subtitlesTimer = setInterval(() => {
    if (currentScreen !== "4") return;

    const text = lines[i % lines.length];
    i++;

    const p = document.createElement("div");
    p.className = "subtitle-line";
    p.textContent = text;

    subtitles.appendChild(p);

    setTimeout(() => {
      p.remove();
    }, 3800);

  }, CONFIG.screen4.subtitleIntervalMs);
}

function stopSubtitles(){
  if (subtitlesTimer){
    clearInterval(subtitlesTimer);
    subtitlesTimer = null;
  }
}

/* -------------------- Sparkles -------------------- */

function startSparkles(){
  if (!balloonStage) return;

  sparklesTimer = setInterval(() => {
    if (currentScreen !== "4") return;

    const rect = balloonStage.getBoundingClientRect();
    const s = document.createElement("div");

    const size = 6 + Math.random() * 8;
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height * 0.85;

    s.style.position = "absolute";
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.borderRadius = "999px";
    s.style.background = "rgba(255,255,255,.9)";
    s.style.boxShadow = "0 0 14px rgba(255,255,255,.85), 0 10px 20px rgba(0,0,0,.10)";
    s.style.opacity = "0";
    s.style.transform = "translate(-50%, -50%) scale(.6)";
    s.style.pointerEvents = "none";

    balloonStage.appendChild(s);

    requestAnimationFrame(() => {
      s.style.transition = "opacity 250ms ease, transform 900ms ease";
      s.style.opacity = "1";
      s.style.transform = "translate(-50%, -50%) scale(1)";
    });

    setTimeout(() => {
      s.style.transition = "opacity 420ms ease, transform 420ms ease";
      s.style.opacity = "0";
      s.style.transform = "translate(-50%, -50%) scale(.7)";
    }, CONFIG.screen4.sparkleLifeMs - 420);

    setTimeout(() => {
      s.remove();
    }, CONFIG.screen4.sparkleLifeMs);

  }, CONFIG.screen4.sparkleRateMs);
}

function stopSparkles(){
  if (sparklesTimer){
    clearInterval(sparklesTimer);
    sparklesTimer = null;
  }
}

/* -------------------- Helpers -------------------- */

function randomBalloonColor(){
  const colors = [
    "rgba(255, 105, 180, .95)",
    "rgba(255, 140, 180, .95)",
    "rgba(255, 190, 125, .95)",
    "rgba(120, 220, 255, .95)",
    "rgba(150, 255, 200, .95)",
    "rgba(190, 170, 255, .95)",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function calcStagger(totalMs, count, minMs, maxMs){
  if (count <= 1) return minMs;
  const raw = Math.floor(totalMs / (count - 1));
  return clamp(raw, minMs, maxMs);
}

function wait(ms){
  return new Promise(r => setTimeout(r, ms));
}

function nextFrame(){
  return new Promise(r => requestAnimationFrame(() => r()));
}

function clamp(v, a, b){
  return Math.max(a, Math.min(b, v));
}