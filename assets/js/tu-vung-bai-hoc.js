// 1. Dữ liệu từ vựng — viết cứng, sau này sẽ thay bằng API gọi từ FastAPI
const words = [
  { en: "Menu", type: "danh từ", vi: "Thực đơn", example: "Can I see the menu, please?" },
  { en: "Order", type: "danh từ / động từ", vi: "Gọi món / đơn hàng", example: "I would like to order the grilled chicken." },
  { en: "Delicious", type: "tính từ", vi: "Ngon", example: "This soup is absolutely delicious." },
  { en: "Recipe", type: "danh từ", vi: "Công thức nấu ăn", example: "She shared her recipe for apple pie." },
  { en: "Ingredient", type: "danh từ", vi: "Nguyên liệu", example: "Flour is the main ingredient in bread." },
  { en: "Restaurant", type: "danh từ", vi: "Nhà hàng", example: "We booked a table at a new restaurant." },
  { en: "Dessert", type: "danh từ", vi: "Món tráng miệng", example: "Would you like some dessert after dinner?" },
  { en: "Appetizer", type: "danh từ", vi: "Món khai vị", example: "The spring rolls make a great appetizer." },
  { en: "Reservation", type: "danh từ", vi: "Đặt chỗ trước", example: "I made a reservation for two at 7 PM." },
  { en: "Waiter", type: "danh từ", vi: "Người phục vụ", example: "The waiter recommended the fish special." }
];

// 2. Trạng thái của phiên học
let currentIndex = 0;
let knownCount = 0;
let forgotCount = 0;

