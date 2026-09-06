// Kịch bản hội thoại luyện nói — vai "NV" (nhân viên nhà hàng) nói tự động,
// vai "Bạn" (người học) sẽ NÓI câu trả lời bằng mic thật (Web Speech API).
// LƯU Ý: đây chỉ ghi lại và hiển thị lại những gì bạn nói, CHƯA chấm điểm
// đúng/sai ngữ pháp — việc chấm điểm bằng AI sẽ làm ở giai đoạn có backend.
const script = [
  { role: 'ai', text: 'Good evening! Do you have a reservation?' },
  { role: 'user', suggestion: 'Yes, a table for two, please.' },
  { role: 'ai', text: 'Great, right this way. Here is the menu.' },
  { role: 'user', suggestion: 'Thank you very much.' },
  { role: 'ai', text: 'Are you ready to order, or do you need a few more minutes?' },
  { role: 'user', suggestion: "I'd like to order the grilled salmon, please." },
  { role: 'ai', text: "Excellent choice! I'll bring that right out for you." },
  { role: 'user', suggestion: 'Thank you so much!' }
];

let turnIndex = 0;

const chatLog = document.getElementById('chatLog');
const micBtn = document.getElementById('micBtn');
const speakHint = document.getElementById('speakHint');
const nextTurnBtn = document.getElementById('nextTurnBtn');

// Kiểm tra trình duyệt có hỗ trợ nhận diện giọng nói không (Chrome/Edge có, Safari/Firefox thường không)
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const supportsSpeechRecognition = !!SpeechRecognitionAPI;

let recognition = null;
if (supportsSpeechRecognition) {
  recognition = new SpeechRecognitionAPI();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.92;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function addBubble(role, text, withPlay) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role === 'ai' ? 'ai' : 'me'}`;
  const playBtn = withPlay ? `<button class="play-line" data-text="${text.replace(/"/g, '&quot;')}">🔊</button>` : '';
  bubble.innerHTML = `${playBtn}${text}`;
  chatLog.appendChild(bubble);
  chatLog.scrollTop = chatLog.scrollHeight;
}

chatLog.addEventListener('click', (e) => {
  if (e.target.classList.contains('play-line')) {
    speak(e.target.getAttribute('data-text'));
  }
});

// Hiện các câu thoại của NV liên tiếp cho tới khi gặp lượt của người học
function advanceUntilUserTurn() {
  while (turnIndex < script.length && script[turnIndex].role === 'ai') {
    const line = script[turnIndex];
    addBubble('ai', line.text, true);
    speak(line.text);
    turnIndex++;
  }

  if (turnIndex >= script.length) {
    micBtn.disabled = true;
    speakHint.textContent = '🎉 Bạn đã hoàn thành hội thoại luyện nói này!';
    nextTurnBtn.textContent = 'Luyện lại từ đầu';
    nextTurnBtn.disabled = false;
    return;
  }

  // Đến lượt người học nói
  const hint = script[turnIndex].suggestion;
  if (supportsSpeechRecognition) {
    speakHint.textContent = `Bấm mic và nói câu trả lời. Gợi ý: "${hint}"`;
  } else {
    speakHint.textContent = `Trình duyệt này chưa hỗ trợ nhận diện giọng nói — hãy gõ câu trả lời. Gợi ý: "${hint}"`;
  }
  nextTurnBtn.disabled = true;
}

function handleUserAnswer(transcript) {
  addBubble('me', transcript, false);
  turnIndex++;
  nextTurnBtn.disabled = false;
  speakHint.textContent = 'Bấm "Câu tiếp theo" khi bạn đã sẵn sàng.';
}

// --- Xử lý mic (trình duyệt hỗ trợ) ---
if (supportsSpeechRecognition) {
  let isRecording = false;

  micBtn.addEventListener('click', () => {
    if (isRecording) return;
    isRecording = true;
    micBtn.classList.add('recording');
    speakHint.textContent = '🔴 Đang nghe... hãy nói câu trả lời của bạn.';

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleUserAnswer(transcript);
    };

    recognition.onerror = () => {
      speakHint.textContent = 'Không nghe rõ, hãy bấm mic để thử lại.';
    };

    recognition.onend = () => {
      isRecording = false;
      micBtn.classList.remove('recording');
    };
  });
} else {
  // --- Trình duyệt không hỗ trợ mic: thay bằng ô nhập text ---
  micBtn.outerHTML = `
    <input type="text" id="fallbackInput" placeholder="Gõ câu trả lời của bạn..." style="flex:1;padding:12px 14px;border:1px solid var(--line);border-radius:10px;font-family:'Inter',sans-serif;">
    <button class="mic-btn" id="fallbackSendBtn" style="font-size:16px;">➤</button>
  `;
  document.getElementById('fallbackSendBtn').addEventListener('click', () => {
    const input = document.getElementById('fallbackInput');
    if (input.value.trim() === '') return;
    handleUserAnswer(input.value.trim());
    input.value = '';
  });
}

// Nút "Câu tiếp theo" / "Luyện lại từ đầu"
nextTurnBtn.addEventListener('click', () => {
  if (turnIndex >= script.length) {
    // Luyện lại từ đầu
    turnIndex = 0;
    chatLog.innerHTML = '';
    nextTurnBtn.textContent = 'Câu tiếp theo';
    micBtn.disabled = false;
  }
  advanceUntilUserTurn();
});

// Khởi động hội thoại
advanceUntilUserTurn();
