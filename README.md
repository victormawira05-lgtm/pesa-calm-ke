# PesaCalm KE

A desktop wellness demo that uses Presage SmartSpectra to show camera-based pulse, breathing-rate, and HRV readings. When several readings stay above a recent personal baseline, it offers an optional 30-second guided breathing exercise and the message “Pumzika, pesa itakuja.”

## Requirements

- Node.js 20 or newer and npm
- A webcam and a working internet connection for SmartSpectra authentication
- A Presage SmartSpectra API key for your project

## Run locally

```bash
npm install
```

Copy `.env.example` to `.env`, then put your **newly issued** SmartSpectra API key in `.env`:

```dotenv
PRESAGE_API_KEY=replace_with_your_key
```

Start the desktop app:

```bash
npm start
```

Accept the in-app camera consent and choose **Start check-in**. The app shows real SDK measurements; it does not invent values when measurement fails. Use **Stop** or uncheck consent to end measurement.

## Privacy and scope

- Camera access starts only after the user accepts consent and starts a check-in.
- Video is passed to the SmartSpectra SDK for measurement. This app does not save or upload video itself. Review Presage’s SDK and service privacy terms for their processing and telemetry practices.
- API keys belong in the local ignored `.env` file. Never commit them or paste them into source code.
- Pulse is not a diagnosis of stress or a medical condition. The baseline comparison is a simple wellness prompt, not a validated clinical assessment.
- This project does not integrate with M-Pesa. Its spending control is only a demo message; it cannot approve, block, or make payments.

## Project files

- `main.js` — Electron window, permissions, secure SDK IPC binding, and local key loading
- `preload.js` — SmartSpectra preload plus a narrow API-key bridge
- `renderer.js` — SDK lifecycle, metric display, baseline prompt, and breathing exercise
- `index.html`, `styles.css` — interface

## References

- [Presage SmartSpectra Node.js and Electron SDK](https://smartspectra.presagetech.com/docs/nodejs/)
- [SmartSpectra metric definitions](https://smartspectra.presagetech.com/docs/nodejs/metrics)
