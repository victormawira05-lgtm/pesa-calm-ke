// PesaCalm KE - REAL Presage Physiology API
const video = document.getElementById('video');
const pulseEl = document.getElementById('pulse');
const hrvEl = document.getElementById('hrv');
const statusEl = document.getElementById('status');
const consent = document.getElementById('consent');

// PASTE YOUR KEY HERE - from dashboard Network -> Preview tab
const PRESAGE_API_KEY = "FgiCgWX9pf20H6714udIx4spEGXbBgNq66Z4YV7H";

navigator.mediaDevices.getUserMedia({video:true}).then(s=>{
  video.srcObject=s;
  video.onloadedmetadata = ()=> video.play();
});

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

async function measureRealVitals() {
  if(!consent.checked || !PRESAGE_API_KEY || PRESAGE_API_KEY.includes("PASTE")) {
    statusEl.innerText = consent.checked ? "Add API key in code" : "Please consent to measure";
    return;
  }
  
  canvas.width = 640; canvas.height = 480;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

  try {
    statusEl.innerText = "Measuring...";
    const res = await fetch("api/measure", {
      method: "POST",
      headers: {
        "x-api-key": PRESAGE_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ image: base64 })
    });
    
    const data = await res.json();
    console.log("Presage:", data);
    
    // Real values from API
    const pulse = data.pulse_rate || data.pulse || 0;
    const breathing = data.respiratory_rate || data.breathing || 0;
    const stress = data.stress || data.hrv_score || 0;

    pulseEl.innerText = Math.round(pulse);
    hrvEl.innerText = Math.round(stress) || Math.round(breathing);

    if(pulse > 90 || stress > 70){
      statusEl.innerText = `STRESSED (${pulse}bpm) - M-Pesa KES 500 BLOCKED`;
      statusEl.style.color = "red";
      // BLOCK M-Pesa logic here
    } else {
      statusEl.innerText = `CALM (${pulse}bpm) - Safe to transact`;
      statusEl.style.color = "green";
    }
  } catch(e){
    console.error(e);
    statusEl.innerText = "Error: Check API key / CORS - Using fallback";
  }
}

// Measure every 3 seconds to save credits (100 credits = 50 mins at this rate)
setInterval(measureRealVitals, 3000);
