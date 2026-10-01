// ============================================================
// DỮ LIỆU MẪU — Chủ đề Food, trình độ A1
// ============================================================
const TOPIC = {
  id: 'food',
  name: 'Food',
  vocabulary: [
    {
      word: 'apple',
      ipa: 'ˈæp.əl',
      meaning: 'quả táo',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop',
      examples: [
        { en: 'I eat an apple every morning.', vi: 'Tôi ăn một quả táo mỗi sáng.' },
        { en: 'This apple is very sweet.', vi: 'Quả táo này rất ngọt.' }
      ]
    },
    {
      word: 'bread',
      ipa: 'brɛd',
      meaning: 'bánh mì',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop',
      examples: [
        { en: 'She buys fresh bread every day.', vi: 'Cô ấy mua bánh mì tươi mỗi ngày.' },
        { en: 'I want a piece of bread.', vi: 'Tôi muốn một miếng bánh mì.' }
      ]
    },
    {
      word: 'water',
      ipa: 'ˈwɔː.tər',
      meaning: 'nước',
      image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&auto=format&fit=crop',
      examples: [
        { en: 'Please give me some water.', vi: 'Vui lòng cho tôi ít nước.' },
        { en: 'Water is important for our body.', vi: 'Nước rất quan trọng đối với cơ thể.' }
      ]
    },
    {
      word: 'rice',
      ipa: 'raɪs',
      meaning: 'cơm / gạo',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop',
      examples: [
        { en: 'We eat rice every day.', vi: 'Chúng tôi ăn cơm mỗi ngày.' },
        { en: 'This rice smells great.', vi: 'Gạo này thơm quá.' }
      ]
    },
    {
      word: 'egg',
      ipa: 'ɛɡ',
      meaning: 'trứng',
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop',
      examples: [
        { en: 'I had an egg for breakfast.', vi: 'Tôi ăn một quả trứng vào buổi sáng.' },
        { en: 'She is cooking an egg.', vi: 'Cô ấy đang nấu trứng.' }
      ]
    }
  ]
}

// ============================================================
// TIỆN ÍCH CHUNG
// ============================================================
function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'en-US'
  utter.rate = 0.9
  window.speechSynthesis.speak(utter)
}

function isKnown(word) {
  return localStorage.getItem(`known_${word}`) === 'known'
}

function imageHtml(word, big) {
  if (word.image) return `<img src="${word.image}" alt="${word.word}">`
  return `<div class="image-placeholder ${big ? 'big' : ''}">🖼️</div>`
}

function showSection(sectionId) {
  document.querySelectorAll('.lesson-section').forEach((s) => s.classList.remove('visible'))
  document.getElementById(sectionId).classList.add('visible')
}

// ============================================================
// BƯỚC 1 — PODCAST PLAYER (Chỉ đọc khi bấm loa & Lưu hoàn thành bài)
// ============================================================
const podcastState = {
  words: TOPIC.vocabulary,
  index: 0,
  stats: { known: 0, unknown: 0 },
  finished: false
}

function renderPodcast() {
  const root = document.getElementById('podcastRoot')
  const s = podcastState

  if (s.finished) {
    // Đánh dấu đã học xong chủ đề hiện tại để mở khóa chủ đề tiếp theo
    localStorage.setItem(`completed_topic_${TOPIC.id}`, 'true')

    root.innerHTML = `
      <div class="podcast-summary">
        <h3>🎧 Xong chủ đề "${TOPIC.name}"!</h3>
        <p>✅ Đã biết: <strong>${s.stats.known}</strong> từ &nbsp;|&nbsp; 📝 Chưa biết: <strong>${s.stats.unknown}</strong> từ</p>
        ${
          s.stats.unknown > 0
            ? `<p>Những từ chưa biết đã được lưu lại — cùng ôn tập ngay nhé!</p>
               <button class="btn btn-primary" id="goReviewBtn">🔁 Đi ôn tập ngay</button>`
            : `<p class="success">🎉 Bạn đã biết hết từ vựng chủ đề này!</p>`
        }
        <button class="btn ghost" id="restartBtn" style="margin-top:10px;">↺ Học lại từ đầu</button>
      </div>
    `
    document.getElementById('restartBtn').onclick = restartPodcast
    const goReviewBtn = document.getElementById('goReviewBtn')
    if (goReviewBtn) goReviewBtn.onclick = () => { showSection('reviewSection'); renderReview() }
    return
  }

  const word = s.words[s.index]
  root.innerHTML = `
    <div class="podcast-progress">Từ ${s.index + 1} / ${s.words.length}</div>
    <div class="podcast-card">
      <div class="podcast-image">${imageHtml(word, true)}</div>
      <div class="podcast-info">
        <div class="podcast-word-row">
          <h3>${word.word}</h3>
          <button class="btn-audio" id="listenBtn" aria-label="Nghe lại">🔊</button>
        </div>
        <p class="ipa">/${word.ipa}/</p>
        <p class="meaning">Nghĩa: ${word.meaning}</p>
        <div class="examples">
          ${word.examples ? word.examples.map((ex) => `<p class="example">💬 ${ex.en}<span class="example-vi"> — ${ex.vi}</span></p>`).join('') : ''}
        </div>
      </div>
    </div>
    <div class="podcast-controls">
      <button class="btn ghost" id="prevBtn" ${s.index === 0 ? 'disabled' : ''}>⬅ Từ trước</button>
      <button class="btn danger" id="unknownBtn">✗ Chưa biết</button>
      <button class="btn known-btn" id="knownBtn">✓ Đã biết</button>
    </div>
  `

  document.getElementById('listenBtn').onclick = () => speak(word.word)
  document.getElementById('prevBtn').onclick = goPrevWord
  document.getElementById('unknownBtn').onclick = () => markWord(false)
  document.getElementById('knownBtn').onclick = () => markWord(true)
}

