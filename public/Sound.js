/* Procedural sound effects for Family Trivia — Web Audio API, no files, no API.
   Synthesizes short, friendly tones at runtime. Exposes window.FTSound.

   API:
     FTSound.correct()   -> party-popper / confetti-cannon pops + crackle + sparkle
     FTSound.wrong()     -> gentle, non-punishing two-note "boop" (kind, not a buzzer)
     FTSound.tap()       -> tiny UI tick for button presses (optional)
     FTSound.setMuted(b) / FTSound.toggleMuted() / FTSound.isMuted()

   Mute preference persists in localStorage ('ft_muted').
   AudioContext is created lazily on first sound (must follow a user gesture,
   which answering a question always is). */
(function () {
  if (window.FTSound) return;

  let ctx = null;
  let master = null;
  let muted = false;
  try { muted = localStorage.getItem('ft_muted') === '1'; } catch (e) {}

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.85;
      // a compressor glues the chorus together and gives it "shout" loudness
      // (without it, 7 stacked voices clip into harshness)
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -16;
      comp.knee.value = 22;
      comp.ratio.value = 3.5;
      comp.attack.value = 0.003;
      comp.release.value = 0.25;
      master.connect(comp);
      comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    return ctx;
  }

  // one shaped oscillator note
  function note(freq, start, dur, opts) {
    opts = opts || {};
    const type = opts.type || 'sine';
    const peak = opts.gain == null ? 0.22 : opts.gain;
    const t0 = ctx.currentTime + start;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.glide) osc.frequency.exponentialRampToValueAtTime(opts.glide, t0 + dur);

    const attack = opts.attack == null ? 0.008 : opts.attack;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(g);
    if (opts.detune) osc.detune.value = opts.detune;
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  // short filtered-noise burst (sparkle / shimmer top end)
  function sparkle(start, dur) {
    const t0 = ctx.currentTime + start;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const env = 1 - i / len;
      data[i] = (Math.random() * 2 - 1) * env * env;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(5200, t0);
    bp.frequency.exponentialRampToValueAtTime(9000, t0 + dur);
    bp.Q.value = 0.8;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.16, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(t0); src.stop(t0 + dur + 0.02);
  }

  // ONE child's "Yey!" shout, humanized so a stack of them reads as a real crowd.
  // Key anti-"creepy" choices vs. a plain formant tone:
  //   - no smooth sinusoidal vibrato (that's what made it sound like a theremin/ghost);
  //     instead a tiny irregular flutter, and pitch variety comes from many voices
  //   - lower formant Q (less whistly/resonant => more "shouting kid", less "alien")
  //   - a real /j/->/e/->I/ articulation ("y-e-y") in the first ~140ms
  //   - per-voice pitch jitter, onset jitter and stereo pan => a scattered crowd
  function shoutYey(start, f0, gain, pan) {
    const t0 = ctx.currentTime + start;
    const dur = 1.12;
    const jit = 1 + (Math.random() * 0.05 - 0.025);

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    // two-syllable "yea-HAY" contour: a sustained first syllable, a dip (the breath),
    // then a lifted, longer second syllable that eases down
    osc.frequency.setValueAtTime(f0 * 0.90 * jit, t0);
    osc.frequency.linearRampToValueAtTime(f0 * 1.04 * jit, t0 + 0.16);  // "yea"
    osc.frequency.linearRampToValueAtTime(f0 * 0.98 * jit, t0 + 0.46);
    osc.frequency.linearRampToValueAtTime(f0 * 1.12 * jit, t0 + 0.66);  // "HAY" lift
    osc.frequency.linearRampToValueAtTime(f0 * 0.98 * jit, t0 + 0.95);
    osc.frequency.linearRampToValueAtTime(f0 * 0.90 * jit, t0 + dur);

    // small irregular flutter (human, not operatic vibrato)
    const flut = ctx.createOscillator();
    const flutGain = ctx.createGain();
    flut.type = 'triangle';
    flut.frequency.value = 11 + Math.random() * 5;
    flutGain.gain.value = f0 * 0.012;
    flut.connect(flutGain); flutGain.connect(osc.frequency);

    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.04);          // "yea" attack
    amp.gain.setValueAtTime(gain, t0 + 0.40);
    amp.gain.exponentialRampToValueAtTime(gain * 0.30, t0 + 0.56);   // dip = breath between syllables
    amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.68);          // "HAY" swells back
    amp.gain.setValueAtTime(gain, t0 + 0.92);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    // output through a stereo pan so the crowd spreads across the field
    let out = amp;
    if (ctx.createStereoPanner) {
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      amp.connect(p); p.connect(master);
    } else {
      amp.connect(master);
    }

    // formant articulation of "yey": [F1, F2, F3] gliding /j/ -> /e/ -> /ɪ/
    // time points (sec from t0) and target Hz; Q kept moderate to avoid whistle
    // articulate twice: "yea" (j->e) ... breath ... "hay" (h->e->i)
    const formants = [
      { g: 1.0,  Q: 6, pts: [[320, 0], [620, 0.12], [500, 0.46], [630, 0.68], [440, 0.98]] },   // F1
      { g: 0.62, Q: 7, pts: [[2350, 0], [1800, 0.12], [2050, 0.46], [1820, 0.68], [2450, 0.98]] }, // F2
      { g: 0.28, Q: 8, pts: [[2950, 0], [2750, 0.12], [2850, 0.46], [2750, 0.68], [3050, 0.98]] }, // F3
    ];
    formants.forEach(function (f) {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = f.Q;
      bp.frequency.setValueAtTime(f.pts[0][0], t0);
      for (let i = 1; i < f.pts.length; i++) {
        bp.frequency.linearRampToValueAtTime(f.pts[i][0], t0 + f.pts[i][1]);
      }
      const fg = ctx.createGain();
      fg.gain.value = f.g;
      osc.connect(bp); bp.connect(fg); fg.connect(amp);
    });

    osc.start(t0); osc.stop(t0 + dur + 0.05);
    flut.start(t0); flut.stop(t0 + dur + 0.05);
  }

  // a short breathy "sh" of crowd energy at the very front of the shout
  function crowdBreath(start, dur) {
    const t0 = ctx.currentTime + start;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const env = Math.sin((i / len) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1600;
    bp.Q.value = 0.6;
    const g = ctx.createGain();
    g.gain.value = 0.06;
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(t0); src.stop(t0 + dur + 0.02);
  }

  // ---- Confetti / party-popper sounds (percussive, no voices) ----

  // a single "champagne cork / confetti cannon" pop: a fast pitch-dropping
  // body (the THWUP) plus a click transient at the front.
  function pop(start, opts) {
    opts = opts || {};
    const t0 = ctx.currentTime + start;
    const gain = opts.gain == null ? 0.5 : opts.gain;
    const f = opts.freq == null ? 320 : opts.freq;
    const pan = opts.pan == null ? 0 : opts.pan;

    let dest = master;
    if (ctx.createStereoPanner) {
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      p.connect(master);
      dest = p;
    }

    // pitched body — drops fast, like air rushing out
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f * 2.4, t0);
    osc.frequency.exponentialRampToValueAtTime(f * 0.6, t0 + 0.07);
    const bg = ctx.createGain();
    bg.gain.setValueAtTime(0.0001, t0);
    bg.gain.exponentialRampToValueAtTime(gain, t0 + 0.004);
    bg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.10);
    osc.connect(bg); bg.connect(dest);
    osc.start(t0); osc.stop(t0 + 0.13);

    // click transient — a 6ms noise spike for the "p" attack
    const len = Math.floor(ctx.sampleRate * 0.012);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 1200;
    const cg = ctx.createGain();
    cg.gain.value = gain * 0.9;
    src.connect(hp); hp.connect(cg); cg.connect(dest);
    src.start(t0); src.stop(t0 + 0.02);
  }

  // dry paper "crackle" — a cluster of tiny snaps, like streamers/confetti
  // raining and little firecracker pops scattered in time.
  function crackle(start, dur, density, gain) {
    const t0 = ctx.currentTime + start;
    const n = Math.floor(dur * density);
    for (let i = 0; i < n; i++) {
      const at = start + Math.random() * dur;
      const len = Math.floor(ctx.sampleRate * (0.004 + Math.random() * 0.01));
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let j = 0; j < len; j++) data[j] = (Math.random() * 2 - 1) * (1 - j / len);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1800 + Math.random() * 4000;
      bp.Q.value = 0.8 + Math.random();
      const g = ctx.createGain();
      g.gain.value = gain * (0.4 + Math.random() * 0.6);
      let dest = master;
      if (ctx.createStereoPanner) {
        const p = ctx.createStereoPanner();
        p.pan.value = Math.random() * 1.6 - 0.8;
        p.connect(master); dest = p;
      }
      src.connect(bp); bp.connect(g); g.connect(dest);
      const tt = ctx.currentTime + at;
      src.start(tt); src.stop(tt + 0.03);
    }
  }

  const API = {
    correct() {
      if (muted || !ensure()) return;
      // Party-popper / confetti cannon: a big lead pop, a couple of quick
      // follow-up pops, then paper crackle raining down across the ~1s burst
      // to match the confetti animation. Festive, percussive, no voices.
      pop(0.00, { gain: 0.55, freq: 300, pan: -0.2 });
      pop(0.06, { gain: 0.42, freq: 420, pan: 0.35 });
      pop(0.13, { gain: 0.38, freq: 360, pan: -0.45 });
      pop(0.22, { gain: 0.30, freq: 500, pan: 0.15 });
      // scattered confetti/streamer crackle, denser up front then thinning out
      crackle(0.02, 0.45, 95, 0.12);
      crackle(0.30, 0.70, 45, 0.08);
      // a little sparkle shimmer on top for "magic"
      sparkle(0.04, 0.5);
    },

    wrong() {
      // kind, encouraging — a soft descending two-note, never a harsh buzzer
      if (muted || !ensure()) return;
      note(392, 0, 0.16, { type: 'sine', gain: 0.16 });   // G4
      note(329.63, 0.12, 0.24, { type: 'sine', gain: 0.15 }); // E4
    },

    tap() {
      if (muted || !ensure()) return;
      note(660, 0, 0.06, { type: 'triangle', gain: 0.08, attack: 0.003 });
    },

    setMuted(b) {
      muted = !!b;
      try { localStorage.setItem('ft_muted', muted ? '1' : '0'); } catch (e) {}
      return muted;
    },
    toggleMuted() { return API.setMuted(!muted); },
    isMuted() { return muted; },
  };

  window.FTSound = API;
})();
