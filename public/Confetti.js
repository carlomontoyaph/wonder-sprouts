/* Procedural celebration burst for correct answers — no images, no API.
   A self-contained <confetti-burst> custom element that fires once on mount
   and tears itself down when the animation finishes.

   Attributes (all optional):
     colors    comma-separated hex list (defaults to warm palette)
     origin-x  burst origin as 0..1 fraction of width  (default 0.5)
     origin-y  burst origin as 0..1 fraction of height (default 0.32)
     count     particle count (default 110)
*/
(function () {
  if (customElements.get('confetti-burst')) return;

  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  class ConfettiBurst extends HTMLElement {
    connectedCallback() {
      if (this._started) return;
      this._started = true;
      // defer one frame so absolute-fill layout is flushed before we measure
      requestAnimationFrame(() => this._run());
    }
    _run() {
      const host = this;
      host.style.display = 'block';
      host.style.position = 'absolute';
      host.style.top = '0';
      host.style.left = '0';
      host.style.right = '0';
      host.style.bottom = '0';
      host.style.pointerEvents = 'none';

      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'width:100%;height:100%;display:block;';
      host.appendChild(canvas);
      const ctx = canvas.getContext('2d');

      const rect = host.getBoundingClientRect();
      const W = Math.max(1, rect.width || host.clientWidth || 360);
      const H = Math.max(1, rect.height || host.clientHeight || 640);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);

      const attr = (name, prop) => {
        const a = host.getAttribute(name);
        if (a != null && a !== '') return a;
        if (host[prop] != null && host[prop] !== '') return host[prop];
        return null;
      };
      const colors = (attr('colors', 'colors') || '#E8946A,#7BAE7F,#EBB347,#F2998E,#7C84C4,#F4C766')
        .split(',').map(s => s.trim()).filter(Boolean);
      const ox = parseFloat(attr('origin-x', 'originX') || '0.5') * W;
      const oy = parseFloat(attr('origin-y', 'originY') || '0.32') * H;
      const COUNT = parseInt(attr('count', 'count') || '110', 10);

      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const G = 0.42;        // gravity
      const DRAG = 0.992;    // air drag
      const particles = [];
      const SHAPES = ['rect', 'rect', 'circle', 'streamer', 'star'];

      for (let i = 0; i < (reduce ? Math.min(28, COUNT) : COUNT); i++) {
        // burst: mostly upward, full horizontal spread
        const ang = rand(-TAU / 2 - 0.5, 0.5);        // upward-biased
        const speed = rand(6, 15);
        particles.push({
          x: ox + rand(-8, 8),
          y: oy + rand(-6, 6),
          vx: Math.cos(ang) * speed * rand(0.6, 1.1),
          vy: Math.sin(ang) * speed - rand(2, 6),
          rot: rand(0, TAU),
          vr: rand(-0.3, 0.3),
          size: rand(6, 13),
          color: pick(colors),
          shape: pick(SHAPES),
          wobble: rand(0, TAU),
          vw: rand(0.05, 0.18),
          life: 0,
          ttl: rand(80, 130),
        });
      }

      // a soft expanding shock ring at the origin
      const ring = { r: 6, max: Math.max(W, H) * 0.32, life: 0, ttl: 26 };

      const drawStar = (s) => {
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? s.size * 0.7 : s.size * 0.3;
          const a = (i / 10) * TAU;
          const px = Math.cos(a) * r, py = Math.sin(a) * r;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      };

      let raf;
      const tick = () => {
        ctx.clearRect(0, 0, W, H);

        // shock ring
        if (ring.life < ring.ttl) {
          const t = ring.life / ring.ttl;
          const r = ring.r + (ring.max - ring.r) * (1 - Math.pow(1 - t, 2));
          ctx.save();
          ctx.globalAlpha = (1 - t) * 0.45;
          ctx.lineWidth = 4 * (1 - t) + 1;
          ctx.strokeStyle = colors[0];
          ctx.beginPath();
          ctx.arc(ox, oy, r, 0, TAU);
          ctx.stroke();
          ctx.restore();
          ring.life++;
        }

        let alive = 0;
        for (const p of particles) {
          if (p.life >= p.ttl) continue;
          alive++;
          p.life++;
          p.vx *= DRAG;
          p.vy = p.vy * DRAG + G;
          p.wobble += p.vw;
          p.x += p.vx + Math.cos(p.wobble) * 0.6;
          p.y += p.vy;
          p.rot += p.vr;

          const fade = p.life > p.ttl * 0.7 ? 1 - (p.life - p.ttl * 0.7) / (p.ttl * 0.3) : 1;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = Math.max(0, fade);
          ctx.fillStyle = p.color;
          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
          } else if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.42, 0, TAU);
            ctx.fill();
          } else if (p.shape === 'streamer') {
            ctx.fillRect(-p.size * 0.18, -p.size * 0.9, p.size * 0.36, p.size * 1.8);
          } else {
            drawStar(p);
          }
          ctx.restore();
        }

        if (alive > 0 || ring.life < ring.ttl) {
          raf = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(raf);
          try { canvas.remove(); } catch (e) {}
        }
      };
      raf = requestAnimationFrame(tick);

      // safety cleanup
      this._timeout = setTimeout(() => { try { cancelAnimationFrame(raf); canvas.remove(); } catch (e) {} }, 4000);
      this._raf = () => raf;
    }

    disconnectedCallback() {
      if (this._timeout) clearTimeout(this._timeout);
    }
  }

  customElements.define('confetti-burst', ConfettiBurst);
})();