function markWord(known) {
  const s = podcastState
  const word = s.words[s.index]
  const key = `known_${word.word}`
  if (known) {
    localStorage.setItem(key, 'known')
    s.stats.known++
  } else {
    localStorage.removeItem(key)
    s.stats.unknown++
  }
  if (s.index + 1 >= s.words.length) s.finished = true
  else s.index++
  renderPodcast()
}

function goPrevWord() {
  if (podcastState.index > 0) {
    podcastState.index--
    renderPodcast()
  }
}

function restartPodcast() {
  podcastState.index = 0
  podcastState.stats = { known: 0, unknown: 0 }
  podcastState.finished = false
  showSection('podcastSection')
  renderPodcast()
}

// ============================================================
// BƯỚC 2 — ÔN TẬP (Hiển thị đáp án, Phát âm & Ví dụ cho cả Đúng và Sai)
// ============================================================
const reviewState = {
  words: [],
  index: 0,
  feedback: null // null | 'correct' | 'wrong'
}

function renderReview() {
  reviewState.words = TOPIC.vocabulary.filter((w) => !isKnown(w.word))
  reviewState.index = 0
  reviewState.feedback = null
  renderReviewStep()
}

function renderReviewStep() {
  const root = document.getElementById('reviewRoot')
  const s = reviewState

  if (s.words.length === 0) {
    root.innerHTML = `<p class="success">🎉 Bạn đã biết hết tất cả từ vựng của chủ đề này!</p>`
    return
  }

  if (s.index >= s.words.length) {
    root.innerHTML = `<p class="success">🎉 Chúc mừng! Bạn đã ôn xong toàn bộ từ chưa thuộc.</p>`
    return
  }

  const word = s.words[s.index]

  root.innerHTML = `
    <div class="quiz-box">
      <div class="quiz-progress">Từ ${s.index + 1} / ${s.words.length}</div>
      <div class="quiz-image">${imageHtml(word, true)}</div>

      ${
        s.feedback === null
          ? `<p class="quiz-hint">Nhìn hình và nhập từ tiếng Anh tương ứng:</p>
             <input class="input" id="answerInput" placeholder="Nhập từ vựng..." autofocus />
             <button class="btn" id="checkBtn">Kiểm tra</button>`
          : `<div class="feedback ${s.feedback}">
               ${
                 s.feedback === 'correct'
                   ? `<p class="feedback correct">✅ Đúng rồi! Đáp án: <strong>${word.word}</strong></p>`
                   : `<p class="feedback wrong">❌ Sai rồi! Đáp án đúng là: <strong>${word.word}</strong> (${word.meaning})</p>`
               }
               <div class="podcast-word-row" style="margin: 10px 0;">
                 <span class="ipa">/${word.ipa}/</span>
                 <button class="btn-audio" id="quizAudioBtn" aria-label="Phát âm">🔊</button>
               </div>
               <div class="examples">
                 ${
                   word.examples
                     ? word.examples.map((ex) => `<p class="example">💬 ${ex.en}<span class="example-vi"> — ${ex.vi}</span></p>`).join('')
                     : ''
                 }
               </div>
               <div class="quiz-buttons" style="margin-top: 15px;">
                 ${
                   s.feedback === 'correct'
                     ? `<button class="btn" id="nextBtn">⏭ Câu tiếp theo</button>`
                     : `<button class="btn" id="retryBtn">🔁 Làm lại</button>
                        <button class="btn ghost" id="skipBtn">⏭ Bỏ qua</button>`
                 }
               </div>
             </div>`
      }
    </div>
  `

  if (s.feedback === null) {
    const input = document.getElementById('answerInput')
    const checkAnswer = () => {
      const answer = input.value.trim().toLowerCase()
      s.feedback = answer === word.word.toLowerCase() ? 'correct' : 'wrong'
      renderReviewStep()
    }
    document.getElementById('checkBtn').onclick = checkAnswer
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkAnswer() })
  } else {
    const quizAudioBtn = document.getElementById('quizAudioBtn')
    if (quizAudioBtn) quizAudioBtn.onclick = () => speak(word.word)

    if (s.feedback === 'correct') {
      document.getElementById('nextBtn').onclick = () => {
        localStorage.setItem(`known_${word.word}`, 'known')
        s.feedback = null
        s.index++
        renderReviewStep()
      }
    } else {
      document.getElementById('retryBtn').onclick = () => {
        s.feedback = null
        renderReviewStep()
      }
      document.getElementById('skipBtn').onclick = () => {
        s.feedback = null
        s.index++
        renderReviewStep()
      }
    }
  }
}

// ============================================================
// KHỞI CHẠY
// ============================================================
renderPodcast()