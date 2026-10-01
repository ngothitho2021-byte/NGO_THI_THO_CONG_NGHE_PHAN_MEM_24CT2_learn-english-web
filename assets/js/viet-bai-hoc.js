// viet-bai-hoc.js
// Bản HTML/JS thuần thay cho component React WritingSection.jsx
// Không dùng useState / JSX — mọi "state" được lưu trong biến JS thường
// và cập nhật lại DOM thủ công bằng document.getElementById(...).innerHTML/.value

// ==================================================================
// CẤU HÌNH API AI
// Frontend không chứa Groq API key; FastAPI backend giữ khóa bí mật.
// ==================================================================
const AI_API_BASE = 'http://127.0.0.1:8000/api/ai';

// ---- Dữ liệu chủ đề (thay cho getTopics(level) trong curriculum.jsx) ----
// Muốn thêm chủ đề mới: thêm 1 object vào đây + 1 <button data-topic="..."> trong HTML
const TOPICS = {
  food: {
    id: 'food',
    title: 'Món ăn yêu thích của bạn',
    prompt: 'Hãy viết 4-6 câu miêu tả món ăn bạn thích nhất: tên món, vị của nó, khi nào bạn ăn, vì sao bạn thích.',
  },
};

// ---- State đơn giản bằng biến toàn cục ----
let currentTopicId = 'food';
let isChecking = false; // chặn bấm nhiều lần khi đang chờ AI trả lời

// ---- Lấy tham chiếu các phần tử DOM 1 lần, dùng lại nhiều nơi ----
const el = {
  levelLabel: document.getElementById('levelLabel'),
  tabs: document.getElementById('topicTabs'),
  topicTitle: document.getElementById('topicTitle'),
  topicPrompt: document.getElementById('topicPrompt'),
  input: document.getElementById('writingInput'),
  checkBtn: document.getElementById('checkBtn'),
  saveBtn: document.getElementById('saveBtn'),
  result: document.getElementById('writingResult'),
  resultSummary: document.getElementById('resultSummary'),
  resultIssues: document.getElementById('resultIssues'),
  resultCorrected: document.getElementById('resultCorrected'),
};

// ---- Khởi tạo trang khi vừa tải ----
function init() {
  const savedLevel = localStorage.getItem('hoc_tu_dau_level') || 'A1';
  el.levelLabel.textContent = savedLevel;

  // Gắn sự kiện click cho từng tab chủ đề
  el.tabs.querySelectorAll('.topic-tab').forEach((btn) => {
    btn.addEventListener('click', () => selectTopic(btn.dataset.topic, btn));
  });

  selectTopic(currentTopicId, el.tabs.querySelector('.topic-tab.active'));

  el.checkBtn.addEventListener('click', checkWriting);
  el.saveBtn.addEventListener('click', saveWriting);
}

