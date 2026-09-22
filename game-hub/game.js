/* ===================================================
   GAMEHUB - JAVASCRIPT ENGINE
   =================================================== */

// ===================== GLOBAL STATE =====================
let totalXP = 0;
let streak = 0;
let level = 1;
let gamesPlayedToday = 0;
let currentGame = null;

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  initLanguageGame();
  initPuzzle();
  initRiddles();
  updateUI();
});

// ===================== PARTICLES =====================
function createParticles() {
  const container = document.getElementById('particles');
  const colors = ['#a855f7', '#3b82f6', '#58cc02', '#f97316', '#ec4899', '#fbbf24'];

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      filter: blur(${Math.random() * 2}px);
    `;
    container.appendChild(p);
  }
}

// ===================== SCREEN NAVIGATION =====================
function showGame(game) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(game + '-screen').classList.add('active');
  currentGame = game;

  if (game === 'language') resetLanguageGame();
  if (game === 'puzzle')   { initPuzzle(); startPuzzleTimer(); }
  if (game === 'riddle')   resetRiddles();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('home-screen').classList.add('active');
  clearInterval(puzzleTimerInterval);
  currentGame = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================== UI UPDATE =====================
function updateUI() {
  document.getElementById('total-xp').textContent = totalXP;
  document.getElementById('streak-count').textContent = streak;
  document.getElementById('level-val').textContent = level;

  const pct = Math.min(gamesPlayedToday / 3 * 100, 100);
  document.getElementById('daily-bar').style.width = pct + '%';
  document.getElementById('daily-pct').textContent = Math.round(pct) + '%';
}

function addXP(amount) {
  totalXP += amount;
  streak++;
  level = Math.floor(totalXP / 50) + 1;
  updateUI();
  showXPToast('+' + amount + ' XP 🌟');
}

function showXPToast(msg) {
  const toast = document.getElementById('xp-toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 2000);
}

// ================================================================
//  GAME 1 — LANGUAGE QUIZ (Duolingo Style)
// ================================================================
const langQuestions = [
  // English → Indonesian
  { word: 'Hello',       flag: '🇬🇧', from: 'Inggris', to: 'Indonesia', answer: 'Halo',       options: ['Halo', 'Selamat Tinggal', 'Terima Kasih', 'Maaf'],           level: 1, type: 'translate' },
  { word: 'Cat',         flag: '🇬🇧', from: 'Inggris', to: 'Indonesia', answer: 'Kucing',     options: ['Anjing', 'Kucing', 'Burung', 'Ikan'],                         level: 1, type: 'translate' },
  { word: 'Beautiful',  flag: '🇬🇧', from: 'Inggris', to: 'Indonesia', answer: 'Indah',      options: ['Jelek', 'Besar', 'Indah', 'Cepat'],                           level: 1, type: 'translate' },
  { word: 'Thank You',  flag: '🇬🇧', from: 'Inggris', to: 'Indonesia', answer: 'Terima Kasih', options: ['Halo', 'Terima Kasih', 'Selamat', 'Permisi'],               level: 1, type: 'translate' },
  // Japanese → Indonesian
  { word: 'さくら (Sakura)', flag: '🇯🇵', from: 'Jepang', to: 'Indonesia', answer: 'Bunga Sakura', options: ['Bunga Sakura', 'Bulan', 'Matahari', 'Bintang'],        level: 2, type: 'translate' },
  { word: 'ありがとう (Arigatou)', flag: '🇯🇵', from: 'Jepang', to: 'Indonesia', answer: 'Terima Kasih', options: ['Halo', 'Sampai Jumpa', 'Terima Kasih', 'Maaf'], level: 2, type: 'translate' },
  // Spanish → Indonesian
  { word: 'Agua',        flag: '🇪🇸', from: 'Spanyol', to: 'Indonesia', answer: 'Air',        options: ['Api', 'Air', 'Tanah', 'Angin'],                              level: 2, type: 'translate' },
  { word: 'Amor',        flag: '🇪🇸', from: 'Spanyol', to: 'Indonesia', answer: 'Cinta',      options: ['Benci', 'Sedih', 'Cinta', 'Takut'],                          level: 2, type: 'translate' },
  // French → Indonesian
  { word: 'Bonjour',     flag: '🇫🇷', from: 'Prancis', to: 'Indonesia', answer: 'Selamat Pagi/Halo', options: ['Selamat Malam', 'Selamat Pagi/Halo', 'Sampai Jumpa', 'Permisi'], level: 3, type: 'translate' },
  { word: 'Magnifique',  flag: '🇫🇷', from: 'Prancis', to: 'Indonesia', answer: 'Luar Biasa', options: ['Biasa Saja', 'Jelek', 'Luar Biasa', 'Kecil'],               level: 3, type: 'translate' },
];

let langIndex = 0;
let langLives = 3;
let langScore = 0;
let langAnswered = false;

function initLanguageGame() {
  resetLanguageGame();
}

function resetLanguageGame() {
  langIndex = 0;
  langLives = 3;
  langScore = 0;
  langAnswered = false;
  renderLangQuestion();
  updateLangLives();
  updateLangProgress();
}

function renderLangQuestion() {
  const q = langQuestions[langIndex];
  document.getElementById('lang-flag').textContent = q.flag;
  document.getElementById('lang-word').textContent = q.word;
  document.getElementById('lang-instruction').textContent =
    `Apa arti kata "${q.word}" dalam Bahasa ${q.to}?`;
  document.getElementById('lang-level-badge').textContent = `Level ${q.level}`;
  document.getElementById('lang-feedback').style.display = 'none';
  document.getElementById('lang-question-card').style.animation = 'none';
  setTimeout(() => {
    document.getElementById('lang-question-card').style.animation = 'slideInUp 0.4s cubic-bezier(0.34,1.56,0.64,1)';
  }, 10);

  // Shuffle options
  const opts = [...q.options].sort(() => Math.random() - 0.5);
  const grid = document.getElementById('lang-answers');
  grid.innerHTML = '';

  opts.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = opt;
    btn.onclick = () => checkLangAnswer(btn, opt, q.answer);
    grid.appendChild(btn);
  });

  langAnswered = false;
}

function checkLangAnswer(btn, chosen, correct) {
  if (langAnswered) return;
  langAnswered = true;

  const allBtns = document.querySelectorAll('.answer-btn');
  allBtns.forEach(b => b.disabled = true);

  const feedback = document.getElementById('lang-feedback');
  const icon = document.getElementById('lang-feedback-icon');
  const text = document.getElementById('lang-feedback-text');

  if (chosen === correct) {
    btn.classList.add('correct');
    icon.textContent = '🎉';
    text.innerHTML = `<span style="color:#58cc02">Benar!</span> "${correct}" adalah jawabannya!`;
    feedback.style.borderColor = 'rgba(88,204,2,0.4)';
    langScore++;
    addXP(10);
  } else {
    btn.classList.add('wrong');
    // Highlight correct
    allBtns.forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
    icon.textContent = '😔';
    text.innerHTML = `<span style="color:#ef4444">Salah!</span> Jawaban benar: <strong>"${correct}"</strong>`;
    feedback.style.borderColor = 'rgba(239,68,68,0.4)';
    langLives--;
    updateLangLives();
  }

  feedback.style.display = 'block';
  updateLangProgress();
}

function nextLangQuestion() {
  langIndex++;

  if (langLives <= 0) {
    showCompleteModal('language', langScore, langQuestions.length, false);
    return;
  }

  if (langIndex >= langQuestions.length) {
    showCompleteModal('language', langScore, langQuestions.length, true);
    return;
  }

  renderLangQuestion();
}

function updateLangLives() {
  const hearts = ['❤️', '❤️', '❤️'];
  for (let i = langLives; i < 3; i++) hearts[i] = '🖤';
  document.getElementById('lang-lives').textContent = hearts.join('');
}

function updateLangProgress() {
  const pct = (langIndex / langQuestions.length) * 100;
  document.getElementById('lang-progress-bar').style.width = pct + '%';
  document.getElementById('lang-q-num').textContent = `${Math.min(langIndex + 1, langQuestions.length)}/${langQuestions.length}`;
}

// ================================================================
//  GAME 2 — SLIDING PUZZLE
// ================================================================
let puzzleSize = 3;
let puzzleState = [];
let emptyPos = 0;
let moveCount = 0;
let puzzleTimerInterval = null;
let puzzleSeconds = 0;
let puzzleBestMoves = {};

const tileColors = [
  '#7c3aed','#6d28d9','#5b21b6','#4c1d95',
  '#1d4ed8','#1e40af','#1e3a8a','#0f766e',
  '#0d9488','#059669','#047857','#065f46',
  '#b45309','#92400e','#78350f','#7f1d1d',
  '#be185d','#9d174d','#831843','#4a044e',
  '#1a1a35','#0f0f20','#12122a','#1e1e40'
];

function initPuzzle() {
  const grid = document.getElementById('puzzle-grid');
  const size = Math.min(Math.min(window.innerWidth - 48, 500), 460);
  const tileSize = Math.floor((size - 16 - (puzzleSize - 1) * 4) / puzzleSize);

  grid.style.gridTemplateColumns = `repeat(${puzzleSize}, ${tileSize}px)`;
  grid.style.width = (tileSize * puzzleSize + (puzzleSize - 1) * 4 + 16) + 'px';

  // Create solved state
  puzzleState = Array.from({ length: puzzleSize * puzzleSize }, (_, i) => i);
  emptyPos = puzzleSize * puzzleSize - 1;
  moveCount = 0;
  puzzleSeconds = 0;

  document.getElementById('move-count').textContent = '0';
  document.getElementById('puzzle-win').style.display = 'none';

  shufflePuzzle();
  renderPuzzle(tileSize);
}

function renderPuzzle(tileSize) {
  const size = Math.min(Math.min(window.innerWidth - 48, 500), 460);
  const ts = tileSize || Math.floor((size - 16 - (puzzleSize - 1) * 4) / puzzleSize);
  const grid = document.getElementById('puzzle-grid');
  grid.innerHTML = '';

  puzzleState.forEach((val, idx) => {
    const tile = document.createElement('div');
    tile.className = 'puzzle-tile' + (val === 0 ? ' empty' : '');
    tile.style.width = ts + 'px';
    tile.style.height = ts + 'px';

    if (val !== 0) {
      const colorIdx = (val - 1) % tileColors.length;
      tile.style.background = `linear-gradient(135deg, ${tileColors[colorIdx]}, ${tileColors[(colorIdx + 3) % tileColors.length]})`;
      tile.style.fontSize = ts > 80 ? '1.6rem' : ts > 60 ? '1.2rem' : '0.9rem';
      tile.style.fontWeight = '900';
      tile.style.color = '#fff';
      tile.style.textShadow = '0 2px 4px rgba(0,0,0,0.4)';
      tile.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      tile.textContent = val;
      tile.onclick = () => moveTile(idx);
    }

    grid.appendChild(tile);
  });
}

function moveTile(idx) {
  const row = Math.floor(idx / puzzleSize);
  const col = idx % puzzleSize;
  const emptyRow = Math.floor(emptyPos / puzzleSize);
  const emptyCol = emptyPos % puzzleSize;

  const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
                     (Math.abs(col - emptyCol) === 1 && row === emptyRow);

  if (!isAdjacent) return;

  // Swap
  [puzzleState[idx], puzzleState[emptyPos]] = [puzzleState[emptyPos], puzzleState[idx]];
  emptyPos = idx;
  moveCount++;
  document.getElementById('move-count').textContent = moveCount;

  renderPuzzle();

  // Add moving animation to the tile that just moved
  const tiles = document.querySelectorAll('.puzzle-tile');
  if (tiles[emptyPos]) {
    tiles[emptyPos].classList.add('moving');
    setTimeout(() => tiles[emptyPos].classList.remove('moving'), 150);
  }

  if (checkPuzzleSolved()) {
    setTimeout(puzzleSolved, 300);
  }
}

function checkPuzzleSolved() {
  for (let i = 0; i < puzzleState.length - 1; i++) {
    if (puzzleState[i] !== i + 1) return false;
  }
  return puzzleState[puzzleState.length - 1] === 0;
}

function puzzleSolved() {
  clearInterval(puzzleTimerInterval);
  const timeStr = formatTime(puzzleSeconds);

  const key = puzzleSize + 'x' + puzzleSize;
  if (!puzzleBestMoves[key] || moveCount < puzzleBestMoves[key]) {
    puzzleBestMoves[key] = moveCount;
    document.getElementById('puzzle-best').textContent = moveCount;
  }

  document.getElementById('win-stats').textContent = `${moveCount} langkah • ${timeStr}`;
  document.getElementById('puzzle-win').style.display = 'flex';

  addXP(15);
  gamesPlayedToday = Math.min(gamesPlayedToday + 1, 3);
  updateUI();
}

function shufflePuzzle() {
  // Generate a solvable shuffle
  puzzleState = Array.from({ length: puzzleSize * puzzleSize }, (_, i) => i === 0 ? 0 : i);
  emptyPos = 0;

  // Do random valid moves to ensure solvability
  let prevEmpty = -1;
  const moves = puzzleSize * puzzleSize * 50;

  for (let i = 0; i < moves; i++) {
    const neighbors = getValidMoves(emptyPos).filter(n => n !== prevEmpty);
    if (neighbors.length === 0) continue;
    const next = neighbors[Math.floor(Math.random() * neighbors.length)];
    prevEmpty = emptyPos;
    [puzzleState[emptyPos], puzzleState[next]] = [puzzleState[next], puzzleState[emptyPos]];
    emptyPos = next;
  }

  moveCount = 0;
  puzzleSeconds = 0;
  document.getElementById('move-count').textContent = '0';
  document.getElementById('puzzle-win').style.display = 'none';
  renderPuzzle();
}

function getValidMoves(pos) {
  const row = Math.floor(pos / puzzleSize);
  const col = pos % puzzleSize;
  const moves = [];
  if (row > 0) moves.push(pos - puzzleSize);
  if (row < puzzleSize - 1) moves.push(pos + puzzleSize);
  if (col > 0) moves.push(pos - 1);
  if (col < puzzleSize - 1) moves.push(pos + 1);
  return moves;
}

function startPuzzleTimer() {
  clearInterval(puzzleTimerInterval);
  puzzleSeconds = 0;
  puzzleTimerInterval = setInterval(() => {
    puzzleSeconds++;
    document.getElementById('puzzle-timer').textContent = '⏱ ' + formatTime(puzzleSeconds);
  }, 1000);
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

function setPuzzleSize(size, btn) {
  puzzleSize = size;
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  initPuzzle();
  startPuzzleTimer();
}

function solvePuzzle() {
  // Show one valid hint: highlight tiles that are out of place
  const tiles = document.querySelectorAll('.puzzle-tile:not(.empty)');
  tiles.forEach((tile, i) => {
    const val = parseInt(tile.textContent);
    const correctPos = val - 1;
    const currentPos = puzzleState.indexOf(val);
    if (currentPos !== correctPos) {
      tile.style.boxShadow = '0 0 20px rgba(251,191,36,0.8)';
      setTimeout(() => tile.style.boxShadow = '', 1500);
    }
  });
  showXPToast('💡 Kuning = posisi salah!');
}

// ================================================================
//  GAME 3 — RIDDLES / TEKA-TEKI
// ================================================================
const riddles = [
  {
    text: 'Saya punya kepala tapi tidak bisa berpikir, saya punya ekor tapi tidak bisa bergerak. Apa saya?',
    options: ['Koin', 'Ikan', 'Bintang', 'Bulan'],
    answer: 'Koin',
    hint: 'Kamu sering menemukanku di dompet...',
    explanation: '💡 Koin memiliki "kepala" (sisi gambar orang) dan "ekor" (sisi belakang) tapi tidak bisa bergerak!',
    category: '🤔 Logika',
    icon: '🪙'
  },
  {
    text: 'Semakin banyak yang kamu ambil, semakin besar saya menjadi. Apa saya?',
    options: ['Lubang', 'Uang', 'Makanan', 'Waktu'],
    answer: 'Lubang',
    hint: 'Bayangkan menggali sesuatu di tanah...',
    explanation: '💡 Semakin banyak tanah yang diambil (digali), semakin BESAR lubangnya!',
    category: '🧠 Pikiran Kreatif',
    icon: '🕳️'
  },
  {
    text: 'Apa yang selalu ada di depanmu tapi tidak bisa dilihat?',
    options: ['Masa Depan', 'Angin', 'Pikiran', 'Bayangan'],
    answer: 'Masa Depan',
    hint: 'Kamu tidak bisa kembali ke sana...',
    explanation: '💡 Masa depan selalu ada "di depanmu" dalam perjalanan hidupmu, tapi kita tidak bisa melihatnya!',
    category: '🌟 Filosofi',
    icon: '🔮'
  },
  {
    text: 'Saya bisa terbang tanpa sayap, menangis tanpa mata, dan membuat tanah basah. Siapa saya?',
    options: ['Awan / Hujan', 'Hantu', 'Angin', 'Es'],
    answer: 'Awan / Hujan',
    hint: 'Lihat ke langit saat cuaca mendung...',
    explanation: '💡 Awan terbang di langit (tanpa sayap), dan hujan "menangis" membasahi tanah!',
    category: '🌿 Alam',
    icon: '🌧️'
  },
  {
    text: 'Apa yang bisa kamu hancurkan hanya dengan menyebutnya?',
    options: ['Keheningan', 'Kaca', 'Batu', 'Air'],
    answer: 'Keheningan',
    hint: 'Saat kamu berbicara di ruangan sunyi...',
    explanation: '💡 Saat kamu menyebut sesuatu (berbicara), keheningan langsung hancur karena suaramu!',
    category: '🤯 Mind Blown',
    icon: '🤫'
  },
  {
    text: 'Saya memiliki kota tanpa rumah, hutan tanpa pohon, dan air tanpa ikan. Apa saya?',
    options: ['Peta', 'Mimpi', 'Buku', 'Foto'],
    answer: 'Peta',
    hint: 'Kamu menggunakanku untuk navigasi...',
    explanation: '💡 Peta menggambarkan kota, hutan, dan lautan, tetapi semuanya hanya gambar, bukan yang asli!',
    category: '🗺️ Geografi',
    icon: '🗺️'
  },
  {
    text: 'Apa yang memiliki banyak jarum tapi tidak bisa menjahit?',
    options: ['Pohon Cemara / Landak', 'Mesin Jahit', 'Kompas', 'Jam'],
    answer: 'Pohon Cemara / Landak',
    hint: 'Ada hewan berduri yang lucu...',
    explanation: '💡 Landak (atau pohon cemara) memiliki banyak "jarum" duri/daun yang tajam tapi tidak bisa menjahit!',
    category: '🦔 Hewan',
    icon: '🦔'
  },
  {
    text: 'Saya selalu datang, tapi tidak pernah tiba. Saya selalu pergi, tapi tidak pernah berangkat. Siapa saya?',
    options: ['Esok Hari', 'Mimpi', 'Bayangan', 'Angin'],
    answer: 'Esok Hari',
    hint: 'Kamu selalu menungguku tapi aku selalu bergerak...',
    explanation: '💡 "Esok hari" selalu datang tapi saat tiba, ia sudah menjadi "hari ini". Ia pergi tapi tidak pernah benar-benar berangkat!',
    category: '⏰ Waktu',
    icon: '🌅'
  },
  {
    text: 'Apa yang semakin tua semakin segar?',
    options: ['Anggur / Keju', 'Roti', 'Buah', 'Sayur'],
    answer: 'Anggur / Keju',
    hint: 'Orang dewasa suka meminumnya di momen spesial...',
    explanation: '💡 Anggur (wine) dan keju semakin lama disimpan, semakin enak dan segar rasanya!',
    category: '🍷 Kuliner',
    icon: '🧀'
  },
  {
    text: 'Saya berbicara tanpa mulut dan mendengar tanpa telinga. Saya tidak punya tubuh tapi bisa melakukan perjalanan jauh. Apa saya?',
    options: ['Gema', 'Angin', 'Radio', 'Pikiran'],
    answer: 'Gema',
    hint: 'Coba berteriak di pegunungan atau gua...',
    explanation: '💡 Gema "berbicara" dengan memantulkan suaramu tanpa mulut, dan terdengar tanpa telinga sendiri!',
    category: '🔊 Suara',
    icon: '🏔️'
  },
];

let riddleIndex = 0;
let riddleLives = 3;
let riddleScore = 0;
let riddleAnswered = false;

function initRiddles() {
  resetRiddles();
}

function resetRiddles() {
  riddleIndex = 0;
  riddleLives = 3;
  riddleScore = 0;
  riddleAnswered = false;
  renderRiddle();
  updateRiddleLives();
  updateRiddleProgress();
}

function renderRiddle() {
  const r = riddles[riddleIndex];
  document.getElementById('riddle-category').textContent = r.category;
  document.getElementById('riddle-text').textContent = r.text;
  document.querySelector('.riddle-question-icon').textContent = r.icon;
  document.getElementById('riddle-hint').style.display = 'none';
  document.getElementById('riddle-hint').textContent = '💡 ' + r.hint;
  document.getElementById('hint-btn').style.display = 'inline-block';
  document.getElementById('riddle-feedback').style.display = 'none';

  // Animate card
  const card = document.getElementById('riddle-card');
  card.style.animation = 'none';
  setTimeout(() => { card.style.animation = 'slideInUp 0.4s cubic-bezier(0.34,1.56,0.64,1)'; }, 10);

  // Render options
  const opts = [...r.options].sort(() => Math.random() - 0.5);
  const container = document.getElementById('riddle-options');
  container.innerHTML = '';

  opts.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'riddle-opt-btn';
    btn.textContent = opt;
    btn.onclick = () => checkRiddleAnswer(btn, opt, r.answer, r.explanation);
    container.appendChild(btn);
  });

  riddleAnswered = false;
}

function showHint() {
  document.getElementById('riddle-hint').style.display = 'block';
  document.getElementById('hint-btn').style.display = 'none';
}

function checkRiddleAnswer(btn, chosen, correct, explanation) {
  if (riddleAnswered) return;
  riddleAnswered = true;

  const allBtns = document.querySelectorAll('.riddle-opt-btn');
  allBtns.forEach(b => b.disabled = true);

  const feedback = document.getElementById('riddle-feedback');
  const icon = document.getElementById('riddle-feedback-icon');
  const text = document.getElementById('riddle-feedback-text');
  const exp = document.getElementById('riddle-explanation');

  if (chosen === correct) {
    btn.classList.add('correct');
    icon.textContent = '🎉';
    text.innerHTML = `<span style="color:#58cc02">Luar Biasa!</span> Kamu menemukan jawabannya!`;
    riddleScore++;
    addXP(20);
  } else {
    btn.classList.add('wrong');
    allBtns.forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
    icon.textContent = '🤔';
    text.innerHTML = `<span style="color:#ef4444">Hampir!</span> Jawaban benar: <strong>"${correct}"</strong>`;
    riddleLives--;
    updateRiddleLives();
  }

  exp.textContent = explanation;
  feedback.style.display = 'block';
  updateRiddleProgress();
}

function nextRiddle() {
  riddleIndex++;

  if (riddleLives <= 0) {
    showCompleteModal('riddle', riddleScore, riddles.length, false);
    return;
  }

  if (riddleIndex >= riddles.length) {
    showCompleteModal('riddle', riddleScore, riddles.length, true);
    return;
  }

  renderRiddle();
}

function updateRiddleLives() {
  const hearts = ['❤️', '❤️', '❤️'];
  for (let i = riddleLives; i < 3; i++) hearts[i] = '🖤';
  document.getElementById('riddle-lives').textContent = hearts.join('');
}

function updateRiddleProgress() {
  const pct = (riddleIndex / riddles.length) * 100;
  document.getElementById('riddle-progress-bar').style.width = pct + '%';
  document.getElementById('riddle-q-num').textContent = `${Math.min(riddleIndex + 1, riddles.length)}/${riddles.length}`;
}

// ================================================================
//  COMPLETE MODAL
// ================================================================
let currentCompleteGame = null;

function showCompleteModal(game, score, total, won) {
  currentCompleteGame = game;
  gamesPlayedToday = Math.min(gamesPlayedToday + 1, 3);
  updateUI();

  const pct = score / total;
  let emoji, title, desc, xp, stars;

  if (won && pct >= 0.8) {
    emoji = '🏆'; title = 'Sempurna!'; desc = 'Kamu luar biasa! Semua jawaban benar!';
    xp = game === 'language' ? 50 : game === 'riddle' ? 80 : 60;
    stars = '⭐⭐⭐';
  } else if (pct >= 0.5) {
    emoji = '🎯'; title = 'Bagus!'; desc = 'Kerja bagus! Kamu hampir sempurna!';
    xp = game === 'language' ? 30 : game === 'riddle' ? 50 : 40;
    stars = '⭐⭐';
  } else {
    emoji = '💪'; title = 'Coba Lagi!'; desc = 'Latihan membuat sempurna! Jangan menyerah!';
    xp = 10;
    stars = '⭐';
  }

  document.getElementById('modal-emoji').textContent = emoji;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-desc').textContent = `${desc} (${score}/${total} benar)`;
  document.getElementById('modal-xp').textContent = `+${xp} XP`;
  document.getElementById('modal-stars').textContent = stars;

  addXP(xp);

  document.getElementById('complete-modal').style.display = 'flex';
  createConfetti();
}

function createConfetti() {
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';
  const colors = ['#58cc02','#a855f7','#f97316','#3b82f6','#fbbf24','#ec4899'];

  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      top: 0;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 0.5}s;
      animation-duration: ${Math.random() * 0.8 + 0.8}s;
      transform: rotate(${Math.random() * 360}deg);
      width: ${Math.random() * 8 + 6}px;
      height: ${Math.random() * 8 + 6}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    container.appendChild(piece);
  }
}

function restartGame() {
  closeModal();
  if (currentCompleteGame) showGame(currentCompleteGame);
}

function closeModal() {
  document.getElementById('complete-modal').style.display = 'none';
  goHome();
}
