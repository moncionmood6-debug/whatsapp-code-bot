const API_KEY = "49bd13bd";
const API_SECRET = "DliY4fiDOrvBBCDo";
let authToken = localStorage.getItem("authToken");

function setAuthToken(token) {
  authToken = token;
  localStorage.setItem("authToken", token);
}

function getAuthToken() {
  return localStorage.getItem("authToken");
}

function clearAuthToken() {
  authToken = null;
  localStorage.removeItem("authToken");
}

async function apiRequest(url, options = {}) {
  const token = getAuthToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "x-api-secret": API_SECRET,
      ...(token && { "x-token": token }),
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (response.status === 401 && data.error && data.error.includes("Session")) {
    clearAuthToken();
    showLoginPage();
  }

  return data;
}

async function login() {
  const password = document.getElementById("passwordInput").value.trim();
  const errorDiv = document.getElementById("loginError");

  if (!password) {
    errorDiv.textContent = "Veuillez entrer le mot de passe.";
    return;
  }

  const result = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  }).then((res) => res.json());

  if (result.success) {
    setAuthToken(result.token);
    showAppPage();
    loadCodes();
    loadQr();
  } else {
    errorDiv.textContent = result.error || "Erreur lors de la connexion.";
  }
}

function showLoginPage() {
  document.getElementById("loginContainer").style.display = "flex";
  document.getElementById("appContainer").style.display = "none";
}

function showAppPage() {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("appContainer").style.display = "block";
}

function logout() {
  clearAuthToken();
  document.getElementById("passwordInput").value = "";
  document.getElementById("loginError").textContent = "";
  showLoginPage();
}

async function loadCodes() {
  const tbody = document.getElementById("codeTableBody");
  const result = await apiRequest("/api/codes");

  if (!Array.isArray(result)) {
    tbody.innerHTML = `<tr><td colspan="4">${result.error || "Erreur"}</td></tr>`;
    return;
  }

  tbody.innerHTML = result
    .map(
      (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.code}</td>
          <td>${item.number}</td>
          <td>${new Date(item.created_at).toLocaleDateString("fr-FR")}</td>
        </tr>
      `
    )
    .join("");
}

async function addCode() {
  const code = document.getElementById("codeInput").value.trim();
  const number = document.getElementById("numberInput").value.trim();

  if (!code || !number) {
    alert("Veuillez remplir le code et le numéro.");
    return;
  }

  const result = await apiRequest("/api/add-code", {
    method: "POST",
    body: JSON.stringify({ code, number })
  });

  alert(result.message || result.error || "Erreur");
  document.getElementById("codeInput").value = "";
  document.getElementById("numberInput").value = "";
  loadCodes();
}

async function sendCode() {
  const code = document.getElementById("sendCodeInput").value.trim();
  const number = document.getElementById("sendNumberInput").value.trim();
  const repeatCount = document.getElementById("repeatInput").value || 1;

  if (!code || !number) {
    alert("Veuillez remplir le code et le numéro à envoyer.");
    return;
  }

  const result = await apiRequest("/api/send-code", {
    method: "POST",
    body: JSON.stringify({ code, number, repeatCount })
  });

  alert(result.message || result.error || "Erreur");
}

async function loadQr() {
  const image = document.getElementById("qrImage");
  const result = await apiRequest("/api/qr");

  if (result.qr) {
    image.src = result.qr;
  } else {
    image.src = "";
    image.alt = "QR non disponible";
  }
}

document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("passwordInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") login();
});

document.getElementById("addCodeBtn").addEventListener("click", addCode);
document.getElementById("sendBtn").addEventListener("click", sendCode);
document.getElementById("refreshQrBtn").addEventListener("click", loadQr);
document.getElementById("logoutBtn").addEventListener("click", logout);

if (authToken) {
  showAppPage();
  loadCodes();
  loadQr();
} else {
  showLoginPage();
}
