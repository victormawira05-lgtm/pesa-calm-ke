import { SmartSpectraSDK } from '@smartspectra/node-sdk/renderer';
import { breathingMetrics, cardioMetrics } from '@smartspectra/node-sdk';
import { decodeMetrics } from '@smartspectra/node-sdk/messages';

const $ = (id) => document.getElementById(id);
const startButton = $('startButton');
const stopButton = $('stopButton');
const consent = $('consent');
const statusText = $('statusText');
const pulseValue = $('pulseValue');
const breathingValue = $('breathingValue');
const hrvValue = $('hrvValue');
const video = $('cameraPreview');
const promptCard = $('pausePrompt');
const breathCard = $('breathExercise');
const breathCircle = $('breathCircle');
const breathLabel = $('breathLabel');
const breathTimer = $('breathTimer');
const demoButton = $('demoPaymentButton');
const demoMessage = $('demoMessage');

let sdk;
let latestPulse = null;
let pulseHistory = [];
let elevatedSamples = 0;
let lastPromptAt = 0;
let breathingInterval;
let breathSeconds = 30;
let stream = null;

function setStatus(message, mode = 'neutral') {
  statusText.textContent = message;
  statusText.dataset.mode = mode;
}

function latestValue(series) {
  const item = Array.isArray(series) ? series.at(-1) : undefined;
  return typeof item?.value === 'number' ? item.value : null;
}

function showMetrics(payload) {
  let metrics;
  try {
    metrics = payload?.cardio || payload?.breathing ? payload : decodeMetrics(payload);
  } catch (error) {
    console.warn('Could not decode SmartSpectra metrics:', error);
    return;
  }

  const pulse = latestValue(metrics?.cardio?.pulseRate);
  const breathing = latestValue(metrics?.breathing?.rate);
  const hrv = metrics?.cardio?.hrv?.at(-1)?.rmssd;

  if (pulse !== null && pulse > 0) {
    latestPulse = pulse;
    pulseValue.textContent = String(Math.round(pulse));
    pulseHistory.push(pulse);
    pulseHistory = pulseHistory.slice(-20);
    assessPulse(pulse);
  }
  if (breathing !== null) breathingValue.textContent = breathing.toFixed(1);
  if (typeof hrv === 'number') hrvValue.textContent = hrv.toFixed(1);
}

function assessPulse(pulse) {
  if (pulseHistory.length < 5) {
    setStatus('Finding your recent pulse baseline…', 'neutral');
    return;
  }

  const baselineSamples = pulseHistory.slice(0, Math.min(8, pulseHistory.length));
  const baseline = baselineSamples.reduce((sum, value) => sum + value, 0) / baselineSamples.length;
  const isElevated = pulse >= Math.max(90, baseline + 12);
  elevatedSamples = isElevated ? elevatedSamples + 1 : 0;

  if (elevatedSamples >= 3 && Date.now() - lastPromptAt > 60_000) {
    promptCard.hidden = false;
    lastPromptAt = Date.now();
    setStatus('Your pulse is above your recent baseline.', 'attention');
  } else if (!isElevated) {
    promptCard.hidden = true;
    setStatus('Pulse reading received. Take care of yourself.', 'good');
  }
}

