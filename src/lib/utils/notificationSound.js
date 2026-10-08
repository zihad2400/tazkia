// ═══════════════════════════════════════════════════════
// 🔔 Notification Sound Utility
// Web Audio API দিয়ে generate হয় — কোনো file লাগে না
// ═══════════════════════════════════════════════════════

let audioContext = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return null;
    }
  }
  return audioContext;
}

/**
 * 🕌 Soft Islamic Bell — সুন্দর, মৃদু, কোমল
 * 3-note ascending chime (soft prayer-bell style)
 */
export function playIslamicBell(volume = 0.3) {
  const ctx = getCtx();
  if (!ctx) return;

  // Resume if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') ctx.resume();

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.value = Math.max(0, Math.min(1, volume));
  masterGain.connect(ctx.destination);

  // 3 sweet notes — pentatonic (very pleasant)
  const notes = [
    { freq: 659.25, time: 0,    dur: 0.8 },  // E5
    { freq: 783.99, time: 0.18, dur: 0.8 },  // G5
    { freq: 987.77, time: 0.36, dur: 1.1 },  // B5
  ];

  notes.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    // Soft attack + long decay (bell-like)
    const t0 = now + time;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.55, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  });
}

/**
 * 📩 Single "ping" — হালকা, দ্রুত
 */
export function playPing(volume = 0.25) {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  gain.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.5, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

  osc.connect(g);
  g.connect(gain);
  osc.start(now);
  osc.stop(now + 0.45);
}

/**
 * 🕋 Adhan-inspired mellow tone — warm, spiritual
 */
export function playAdhanStyle(volume = 0.25) {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = volume;
  master.connect(ctx.destination);

  // Warm notes — Arabic maqam-inspired
  const notes = [
    { freq: 440.00, time: 0,    dur: 1.0 }, // A4
    { freq: 493.88, time: 0.22, dur: 1.0 }, // B4
    { freq: 523.25, time: 0.44, dur: 1.3 }, // C5
  ];

  notes.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = freq;

    const t0 = now + time;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.4, t0 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.1);
  });
}

/**
 * Volume + preference helper
 */
export function getSoundPrefs() {
  if (typeof window === 'undefined') {
    return { enabled: true, volume: 0.3, style: 'bell' };
  }
  try {
    const raw = localStorage.getItem('tazkia-notif-sound');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { enabled: true, volume: 0.3, style: 'bell' };
}

export function setSoundPrefs(prefs) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('tazkia-notif-sound', JSON.stringify(prefs));
  } catch (e) {}
}

/**
 * Play according to user preference
 */
export function playNotificationSound() {
  const prefs = getSoundPrefs();
  if (!prefs.enabled) return;

  if (prefs.style === 'ping') {
    playPing(prefs.volume);
  } else if (prefs.style === 'adhan') {
    playAdhanStyle(prefs.volume);
  } else {
    playIslamicBell(prefs.volume);
  }
}
