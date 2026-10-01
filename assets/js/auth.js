// assets/js/auth.js
// ─────────────────────────────────────────────────────────
// Module xác thực — giờ gọi FastAPI backend thay vì localStorage.
// Token JWT được lưu localStorage (chỉ lưu token, không lưu mật khẩu).
// ─────────────────────────────────────────────────────────

// ── Địa chỉ API backend FastAPI ──────────────────────────
const API_BASE = 'http://127.0.0.1:8000';

// ── Key lưu JWT token trong localStorage ─────────────────
const TOKEN_KEY   = 'hoc_tu_dau_token';
const SESSION_KEY = 'hoc_tu_dau_session';   // { name, email, level }


// ═══════════════════════════════════════════════════════
// Hàm tiện ích: đọc/lưu/xóa token & session
// ═══════════════════════════════════════════════════════

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function saveSession(tokenResponse) {
  // tokenResponse = { access_token, user_name, user_email, user_level }
  localStorage.setItem(TOKEN_KEY, tokenResponse.access_token);
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    name:  tokenResponse.user_name,
    email: tokenResponse.user_email,
    level: tokenResponse.user_level,
  }));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

// Tạo header Authorization cho các request cần xác thực
function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}


// ═══════════════════════════════════════════════════════
// registerUser — gọi POST /api/auth/register
// Trả về Promise<{ ok, data? , message? }>
// ═══════════════════════════════════════════════════════
async function registerUser(name, email, password) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      saveSession(data);       // lưu token + thông tin user
      return { ok: true };
    }

    // Lỗi từ server (400 email tồn tại, 422 validation, ...)
    return { ok: false, message: data.detail || 'Đăng ký thất bại.' };

  } catch (err) {
    // Lỗi mạng — server chưa chạy
    return { ok: false, message: '⚠️ Không kết nối được server. Hãy chắc uvicorn đang chạy.' };
  }
}


// ═══════════════════════════════════════════════════════
// loginUser — gọi POST /api/auth/login
// ═══════════════════════════════════════════════════════
async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      saveSession(data);
      return { ok: true };
    }

    if (res.status === 401) {
      return { ok: false, reason: 'wrong-credentials', message: data.detail };
    }

    return { ok: false, message: data.detail || 'Đăng nhập thất bại.' };

  } catch (err) {
    return { ok: false, message: '⚠️ Không kết nối được server. Hãy chắc uvicorn đang chạy.' };
  }
}


// ═══════════════════════════════════════════════════════
// renderNavAuth — hiển thị nav (giữ nguyên API cũ, dùng session cache)
// ═══════════════════════════════════════════════════════
function renderNavAuth(rootPrefix) {
  const slot = document.getElementById('navAuthSlot');
  if (!slot) return;
  const session = getSession();

  if (session) {
    const initial = session.name ? session.name.charAt(0).toUpperCase() : '?';
    slot.innerHTML = `
      <div class="nav-user">
        <div class="avatar">${initial}</div>
        <span>${session.name}</span>
        <a href="#" class="logout-link" id="logoutLink">Đăng xuất</a>
      </div>
    `;
    document.getElementById('logoutLink').addEventListener('click', (e) => {
      e.preventDefault();
      clearSession();
      window.location.reload();
    });
  } else {
    slot.innerHTML = `
      <div class="nav-auth">
        <a href="${rootPrefix}login.html" class="btn btn-secondary">Đăng nhập</a>
        <a href="${rootPrefix}signup.html" class="btn btn-primary">Đăng ký</a>
      </div>
    `;
  }
}
