const root = document.documentElement;
const cursor = document.querySelector('.cursor-core');
const navLinks = document.querySelector('#navLinks');
const menuBtn = document.querySelector('.menu-btn');
const toast = document.querySelector('#toast');
const year = document.querySelector('#year');
year.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
document.querySelector('.theme-btn')?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});

menuBtn?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

window.addEventListener('pointermove', (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

// Matrix canvas background
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
let columns, drops;
const glyphs = 'PHP{}Laravel<>MySQL[]REST_API;Git$0101';
function resizeMatrix() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  columns = Math.floor(window.innerWidth / 18);
  drops = Array.from({ length: columns }, () => Math.random() * window.innerHeight);
}
function drawMatrix() {
  ctx.fillStyle = root.getAttribute('data-theme') === 'dark' ? 'rgba(2,6,23,.12)' : 'rgba(248,251,255,.16)';
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.font = '14px ui-monospace, SFMono-Regular, Menlo, monospace';
  for (let i = 0; i < drops.length; i++) {
    const text = glyphs[Math.floor(Math.random() * glyphs.length)];
    ctx.fillStyle = i % 4 === 0 ? 'rgba(0,255,136,.65)' : 'rgba(0,229,255,.52)';
    ctx.fillText(text, i * 18, drops[i]);
    if (drops[i] > window.innerHeight + Math.random() * 900) drops[i] = 0;
    drops[i] += 18;
  }
  requestAnimationFrame(drawMatrix);
}
resizeMatrix(); drawMatrix();
window.addEventListener('resize', resizeMatrix);

// Reveal animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .14 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Magnetic buttons
for (const el of document.querySelectorAll('.magnetic')) {
  el.addEventListener('pointermove', e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * .09}px, ${y * .14}px)`;
  });
  el.addEventListener('pointerleave', () => el.style.transform = 'translate(0, 0)');
}

// 3D tilt cards
for (const card of document.querySelectorAll('.tilt-card')) {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - .5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - .5) * 2;
    card.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-2px)`;
  });
  card.addEventListener('pointerleave', () => card.style.transform = 'rotateY(0) rotateX(0) translateY(0)');
}

// Project filters
for (const chip of document.querySelectorAll('[data-filter]')) {
  chip.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const filter = chip.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      card.style.display = filter === 'all' || card.dataset.tags.includes(filter) ? '' : 'none';
    });
  });
}

// Typewriter terminal
const lines = [
  '$ candidate.scan --role="PHP Developer"',
  '✓ PHP / Laravel / MySQL / JavaScript signal detected',
  '✓ UI → API → DB architecture narrative loaded',
  '✓ Production support + SDLC + documentation keywords mapped',
  '',
  'class Developer {',
  '  public function build() {',
  '    return Pipeline::from(requirements())',
  '      ->through([proofOfConcept(), code(), test(), deploy()])',
  '      ->documentFor(stakeholders());',
  '  }',
  '}',
  '',
  'status: interview-ready ▉▉▉▉▉▉▉▉▉ 100%'
];
let lineIndex = 0, charIndex = 0;
const typeTarget = document.querySelector('#typewriter');
function typeLoop() {
  if (!typeTarget) return;
  if (lineIndex >= lines.length) {
    setTimeout(() => { lineIndex = 0; charIndex = 0; typeTarget.textContent = ''; typeLoop(); }, 3600);
    return;
  }
  const line = lines[lineIndex];
  if (charIndex <= line.length) {
    typeTarget.textContent += line.charAt(charIndex);
    charIndex++;
    setTimeout(typeLoop, 18 + Math.random() * 22);
  } else {
    typeTarget.textContent += '\n';
    lineIndex++; charIndex = 0;
    setTimeout(typeLoop, 130);
  }
}
typeLoop();

// Radar chart animation
const radar = document.getElementById('radarCanvas');
const rctx = radar?.getContext('2d');
let radarTick = 0;
function drawRadar() {
  if (!rctx) return;
  const w = radar.width, h = radar.height;
  const cx = w / 2, cy = h / 2;
  rctx.clearRect(0, 0, w, h);
  const sides = 5;
  const maxR = 130;
  const values = [.88, .78, .84, .82, .9];
  rctx.lineWidth = 1;
  for (let ring = 1; ring <= 5; ring++) {
    rctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = -Math.PI / 2 + i * Math.PI * 2 / sides + Math.sin(radarTick / 90) * .04;
      const r = maxR * ring / 5;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      i ? rctx.lineTo(x, y) : rctx.moveTo(x, y);
    }
    rctx.closePath();
    rctx.strokeStyle = 'rgba(0,229,255,.22)';
    rctx.stroke();
  }
  for (let i = 0; i < sides; i++) {
    const angle = -Math.PI / 2 + i * Math.PI * 2 / sides;
    rctx.beginPath(); rctx.moveTo(cx, cy); rctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
    rctx.strokeStyle = 'rgba(255,255,255,.10)'; rctx.stroke();
  }
  const gradient = rctx.createRadialGradient(cx, cy, 20, cx, cy, maxR);
  gradient.addColorStop(0, 'rgba(0,255,136,.55)');
  gradient.addColorStop(1, 'rgba(0,229,255,.16)');
  rctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const phase = .96 + Math.sin(radarTick / 35 + i) * .025;
    const angle = -Math.PI / 2 + i * Math.PI * 2 / sides;
    const r = maxR * values[i] * phase;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    i ? rctx.lineTo(x, y) : rctx.moveTo(x, y);
  }
  rctx.closePath(); rctx.fillStyle = gradient; rctx.fill();
  rctx.strokeStyle = 'rgba(0,255,136,.95)'; rctx.lineWidth = 2; rctx.stroke();
  const sweep = (radarTick / 70) % (Math.PI * 2);
  rctx.beginPath(); rctx.moveTo(cx, cy); rctx.lineTo(cx + Math.cos(sweep) * maxR, cy + Math.sin(sweep) * maxR);
  rctx.strokeStyle = 'rgba(0,229,255,.75)'; rctx.lineWidth = 2; rctx.stroke();
  radarTick++;
  requestAnimationFrame(drawRadar);
}
drawRadar();

// Email copy
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}
document.querySelector('#copyEmail')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('tkskaransinghthakur@gmail.com');
    showToast('Email copied.');
  } catch {
    showToast('Email: tkskaransinghthakur@gmail.com');
  }
});
