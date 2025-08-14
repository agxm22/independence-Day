// Utility: add class to trigger animations
function playTimeline() {
  const stage = document.getElementById('stage');
  stage.classList.remove('play');
  // force reflow to restart CSS animations
  // eslint-disable-next-line no-unused-expressions
  stage.offsetWidth;
  stage.classList.add('play');
}

// Build 24 spokes for the Chakra dynamically
function buildChakraSpokes() {
  const spokesGroup = document.querySelector('#chakra .spokes');
  if (!spokesGroup || spokesGroup.childElementCount > 0) return;
  const cx = 100, cy = 100, rOuter = 72, rInner = 16;
  for (let i = 0; i < 24; i++) {
    const angle = (i * 360 / 24) * Math.PI / 180;
    const x1 = cx + rInner * Math.cos(angle);
    const y1 = cy + rInner * Math.sin(angle);
    const x2 = cx + rOuter * Math.cos(angle);
    const y2 = cy + rOuter * Math.sin(angle);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1.toFixed(2));
    line.setAttribute('y1', y1.toFixed(2));
    line.setAttribute('x2', x2.toFixed(2));
    line.setAttribute('y2', y2.toFixed(2));
    line.setAttribute('stroke', '#0a3d91');
    line.setAttribute('stroke-width', '4');
    spokesGroup.appendChild(line);
  }
}

// Simple confetti effect
function celebrate(duration = 4000) {
  const canvas = document.getElementById('confetti');
  const stage = document.getElementById('stage');
  const ctx = canvas.getContext('2d');

  // Resize canvas to stage
  function resize() {
    const rect = stage.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#FF9933', '#FFFFFF', '#138808'];
  const pieces = [];
  const count = Math.floor((canvas.width * canvas.height) / 8000); // density

  for (let i = 0; i < count; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height,
      size: 6 + Math.random() * 8,
      speedY: 1 + Math.random() * 2,
      speedX: -1 + Math.random() * 2,
      rot: Math.random() * Math.PI,
      rotSpeed: -0.1 + Math.random() * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() < 0.5 ? 'rect' : 'circle'
    });
  }

  let running = true;
  const startTime = performance.now();

  function tick(now) {
    if (!running) return;
    const elapsed = now - startTime;
    if (elapsed > duration) running = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of pieces) {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rot += p.rotSpeed;

      // wrap horizontally
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;

      // respawn at top when goes below
      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  // Auto clear after stop
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, duration + 200);
}

document.addEventListener('DOMContentLoaded', () => {
  buildChakraSpokes();
  playTimeline();
  // a little celebration on load
  setTimeout(() => celebrate(3500), 2200);

  document.getElementById('replayBtn').addEventListener('click', () => {
    playTimeline();
    setTimeout(() => celebrate(3500), 1200);
  });
  document.getElementById('confettiBtn').addEventListener('click', () => {
    celebrate(4500);
  });
});
