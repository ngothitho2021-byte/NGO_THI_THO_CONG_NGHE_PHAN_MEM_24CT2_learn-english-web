// Dữ liệu hội thoại — 1 bài nghe gắn với chủ đề Food vừa học ở phần Từ vựng.
// "blank" là từ đúng cần điền, "text" là câu đầy đủ dùng để phát âm thanh.
const dialogue = [
  {
    speaker: 'W',
    display: 'Good evening! Do you have a ____?',
    text: 'Good evening! Do you have a reservation?',
    answer: 'reservation'
  },
  {
    speaker: 'C',
    display: 'Yes, table for two. Can I see the ____?',
    text: 'Yes, table for two. Can I see the menu?',
    answer: 'menu'
  },
  {
    speaker: 'W',
    display: "Of course. Today's special is grilled salmon, it's very ____.",
    text: "Of course. Today's special is grilled salmon, it's very delicious.",
    answer: 'delicious'
  },
  {
    speaker: 'C',
    display: "Great, I'd like to ____ that, please.",
    text: "Great, I'd like to order that, please.",
    answer: 'order'
  }
];

const linesContainer = document.getElementById('dialogueLines');
const checkAllBtn = document.getElementById('checkAllBtn');
const dialogueFeedback = document.getElementById('dialogueFeedback');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const progressPercent = document.getElementById('progressPercent');

// 1. Vẽ toàn bộ hội thoại ra màn hình
dialogue.forEach((line, i) => {
  const row = document.createElement('div');
  row.className = 'dialogue-line';

  const speakerLabel = line.speaker === 'W' ? 'NV' : 'Bạn';
  const htmlWithInput = line.display.replace(
    '____',
    `<input type="text" data-index="${i}" autocomplete="off">`
  );

  row.innerHTML = `
    <div class="speaker">${speakerLabel}</div>
    <div class="bubble">
      <button class="play-line" data-text="${line.text.replace(/"/g, '&quot;')}">🔊</button>
      ${htmlWithInput}
    </div>
  `;
  linesContainer.appendChild(row);
});

// 2. Phát âm thanh từng câu bằng giọng đọc trình duyệt (Web Speech API)
linesContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('play-line')) {
    const text = e.target.getAttribute('data-text');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }
});

// 3. Theo dõi tiến độ điền (chưa chấm điểm, chỉ đếm đã gõ hay chưa)
function updateProgress() {
  const inputs = document.querySelectorAll('#dialogueLines input');
  const filled = Array.from(inputs).filter(i => i.value.trim() !== '').length;
  const percent = Math.round((filled / inputs.length) * 100);
  progressFill.style.width = percent + '%';
  progressText.textContent = `Đã điền ${filled} / ${inputs.length}`;
  progressPercent.textContent = percent + '%';
}
linesContainer.addEventListener('input', updateProgress);

// 4. Kiểm tra toàn bộ đáp án
checkAllBtn.addEventListener('click', () => {
  const inputs = document.querySelectorAll('#dialogueLines input');
  let correctCount = 0;

  inputs.forEach(input => {
    const idx = Number(input.getAttribute('data-index'));
    const correctAnswer = dialogue[idx].answer;
    const userAnswer = input.value.trim().toLowerCase();

    input.classList.remove('correct', 'wrong');
    if (userAnswer === correctAnswer) {
      input.classList.add('correct');
      correctCount++;
    } else {
      input.classList.add('wrong');
    }
    input.disabled = true;
  });

  dialogueFeedback.textContent = `Bạn đúng ${correctCount} / ${inputs.length} câu.`;
  dialogueFeedback.className = correctCount === inputs.length ? 'fill-feedback ok' : 'fill-feedback no';
  checkAllBtn.disabled = true;
});