// ---- Chuyển chủ đề: cập nhật active tab + load lại nội dung đã lưu ----
function selectTopic(topicId, btnEl) {
  currentTopicId = topicId;
  const topic = TOPICS[topicId];

  el.tabs.querySelectorAll('.topic-tab').forEach((b) => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  el.topicTitle.textContent = 'Chủ đề: ' + topic.title;
  el.topicPrompt.textContent = topic.prompt;

  // Khôi phục bài viết đã lưu trước đó cho chủ đề này (nếu có)
  el.input.value = localStorage.getItem(`writing_${topicId}`) || '';

  // Ẩn kết quả kiểm tra cũ khi đổi chủ đề
  el.result.style.display = 'none';
}

// ---- Lưu bài viết vào localStorage ----
function saveWriting() {
  localStorage.setItem(`writing_${currentTopicId}`, el.input.value);
  alert('Đã lưu bài viết của bạn!');
}

// ==================================================================
// KIỂM TRA BẰNG AI (Groq) — chấm: có đúng chủ đề không, lỗi ngữ pháp
// ở đâu, sửa thành gì, vì sao sai
// ==================================================================
async function checkWriting() {
  const text = el.input.value;
  if (!text.trim()) {
    alert('Hãy viết một ít nội dung trước khi kiểm tra.');
    return;
  }

  if (isChecking) return; // đang chờ AI, không cho bấm tiếp
  setCheckingState(true);

  try {
    const aiResult = await callGroqForFeedback(text, TOPICS[currentTopicId]);
    renderAiResult(aiResult);
  } catch (err) {
    console.error('Lỗi gọi Groq API:', err);
    el.result.style.display = 'block';
    el.resultSummary.innerHTML = `<p class="feedback wrong">⚠️ Không gọi được AI để chấm bài (${escapeHtml(err.message || 'lỗi không rõ')}). Vui lòng kiểm tra API key / kết nối mạng rồi thử lại.</p>`;
    el.resultIssues.innerHTML = '';
    el.resultCorrected.textContent = '';
  } finally {
    setCheckingState(false);
  }
}

// ---- Bật/tắt trạng thái "đang chấm bài" trên nút bấm ----
function setCheckingState(checking) {
  isChecking = checking;
  el.checkBtn.disabled = checking;
  el.checkBtn.textContent = checking ? '⏳ Đang chấm bài bằng AI...' : '✅ Kiểm tra & sửa lỗi';
}

// ---- Gọi Groq Chat Completions API, yêu cầu trả về JSON có cấu trúc ----
async function callGroqForFeedback(text, topic) {
  const response = await fetch(`${AI_API_BASE}/writing/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      topic_title: topic.title,
      topic_prompt: topic.prompt,
    }),
  });

  if (!response.ok) {
    let message = `FastAPI trả lỗi HTTP ${response.status}`;
    try {
      const err = await response.json();
      if (err && err.detail) message = err.detail;
    } catch (_) {}
    throw new Error(message);
  }

  const data = await response.json();
  return {
    onTopic: !!data.onTopic,
    topicFeedback: data.topicFeedback || '',
    score: Number.isFinite(data.score) ? Math.max(0, Math.min(100, data.score)) : null,
    issues: Array.isArray(data.issues) ? data.issues : [],
    corrected: data.corrected || '',
    overallFeedback: data.overallFeedback || '',
  };
}

// ---- Parse JSON từ AI, phòng trường hợp model lỡ bọc thêm ```json ----
function parseAiJson(raw) {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '');

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error('Không đọc được kết quả JSON từ AI.');
  }

  // Chuẩn hoá để renderAiResult luôn nhận đủ field, tránh lỗi undefined
  return {
    onTopic: !!parsed.onTopic,
    topicFeedback: parsed.topicFeedback || '',
    score: Number.isFinite(parsed.score) ? Math.max(0, Math.min(100, parsed.score)) : null,
    issues: Array.isArray(parsed.issues) ? parsed.issues : [],
    corrected: parsed.corrected || '',
    overallFeedback: parsed.overallFeedback || '',
  };
}

// ---- Vẽ kết quả chấm điểm của AI ra DOM ----
function renderAiResult(result) {
  el.result.style.display = 'block';

  const topicClass = result.onTopic ? 'correct' : 'wrong';
  const topicIcon = result.onTopic ? '✅' : '⚠️';
  const scoreText = result.score !== null ? ` · Điểm: ${result.score}/100` : '';

  el.resultSummary.innerHTML = `
    <p class="feedback ${topicClass}">${topicIcon} ${escapeHtml(result.topicFeedback || (result.onTopic ? 'Bài viết bám sát chủ đề.' : 'Bài viết chưa bám sát chủ đề.'))}${scoreText}</p>
    ${result.overallFeedback ? `<p>${escapeHtml(result.overallFeedback)}</p>` : ''}
  `;

  el.resultIssues.innerHTML = '';

  if (result.issues.length === 0) {
    el.resultIssues.innerHTML = '<p class="feedback correct">✅ Không tìm thấy lỗi ngữ pháp nào đáng kể!</p>';
  } else {
    result.issues.forEach((it) => {
      const div = document.createElement('div');
      div.className = 'issue';
      div.innerHTML = `
        <p class="feedback wrong">⚠️ ${escapeHtml(it.errorType || 'Lỗi')}</p>
        <p class="original-line">Gốc: ${escapeHtml(it.original || '')}</p>
        <p class="fixed-line" style="color: green;">Sửa: ${escapeHtml(it.correction || '')}</p>
        ${it.explanation ? `<p class="explanation" style="font-style: italic;">${escapeHtml(it.explanation)}</p>` : ''}
      `;
      el.resultIssues.appendChild(div);
    });
  }

  el.resultCorrected.textContent = result.corrected;
}

// ---- Tránh lỗi XSS khi nhét text người dùng gõ / AI trả về vào innerHTML ----
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

init();