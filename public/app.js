:root {
  --bg: #190606;
  --bg-2: #2b0707;
  --card: #340909;
  --card-2: #4a0b0b;
  --line: #ff3b3b;
  --line-strong: #ff1d1d;
  --text: #fff5f5;
  --muted: #f7b4b4;
  --button: #ff2d2d;
  --button-strong: #c80b0b;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 100%);
  color: var(--text);
}

.login-container,
.app-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: min(420px, 90vw);
  background: rgba(52, 9, 9, 0.9);
  border: 2px solid var(--line);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 0 18px rgba(255, 34, 34, 0.3);
}

.login-card h1 {
  margin-top: 0;
  color: var(--line);
  text-align: center;
}

.login-card p {
  text-align: center;
  color: var(--muted);
}

.error-message {
  color: #ffd1d1;
  margin-top: 8px;
  min-height: 20px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

.header {
  text-align: center;
  margin-bottom: 24px;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.header h1 {
  color: var(--line);
  text-shadow: 0 0 10px rgba(255, 61, 61, 0.8);
  font-size: clamp(2rem, 4vw, 3rem);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: rgba(52, 9, 9, 0.9);
  border: 2px solid var(--line);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 0 18px rgba(255, 34, 34, 0.3);
}

.card.full {
  grid-column: 1 / -1;
}

.card h2 {
  margin-top: 0;
  color: var(--line);
}

input,
button {
  width: 100%;
  border-radius: 10px;
  margin-top: 12px;
}

input {
  background: #250606;
  border: 1px solid var(--line);
  color: var(--text);
  padding: 12px 14px;
}

input::placeholder {
  color: var(--muted);
}

button {
  background: linear-gradient(135deg, var(--button), var(--button-strong));
  color: white;
  border: none;
  font-weight: bold;
  cursor: pointer;
  padding: 12px 16px;
  transition: 0.2s ease;
}

button:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}

.logout-btn {
  max-width: 170px;
}

.qr-box {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 220px;
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  margin-top: 12px;
}

.qr-box img {
  max-width: 220px;
  width: 100%;
  display: block;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

th,
td {
  text-align: left;
  border-bottom: 1px solid rgba(255, 61, 61, 0.5);
  padding: 10px 8px;
}

th {
  color: #ffd2d2;
}

@media (max-width: 600px) {
  .container {
    padding: 14px;
  }

  .header-top {
    flex-direction: column;
  }
}













