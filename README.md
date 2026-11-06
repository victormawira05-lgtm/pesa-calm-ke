# PesaCalm KE - Presage Challenge

**Kenya M-Pesa Stress Guard using SmartSpectra vitals**

PesaCalm detects stress via camera (pulse + HRV) and blocks impulsive M-Pesa transactions when stressed. Prevents debt spiral for Kenyan youth.

### Live Demo
`npm install` then `npm start` -> allow camera -> see LIVE pulse.

### Presage SDK Integration
Uses SmartSpectra Desktop SDK:
- `smartspectra.getPulse()` -> live pulse
- `smartspectra.getHRV()` -> stress metric
- Video stream processed locally, only metrics sent

### Consent & Data Handling (Required)
- User must check consent checkbox before measurement starts
- Camera video NEVER leaves device, processed in-browser/Electron
- No video storage, only pulse/HRV numbers stored locally
- User can revoke consent anytime via checkbox
- Complies with Kenya Data Protection Act

### Tech Stack
Electron + Presage SmartSpectra + M-Pesa logic

### Author
Victor - Nairobi, KE - for Presage DEV Challenge