async function startMeasurement() {
  if (!consent.checked) {
    setStatus('Please review and accept camera consent first.', 'attention');
    return;
  }
  startButton.disabled = true;
  setStatus('Connecting to SmartSpectra…');

  try {
    const apiKey = await window.pesaCalm.getPresageApiKey();
    if (!apiKey) {
      setStatus('Missing Presage key. Add PRESAGE_API_KEY to your local .env file, then restart.', 'attention');
      startButton.disabled = false;
      return;
    }

    sdk = new SmartSpectraSDK({
      apiKey,
      requestedMetrics: [...breathingMetrics, ...cardioMetrics],
      // The SDK's aggregate diagnostics are optional and default to enabled.
      // This app opts out to minimize data sent beyond authentication traffic.
      enableTelemetry: false,
    });
    sdk.on('streamAvailable', (mediaStream) => {
      if (mediaStream instanceof MediaStream) {
        stream = mediaStream;
        video.srcObject = mediaStream;
        video.play().catch(() => {});
      }
    });
    sdk.on('metrics', showMetrics);
    sdk.on('validationStatus', (_code, _timestampUs, hint) => {
      if (hint) setStatus(hint, 'neutral');
    });
    sdk.on('error', (code, message, retryable) => {
      console.error('SmartSpectra error:', code, message, 'retryable:', retryable);
      setStatus(message || 'SmartSpectra could not start. Check your key and connection.', 'attention');
      startButton.disabled = false;
    });

    await sdk.start();
    stopButton.disabled = false;
    setStatus('Measurement started. Keep your face in view and hold still.', 'good');
  } catch (error) {
    console.error('Could not start measurement:', error);
    setStatus(error?.message || 'Could not start measurement. Check camera permissions and API key.', 'attention');
    startButton.disabled = false;
    stopButton.disabled = true;
  }
}

async function stopMeasurement() {
  if (sdk) {
    try { await sdk.stop(); } catch (error) { console.warn('Stop warning:', error); }
    try { sdk.destroy(); } catch (error) { console.warn('Cleanup warning:', error); }
    sdk = undefined;
  }
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
  video.srcObject = null;
  pulseHistory = [];
  latestPulse = null;
  elevatedSamples = 0;
  pulseValue.textContent = '—';
  breathingValue.textContent = '—';
  hrvValue.textContent = '—';
  promptCard.hidden = true;
  startButton.disabled = false;
  stopButton.disabled = true;
  setStatus(consent.checked ? 'Measurement stopped.' : 'Camera consent withdrawn. Camera is off.');
}

function startBreathing() {
  promptCard.hidden = true;
  breathCard.hidden = false;
  breathSeconds = 30;
  breathTimer.textContent = String(breathSeconds);
  let phaseSeconds = 0;
  let inhale = true;
  breathLabel.textContent = 'Breathe in';
  breathCircle.classList.add('inhale');
  clearInterval(breathingInterval);

  breathingInterval = setInterval(() => {
    breathSeconds -= 1;
    phaseSeconds += 1;
    breathTimer.textContent = String(Math.max(0, breathSeconds));
    if (phaseSeconds >= (inhale ? 4 : 6)) {
      inhale = !inhale;
      phaseSeconds = 0;
      breathLabel.textContent = inhale ? 'Breathe in' : 'Breathe out';
      breathCircle.classList.toggle('inhale', inhale);
    }
    if (breathSeconds <= 0) {
      clearInterval(breathingInterval);
      breathCard.hidden = true;
      setStatus('Exercise complete. Notice how you feel before deciding what to do next.', 'good');
    }
  }, 1000);
}

consent.addEventListener('change', () => {
  if (!consent.checked) stopMeasurement();
  startButton.disabled = !consent.checked;
});
startButton.addEventListener('click', startMeasurement);
stopButton.addEventListener('click', stopMeasurement);
$('breathingButton').addEventListener('click', startBreathing);
$('dismissPrompt').addEventListener('click', () => { promptCard.hidden = true; });
$('stopBreathing').addEventListener('click', () => {
  clearInterval(breathingInterval);
  breathCard.hidden = true;
});
demoButton.addEventListener('click', () => {
  const pulseText = latestPulse === null ? 'No current pulse reading is available.' : `Current reading: ${Math.round(latestPulse)} bpm.`;
  demoMessage.textContent = `${pulseText} Demo only: no M-Pesa payment or transaction is connected.`;
});

window.addEventListener('beforeunload', () => {
  clearInterval(breathingInterval);
  if (sdk) {
    sdk.stop();
    sdk.destroy();
  }
  stream?.getTracks().forEach((track) => track.stop());
});

startButton.disabled = true;
setStatus('Accept camera consent to start a measurement.');
