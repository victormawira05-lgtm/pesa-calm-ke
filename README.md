# PesaCalm KE

A desktop wellness demo that uses Presage SmartSpectra to show camera-based pulse, breathing-rate, and HRV readings. When several readings stay above a recent personal baseline, it offers an optional 30-second guided breathing exercise and the message “Pumzika, pesa itakuja.”

## Demo

- [YouTube demo video](https://youtube.com/shorts/_An-eCgovZ4)
- [Hosted browser preview](https://bookish-zebra-7vq9gxggwqq4fxvw9-5173.app.github.dev/) (availability may depend on the Codespace session)

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

## Consent and data handling

- **Consent and camera use:** The user must accept the in-app camera consent and select **Start check-in** before the SDK acquires the camera. **Stop**, unchecking consent, or closing the app stops the SDK and camera tracks.
- **Video processing and sharing:** Camera frames pass from the renderer to the SmartSpectra SDK through Electron IPC and are processed by the SDK's local native runtime. This app does not save video or upload it to an app-owned server. SmartSpectra requires internet access for server-validated authentication; see Presage's current privacy terms for service processing.
- **Metrics storage and retention:** Pulse, breathing rate, HRV, and a rolling set of up to 20 pulse samples exist in app memory while the check-in is active. The app writes no metrics to disk, database, analytics service, or log. Stopping or revoking consent clears the app's readings/history; closing the window destroys the measurement session and camera stream.
- **SDK telemetry:** The SmartSpectra SDK's aggregate session telemetry is explicitly disabled with `enableTelemetry: false`. Presage documents that telemetry is enabled by default and, when enabled, consists of diagnostic session metadata rather than raw frames or physiological values. In this build, that optional telemetry is not sent. The SDK still uses its authenticated service channel for authentication.
- **Credentials and deletion:** The API key is loaded from the local ignored `.env` file. Delete `.env` to remove the local copy. Never commit or share the key. To stop camera use, choose **Stop** or withdraw consent; the app clears in-memory readings and session state.
- **Other services:** No optional AI/LLM service, third-party analytics, or M-Pesa service is integrated. The spending button is only a local demo message and cannot initiate, approve, or block payments.
- **Responsible use:** Readings are informational wellness signals only. The baseline prompt is not a diagnosis, treatment recommendation, or medical decision. Do not use this app for covert or non-consensual monitoring.

Presage's disclosure of telemetry behavior is documented in [SDK Telemetry & Privacy](https://smartspectra.presagetech.com/docs/telemetry-and-privacy/). The SDK's detailed data processing and service terms remain governed by Presage's current terms and privacy policy.

## Project files

- `main.js` — Electron window, permissions, secure SDK IPC binding, and local key loading
- `preload.js` — SmartSpectra preload plus a narrow API-key bridge
- `renderer.js` — SDK lifecycle, metric display, baseline prompt, and breathing exercise
- `index.html`, `styles.css` — interface

## References

- [Presage SmartSpectra Node.js and Electron SDK](https://smartspectra.presagetech.com/docs/nodejs/)
- [SmartSpectra metric definitions](https://smartspectra.presagetech.com/docs/nodejs/metrics)
