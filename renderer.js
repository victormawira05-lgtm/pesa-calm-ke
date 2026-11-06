// Presage SmartSpectra integration - PesaCalm KE
const video = document.getElementById('video');
const pulseEl = document.getElementById('pulse');
const hrvEl = document.getElementById('hrv');
const statusEl = document.getElementById('status');
const consent = document.getElementById('consent');

navigator.mediaDevices.getUserMedia({video:true}).then(s=>video.srcObject=s);

// TODO: Replace with real Presage SDK call after getting key from presage.io/developers
// Example: const metrics = await smartspectra.measure(video);
// For demo we simulate but in submission video show REAL SDK values
let pulse = 75, hrv = 45;
setInterval(()=>{
  if(!consent.checked){ statusEl.innerText="Please consent to measure"; return; }
  pulse += (Math.random()-0.5)*2; hrv += (Math.random()-0.5);
  pulseEl.innerText = pulse.toFixed(0);
  hrvEl.innerText = hrv.toFixed(0);
  if(pulse>90 || hrv<30){ statusEl.innerText="STRESSED - M-Pesa KES 500 BLOCKED"; statusEl.style.color="red"; }
  else { statusEl.innerText="CALM - Safe to transact"; statusEl.style.color="green"; }
},1000);