// 3. Lấy tham chiếu tới các phần tử HTML
const cardIndexEl = document.getElementById('cardIndex');
const wordEnEl = document.getElementById('wordEn');
const wordTypeEl = document.getElementById('wordType');
const wordViEl = document.getElementById('wordVi');
const wordExampleEl = document.getElementById('wordExample');
const meaningBox = document.getElementById('meaningBox');
const revealBtn = document.getElementById('revealBtn');
const forgotBtn = document.getElementById('forgotBtn');
const knownBtn = document.getElementById('knownBtn');
const soundBtn = document.getElementById('soundBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const progressPercent = document.getElementById('progressPercent');
const cardView = document.getElementById('cardView');
const summaryView = document.getElementById('summaryView');
const knownCountEl = document.getElementById('knownCount');
const forgotCountEl = document.getElementById('forgotCount');
const restartBtn = document.getElementById('restartBtn');

// Phần tử cho bài tập điền từ (fill-in-the-blank)
const fillView = document.getElementById('fillView');
const fillIndexEl = document.getElementById('fillIndex');
const fillSentenceEl = document.getElementById('fillSentence');
const fillHintEl = document.getElementById('fillHint');
const fillFeedbackEl = document.getElementById('fillFeedback');
const checkBtn = document.getElementById('checkBtn');

// 4. Hiển thị thẻ từ hiện tại
function renderCard() {
  const word = words[currentIndex];
  cardIndexEl.textContent = `${currentIndex + 1} / ${words.length}`;
  wordEnEl.textContent = word.en;
  wordTypeEl.textContent = `(${word.type})`;
  wordViEl.textContent = word.vi;
  wordExampleEl.textContent = `"${word.example}"`;

  meaningBox.classList.remove('show');
  revealBtn.disabled = false;
  revealBtn.textContent = "Xem nghĩa";
  forgotBtn.disabled = true;
  knownBtn.disabled = true;

  updateProgress();
}

function updateProgress() {
  const percent = Math.round((currentIndex / words.length) * 100);
  progressFill.style.width = percent + "%";
  progressText.textContent = `Từ ${currentIndex + 1} / ${words.length}`;
  progressPercent.textContent = percent + "%";
}

// 5. Bấm "Xem nghĩa"
revealBtn.addEventListener('click', () => {
  meaningBox.classList.add('show');
  revealBtn.disabled = true;
  revealBtn.textContent = "Đã hiện nghĩa";
  forgotBtn.disabled = false;
  knownBtn.disabled = false;
});

// 6. Bấm nút phát âm — dùng giọng đọc có sẵn của trình duyệt (Web Speech API)
soundBtn.addEventListener('click', () => {
  const utterance = new SpeechSynthesisUtterance(words[currentIndex].en);
  utterance.lang = 'en-US';
  utterance.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
});

// 7. Bấm "Tôi nhớ" hoặc "Tôi quên" → sang từ tiếp theo
function goNext(known) {
  if (known) knownCount++; else forgotCount++;

  if (currentIndex < words.length - 1) {
    currentIndex++;
    renderCard();
  } else {
    startFillExercise();
  }
}
knownBtn.addEventListener('click', () => goNext(true));
forgotBtn.addEventListener('click', () => goNext(false));

// 7b. Bài tập điền từ — xuất hiện sau khi học xong hết flashcard, trước màn tổng kết
const fillQuestions = [
  { sentence: "Can I see the ____, please?", answer: "menu", hint: "Gợi ý: từ này nghĩa là \"thực đơn\"" },
  { sentence: "I would like to ____ the grilled chicken.", answer: "order", hint: "Gợi ý: từ này nghĩa là \"gọi món\"" },
  { sentence: "This soup is absolutely ____.", answer: "delicious", hint: "Gợi ý: từ này nghĩa là \"ngon\"" }
];
let fillIndex = 0;

function startFillExercise() {
  cardView.classList.add('hidden');
  fillView.classList.remove('hidden');
  fillIndex = 0;
  renderFillQuestion();
}

function renderFillQuestion() {
  const q = fillQuestions[fillIndex];
  fillIndexEl.textContent = `${fillIndex + 1} / ${fillQuestions.length}`;
  fillSentenceEl.innerHTML = q.sentence.replace(
    '____',
    '<input type="text" id="fillInput" autocomplete="off">'
  );
  fillHintEl.textContent = q.hint;
  fillFeedbackEl.textContent = '';
  fillFeedbackEl.className = 'fill-feedback';
  checkBtn.textContent = 'Kiểm tra';
  document.getElementById('fillInput').focus();
}

checkBtn.addEventListener('click', () => {
  // Nếu vừa mới chấm xong, nút này chuyển vai trò thành "Tiếp tục"
  if (checkBtn.textContent === 'Tiếp tục') {
    fillIndex++;
    if (fillIndex < fillQuestions.length) {
      renderFillQuestion();
    } else {
      fillView.classList.add('hidden');
      showSummary();
    }
    return;
  }

  const input = document.getElementById('fillInput');
  const userAnswer = input.value.trim().toLowerCase();
  const isCorrect = userAnswer === fillQuestions[fillIndex].answer;

  if (isCorrect) {
    input.classList.add('correct');
    fillFeedbackEl.textContent = '✓ Chính xác!';
    fillFeedbackEl.className = 'fill-feedback ok';
  } else {
    input.classList.add('wrong');
    fillFeedbackEl.textContent = `✗ Chưa đúng. Đáp án đúng là "${fillQuestions[fillIndex].answer}"`;
    fillFeedbackEl.className = 'fill-feedback no';
  }
  input.disabled = true;
  checkBtn.textContent = 'Tiếp tục';
});

// 8. Màn hình tổng kết
function showSummary() {
  progressFill.style.width = "100%";
  progressText.textContent = `Từ ${words.length} / ${words.length}`;
  progressPercent.textContent = "100%";

  cardView.classList.add('hidden');
  summaryView.classList.remove('hidden');
  knownCountEl.textContent = knownCount;
  forgotCountEl.textContent = forgotCount;
}

// 9. Học lại từ đầu
restartBtn.addEventListener('click', () => {
  currentIndex = 0;
  knownCount = 0;
  forgotCount = 0;
  summaryView.classList.add('hidden');
  cardView.classList.remove('hidden');
  renderCard();
});

// Khởi chạy lần đầu
renderCard();
