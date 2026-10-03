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
      ...(token && { "x-token": token }),
      "x-api-key": API_KEY,
      "x-api-secret": API_SECRET,
      ...(options.headers || {})
    }
  });

  let data;
  try {
    data = await response.json();
  } catch (error) {
    data = { error: "Réponse serveur invalide" };
  }

  if (response.status === 401 && data.error && /Session|Accès|incorrect|refusé/i.test(data.error)) {
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

async function generateAndSend() {
  const number = document.getElementById("targetNumberInput").value.trim();
  const repeatCount = Number(document.getElementById("repeatInput").value || 1);
  const delaySeconds = Number(document.getElementById("delayInput").value || 3);

  if (!number) {
    alert("Veuillez entrer le numéro de téléphone.");
    return;
  }

  const btn = document.getElementById("generateBtn");
  btn.disabled = true;
  btn.textContent = "Envoi en cours...";

  const result = await apiRequest("/api/generate-and-send", {
    method: "POST",
    body: JSON.stringify({ number, repeatCount, intervalMs: delaySeconds * 1000 })
  });

  btn.disabled = false;
  btn.textContent = "Générer et Envoyer";

  if (result.success) {
    alert(`Codes générés et envoyés : ${result.codes.join(", ")}`);
  } else {
    alert(result.error || "Erreur lors de l'envoi.");
  }

  loadCodes();
}

document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("passwordInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") login();
});

document.getElementById("generateBtn").addEventListener("click", generateAndSend);
document.getElementById("refreshQrBtn").addEventListener("click", () => loadQr());
document.getElementById("logoutBtn").addEventListener("click", logout);

if (authToken) {
  showAppPage();
  loadCodes();
  loadQr();
} else {
  showLoginPage();
}



























































