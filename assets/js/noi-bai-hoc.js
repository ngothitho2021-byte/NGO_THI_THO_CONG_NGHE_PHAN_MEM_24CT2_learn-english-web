// ============================================================
// CẤU HÌNH API AI
// Frontend KHÔNG chứa API key. Mọi yêu cầu AI được gửi tới FastAPI.
// ============================================================
const AI_API_BASE = "http://127.0.0.1:8000/api/ai"

// ============================================================
// KỊCH BẢN HỘI THOẠI NHIỀU BƯỚC (MULTI-TURN DIALOGUE)
// ============================================================
const CONVERSATIONS = {
  A1: {
    title: 'Gọi món tại nhà hàng',
    partner: 'Bồi bàn (AI)',
    steps: [
      {
        stepId: 1,
        aiLine: 'Hello! What would you like to order today?',
        hints: ['I would like a pizza, please.', 'Can I have a coffee, please.']
      },
      {
        stepId: 2,
        aiLine: 'Great choice! What size would you like?',
        hints: ['Medium size, please.', 'A large size, please.']
      },
      {
        stepId: 3,
        aiLine: 'Would you like anything to drink?',
        hints: ['Can I have a glass of water?', 'A coke, please.']
      },
      {
        stepId: 4,
        aiLine: 'Got it! Your order will be ready soon. Is there anything else?',
        hints: ['No, that is all. Thank you!', 'That is all, thanks.']
      }
    ]
  }
}

let currentLevel = 'A1'
let currentStepIndex = 0
let showHintsState = false
let feedbackState = null

// Khởi tạo Voice Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
let recognition = null
let isListening = false

if (SpeechRecognition) {
  recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.continuous = false
  recognition.interimResults = false
}

function speakLine(text) {
  if (!text) return
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'en-US'
  utter.rate = 0.9
  window.speechSynthesis.speak(utter)
}

// Escape để nhét text (đặc biệt là text do AI trả về) vào innerHTML một cách an toàn,
// tránh vỡ layout hoặc lộ lỗ hổng XSS nếu chuỗi chứa <, >, ", ...
function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str == null ? '' : String(str)
  return div.innerHTML
}

