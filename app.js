// Sentences to type
const SENTENCES = [
"Consistency is the key to building long lasting good habits.",
"Reading books can open doors to knowledge and imagination.",
"Hard work beats talent when talent does not work hard enough.",
"Clean code is easy to read, understand, and maintain over time.",
"Patience and persistence are important traits for success.",
"Debugging teaches you how to think carefully and logically.",
"The internet connects people and ideas across the world instantly.",
"Creativity grows when you try new things without fear of failure.",
"Small steps taken every day lead to big achievements in life.",
"Teamwork makes complex challenges easier to solve together."
];

// Elements
const sentenceEl = document.getElementById('sentence');
const inputEl = document.getElementById('input');
const wpmEl = document.getElementById('wpm');
const accEl = document.getElementById('accuracy');
const timeEl = document.getElementById('time');
const newTestBtn = document.getElementById('newTest');
const resultEl = document.getElementById('result');
const finalWpmEl = document.getElementById('finalWpm');
const finalAccEl = document.getElementById('finalAccuracy');
const bestWpmEl = document.getElementById('bestWpm');

let target = '';
let startTimeMs = null;
let finished = false;

function pickRandomSentence() {
  const index = Math.floor(Math.random() * SENTENCES.length);
  return SENTENCES[index];
}

function resetTest() {
  target = pickRandomSentence();
  sentenceEl.innerHTML = '';
  renderSentence('');
  inputEl.value = '';
  startTimeMs = null;
  finished = false;
  updateStats(0, 100, 0);
  resultEl.hidden = true;
  inputEl.focus();
}

function renderSentence(currentInput) {
  const chars = target.split('');
  const typed = currentInput.split('');
  const spanNodes = [];

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const span = document.createElement('span');
    if (i < typed.length) {
      span.textContent = c;
      if (typed[i] === c) {
        span.className = 'correct';
      } else {
        span.className = 'incorrect';
      }
    } else {
      span.textContent = c;
      span.className = 'remaining';
    }
    spanNodes.push(span);
  }

  sentenceEl.replaceChildren(...spanNodes);
}

function computeStats(currentInput) {
  const elapsedSec = startTimeMs ? (Date.now() - startTimeMs) / 1000 : 0;

  const correctCharCount = currentInput
    .split('')
    .filter((ch, i) => i < target.length && ch === target[i]).length;
  const accuracy = currentInput.length === 0
    ? 100
    : Math.max(0, Math.min(100, Math.round((correctCharCount / currentInput.length) * 100)));

  const wordsTyped = currentInput.trim().length === 0 ? 0 : currentInput.trim().split(/\s+/).length;
  const minutes = elapsedSec / 60;
  const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;

  return { elapsedSec, accuracy, wpm };
}

function updateStats(wpm, accuracy, elapsedSec) {
  wpmEl.textContent = String(wpm);
  accEl.textContent = `${accuracy}%`;
  timeEl.textContent = `${elapsedSec.toFixed(1)}s`;
}

function finishTest(finalWpm, finalAccuracy) {
  finished = true;
  finalWpmEl.textContent = String(finalWpm);
  finalAccEl.textContent = `${finalAccuracy}%`;
  resultEl.hidden = false;

  const best = Number(localStorage.getItem('bestWpm') || '0');
  if (finalWpm > best) {
    localStorage.setItem('bestWpm', String(finalWpm));
    bestWpmEl.textContent = String(finalWpm);
  }
}

function loadBest() {
  const best = Number(localStorage.getItem('bestWpm') || '0');
  bestWpmEl.textContent = String(best);
}

inputEl.addEventListener('input', () => {
  if (finished) return;
  const value = inputEl.value;
  if (startTimeMs === null && value.length > 0) {
    startTimeMs = Date.now();
  }

  renderSentence(value);
  const { elapsedSec, accuracy, wpm } = computeStats(value);
  updateStats(wpm, accuracy, elapsedSec);

  if (value === target) {
    finishTest(wpm, accuracy);
  }
});

newTestBtn.addEventListener('click', resetTest);

// Initialize
loadBest();
resetTest();


