const API_KEY = "49bd13bd";
const API_SECRET = "DliY4fiDOrvBBCDo";

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "x-api-secret": API_SECRET,
      ...(options.headers || {})
    }
  });

  return response.json();
}

async function loadCodes() {
  const tbody = document.getElementById("codeTableBody");
  const result = await apiRequest("/api/codes");

  if (!Array.isArray(result)) {
    tbody.innerHTML = `<tr><td colspan="3">${result.error || "Erreur"}</td></tr>`;
    return;
  }

  tbody.innerHTML = result
    .map(
      (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.code}</td>
          <td>${item.number}</td>
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
  const result = await fetch("/api/qr");
  const data = await result.json();

  if (data.qr) {
    image.src = data.qr;
  } else {
    image.src = "";
    image.alt = "QR non disponible";
  }
}

document.getElementById("addCodeBtn").addEventListener("click", addCode);
document.getElementById("sendBtn").addEventListener("click", sendCode);
document.getElementById("refreshQrBtn").addEventListener("click", loadQr);

loadCodes();
loadQr();
