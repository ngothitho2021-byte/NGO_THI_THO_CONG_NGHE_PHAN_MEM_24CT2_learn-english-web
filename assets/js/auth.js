
const AUTH_USERS_KEY = 'hoc_tu_dau_users';       // danh sách tài khoản đã đăng ký
const AUTH_SESSION_KEY = 'hoc_tu_dau_session';   // ai đang đăng nhập

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USERS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY));
  } catch (e) {
    return null;
  }
}

function setSession(user) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
}

function clearSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

// Đăng ký tài khoản mới. Trả về { ok: true } hoặc { ok: false, message }
function registerUser(name, email, password) {
  const users = getUsers();
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { ok: false, message: 'Email này đã có tài khoản. Hãy đăng nhập thay vì đăng ký.' };
  }
  users.push({ name, email, password });
  saveUsers(users);
  setSession({ name, email });
  return { ok: true };
}

// Đăng nhập. Trả về { ok: true } hoặc { ok: false, reason: 'no-account' | 'wrong-password' }
function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return { ok: false, reason: 'no-account' };
  }
  if (user.password !== password) {
    return { ok: false, reason: 'wrong-password' };
  }
  setSession(user);
  return { ok: true };
}

// Gắn phần "Đăng nhập / Đăng ký" hoặc "Xin chào, Tên" vào khu vực có id="navAuthSlot"
// Gọi hàm này ở MỌI trang có header dùng chung.
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