// ============================================================
// PHÂN TÍCH CÂU TRẢ LỜI BẰNG GROQ AI API (OpenAI-compatible)
// Tách rõ 2 bước đánh giá:
//   1) isRelevant        -> câu trả lời có đúng/phù hợp với nội dung câu hỏi không
//   2) isGrammarCorrect  -> nếu phù hợp nội dung rồi thì ngữ pháp có đúng không
// Luồng xử lý ở renderFeedback() sẽ dựa vào 2 cờ này để quyết định:
//   - Sai nội dung -> báo lỗi lạc đề, chưa cho qua
//   - Đúng nội dung nhưng sai ngữ pháp -> đưa câu sửa, chưa cho qua
//   - Đúng cả hai -> cho chuyển sang câu hỏi tiếp theo
// ============================================================
async function checkSentenceWithAI(userText, aiQuestion) {
  try {
    const response = await fetch(`${AI_API_BASE}/speaking/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_text: userText,
        question: aiQuestion
      })
    })

    if (!response.ok) {
      let message = `FastAPI trả lỗi HTTP ${response.status}`
      try {
        const err = await response.json()
        if (err && err.detail) message = err.detail
      } catch (_) {}
      throw new Error(message)
    }

    const data = await response.json()
    return {
      isRelevant: Boolean(data.isRelevant),
      isGrammarCorrect: Boolean(data.isGrammarCorrect),
      correctedSentence: String(data.correctedSentence || userText),
      explanation: String(data.explanation || '')
    }
  } catch (error) {
    console.error("Lỗi kiểm tra AI:", error)
    return {
      error: true,
      correctedSentence: userText,
      explanation: `Không kiểm tra được câu trả lời (${error.message}). Hãy kiểm tra backend FastAPI và file backend/.env.`
    }
  }
}

// ============================================================
// GIAO DIỆN HỘI THOẠI
// ============================================================
function initSpeakingSection() {
  currentStepIndex = 0
  feedbackState = null
  renderSpeakingPractice()
}

function renderSpeakingPractice() {
  const root = document.getElementById('speakingPracticeRoot')
  if (!root) return

  const conversationData = CONVERSATIONS[currentLevel] || CONVERSATIONS['A1']
  const totalSteps = conversationData.steps.length

  if (currentStepIndex >= totalSteps) {
    root.innerHTML = `
      <div style="background: #fff; padding: 32px; border-radius: 12px; border: 1px solid #e5e7eb; text-align: center;">
        <h2 style="color: #16a34a;">🎉 Hoàn thành bài hội thoại!</h2>
        <p style="font-size: 16px; color: #4b5563; margin-bottom: 20px;">Bạn đã hoàn tất cuộc đối thoại với ${escapeHtml(conversationData.partner)}.</p>
        <button class="btn" id="restartBtn" style="background-color: #2563eb; color: white;">🔄 Luyện tập lại từ đầu</button>
      </div>
    `
    const restartBtn = document.getElementById('restartBtn')
    if (restartBtn) restartBtn.addEventListener('click', restartConversation)
    return
  }

  const currentStep = conversationData.steps[currentStepIndex]

  root.innerHTML = `
    <div class="speaking-box" style="background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 style="margin: 0;">${escapeHtml(conversationData.title)}</h3>
        <span style="font-size: 14px; font-weight: 600; background: #e0e7ff; color: #3730a3; padding: 4px 12px; border-radius: 12px;">
          Bước ${currentStepIndex + 1} / ${totalSteps}
        </span>
      </div>

      <p class="partner-info" style="margin-bottom: 16px; color: #4b5563;">
        Bạn đang nói chuyện cùng <strong>${escapeHtml(conversationData.partner)}</strong>.
      </p>

      <div class="ai-block" style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
        <div class="ai-avatar" style="font-size: 24px;">🤖</div>
        <div class="ai-message" style="flex: 1; font-weight: 500; font-size: 16px;">${escapeHtml(currentStep.aiLine)}</div>
        <button class="btn small ghost" id="speakAiBtn" type="button">🔊 Nghe đối phương</button>
      </div>

      <button class="btn ghost" id="toggleHintsBtn" type="button" style="margin-bottom: 12px;">
        💡 ${showHintsState ? 'Ẩn' : 'Hiện'} gợi ý câu trả lời
      </button>

      <ul class="hints" id="hintsList" style="display: ${showHintsState ? 'block' : 'none'}; margin-bottom: 16px; padding-left: 20px;">
        ${currentStep.hints
          .map(
            (h, i) => `
          <li style="margin-bottom: 6px;">
            💡 ${escapeHtml(h)}
            <button class="btn tiny ghost hint-play-btn" type="button" data-hint-index="${i}">🔊 Nghe mẫu</button>
          </li>
        `
          )
          .join('')}
      </ul>

      <div style="position: relative; margin-bottom: 16px;">
        <textarea
          id="userLineInput"
          class="textarea"
          style="width: 100%; min-height: 90px; padding: 12px; border-radius: 8px; border: 1px solid #d1d5db; font-family: inherit; box-sizing: border-box;"
          placeholder="Bấm nút Micro để nói, hoặc tự gõ câu trả lời của bạn..."
        ></textarea>

        <div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
          <button class="btn" id="micBtn" type="button" style="background-color: #ef4444; color: white;">
            🎙️ <span id="micBtnText">Bấm để nói</span>
          </button>
          <button class="btn ghost" id="userAudioBtn" type="button" style="display: none;">🔊 Nghe lại câu bạn vừa nhập</button>
        </div>
        <div id="micStatusMsg" style="margin-top: 8px; font-size: 14px; display: none;"></div>
      </div>

      <div class="speaking-controls" style="display: flex; gap: 12px; align-items: center; margin-top: 12px;">
        <button class="btn" id="checkBtn" type="button" style="background-color: #2563eb; color: white;">✅ AI Kiểm tra câu trả lời</button>
      </div>

      <div id="feedbackContainer" style="margin-top: 20px;"></div>
    </div>
  `

  const speakAiBtn = document.getElementById('speakAiBtn')
  speakAiBtn.addEventListener('click', () => speakLine(currentStep.aiLine))

  document.getElementById('toggleHintsBtn').addEventListener('click', () => {
    showHintsState = !showHintsState
    renderSpeakingPractice()
  })

  // Gắn sự kiện cho từng nút "Nghe mẫu" bằng closure thay vì nhét text vào onclick="",
  // tránh lỗi vỡ HTML khi gợi ý chứa dấu nháy đơn/kép.
  document.querySelectorAll('.hint-play-btn').forEach((btn) => {
    const index = Number(btn.dataset.hintIndex)
    btn.addEventListener('click', () => speakLine(currentStep.hints[index]))
  })

  const textarea = document.getElementById('userLineInput')
  const userAudioBtn = document.getElementById('userAudioBtn')
  const micBtn = document.getElementById('micBtn')
  const micBtnText = document.getElementById('micBtnText')
  const micStatusMsg = document.getElementById('micStatusMsg')

  textarea.oninput = () => {
    userAudioBtn.style.display = textarea.value.trim() ? 'inline-block' : 'none'
  }

  userAudioBtn.addEventListener('click', () => speakLine(textarea.value))

  if (micBtn && recognition) {
    micBtn.addEventListener('click', () => {
      if (!isListening) {
        try {
          recognition.start()
          isListening = true
          micBtnText.innerText = '🔴 Đang nghe...'
          micBtn.style.backgroundColor = '#dc2626'
        } catch (e) {
          console.error(e)
        }
      } else {
        recognition.stop()
        isListening = false
        micBtnText.innerText = 'Bấm để nói'
        micBtn.style.backgroundColor = '#ef4444'
      }
    })

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      textarea.value = transcript
      userAudioBtn.style.display = 'inline-block'
    }

    recognition.onerror = (event) => {
      isListening = false
      micBtnText.innerText = 'Bấm để nói'
      micBtn.style.backgroundColor = '#ef4444'
      micStatusMsg.style.display = 'block'
      micStatusMsg.style.color = '#dc2626'
      micStatusMsg.textContent =
        event.error === 'not-allowed'
          ? '⚠️ Trình duyệt chưa được cấp quyền dùng micro.'
          : `⚠️ Lỗi nhận diện giọng nói: ${event.error}`
    }

    recognition.onend = () => {
      isListening = false
      micBtnText.innerText = 'Bấm để nói'
      micBtn.style.backgroundColor = '#ef4444'
    }
  } else if (micBtn) {
    // Trình duyệt không hỗ trợ Speech Recognition (vd Firefox) -> báo rõ thay vì im lặng
    micBtn.disabled = true
    micBtn.style.opacity = '0.5'
    micBtn.style.cursor = 'not-allowed'
    micBtnText.innerText = 'Trình duyệt không hỗ trợ ghi âm'
    micStatusMsg.style.display = 'block'
    micStatusMsg.style.color = '#6b7280'
    micStatusMsg.textContent = 'Bạn vẫn có thể gõ câu trả lời trực tiếp vào ô bên trên.'
  }

  const checkBtn = document.getElementById('checkBtn')
  checkBtn.addEventListener('click', async () => {
    const text = textarea.value.trim()
    if (!text) {
      alert('Vui lòng nói hoặc gõ câu trước khi kiểm tra!')
      return
    }

    checkBtn.disabled = true
    checkBtn.innerText = '⏳ AI đang phân tích...'

    feedbackState = await checkSentenceWithAI(text, currentStep.aiLine)

    checkBtn.disabled = false
    checkBtn.innerText = '✅ AI Kiểm tra câu trả lời'

    renderFeedback()
  })
}

// Hiển thị kết quả do AI chấm theo 2 bước: nội dung -> ngữ pháp
function renderFeedback() {
  const container = document.getElementById('feedbackContainer')
  if (!container || !feedbackState) return


  if (feedbackState.error) {
    container.innerHTML = `
      <div style="background:#fef2f2; border-left:4px solid #dc2626; padding:14px 16px; border-radius:8px; font-size:14px; color:#991b1b;">
        ⚠️ ${escapeHtml(feedbackState.explanation)}
      </div>
    `
    return
  }

  const { isRelevant, isGrammarCorrect, correctedSentence, explanation } = feedbackState
  const canProceed = isRelevant && isGrammarCorrect

  let statusColor = '#dc2626'
  let headline = '❌ Câu trả lời chưa đúng trọng tâm câu hỏi.'

  if (!isRelevant) {
    statusColor = '#dc2626'
    headline = '❌ Câu trả lời chưa đúng trọng tâm câu hỏi.'
  } else if (!isGrammarCorrect) {
    statusColor = '#f59e0b'
    headline = '✏️ Đúng nội dung, nhưng ngữ pháp cần chỉnh lại.'
  } else {
    statusColor = '#16a34a'
    headline = '✅ Chính xác cả nội dung lẫn ngữ pháp!'
  }

  container.innerHTML = `
    <div class="speaking-feedback" style="background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid ${statusColor};">
      <h4 style="margin: 0 0 8px 0; color: ${statusColor};">${headline}</h4>

      <p style="margin: 8px 0; font-size: 16px;">
        💬 Câu gợi ý hoàn chỉnh: <strong style="color: #1e40af;">"${escapeHtml(correctedSentence)}"</strong>
        <button class="btn tiny ghost" id="correctedPlayBtn" type="button">🔊 Nghe</button>
      </p>

      ${explanation ? `<p style="color: #4b5563; margin: 8px 0; font-size: 14px; background: #edf2f7; padding: 8px 12px; border-radius: 6px;">💡 <strong>AI nhận xét:</strong> ${escapeHtml(explanation)}</p>` : ''}

      <div style="margin-top: 16px;">
        ${
          canProceed
            ? `
          <button class="btn" id="nextStepBtn" type="button" style="background-color: #16a34a; color: white;">
            ➡️ Chuyển sang câu thoại tiếp theo
          </button>
        `
            : `
          <p style="font-size: 14px; color: #6b7280; margin: 0;">
            👉 Hãy sửa lại câu trả lời theo gợi ý ở trên rồi bấm kiểm tra lại nhé.
          </p>
        `
        }
      </div>
    </div>
  `

  const correctedPlayBtn = document.getElementById('correctedPlayBtn')
  if (correctedPlayBtn) {
    correctedPlayBtn.addEventListener('click', () => speakLine(correctedSentence))
  }

  const nextBtn = document.getElementById('nextStepBtn')
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentStepIndex++
      showHintsState = false
      feedbackState = null
      renderSpeakingPractice()
    })
  }
}

function restartConversation() {
  currentStepIndex = 0
  showHintsState = false
  feedbackState = null
  renderSpeakingPractice()
}

document.addEventListener('DOMContentLoaded', () => {
  initSpeakingSection()
})