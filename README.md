# PesaCalm KE 🇰🇪
### *Pumzika, pesa itakuja* - A consent-first financial wellness app

> Built with Presage SmartSpectra SDK - Camera-based pulse wellness check before financial decisions.

**Live Demo:** https://YOUR-CODESPACE-8000.app.github.dev
*(Replace with your PORTS -> 8000 globe link)*

**YouTube Demo:** [Link to your video]

---

## ✨ What it does
PesaCalm detects stress via camera pulse (SmartSpectra) and pauses risky M-Pesa / loan decisions.

- 📹 **Pulse Check:** Uses Presage SmartSpectra to get BPM from selfie camera
- 🧘 **Swahili Wellness:** If BPM > 85, shows "Pumzika, pesa itakuja 🌿"
- 💚 **Consent-First:** All processing on-device, no video uploaded

## 🛠️ Tech Stack
- **Frontend:** HTML5, Vanilla JS
- **Wellness Engine:** Presage SmartSpectra (Node SDK for desktop, Web SDK for browser)
- **Platform:** Vite + Web Camera API

## 🚀 Run Locally
```bash
# Browser version (no build errors)
python3 -m http.server 8000
# Then open PORTS -> 8000

# Or with Vite
npm install
npm run dev -- --host 0.0.0.0 --port 5173
